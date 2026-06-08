// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // MongoDB Connection Path
// const MONGO_URI =
//   process.env.MONGO_URI || "mongodb://127.0.0.1:27017/subjectPortal";
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("MongoDB Database Connected Successfully"))
//   .catch((err) => console.error("Database connection failure:", err));

// // --- DATA SCHEMAS ---

// const SubjectSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   materials: [{ title: String, htmlContent: String }],
//   tasks: [{ title: String, htmlContent: String }],
//   quizzes: [{ title: String, htmlContent: String }],
// });

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   role: { type: String, enum: ["admin", "student"], default: "student" },
//   assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
// });

// const Subject = mongoose.model("Subject", SubjectSchema);
// const User = mongoose.model("User", UserSchema);

// // --- API ROUTE CONTROLLERS ---

// // Subjects Management
// app.get("/api/subjects", async (req, res) => {
//   try {
//     const subjects = await Subject.find();
//     res.json(subjects);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/subjects", async (req, res) => {
//   try {
//     const newSubject = new Subject({
//       name: req.body.name,
//       materials: [],
//       tasks: [],
//       quizzes: [],
//     });
//     await newSubject.save();
//     res.status(201).json(newSubject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.post("/api/subjects/:id/content", async (req, res) => {
//   try {
//     const { type, title, htmlContent } = req.body; // type: 'materials' | 'tasks' | 'quizzes'
//     const subject = await Subject.findById(req.params.id);
//     if (!subject)
//       return res.status(404).json({ error: "Subject context not found" });

//     subject[type].push({ title, htmlContent });
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Users Management
// app.get("/api/students", async (req, res) => {
//   try {
//     const students = await User.find({ role: "student" }).populate(
//       "assignedSubjects",
//     );
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/students", async (req, res) => {
//   try {
//     const newStudent = new User({
//       username: req.body.username,
//       role: "student",
//       assignedSubjects: [],
//     });
//     await newStudent.save();
//     res.status(201).json(newStudent);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.put("/api/students/:id/assign", async (req, res) => {
//   try {
//     const { subjectIds } = req.body;
//     const student = await User.findByIdAndUpdate(
//       req.params.id,
//       { assignedSubjects: subjectIds },
//       { new: true },
//     ).populate("assignedSubjects");
//     res.json(student);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Context Fetcher Mock for Current Logged In User Viewport
// app.get("/api/user-context/:username", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.params.username }).populate(
//       "assignedSubjects",
//     );
//     if (!user)
//       return res.status(404).json({ error: "Identity profile not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`Server executing operations on port ${PORT}`),
// );

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// const MONGO_URI =
//   process.env.MONGO_URI || "mongodb://127.0.0.1:27017/subjectPortal";
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("MongoDB Database Connected Successfully"))
//   .catch((err) => console.error("Database connection failure:", err));

// // --- DATA SCHEMAS ---

// const SubjectSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   materials: [{ title: String, htmlContent: String }],
//   tasks: [{ title: String, htmlContent: String }],
//   quizzes: [{ title: String, htmlContent: String }],
// });

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["admin", "student"], default: "student" },
//   assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
// });

// const Subject = mongoose.model("Subject", SubjectSchema);
// const User = mongoose.model("User", UserSchema);

// // --- SECURE AUTHENTICATION ENDPOINT ---

// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // 1. Verify existence profile rule context
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res
//         .status(401)
//         .json({ error: "Invalid username profile identifier string." });
//     }

//     // 2. Validate structural matching hash match properties
//     const matches = await bcrypt.compare(password, user.password);
//     if (!matches) {
//       return res
//         .status(401)
//         .json({ error: "Secure authorization password key mismatch." });
//     }

//     // 3. Return session tracking metadata object
//     res.json({
//       username: user.username,
//       role: user.role,
//       token: "mock-session-jwt-string-placeholder", // Keep it light and local for basic storage patterns
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Internal Auth validation failure: " + err.message });
//   }
// });

// // --- API GENERAL ROUTE CONTROLLERS ---

// // Subjects Management Array Endpoints
// app.get("/api/subjects", async (req, res) => {
//   try {
//     const subjects = await Subject.find();
//     res.json(subjects);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/subjects", async (req, res) => {
//   try {
//     const newSubject = new Subject({
//       name: req.body.name,
//       materials: [],
//       tasks: [],
//       quizzes: [],
//     });
//     await newSubject.save();
//     res.status(201).json(newSubject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.post("/api/subjects/:id/content", async (req, res) => {
//   try {
//     const { type, title, htmlContent } = req.body; // type matches structural values: 'materials' | 'tasks' | 'quizzes'
//     const subject = await Subject.findById(req.params.id);
//     if (!subject)
//       return res
//         .status(404)
//         .json({ error: "Subject context target index missed" });

//     subject[type].push({ title, htmlContent });
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Student Provision Management Controllers
// app.get("/api/students", async (req, res) => {
//   try {
//     const students = await User.find({ role: "student" }).populate(
//       "assignedSubjects",
//     );
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/students", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password || "student123", salt); // Fallback standard system access key default

//     const newStudent = new User({
//       username,
//       password: hashedPassword,
//       role: "student",
//       assignedSubjects: [],
//     });

//     await newStudent.save();
//     res.status(201).json(newStudent);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.put("/api/students/:id/assign", async (req, res) => {
//   try {
//     const { subjectIds } = req.body;
//     const student = await User.findByIdAndUpdate(
//       req.params.id,
//       { assignedSubjects: subjectIds },
//       { new: true },
//     ).populate("assignedSubjects");
//     res.json(student);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Localized profile mapper endpoint used specifically by Student Dashboard
// app.get("/api/user-context/:username", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.params.username }).populate(
//       "assignedSubjects",
//     );
//     if (!user)
//       return res.status(404).json({ error: "Identity tree trace missed." });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`Server executing operations on port ${PORT}`),
// );

//ab was gd

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// const MONGO_URI =
//   process.env.MONGO_URI || "mongodb://127.0.0.1:27017/subjectPortal";
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("MongoDB Database Connected Successfully"))
//   .catch((err) => console.error("Database connection failure:", err));

