import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// const MONGO_URI = "mongodb://127.0.0.1:27017/subjectPortal";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://Pratheeba:PratheebaMongoDBAtlas@cluster0.ixnufht.mongodb.net/subjectPortal?appName=Cluster0"; 

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student"], default: "student" },
  assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
});

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  materials: [{ title: String, htmlContent: String }],
  tasks: [{ title: String, htmlContent: String }],
  quizzes: [{ title: String, htmlContent: String }],
});

const User = mongoose.model("User", UserSchema);
const Subject = mongoose.model("Subject", SubjectSchema);

async function runSeed() {
  try {
    console.log("Connecting to database infrastructure...");
    await mongoose.connect(MONGO_URI);

    // Wipe collections to start clean
    await User.deleteMany({});
    await Subject.deleteMany({});
    console.log("Stale collections dropped successfully.");

    // 1. Setup Base Subjects
    const pythonSub = await Subject.create({
      name: "Python Fundamentals",
      materials: [
        {
          title: "Introduction to Core Python",
          htmlContent: `
            <div class="hero">
              <div class="hero-badge">📘 Study Material</div>
              <h1>Python Fundamentals</h1>
              <p>Welcome to your learning track! This content is rendered live from your MERN backend store.</p>
            </div>
            <div class="card">
              <div class="card-label" style="color:var(--blue)">Getting Started</div>
              <p>Python is high-level, readable, and highly powerful.</p>
            </div>
          `,
        },
      ],
      tasks: [],
      quizzes: [],
    });

    const webSub = await Subject.create({
      name: "Web Systems Design Architecture",
      materials: [],
      tasks: [],
      quizzes: [],
    });

    // 2. Encrypt and Seed Admin Account
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash("admin123", salt);

    await User.create({
      username: "admin_root",
      password: hashedAdminPassword,
      role: "admin",
    });
    console.log(
      "✔ Admin Profile Registered: [Username: admin_root | Password: admin123]",
    );

    // 3. Encrypt and Seed Student Account
    const hashedStudentPassword = await bcrypt.hash("student123", salt);
    await User.create({
      username: "student_01",
      password: hashedStudentPassword,
      role: "student",
      assignedSubjects: [pythonSub._id], // Mapping access right to Python right out of the box
    });
    console.log(
      "✔ Student Profile Registered: [Username: student_01 | Password: student123]",
    );

    console.log("Database provisioning seed executed perfectly!");
    process.exit(0);
  } catch (error) {
    console.error("Critical failure during seeding process execution:", error);
    process.exit(1);
  }
}

runSeed();