// // --- DATA SCHEMAS ---

// const SubjectSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   materials: [{ title: String, htmlContent: String }],
//   tasks: [{ title: String, htmlContent: String }],
//   quizzes: [{ title: String, htmlContent: String }],
// });

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["admin", "student"], default: "student" },
//   assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
// });

// const Subject = mongoose.model("Subject", SubjectSchema);
// const User = mongoose.model("User", UserSchema);

// // --- SECURE AUTHENTICATION ENDPOINT ---

// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // 1. Verify existence profile rule context
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res
//         .status(401)
//         .json({ error: "Invalid username profile identifier string." });
//     }

//     // 2. Validate structural matching hash match properties
//     const matches = await bcrypt.compare(password, user.password);
//     if (!matches) {
//       return res
//         .status(401)
//         .json({ error: "Secure authorization password key mismatch." });
//     }

//     // 3. Return session tracking metadata object
//     res.json({
//       username: user.username,
//       role: user.role,
//       token: "mock-session-jwt-string-placeholder", // Keep it light and local for basic storage patterns
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Internal Auth validation failure: " + err.message });
//   }
// });

// // --- API GENERAL ROUTE CONTROLLERS ---

// // Subjects Management Array Endpoints
// app.get("/api/subjects", async (req, res) => {
//   try {
//     const subjects = await Subject.find();
//     res.json(subjects);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/subjects", async (req, res) => {
//   try {
//     const newSubject = new Subject({
//       name: req.body.name,
//       materials: [],
//       tasks: [],
//       quizzes: [],
//     });
//     await newSubject.save();
//     res.status(201).json(newSubject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.post("/api/subjects/:id/content", async (req, res) => {
//   try {
//     const { type, title, htmlContent } = req.body; // type matches structural values: 'materials' | 'tasks' | 'quizzes'
//     const subject = await Subject.findById(req.params.id);
//     if (!subject)
//       return res
//         .status(404)
//         .json({ error: "Subject context target index missed" });

//     subject[type].push({ title, htmlContent });
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Delete Sub-module content node from array endpoint
// app.delete(
//   "/api/subjects/:subjectId/content/:contentType/:contentId",
//   async (req, res) => {
//     try {
//       const { subjectId, contentType, contentId } = req.params;

//       // Validate type restrictions
//       if (!["materials", "tasks", "quizzes"].includes(contentType)) {
//         return res
//           .status(400)
//           .json({ error: "Invalid module content array target type context." });
//       }

//       const updatedSubject = await Subject.findByIdAndUpdate(
//         subjectId,
//         { $pull: { [contentType]: { _id: contentId } } },
//         { new: true },
//       );

//       if (!updatedSubject) {
//         return res.status(404).json({ error: "Subject target index missed." });
//       }

//       res.json(updatedSubject);
//     } catch (err) {
//       res.status(500).json({ error: "Deletion routine error: " + err.message });
//     }
//   },
// );

// // Student Provision Management Controllers
// app.get("/api/students", async (req, res) => {
//   try {
//     const students = await User.find({ role: "student" }).populate(
//       "assignedSubjects",
//     );
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/students", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password || "student123", salt); // Fallback standard system access key default

//     const newStudent = new User({
//       username,
//       password: hashedPassword,
//       role: "student",
//       assignedSubjects: [],
//     });

//     await newStudent.save();
//     res.status(201).json(newStudent);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.put("/api/students/:id/assign", async (req, res) => {
//   try {
//     const { subjectIds } = req.body;
//     const student = await User.findByIdAndUpdate(
//       req.params.id,
//       { assignedSubjects: subjectIds },
//       { new: true },
//     ).populate("assignedSubjects");
//     res.json(student);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Localized profile mapper endpoint used specifically by Student Dashboard
// app.get("/api/user-context/:username", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.params.username }).populate(
//       "assignedSubjects",
//     );
//     if (!user)
//       return res.status(404).json({ error: "Identity tree trace missed." });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`Server executing operations on port ${PORT}`),
// );

//ab was too gd

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// const MONGO_URI =
//   process.env.MONGO_URI || "mongodb://127.0.0.1:27017/subjectPortal";
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("MongoDB Database Connected Successfully"))
//   .catch((err) => console.error("Database connection failure:", err));

// // --- DATA SCHEMAS ---

// const SubjectSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   materials: [{ title: String, htmlContent: String }],
//   // Restructured Tasks to handle multiple interactive programming questions directly
//   tasks: [
//     {
//       title: { type: String, required: true },
//       topic: { type: String, required: true },
//       questions: [
//         {
//           questionText: String,
//           allowedLanguages: [String], // ['python', 'java']
//           initialPythonCode: String,
//           initialJavaCode: String,
//           expectedOutput: String, // For basic matching evaluation metrics
//         },
//       ],
//     },
//   ],
//   quizzes: [{ title: String, htmlContent: String }],
// });

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["admin", "student"], default: "student" },
//   assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
// });

// const Subject = mongoose.model("Subject", SubjectSchema);
// const User = mongoose.model("User", UserSchema);

// // --- SECURE AUTHENTICATION ENDPOINT ---

// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res
//         .status(401)
//         .json({ error: "Invalid username profile identifier string." });
//     }

//     const matches = await bcrypt.compare(password, user.password);
//     if (!matches) {
//       return res
//         .status(401)
//         .json({ error: "Secure authorization password key mismatch." });
//     }

//     res.json({
//       username: user.username,
//       role: user.role,
//       token: "mock-session-jwt-string-placeholder",
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Internal Auth validation failure: " + err.message });
//   }
// });

// // --- API GENERAL ROUTE CONTROLLERS ---

// app.get("/api/subjects", async (req, res) => {
//   try {
//     const subjects = await Subject.find();
//     res.json(subjects);
//   } catch (err) {
//     res.status(500).get({ error: err.message });
//   }
// });

// app.post("/api/subjects", async (req, res) => {
//   try {
//     const newSubject = new Subject({
//       name: req.body.name,
//       materials: [],
//       tasks: [],
//       quizzes: [],
//     });
//     await newSubject.save();
//     res.status(201).json(newSubject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Standard Material/Quiz Insertion Content Controller
// app.post("/api/subjects/:id/content", async (req, res) => {
//   try {
//     const { type, title, htmlContent } = req.body;
//     const subject = await Subject.findById(req.params.id);
//     if (!subject)
//       return res
//         .status(404)
//         .json({ error: "Subject context target index missed" });

//     subject[type].push({ title, htmlContent });
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Specialized Task Structural Creation Controller Endpoint
// app.post("/api/subjects/:id/tasks", async (req, res) => {
//   try {
//     const { title, topic, questions } = req.body;
//     const subject = await Subject.findById(req.params.id);
//     if (!subject)
//       return res.status(404).json({ error: "Subject target context missed" });

//     subject.tasks.push({ title, topic, questions });
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.delete(
//   "/api/subjects/:subjectId/content/:contentType/:contentId",
//   async (req, res) => {
//     try {
//       const { subjectId, contentType, contentId } = req.params;

//       if (!["materials", "tasks", "quizzes"].includes(contentType)) {
//         return res
//           .status(400)
//           .json({ error: "Invalid module content array target type context." });
//       }

//       const updatedSubject = await Subject.findByIdAndUpdate(
//         subjectId,
//         { $pull: { [contentType]: { _id: contentId } } },
//         { new: true },
//       );

//       if (!updatedSubject) {
//         return res.status(404).json({ error: "Subject target index missed." });
//       }

//       res.json(updatedSubject);
//     } catch (err) {
//       res.status(500).json({ error: "Deletion routine error: " + err.message });
//     }
//   },
// );

// app.get("/api/students", async (req, res) => {
//   try {
//     const students = await User.find({ role: "student" }).populate(
//       "assignedSubjects",
//     );
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/students", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password || "student123", salt);

//     const newStudent = new User({
//       username,
//       password: hashedPassword,
//       role: "student",
//       assignedSubjects: [],
//     });

//     await newStudent.save();
//     res.status(201).json(newStudent);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.put("/api/students/:id/assign", async (req, res) => {
//   try {
//     const { subjectIds } = req.body;
//     const student = await User.findByIdAndUpdate(
//       req.params.id,
//       { assignedSubjects: subjectIds },
//       { new: true },
//     ).populate("assignedSubjects");
//     res.json(student);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.get("/api/user-context/:username", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.params.username }).populate(
//       "assignedSubjects",
//     );
//     if (!user)
//       return res.status(404).json({ error: "Identity tree trace missed." });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`Server executing operations on port ${PORT}`),
// );

//ab was too too good

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// const MONGO_URI =
//   process.env.MONGO_URI || "mongodb://127.0.0.1:27017/subjectPortal";
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("MongoDB Database Connected Successfully"))
//   .catch((err) => console.error("Database connection failure:", err));

// // --- DATA SCHEMAS ---

// const SubjectSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   materials: [{ title: String, htmlContent: String }],
//   tasks: [
//     {
//       title: { type: String, required: true },
//       topic: { type: String, required: true },
//       questions: [
//         {
//           questionText: String,
//           allowedLanguages: [String], // ['python', 'java']
//           initialPythonCode: String,
//           initialJavaCode: String,
//           expectedOutput: String,
//         },
//       ],
//     },
//   ],
//   quizzes: [{ title: String, htmlContent: String }],
// });

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["admin", "student"], default: "student" },
//   assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
// });

// // Added explicit Tracker Schema to persist scores, submission states, and grading metrics per student
// const SubmissionSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   subjectId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Subject",
//     required: true,
//   },
//   taskId: { type: String, required: true }, // Mapped to subdocument task element _id string
//   scores: { type: Map, of: Number }, // Map structure mapping: questionIndexString -> scoreInt (0 or 100)
//   completedQuestions: [Number], // Array of question indices successfully finished & locked
//   isCompleted: { type: Boolean, default: false },
// });

// const Subject = mongoose.model("Subject", SubjectSchema);
// const User = mongoose.model("User", UserSchema);
// const Submission = mongoose.model("Submission", SubmissionSchema);

// // --- SECURE AUTHENTICATION ENDPOINT ---

// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res
//         .status(401)
//         .json({ error: "Invalid username profile identifier string." });
//     }

//     const matches = await bcrypt.compare(password, user.password);
//     if (!matches) {
//       return res
//         .status(401)
//         .json({ error: "Secure authorization password key mismatch." });
//     }

//     res.json({
//       username: user.username,
//       role: user.role,
//       token: "mock-session-jwt-string-placeholder",
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Internal Auth validation failure: " + err.message });
//   }
// });

// // --- API GENERAL ROUTE CONTROLLERS ---

// app.get("/api/subjects", async (req, res) => {
//   try {
//     const subjects = await Subject.find();
//     res.json(subjects);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/subjects", async (req, res) => {
//   try {
//     const newSubject = new Subject({
//       name: req.body.name,
//       materials: [],
//       tasks: [],
//       quizzes: [],
//     });
//     await newSubject.save();
//     res.status(201).json(newSubject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.post("/api/subjects/:id/content", async (req, res) => {
//   try {
//     const { type, title, htmlContent } = req.body;
//     const subject = await Subject.findById(req.params.id);
//     if (!subject)
//       return res
//         .status(404)
//         .json({ error: "Subject context target index missed" });

//     subject[type].push({ title, htmlContent });
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.post("/api/subjects/:id/tasks", async (req, res) => {
//   try {
//     const { title, topic, questions } = req.body;
//     const subject = await Subject.findById(req.params.id);
//     if (!subject)
//       return res.status(404).json({ error: "Subject target context missed" });

//     subject.tasks.push({ title, topic, questions });
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.delete(
//   "/api/subjects/:subjectId/content/:contentType/:contentId",
//   async (req, res) => {
//     try {
//       const { subjectId, contentType, contentId } = req.params;

//       if (!["materials", "tasks", "quizzes"].includes(contentType)) {
//         return res
//           .status(400)
//           .json({ error: "Invalid module content array target type context." });
//       }

//       const updatedSubject = await Subject.findByIdAndUpdate(
//         subjectId,
//         { $pull: { [contentType]: { _id: contentId } } },
//         { new: true },
//       );

//       if (!updatedSubject) {
//         return res.status(404).json({ error: "Subject target index missed." });
//       }

//       res.json(updatedSubject);
//     } catch (err) {
//       res.status(500).json({ error: "Deletion routine error: " + err.message });
//     }
//   },
// );

// // --- TASK SUBMISSIONS & METRICS TRACKING CONTROLLERS ---

// // Endpoint to fetch all active task tracking metrics for a given user under a subject context
// app.get("/api/submissions/:username/:subjectId", async (req, res) => {
//   try {
//     const { username, subjectId } = req.params;
//     const records = await Submission.find({ username, subjectId });
//     res.json(records);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Failed to pull submission data logs: " + err.message });
//   }
// });

// // Endpoint to handle submission updates when a student hits "Submit Answer"
// app.post("/api/submissions/submit-question", async (req, res) => {
//   try {
//     const {
//       username,
//       subjectId,
//       taskId,
//       questionIndex,
//       score,
//       totalQuestions,
//     } = req.body;

//     let record = await Submission.findOne({ username, subjectId, taskId });
//     if (!record) {
//       record = new Submission({
//         username,
//         subjectId,
//         taskId,
//         scores: {},
//         completedQuestions: [],
//         isCompleted: false,
//       });
//     }

//     // Assign full score properties to Map layer configuration
//     record.scores.set(questionIndex.toString(), score);

//     if (!record.completedQuestions.includes(questionIndex)) {
//       record.completedQuestions.push(questionIndex);
//     }

//     // If all available sub-elements inside the question task matrix are addressed, switch flag state
//     if (record.completedQuestions.length >= totalQuestions) {
//       record.isCompleted = true;
//     }

//     await record.save();
//     res.json(record);
//   } catch (err) {
//     res
//       .status(400)
//       .json({
//         error: "Error saving submission metrics code stack: " + err.message,
//       });
//   }
// });

// app.get("/api/students", async (req, res) => {
//   try {
//     const students = await User.find({ role: "student" }).populate(
//       "assignedSubjects",
//     );
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/students", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password || "student123", salt);

//     const newStudent = new User({
//       username,
//       password: hashedPassword,
//       role: "student",
//       assignedSubjects: [],
//     });

//     await newStudent.save();
//     res.status(201).json(newStudent);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.put("/api/students/:id/assign", async (req, res) => {
//   try {
//     const { subjectIds } = req.body;
//     const student = await User.findByIdAndUpdate(
//       req.params.id,
//       { assignedSubjects: subjectIds },
//       { new: true },
//     ).populate("assignedSubjects");
//     res.json(student);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.get("/api/user-context/:username", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.params.username }).populate(
//       "assignedSubjects",
//     );
//     if (!user)
//       return res.status(404).json({ error: "Identity tree trace missed." });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`Server executing operations on port ${PORT}`),
// );

//ab was too too too good

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// const MONGO_URI =
//   process.env.MONGO_URI || "mongodb://127.0.0.1:27017/subjectPortal";
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("MongoDB Database Connected Successfully"))
//   .catch((err) => console.error("Database connection failure:", err));

// // --- DATA SCHEMAS ---

// const SubjectSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   materials: [{ title: String, htmlContent: String }],
//   tasks: [
//     {
//       title: { type: String, required: true },
//       topic: { type: String, required: true },
//       questions: [
//         {
//           questionText: String,
//           allowedLanguages: [String],
//           initialPythonCode: String,
//           initialJavaCode: String,
//           expectedOutput: String,
//         },
//       ],
//     },
//   ],
//   quizzes: [{ title: String, htmlContent: String }],
// });

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["admin", "student"], default: "student" },
//   assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
// });

// const SubmissionSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   subjectId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Subject",
//     required: true,
//   },
//   taskId: { type: String, required: true },
//   scores: { type: Map, of: Number },
//   completedQuestions: [Number],
//   isCompleted: { type: Boolean, default: false },
// });

// const Subject = mongoose.model("Subject", SubjectSchema);
// const User = mongoose.model("User", UserSchema);
// const Submission = mongoose.model("Submission", SubmissionSchema);

// // --- SECURE AUTHENTICATION ENDPOINT ---

// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res
//         .status(401)
//         .json({ error: "Invalid username profile identifier string." });
//     }

//     const matches = await bcrypt.compare(password, user.password);
//     if (!matches) {
//       return res
//         .status(401)
//         .json({ error: "Secure authorization password key mismatch." });
//     }

//     res.json({
//       username: user.username,
//       role: user.role,
//       token: "mock-session-jwt-string-placeholder",
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Internal Auth validation failure: " + err.message });
//   }
// });

// // --- API GENERAL ROUTE CONTROLLERS ---

// app.get("/api/subjects", async (req, res) => {
//   try {
//     const subjects = await Subject.find();
//     res.json(subjects);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/subjects", async (req, res) => {
//   try {
//     const newSubject = new Subject({
//       name: req.body.name,
//       materials: [],
//       tasks: [],
//       quizzes: [],
//     });
//     await newSubject.save();
//     res.status(201).json(newSubject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.post("/api/subjects/:id/content", async (req, res) => {
//   try {
//     const { type, title, htmlContent } = req.body;
//     const subject = await Subject.findById(req.params.id);
//     if (!subject)
//       return res
//         .status(404)
//         .json({ error: "Subject context target index missed" });

//     subject[type].push({ title, htmlContent });
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.post("/api/subjects/:id/tasks", async (req, res) => {
//   try {
//     const { title, topic, questions } = req.body;
//     const subject = await Subject.findById(req.params.id);
//     if (!subject)
//       return res.status(404).json({ error: "Subject target context missed" });

//     subject.tasks.push({ title, topic, questions });
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.delete(
//   "/api/subjects/:subjectId/content/:contentType/:contentId",
//   async (req, res) => {
//     try {
//       const { subjectId, contentType, contentId } = req.params;

//       if (!["materials", "tasks", "quizzes"].includes(contentType)) {
//         return res
//           .status(400)
//           .json({ error: "Invalid module content array target type context." });
//       }

//       const updatedSubject = await Subject.findByIdAndUpdate(
//         subjectId,
//         { $pull: { [contentType]: { _id: contentId } } },
//         { new: true },
//       );

//       if (!updatedSubject) {
//         return res.status(404).json({ error: "Subject target index missed." });
//       }

//       res.json(updatedSubject);
//     } catch (err) {
//       res.status(500).json({ error: "Deletion routine error: " + err.message });
//     }
//   },
// );

// // --- TASK SUBMISSIONS & METRICS TRACKING CONTROLLERS ---

// app.get("/api/submissions/:username/:subjectId", async (req, res) => {
//   try {
//     const { username, subjectId } = req.params;
//     const records = await Submission.find({ username, subjectId });
//     res.json(records);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Failed to pull submission data logs: " + err.message });
//   }
// });

// app.post("/api/submissions/submit-question", async (req, res) => {
//   try {
//     const {
//       username,
//       subjectId,
//       taskId,
//       questionIndex,
//       score,
//       totalQuestions,
//     } = req.body;

//     let record = await Submission.findOne({ username, subjectId, taskId });
//     if (!record) {
//       record = new Submission({
//         username,
//         subjectId,
//         taskId,
//         scores: {},
//         completedQuestions: [],
//         isCompleted: false,
//       });
//     }

//     record.scores.set(questionIndex.toString(), score);

//     if (!record.completedQuestions.includes(questionIndex)) {
//       record.completedQuestions.push(questionIndex);
//     }

//     if (record.completedQuestions.length >= totalQuestions) {
//       record.isCompleted = true;
//     }

//     await record.save();
//     res.json(record);
//   } catch (err) {
//     res
//       .status(400)
//       .json({
//         error: "Error saving submission metrics code stack: " + err.message,
//       });
//   }
// });

// app.get("/api/students", async (req, res) => {
//   try {
//     const students = await User.find({ role: "student" }).populate(
//       "assignedSubjects",
//     );
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/students", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password || "student123", salt);

//     const newStudent = new User({
//       username,
//       password: hashedPassword,
//       role: "student",
//       assignedSubjects: [],
//     });

//     await newStudent.save();
//     res.status(201).json(newStudent);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.put("/api/students/:id/assign", async (req, res) => {
//   try {
//     const { subjectIds } = req.body;
//     const student = await User.findByIdAndUpdate(
//       req.params.id,
//       { assignedSubjects: subjectIds },
//       { new: true },
//     ).populate("assignedSubjects");
//     res.json(student);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.get("/api/user-context/:username", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.params.username }).populate(
//       "assignedSubjects",
//     );
//     if (!user)
//       return res.status(404).json({ error: "Identity tree trace missed." });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`Server executing operations on port ${PORT}`),
// );

//ab was too too too too good

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// const MONGO_URI =
//   process.env.MONGO_URI || "mongodb://127.0.0.1:27017/subjectPortal";
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("MongoDB Database Connected Successfully"))
//   .catch((err) => console.error("Database connection failure:", err));

// // --- DATA SCHEMAS ---

// const SubjectSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   materials: [{ title: String, htmlContent: String }],
//   tasks: [
//     {
//       title: { type: String, required: true },
//       topic: { type: String, required: true },
//       questions: [
//         {
//           questionText: String,
//           allowedLanguages: [String],
//           initialPythonCode: String,
//           initialJavaCode: String,
//           expectedOutput: String,
//         },
//       ],
//     },
//   ],
//   quizzes: [{ title: String, htmlContent: String }],
// });

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["admin", "student"], default: "student" },
//   assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
// });

// // Task Progress Tracking Schema Matrix
// const SubmissionSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   subjectId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Subject",
//     required: true,
//   },
//   taskId: { type: String, required: true },
//   scores: { type: Map, of: Number },
//   completedQuestions: [Number],
//   isCompleted: { type: Boolean, default: false },
// });

// // Added explicit Quiz Submission tracker schema to map metrics securely to DB
// const QuizSubmissionSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   subjectId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Subject",
//     required: true,
//   },
//   quizId: { type: String, required: true },
//   correctAnswers: { type: Number, required: true },
//   totalQuestions: { type: Number, required: true },
//   percentage: { type: Number, required: true },
//   userAnswersArray: [{ type: Number }], // Holds student selections indices to reload on refresh
//   isCompleted: { type: Boolean, default: true },
// });

// const Subject = mongoose.model("Subject", SubjectSchema);
// const User = mongoose.model("User", UserSchema);
// const Submission = mongoose.model("Submission", SubmissionSchema);
// const QuizSubmission = mongoose.model("QuizSubmission", QuizSubmissionSchema);

// // --- SECURE AUTHENTICATION ENDPOINT ---

// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res
//         .status(401)
//         .json({ error: "Invalid username profile identifier string." });
//     }

//     const matches = await bcrypt.compare(password, user.password);
//     if (!matches) {
//       return res
//         .status(401)
//         .json({ error: "Secure authorization password key mismatch." });
//     }

//     res.json({
//       username: user.username,
//       role: user.role,
//       token: "mock-session-jwt-string-placeholder",
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Internal Auth validation failure: " + err.message });
//   }
// });

// // --- API GENERAL ROUTE CONTROLLERS ---

// app.get("/api/subjects", async (req, res) => {
//   try {
//     const subjects = await Subject.find();
//     res.json(subjects);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/subjects", async (req, res) => {
//   try {
//     const newSubject = new Subject({
//       name: req.body.name,
//       materials: [],
//       tasks: [],
//       quizzes: [],
//     });
//     await newSubject.save();
//     res.status(201).json(newSubject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.post("/api/subjects/:id/content", async (req, res) => {
//   try {
//     const { type, title, htmlContent } = req.body;
//     const subject = await Subject.findById(req.params.id);
//     if (!subject)
//       return res
//         .status(404)
//         .json({ error: "Subject context target index missed" });

//     subject[type].push({ title, htmlContent });
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.post("/api/subjects/:id/tasks", async (req, res) => {
//   try {
//     const { title, topic, questions } = req.body;
//     const subject = await Subject.findById(req.params.id);
//     if (!subject)
//       return res.status(404).json({ error: "Subject target context missed" });

//     subject.tasks.push({ title, topic, questions });
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.delete(
//   "/api/subjects/:subjectId/content/:contentType/:contentId",
//   async (req, res) => {
//     try {
//       const { subjectId, contentType, contentId } = req.params;

//       if (!["materials", "tasks", "quizzes"].includes(contentType)) {
//         return res
//           .status(400)
//           .json({ error: "Invalid module content array target type context." });
//       }

//       const updatedSubject = await Subject.findByIdAndUpdate(
//         subjectId,
//         { $pull: { [contentType]: { _id: contentId } } },
//         { new: true },
//       );

//       if (!updatedSubject) {
//         return res.status(404).json({ error: "Subject target index missed." });
//       }

//       res.json(updatedSubject);
//     } catch (err) {
//       res.status(500).json({ error: "Deletion routine error: " + err.message });
//     }
//   },
// );

// // --- TASK SUBMISSIONS CONTROLLERS ---

// app.get("/api/submissions/:username/:subjectId", async (req, res) => {
//   try {
//     const { username, subjectId } = req.params;
//     const records = await Submission.find({ username, subjectId });
//     res.json(records);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Failed to pull submission data logs: " + err.message });
//   }
// });

// app.post("/api/submissions/submit-question", async (req, res) => {
//   try {
//     const {
//       username,
//       subjectId,
//       taskId,
//       questionIndex,
//       score,
//       totalQuestions,
//     } = req.body;

//     let record = await Submission.findOne({ username, subjectId, taskId });
//     if (!record) {
//       record = new Submission({
//         username,
//         subjectId,
//         taskId,
//         scores: {},
//         completedQuestions: [],
//         isCompleted: false,
//       });
//     }

//     record.scores.set(questionIndex.toString(), score);

//     if (!record.completedQuestions.includes(questionIndex)) {
//       record.completedQuestions.push(questionIndex);
//     }

//     if (record.completedQuestions.length >= totalQuestions) {
//       record.isCompleted = true;
//     }

//     await record.save();
//     res.json(record);
//   } catch (err) {
//     res
//       .status(400)
//       .json({ error: "Error saving submission metrics: " + err.message });
//   }
// });

// // --- QUIZ SUBMISSIONS CONTROLLERS ---

// // Pull complete quiz submission records for a user
// app.get("/api/quiz-submissions/:username/:subjectId", async (req, res) => {
//   try {
//     const { username, subjectId } = req.params;
//     const records = await QuizSubmission.find({ username, subjectId });
//     res.json(records);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Failed to read quiz grading schemas: " + err.message });
//   }
// });

// // Write or refresh quiz evaluation metrics onto DB store
// app.post("/api/quiz-submissions", async (req, res) => {
//   try {
//     const {
//       username,
//       subjectId,
//       quizId,
//       correctAnswers,
//       totalQuestions,
//       percentage,
//       userAnswersArray,
//     } = req.body;

//     const record = await QuizSubmission.findOneAndUpdate(
//       { username, subjectId, quizId },
//       {
//         correctAnswers,
//         totalQuestions,
//         percentage,
//         userAnswersArray,
//         isCompleted: true,
//       },
//       { new: true, upsert: true },
//     );

//     res.json(record);
//   } catch (err) {
//     res
//       .status(400)
//       .json({
//         error: "Failed tracking quiz submission payload: " + err.message,
//       });
//   }
// });

// // Reset specific quiz progress log (For re-attempts)
// app.delete(
//   "/api/quiz-submissions/:username/:subjectId/:quizId",
//   async (req, res) => {
//     try {
//       const { username, subjectId, quizId } = req.params;
//       await QuizSubmission.findOneAndDelete({ username, subjectId, quizId });
//       res.json({
//         success: true,
//         message: "Quiz session trace dropped perfectly.",
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
// );

// // --- IDENTITY GENERAL ROUTE CONTROLLERS ---

// app.get("/api/students", async (req, res) => {
//   try {
//     const students = await User.find({ role: "student" }).populate(
//       "assignedSubjects",
//     );
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/students", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password || "student123", salt);

//     const newStudent = new User({
//       username,
//       password: hashedPassword,
//       role: "student",
//       assignedSubjects: [],
//     });

//     await newStudent.save();
//     res.status(201).json(newStudent);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.put("/api/students/:id/assign", async (req, res) => {
//   try {
//     const { subjectIds } = req.body;
//     const student = await User.findByIdAndUpdate(
//       req.params.id,
//       { assignedSubjects: subjectIds },
//       { new: true },
//     ).populate("assignedSubjects");
//     res.json(student);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.get("/api/user-context/:username", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.params.username }).populate(
//       "assignedSubjects",
//     );
//     if (!user)
//       return res.status(404).json({ error: "Identity tree trace missed." });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`Server executing operations on port ${PORT}`),
// );



import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/subjectPortal";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Database Connected Successfully"))
  .catch((err) => console.error("Database connection failure:", err));

// --- DATA SCHEMAS ---

// const SubjectSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   materials: [{ title: String, htmlContent: String }],
//   tasks: [
//     {
//       title: { type: String, required: true },
//       topic: { type: String, required: true },
//       questions: [
//         {
//           questionText: String,
//           allowedLanguages: [String],
//           initialPythonCode: String,
//           initialJavaCode: String,
//           expectedOutput: String,
//         },
//       ],
//     },
//   ],
//   quizzes: [{ title: String, htmlContent: String }],
// });

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  materials: [{ title: String, htmlContent: String }],
  tasks: [
    {
      title: { type: String, required: true },
      topic: { type: String, required: true },
      questions: [
        {
          questionText: String,
          allowedLanguages: [String],
          initialPythonCode: String,
          initialJavaCode: String,
          expectedOutput: String,
        },
      ],
    },
  ],
  // UPDATED: Added questions array to the quiz subdocument
  quizzes: [
    {
      title: String,
      htmlContent: String,
      questions: [
        {
          questionText: String,
          options: [String],
          correctIndex: Number,
        },
      ],
    },
  ],
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student"], default: "student" },
  assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
});

// Task Progress Tracking Schema Matrix
const SubmissionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  taskId: { type: String, required: true },
  scores: { type: Map, of: Number },
  completedQuestions: [Number],
  isCompleted: { type: Boolean, default: false },
});

// Added explicit Quiz Submission tracker schema to map metrics securely to DB
const QuizSubmissionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  quizId: { type: String, required: true },
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  userAnswersArray: [{ type: Number }],
  isCompleted: { type: Boolean, default: true },
});

const Subject = mongoose.model("Subject", SubjectSchema);
const User = mongoose.model("User", UserSchema);
const Submission = mongoose.model("Submission", SubmissionSchema);
const QuizSubmission = mongoose.model("QuizSubmission", QuizSubmissionSchema);

// --- SECURE AUTHENTICATION ENDPOINT ---

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid username profile identifier string." });
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return res
        .status(401)
        .json({ error: "Secure authorization password key mismatch." });
    }

    res.json({
      username: user.username,
      role: user.role,
      token: "mock-session-jwt-string-placeholder",
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Auth validation failure: " + err.message });
  }
});

// --- API GENERAL ROUTE CONTROLLERS ---

app.get("/api/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/subjects", async (req, res) => {
  try {
    const newSubject = new Subject({
      name: req.body.name,
      materials: [],
      tasks: [],
      quizzes: [],
    });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// app.post("/api/subjects/:id/content", async (req, res) => {
//   try {
//     const { type, title, htmlContent } = req.body;
//     const subject = await Subject.findById(req.params.id);
//     if (!subject)
//       return res
//         .status(404)
//         .json({ error: "Subject context target index missed" });

//     if (!["materials", "quizzes"].includes(type)) {
//       return res
//         .status(400)
//         .json({
//           error: "Invalid content type. Must be 'materials' or 'quizzes'.",
//         });
//     }

//     subject[type].push({ title, htmlContent });
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

app.post("/api/subjects/:id/content", async (req, res) => {
  try {
    // UPDATED: Added 'questions' to the destructured body
    const { type, title, htmlContent, questions } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject)
      return res
        .status(404)
        .json({ error: "Subject context target index missed" });

    if (!["materials", "quizzes"].includes(type)) {
      return res.status(400).json({ error: "Invalid content type." });
    }

    // UPDATED: Push the object including the questions array
    const newContent = {
      title,
      htmlContent: htmlContent || "",
      questions: type === "quizzes" ? questions || [] : undefined,
    };

    subject[type].push(newContent);
    await subject.save();
    res.json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/subjects/:id/tasks", async (req, res) => {
  try {
    const { title, topic, questions } = req.body;
    const subject = await Subject.findById(req.params.id);
    if (!subject)
      return res.status(404).json({ error: "Subject target context missed" });

    subject.tasks.push({ title, topic, questions });
    await subject.save();
    res.json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete(
  "/api/subjects/:subjectId/content/:contentType/:contentId",
  async (req, res) => {
    try {
      const { subjectId, contentType, contentId } = req.params;

      if (!["materials", "tasks", "quizzes"].includes(contentType)) {
        return res
          .status(400)
          .json({ error: "Invalid module content array target type context." });
      }

      const updatedSubject = await Subject.findByIdAndUpdate(
        subjectId,
        { $pull: { [contentType]: { _id: contentId } } },
        { new: true },
      );

      if (!updatedSubject) {
        return res.status(404).json({ error: "Subject target index missed." });
      }

      res.json(updatedSubject);
    } catch (err) {
      res.status(500).json({ error: "Deletion routine error: " + err.message });
    }
  },
);

// --- TASK SUBMISSIONS CONTROLLERS ---

app.get("/api/submissions/:username/:subjectId", async (req, res) => {
  try {
    const { username, subjectId } = req.params;
    const records = await Submission.find({ username, subjectId });
    res.json(records);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to pull submission data logs: " + err.message });
  }
});

app.post("/api/submissions/submit-question", async (req, res) => {
  try {
    const {
      username,
      subjectId,
      taskId,
      questionIndex,
      score,
      totalQuestions,
    } = req.body;

    let record = await Submission.findOne({ username, subjectId, taskId });
    if (!record) {
      record = new Submission({
        username,
        subjectId,
        taskId,
        scores: {},
        completedQuestions: [],
        isCompleted: false,
      });
    }

    record.scores.set(questionIndex.toString(), score);

    if (!record.completedQuestions.includes(questionIndex)) {
      record.completedQuestions.push(questionIndex);
    }

    if (record.completedQuestions.length >= totalQuestions) {
      record.isCompleted = true;
    }

    await record.save();
    res.json(record);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error saving submission metrics: " + err.message });
  }
});

// --- QUIZ SUBMISSIONS CONTROLLERS ---

app.get("/api/quiz-submissions/:username/:subjectId", async (req, res) => {
  try {
    const { username, subjectId } = req.params;
    const records = await QuizSubmission.find({ username, subjectId });
    res.json(records);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to read quiz grading schemas: " + err.message });
  }
});

app.post("/api/quiz-submissions", async (req, res) => {
  try {
    const {
      username,
      subjectId,
      quizId,
      correctAnswers,
      totalQuestions,
      percentage,
      userAnswersArray,
    } = req.body;

    const record = await QuizSubmission.findOneAndUpdate(
      { username, subjectId, quizId },
      {
        correctAnswers,
        totalQuestions,
        percentage,
        userAnswersArray,
        isCompleted: true,
      },
      { new: true, upsert: true },
    );

    res.json(record);
  } catch (err) {
    res.status(400).json({
      error: "Failed tracking quiz submission payload: " + err.message,
    });
  }
});

app.delete(
  "/api/quiz-submissions/:username/:subjectId/:quizId",
  async (req, res) => {
    try {
      const { username, subjectId, quizId } = req.params;
      await QuizSubmission.findOneAndDelete({ username, subjectId, quizId });
      res.json({
        success: true,
        message: "Quiz session trace dropped perfectly.",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// --- ADMIN: STUDENT PROGRESS MONITORING ENDPOINT ---
// Returns full progress data for all students across all subjects
app.get("/api/admin/student-progress", async (req, res) => {
  try {
    // Fetch all students with their assigned subjects
    const students = await User.find({ role: "student" }).populate(
      "assignedSubjects",
    );
    const allSubjects = await Subject.find();

    const progressReport = await Promise.all(
      students.map(async (student) => {
        const subjectProgress = await Promise.all(
          student.assignedSubjects.map(async (subject) => {
            // Get task submissions for this student + subject
            const taskSubmissions = await Submission.find({
              username: student.username,
              subjectId: subject._id,
            });

            // Get quiz submissions for this student + subject
            const quizSubmissions = await QuizSubmission.find({
              username: student.username,
              subjectId: subject._id,
            });

            // Build task progress map
            const taskProgress = subject.tasks.map((task) => {
              const record = taskSubmissions.find(
                (r) => r.taskId === task._id.toString(),
              );
              const totalQ = task.questions.length || 1;
              const completedQ = record?.completedQuestions?.length || 0;
              const scoresMap = record?.scores
                ? Object.fromEntries(record.scores)
                : {};
              const scoreValues = Object.values(scoresMap);
              const avgScore =
                scoreValues.length > 0
                  ? Math.round(
                      scoreValues.reduce((a, b) => a + b, 0) /
                        scoreValues.length,
                    )
                  : 0;

              return {
                taskId: task._id,
                title: task.title,
                topic: task.topic,
                totalQuestions: totalQ,
                completedQuestions: completedQ,
                percentage: Math.min(
                  Math.round((completedQ / totalQ) * 100),
                  100,
                ),
                isCompleted: record?.isCompleted || false,
                avgScore,
                scores: scoresMap,
              };
            });

            // Build quiz progress map
            const quizProgress = subject.quizzes.map((quiz) => {
              const record = quizSubmissions.find(
                (r) => r.quizId === quiz._id.toString(),
              );
              return {
                quizId: quiz._id,
                title: quiz.title,
                isCompleted: record?.isCompleted || false,
                correctAnswers: record?.correctAnswers || 0,
                totalQuestions: record?.totalQuestions || 0,
                percentage: record?.percentage || 0,
                scoreString: record
                  ? `${record.correctAnswers} / ${record.totalQuestions}`
                  : "—",
              };
            });

            // Compute averages
            const completedTasks = taskProgress.filter(
              (t) => t.isCompleted,
            ).length;
            const completedQuizzes = quizProgress.filter(
              (q) => q.isCompleted,
            ).length;
            const taskAvgScore =
              taskProgress.length > 0
                ? Math.round(
                    taskProgress.reduce((a, t) => a + t.avgScore, 0) /
                      taskProgress.length,
                  )
                : 0;
            const quizAvgScore =
              quizProgress.filter((q) => q.isCompleted).length > 0
                ? Math.round(
                    quizProgress
                      .filter((q) => q.isCompleted)
                      .reduce((a, q) => a + q.percentage, 0) /
                      quizProgress.filter((q) => q.isCompleted).length,
                  )
                : 0;

            return {
              subjectId: subject._id,
              subjectName: subject.name,
              taskProgress,
              quizProgress,
              summary: {
                totalTasks: subject.tasks.length,
                completedTasks,
                totalQuizzes: subject.quizzes.length,
                completedQuizzes,
                taskAvgScore,
                quizAvgScore,
              },
            };
          }),
        );

        return {
          studentId: student._id,
          username: student.username,
          subjectProgress,
        };
      }),
    );

    res.json(progressReport);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to build progress report: " + err.message });
  }
});

// --- IDENTITY GENERAL ROUTE CONTROLLERS ---

app.get("/api/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).populate(
      "assignedSubjects",
    );
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || "student123", salt);

    const newStudent = new User({
      username,
      password: hashedPassword,
      role: "student",
      assignedSubjects: [],
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/students/:id/assign", async (req, res) => {
  try {
    const { subjectIds } = req.body;
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { assignedSubjects: subjectIds },
      { new: true },
    ).populate("assignedSubjects");
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/user-context/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate(
      "assignedSubjects",
    );
    if (!user)
      return res.status(404).json({ error: "Identity tree trace missed." });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add this after the existing DELETE content route
app.delete("/api/subjects/:id", async (req, res) => {
  try {
    const deleted = await Subject.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Subject not found." });

    // Also clean up all submissions and quiz submissions for this subject
    await Submission.deleteMany({ subjectId: req.params.id });
    await QuizSubmission.deleteMany({ subjectId: req.params.id });

    // Remove this subject from all students' assignedSubjects
    await User.updateMany(
      { assignedSubjects: req.params.id },
      { $pull: { assignedSubjects: req.params.id } }
    );

    res.json({ success: true, message: "Subject and all related data deleted." });
  } catch (err) {
    res.status(500).json({ error: "Subject deletion failed: " + err.message });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found." });

    // Clean up all their submissions and quiz submissions
    await Submission.deleteMany({ username: student.username });
    await QuizSubmission.deleteMany({ username: student.username });

    res.json({
      success: true,
      message: "Student account and all records deleted.",
    });
  } catch (err) {
    res.status(500).json({ error: "Student deletion failed: " + err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server executing operations on port ${PORT}`),
);
