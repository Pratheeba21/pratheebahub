
// // import express from "express";
// // import mongoose from "mongoose";
// // import cors from "cors";
// // import dotenv from "dotenv";
// // import bcrypt from "bcryptjs";
// // import nodemailer from "nodemailer";

// // dotenv.config();
// // const app = express();

// // app.use(cors());
// // app.use(express.json());



// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });

// // const MONGO_URI =
// //   process.env.MONGO_URI ||
// //   "mongodb+srv://Pratheeba:PratheebaMongoDBAtlas@cluster0.ixnufht.mongodb.net/subjectPortal?appName=Cluster0"; 
// // mongoose
// //   .connect(MONGO_URI)
// //   .then(() => console.log("MongoDB Database Connected Successfully"))
// //   .catch((err) => console.error("Database connection failure:", err));



// // const SubjectSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   coverImage: { type: String, default: "" },
// //   materials: [{ title: String, htmlContent: String }],
// //   tasks: [
// //     {
// //       title: { type: String, required: true },
// //       topic: { type: String, required: true },
// //       questions: [
// //         {
// //           questionText: String,
// //           allowedLanguages: [String],
// //           initialPythonCode: String,
// //           initialJavaCode: String,
// //           expectedOutput: String,
// //         },
// //       ],
// //     },
// //   ],
// //   // UPDATED: Added questions array to the quiz subdocument
// //   quizzes: [
// //     {
// //       title: String,
// //       htmlContent: String,
// //       questions: [
// //         {
// //           questionText: String,
// //           options: [String],
// //           correctIndex: Number,
// //         },
// //       ],
// //     },
// //   ],
// // });


// // const UserSchema = new mongoose.Schema({
// //   username: { type: String, required: true, unique: true },
// //   password: { type: String, required: true },
// //   role: { type: String, enum: ["admin", "student"], default: "student" },
// //   assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
// //   mobile: { type: String, default: "" },
// //   email: { type: String, default: "" },
// // });

// // // Task Progress Tracking Schema Matrix
// // const SubmissionSchema = new mongoose.Schema({
// //   username: { type: String, required: true },
// //   subjectId: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "Subject",
// //     required: true,
// //   },
// //   taskId: { type: String, required: true },
// //   scores: { type: Map, of: Number },
// //   completedQuestions: [Number],
// //   isCompleted: { type: Boolean, default: false },
// // });

// // // Added explicit Quiz Submission tracker schema to map metrics securely to DB
// // const QuizSubmissionSchema = new mongoose.Schema({
// //   username: { type: String, required: true },
// //   subjectId: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "Subject",
// //     required: true,
// //   },
// //   quizId: { type: String, required: true },
// //   correctAnswers: { type: Number, required: true },
// //   totalQuestions: { type: Number, required: true },
// //   percentage: { type: Number, required: true },
// //   userAnswersArray: [{ type: Number }],
// //   isCompleted: { type: Boolean, default: true },
// // });

// // const Subject = mongoose.model("Subject", SubjectSchema);
// // const User = mongoose.model("User", UserSchema);
// // const Submission = mongoose.model("Submission", SubmissionSchema);
// // const QuizSubmission = mongoose.model("QuizSubmission", QuizSubmissionSchema);

// // // --- SECURE AUTHENTICATION ENDPOINT ---

// // app.post("/api/auth/login", async (req, res) => {
// //   try {
// //     const { username, password } = req.body;

// //     const user = await User.findOne({ username });
// //     if (!user) {
// //       return res
// //         .status(401)
// //         .json({ error: "Invalid username profile identifier string." });
// //     }

// //     const matches = await bcrypt.compare(password, user.password);
// //     if (!matches) {
// //       return res
// //         .status(401)
// //         .json({ error: "Secure authorization password key mismatch." });
// //     }

// //     res.json({
// //       username: user.username,
// //       role: user.role,
// //       token: "mock-session-jwt-string-placeholder",
// //     });
// //   } catch (err) {
// //     res
// //       .status(500)
// //       .json({ error: "Internal Auth validation failure: " + err.message });
// //   }
// // });

// // // --- API GENERAL ROUTE CONTROLLERS ---

// // app.get("/api/subjects", async (req, res) => {
// //   try {
// //     const subjects = await Subject.find();
// //     res.json(subjects);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // app.post("/api/subjects", async (req, res) => {
// //   try {
// //     const newSubject = new Subject({
// //       name: req.body.name,
// //       materials: [],
// //       tasks: [],
// //       quizzes: [],
// //     });
// //     await newSubject.save();
// //     res.status(201).json(newSubject);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // app.put("/api/subjects/:id", async (req, res) => {
// //   try {
// //     const { name, coverImage } = req.body;
// //     const subject = await Subject.findById(req.params.id);
// //     if (!subject) return res.status(404).json({ error: "Subject not found." });
// //     if (name !== undefined) subject.name = name;
// //     if (coverImage !== undefined) subject.coverImage = coverImage;
// //     await subject.save();
// //     res.json(subject);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });


// // app.post("/api/subjects/:id/content", async (req, res) => {
// //   try {
// //     // UPDATED: Added 'questions' to the destructured body
// //     const { type, title, htmlContent, questions } = req.body;
// //     const subject = await Subject.findById(req.params.id);

// //     if (!subject)
// //       return res
// //         .status(404)
// //         .json({ error: "Subject context target index missed" });

// //     // if (!["materials", "quizzes"].includes(type)) {
// //     //   return res.status(400).json({ error: "Invalid content type." });
// //     // }
// //     if (!["materials", "quizzes", "tasks"].includes(type)) {
// //       return res.status(400).json({ error: "Invalid content type." });
// //     }

// //     // UPDATED: Push the object including the questions array
// //     const newContent = {
// //       title,
// //       htmlContent: htmlContent || "",
// //       questions: type === "quizzes" ? questions || [] : undefined,
// //     };

// //     subject[type].push(newContent);
// //     await subject.save();
// //     res.json(subject);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // // Add this after the POST /api/subjects/:id/content route
// // app.put("/api/subjects/:subjectId/content/materials/:contentId", async (req, res) => {
// //   try {
// //     const { subjectId, contentId } = req.params;
// //     const { title, htmlContent } = req.body;

// //     const subject = await Subject.findById(subjectId);
// //     if (!subject) return res.status(404).json({ error: "Subject not found" });

// //     const material = subject.materials.id(contentId);
// //     if (!material) return res.status(404).json({ error: "Material not found" });

// //     if (title !== undefined) material.title = title;
// //     if (htmlContent !== undefined) material.htmlContent = htmlContent;

// //     await subject.save();
// //     res.json(subject);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // app.put(
// //   "/api/subjects/:subjectId/content/quizzes/:contentId",
// //   async (req, res) => {
// //     try {
// //       const { subjectId, contentId } = req.params;
// //       const { title, questions } = req.body;

// //       const subject = await Subject.findById(subjectId);
// //       if (!subject) return res.status(404).json({ error: "Subject not found" });

// //       const quiz = subject.quizzes.id(contentId);
// //       if (!quiz) return res.status(404).json({ error: "Quiz not found" });

// //       if (title !== undefined) quiz.title = title;
// //       if (questions !== undefined) quiz.questions = questions;

// //       await subject.save();
// //       res.json(subject);
// //     } catch (err) {
// //       res.status(400).json({ error: err.message });
// //     }
// //   },
// // );

// // app.put("/api/subjects/:subjectId/tasks/:taskId", async (req, res) => {
// //   try {
// //     const { subjectId, taskId } = req.params;
// //     const { title, topic, questions } = req.body;

// //     const subject = await Subject.findById(subjectId);
// //     if (!subject) return res.status(404).json({ error: "Subject not found" });

// //     const task = subject.tasks.id(taskId);
// //     if (!task) return res.status(404).json({ error: "Task not found" });

// //     if (title !== undefined) task.title = title;
// //     if (topic !== undefined) task.topic = topic;
// //     if (questions !== undefined) task.questions = questions;

// //     await subject.save();
// //     res.json(subject);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // app.post("/api/subjects/:id/tasks", async (req, res) => {
// //   try {
// //     const { title, topic, questions } = req.body;
// //     const subject = await Subject.findById(req.params.id);
// //     if (!subject)
// //       return res.status(404).json({ error: "Subject target context missed" });

// //     subject.tasks.push({ title, topic, questions });
// //     await subject.save();
// //     res.json(subject);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // app.delete(
// //   "/api/subjects/:subjectId/content/:contentType/:contentId",
// //   async (req, res) => {
// //     try {
// //       const { subjectId, contentType, contentId } = req.params;

// //       if (!["materials", "tasks", "quizzes"].includes(contentType)) {
// //         return res
// //           .status(400)
// //           .json({ error: "Invalid module content array target type context." });
// //       }

// //       const updatedSubject = await Subject.findByIdAndUpdate(
// //         subjectId,
// //         { $pull: { [contentType]: { _id: contentId } } },
// //         { new: true },
// //       );

// //       if (!updatedSubject) {
// //         return res.status(404).json({ error: "Subject target index missed." });
// //       }

// //       res.json(updatedSubject);
// //     } catch (err) {
// //       res.status(500).json({ error: "Deletion routine error: " + err.message });
// //     }
// //   },
// // );

// // // --- TASK SUBMISSIONS CONTROLLERS ---

// // app.get("/api/submissions/:username/:subjectId", async (req, res) => {
// //   try {
// //     const { username, subjectId } = req.params;
// //     const records = await Submission.find({ username, subjectId });
// //     res.json(records);
// //   } catch (err) {
// //     res
// //       .status(500)
// //       .json({ error: "Failed to pull submission data logs: " + err.message });
// //   }
// // });

// // app.post("/api/submissions/submit-question", async (req, res) => {
// //   try {
// //     const {
// //       username,
// //       subjectId,
// //       taskId,
// //       questionIndex,
// //       score,
// //       totalQuestions,
// //     } = req.body;

// //     let record = await Submission.findOne({ username, subjectId, taskId });
// //     if (!record) {
// //       record = new Submission({
// //         username,
// //         subjectId,
// //         taskId,
// //         scores: {},
// //         completedQuestions: [],
// //         isCompleted: false,
// //       });
// //     }

// //     record.scores.set(questionIndex.toString(), score);

// //     if (!record.completedQuestions.includes(questionIndex)) {
// //       record.completedQuestions.push(questionIndex);
// //     }

// //     if (record.completedQuestions.length >= totalQuestions) {
// //       record.isCompleted = true;
// //     }

// //     await record.save();
// //     res.json(record);
// //   } catch (err) {
// //     res
// //       .status(400)
// //       .json({ error: "Error saving submission metrics: " + err.message });
// //   }
// // });

// // // --- QUIZ SUBMISSIONS CONTROLLERS ---

// // app.get("/api/quiz-submissions/:username/:subjectId", async (req, res) => {
// //   try {
// //     const { username, subjectId } = req.params;
// //     const records = await QuizSubmission.find({ username, subjectId });
// //     res.json(records);
// //   } catch (err) {
// //     res
// //       .status(500)
// //       .json({ error: "Failed to read quiz grading schemas: " + err.message });
// //   }
// // });

// // app.post("/api/quiz-submissions", async (req, res) => {
// //   try {
// //     const {
// //       username,
// //       subjectId,
// //       quizId,
// //       correctAnswers,
// //       totalQuestions,
// //       percentage,
// //       userAnswersArray,
// //     } = req.body;

// //     const record = await QuizSubmission.findOneAndUpdate(
// //       { username, subjectId, quizId },
// //       {
// //         correctAnswers,
// //         totalQuestions,
// //         percentage,
// //         userAnswersArray,
// //         isCompleted: true,
// //       },
// //       { new: true, upsert: true },
// //     );

// //     res.json(record);
// //   } catch (err) {
// //     res.status(400).json({
// //       error: "Failed tracking quiz submission payload: " + err.message,
// //     });
// //   }
// // });

// // app.delete(
// //   "/api/quiz-submissions/:username/:subjectId/:quizId",
// //   async (req, res) => {
// //     try {
// //       const { username, subjectId, quizId } = req.params;
// //       await QuizSubmission.findOneAndDelete({ username, subjectId, quizId });
// //       res.json({
// //         success: true,
// //         message: "Quiz session trace dropped perfectly.",
// //       });
// //     } catch (err) {
// //       res.status(500).json({ error: err.message });
// //     }
// //   },
// // );

// // // --- ADMIN: STUDENT PROGRESS MONITORING ENDPOINT ---
// // // Returns full progress data for all students across all subjects
// // app.get("/api/admin/student-progress", async (req, res) => {
// //   try {
// //     // Fetch all students with their assigned subjects
// //     const students = await User.find({ role: "student" }).populate(
// //       "assignedSubjects",
// //     );
// //     const allSubjects = await Subject.find();

// //     const progressReport = await Promise.all(
// //       students.map(async (student) => {
// //         const subjectProgress = await Promise.all(
// //           student.assignedSubjects.map(async (subject) => {
// //             // Get task submissions for this student + subject
// //             const taskSubmissions = await Submission.find({
// //               username: student.username,
// //               subjectId: subject._id,
// //             });

// //             // Get quiz submissions for this student + subject
// //             const quizSubmissions = await QuizSubmission.find({
// //               username: student.username,
// //               subjectId: subject._id,
// //             });

// //             // Build task progress map
// //             const taskProgress = subject.tasks.map((task) => {
// //               const record = taskSubmissions.find(
// //                 (r) => r.taskId === task._id.toString(),
// //               );
// //               const totalQ = task.questions.length || 1;
// //               const completedQ = record?.completedQuestions?.length || 0;
// //               const scoresMap = record?.scores
// //                 ? Object.fromEntries(record.scores)
// //                 : {};
// //               const scoreValues = Object.values(scoresMap);
// //               const avgScore =
// //                 scoreValues.length > 0
// //                   ? Math.round(
// //                       scoreValues.reduce((a, b) => a + b, 0) /
// //                         scoreValues.length,
// //                     )
// //                   : 0;

// //               return {
// //                 taskId: task._id,
// //                 title: task.title,
// //                 topic: task.topic,
// //                 totalQuestions: totalQ,
// //                 completedQuestions: completedQ,
// //                 percentage: Math.min(
// //                   Math.round((completedQ / totalQ) * 100),
// //                   100,
// //                 ),
// //                 isCompleted: record?.isCompleted || false,
// //                 avgScore,
// //                 scores: scoresMap,
// //               };
// //             });

// //             // Build quiz progress map
// //             const quizProgress = subject.quizzes.map((quiz) => {
// //               const record = quizSubmissions.find(
// //                 (r) => r.quizId === quiz._id.toString(),
// //               );
// //               return {
// //                 quizId: quiz._id,
// //                 title: quiz.title,
// //                 isCompleted: record?.isCompleted || false,
// //                 correctAnswers: record?.correctAnswers || 0,
// //                 totalQuestions: record?.totalQuestions || 0,
// //                 percentage: record?.percentage || 0,
// //                 scoreString: record
// //                   ? `${record.correctAnswers} / ${record.totalQuestions}`
// //                   : "—",
// //               };
// //             });

// //             // Compute averages
// //             const completedTasks = taskProgress.filter(
// //               (t) => t.isCompleted,
// //             ).length;
// //             const completedQuizzes = quizProgress.filter(
// //               (q) => q.isCompleted,
// //             ).length;
// //             const taskAvgScore =
// //               taskProgress.length > 0
// //                 ? Math.round(
// //                     taskProgress.reduce((a, t) => a + t.avgScore, 0) /
// //                       taskProgress.length,
// //                   )
// //                 : 0;
// //             const quizAvgScore =
// //               quizProgress.filter((q) => q.isCompleted).length > 0
// //                 ? Math.round(
// //                     quizProgress
// //                       .filter((q) => q.isCompleted)
// //                       .reduce((a, q) => a + q.percentage, 0) /
// //                       quizProgress.filter((q) => q.isCompleted).length,
// //                   )
// //                 : 0;

// //             return {
// //               subjectId: subject._id,
// //               subjectName: subject.name,
// //               taskProgress,
// //               quizProgress,
// //               summary: {
// //                 totalTasks: subject.tasks.length,
// //                 completedTasks,
// //                 totalQuizzes: subject.quizzes.length,
// //                 completedQuizzes,
// //                 taskAvgScore,
// //                 quizAvgScore,
// //               },
// //             };
// //           }),
// //         );

// //         return {
// //           studentId: student._id,
// //           username: student.username,
// //           subjectProgress,
// //         };
// //       }),
// //     );

// //     res.json(progressReport);
// //   } catch (err) {
// //     res
// //       .status(500)
// //       .json({ error: "Failed to build progress report: " + err.message });
// //   }
// // });

// // // --- IDENTITY GENERAL ROUTE CONTROLLERS ---

// // app.get("/api/students", async (req, res) => {
// //   try {
// //     const students = await User.find({ role: "student" }).populate(
// //       "assignedSubjects",
// //     );
// //     res.json(students);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });


// // app.post("/api/students", async (req, res) => {
// //   try {
// //     const { username, password, mobile, email } = req.body;
// //     const rawPassword = password || "student123";
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(rawPassword, salt);

// //     const newStudent = new User({
// //       username,
// //       password: hashedPassword,
// //       role: "student",
// //       assignedSubjects: [],
// //       mobile: mobile || "",
// //       email: email || "",
// //     });

// //     await newStudent.save();

// //     // Send welcome email if email provided
// //     if (email) {
// //       try {
// //         await transporter.sendMail({
// //           from: `"LMS Portal" <${process.env.EMAIL_USER}>`,
// //           to: email,
// //           subject: "Your LMS Account Has Been Created",
// //           html: `
// //             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1d; color: #e2e8f0; padding: 2rem; border-radius: 12px; border: 1px solid #1e2d45;">
// //               <h2 style="color: #3b82f6;">Welcome to LMS Portal</h2>
// //               <p>Your student account has been successfully created by the administrator.</p>
// //               <div style="background: #111827; border: 1px solid #1e2d45; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
// //                 <p style="margin: 0 0 8px 0;"><strong style="color: #94a3b8;">Username:</strong> <span style="color: #38bdf8; font-family: monospace;">${username}</span></p>
// //                 <p style="margin: 0;"><strong style="color: #94a3b8;">Password:</strong> <span style="color: #38bdf8; font-family: monospace;">${rawPassword}</span></p>
// //               </div>
// //               <p style="color: #64748b; font-size: 0.85rem;">Please log in and keep your credentials safe. Contact your administrator if you have any issues.</p>
// //               <p style="color: #64748b; font-size: 0.8rem; margin-top: 2rem;">— LMS ENGINE v2.0</p>
// //             </div>
// //           `,
// //         });
// //       } catch (mailErr) {
// //         console.error("Mail send failed:", mailErr.message);
// //       }
// //     }

// //     res.status(201).json(newStudent);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // app.put("/api/students/:id/assign", async (req, res) => {
// //   try {
// //     const { subjectIds } = req.body;
// //     const student = await User.findByIdAndUpdate(
// //       req.params.id,
// //       { assignedSubjects: subjectIds },
// //       { new: true },
// //     ).populate("assignedSubjects");
// //     res.json(student);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // app.get("/api/user-context/:username", async (req, res) => {
// //   try {
// //     const user = await User.findOne({ username: req.params.username }).populate(
// //       "assignedSubjects",
// //     );
// //     if (!user)
// //       return res.status(404).json({ error: "Identity tree trace missed." });
// //     res.json(user);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Add this after the existing DELETE content route
// // app.delete("/api/subjects/:id", async (req, res) => {
// //   try {
// //     const deleted = await Subject.findByIdAndDelete(req.params.id);
// //     if (!deleted)
// //       return res.status(404).json({ error: "Subject not found." });

// //     // Also clean up all submissions and quiz submissions for this subject
// //     await Submission.deleteMany({ subjectId: req.params.id });
// //     await QuizSubmission.deleteMany({ subjectId: req.params.id });

// //     // Remove this subject from all students' assignedSubjects
// //     await User.updateMany(
// //       { assignedSubjects: req.params.id },
// //       { $pull: { assignedSubjects: req.params.id } }
// //     );

// //     res.json({ success: true, message: "Subject and all related data deleted." });
// //   } catch (err) {
// //     res.status(500).json({ error: "Subject deletion failed: " + err.message });
// //   }
// // });

// // app.delete("/api/students/:id", async (req, res) => {
// //   try {
// //     const student = await User.findByIdAndDelete(req.params.id);
// //     if (!student) return res.status(404).json({ error: "Student not found." });

// //     // Clean up all their submissions and quiz submissions
// //     await Submission.deleteMany({ username: student.username });
// //     await QuizSubmission.deleteMany({ username: student.username });

// //     res.json({
// //       success: true,
// //       message: "Student account and all records deleted.",
// //     });
// //   } catch (err) {
// //     res.status(500).json({ error: "Student deletion failed: " + err.message });
// //   }
// // });

// // const otpStore = new Map(); // { email: { otp, expiry, username } }

// // // ── Subject Access Requests ──────────────────────────────────────────────────
// // const SubjectRequestSchema = new mongoose.Schema({
// //   username: { type: String, required: true },
// //   email: { type: String, default: "" },
// //   subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
// //   status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
// //   requestedAt: { type: Date, default: Date.now },
// // });
// // const SubjectRequest = mongoose.model("SubjectRequest", SubjectRequestSchema);

// // // Sign Up
// // app.post("/api/auth/signup", async (req, res) => {
// //   try {
// //     const { username, password, email, mobile } = req.body;
// //     if (!username || !password) return res.status(400).json({ error: "Username and password are required." });
// //     // const existing = await User.findOne({ username });
// //     // if (existing) return res.status(400).json({ error: "Username already taken." });
// //     const existing = await User.findOne({ username });
// //     if (existing)
// //       return res.status(400).json({ error: "Username already taken." });
// //     if (email) {
// //       const emailExists = await User.findOne({ email });
// //       if (emailExists)
// //         return res
// //           .status(400)
// //           .json({ error: "An account with this email already exists." });
// //     }
// //     const salt = await bcrypt.genSalt(10);
// //     const hashed = await bcrypt.hash(password, salt);
// //     const newUser = new User({ username, password: hashed, role: "student", assignedSubjects: [], email: email || "", mobile: mobile || "" });
// //     // await newUser.save();
// //     // res.status(201).json({ username: newUser.username, role: newUser.role, token: "mock-session-jwt-string-placeholder" });
// //     await newUser.save();

// //     if (email) {
// //       try {
// //         await transporter.sendMail({
// //           from: `"LMS Portal" <${process.env.EMAIL_USER}>`,
// //           to: email,
// //           subject: "Welcome to LMS Portal!",
// //           html: `
// //             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1d; color: #e2e8f0; padding: 2rem; border-radius: 12px; border: 1px solid #1e2d45;">
// //               <h2 style="color: #3b82f6;">🎓 Welcome to LMS Portal</h2>
// //               <p>Hi <strong>${username}</strong>, your student account has been created successfully!</p>
// //               <div style="background: #111827; border: 1px solid #1e2d45; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
// //                 <p style="margin: 0 0 8px 0;"><strong style="color: #94a3b8;">Username:</strong> <span style="color: #38bdf8; font-family: monospace;">${username}</span></p>
// //               </div>
// //               <p>You can now log in and browse available subjects. Request access to any subject you'd like to enroll in — an admin will review and approve your request.</p>
// //               <p style="color: #64748b; font-size: 0.8rem; margin-top: 2rem;">— LMS ENGINE v2.0</p>
// //             </div>
// //           `,
// //         });
// //       } catch (mailErr) {
// //         console.error("Welcome mail send failed:", mailErr.message);
// //       }
// //     }

// //     res
// //       .status(201)
// //       .json({
// //         username: newUser.username,
// //         role: newUser.role,
// //         token: "mock-session-jwt-string-placeholder",
// //       });
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // // Request subject access
// // app.post("/api/subject-requests", async (req, res) => {
// //   try {
// //     const { username, subjectId } = req.body;
// //     const user = await User.findOne({ username });
// //     if (!user) return res.status(404).json({ error: "User not found." });
// //     // Check already assigned
// //     if (user.assignedSubjects.map(id => id.toString()).includes(subjectId))
// //       return res.status(400).json({ error: "Already assigned to this subject." });
// //     // Check already pending
// //     const existing = await SubjectRequest.findOne({ username, subjectId, status: "pending" });
// //     if (existing) return res.status(400).json({ error: "Request already pending." });
// //     const request = new SubjectRequest({ username, email: user.email, subjectId });
// //     await request.save();
// //     res.status(201).json(request);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // // Get all pending requests (admin)
// // app.get("/api/subject-requests", async (req, res) => {
// //   try {
// //     const requests = await SubjectRequest.find({ status: "pending" }).populate("subjectId", "name");
// //     res.json(requests);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Approve or reject a request
// // app.put("/api/subject-requests/:id", async (req, res) => {
// //   try {
// //     const { action } = req.body; // "approve" | "reject"
// //     const request = await SubjectRequest.findById(req.params.id).populate("subjectId", "name");
// //     if (!request) return res.status(404).json({ error: "Request not found." });
// //     request.status = action === "approve" ? "approved" : "rejected";
// //     await request.save();

// //     if (action === "approve") {
// //       await User.findOneAndUpdate(
// //         { username: request.username },
// //         { $addToSet: { assignedSubjects: request.subjectId._id } }
// //       );
// //     }

// //     // Send email if available
// //     if (request.email) {
// //       const subjectName = request.subjectId?.name || "the subject";
// //       const approved = action === "approve";
// //       try {
// //         await transporter.sendMail({
// //           from: `"LMS Portal" <${process.env.EMAIL_USER}>`,
// //           to: request.email,
// //           subject: approved ? `Access Granted: ${subjectName}` : `Access Update: ${subjectName}`,
// //           html: `
// //             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1d; color: #e2e8f0; padding: 2rem; border-radius: 12px; border: 1px solid #1e2d45;">
// //               <h2 style="color: ${approved ? "#22c55e" : "#f87171"};">${approved ? "✅ Access Approved" : "❌ Access Not Granted"}</h2>
// //               <p>Hi <strong>${request.username}</strong>,</p>
// //               ${approved
// //                 ? `<p>Great news! Your request to access <strong style="color:#38bdf8;">${subjectName}</strong> has been <strong style="color:#22c55e;">approved</strong>. You can now log in and start learning.</p>`
// //                 : `<p>We regret to inform you that your request to access <strong style="color:#38bdf8;">${subjectName}</strong> has not been approved at this time. Please contact your administrator for more information.</p>`
// //               }
// //               <p style="color: #64748b; font-size: 0.8rem; margin-top: 2rem;">— LMS ENGINE v2.0</p>
// //             </div>
// //           `,
// //         });
// //       } catch (mailErr) {
// //         console.error("Mail send failed:", mailErr.message);
// //       }
// //     }

// //     res.json(request);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // // Get requests for a specific student (to know pending/approved status)
// // app.get("/api/subject-requests/student/:username", async (req, res) => {
// //   try {
// //     const requests = await SubjectRequest.find({ username: req.params.username });
// //     res.json(requests);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // app.post("/api/auth/forgot-password", async (req, res) => {
// //   try {
// //     const { email } = req.body;
// //     const user = await User.findOne({ email, role: "student" });
// //     if (!user)
// //       return res
// //         .status(404)
// //         .json({ error: "No account found with this email." });

// //     const otp = Math.floor(100000 + Math.random() * 900000).toString();
// //     otpStore.set(email, {
// //       otp,
// //       expiry: Date.now() + 10 * 60 * 1000,
// //       username: user.username,
// //     });

// //     await transporter.sendMail({
// //       from: `"LMS Portal" <${process.env.EMAIL_USER}>`,
// //       to: email,
// //       subject: "Password Reset OTP",
// //       html: `
// //         <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0f1d; color: #e2e8f0; padding: 2rem; border-radius: 12px; border: 1px solid #1e2d45;">
// //           <h2 style="color: #3b82f6;">Password Reset Request</h2>
// //           <p>Your OTP for password reset is:</p>
// //           <div style="background: #111827; border: 1px solid #3b82f6; border-radius: 8px; padding: 1rem; text-align: center; margin: 1.5rem 0;">
// //             <span style="font-size: 2rem; font-family: monospace; color: #38bdf8; letter-spacing: 8px;">${otp}</span>
// //           </div>
// //           <p style="color: #64748b; font-size: 0.85rem;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
// //         </div>
// //       `,
// //     });

// //     res.json({ success: true, message: "OTP sent to your email." });
// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to send OTP: " + err.message });
// //   }
// // });

// // app.post("/api/auth/verify-otp", async (req, res) => {
// //   try {
// //     const { email, otp, newPassword } = req.body;
// //     const record = otpStore.get(email);
// //     if (!record)
// //       return res
// //         .status(400)
// //         .json({ error: "No OTP request found. Please try again." });
// //     if (Date.now() > record.expiry) {
// //       otpStore.delete(email);
// //       return res.status(400).json({ error: "OTP expired. Request a new one." });
// //     }
// //     if (record.otp !== otp)
// //       return res.status(400).json({ error: "Invalid OTP." });

// //     const salt = await bcrypt.genSalt(10);
// //     const hashed = await bcrypt.hash(newPassword, salt);
// //     await User.findOneAndUpdate({ email }, { password: hashed });
// //     otpStore.delete(email);

// //     res.json({ success: true, message: "Password reset successfully." });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () =>
// //   console.log(`Server executing operations on port ${PORT}`),
// // );



// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // const MONGO_URI =
// //   process.env.MONGO_URI || "mongodb://127.0.0.1:27017/subjectPortal";
// // mongoose
// //   .connect(MONGO_URI)
// //   .then(() => console.log("MongoDB Database Connected Successfully"))
// //   .catch((err) => console.error("Database connection failure:", err));

// const MONGO_URI =
//   process.env.MONGO_URI ||
//   "mongodb+srv://Pratheeba:PratheebaMongoDBAtlas@cluster0.ixnufht.mongodb.net/subjectPortal?appName=Cluster0"; 
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("MongoDB Database Connected Successfully"))
//   .catch((err) => console.error("Database connection failure:", err));

// const SubjectSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   coverImage: { type: String, default: "" },
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
//   // UPDATED: Added questions array to the quiz subdocument
//   quizzes: [
//     {
//       title: String,
//       htmlContent: String,
//       questions: [
//         {
//           questionText: String,
//           options: [String],
//           correctIndex: Number,
//         },
//       ],
//     },
//   ],
// });

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["admin", "student"], default: "student" },
//   assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
//   mobile: { type: String, default: "" },
//   email: { type: String, default: "" },
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
//   userAnswersArray: [{ type: Number }],
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

// app.put("/api/subjects/:id", async (req, res) => {
//   try {
//     const { name, coverImage } = req.body;
//     const subject = await Subject.findById(req.params.id);
//     if (!subject) return res.status(404).json({ error: "Subject not found." });
//     if (name !== undefined) subject.name = name;
//     if (coverImage !== undefined) subject.coverImage = coverImage;
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.post("/api/subjects/:id/content", async (req, res) => {
//   try {
//     // UPDATED: Added 'questions' to the destructured body
//     const { type, title, htmlContent, questions } = req.body;
//     const subject = await Subject.findById(req.params.id);

//     if (!subject)
//       return res
//         .status(404)
//         .json({ error: "Subject context target index missed" });

//     if (!["materials", "quizzes"].includes(type)) {
//       return res.status(400).json({ error: "Invalid content type." });
//     }

//     // UPDATED: Push the object including the questions array
//     const newContent = {
//       title,
//       htmlContent: htmlContent || "",
//       questions: type === "quizzes" ? questions || [] : undefined,
//     };

//     subject[type].push(newContent);
//     await subject.save();
//     res.json(subject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Add this after the POST /api/subjects/:id/content route
// app.put(
//   "/api/subjects/:subjectId/content/materials/:contentId",
//   async (req, res) => {
//     try {
//       const { subjectId, contentId } = req.params;
//       const { title, htmlContent } = req.body;

//       const subject = await Subject.findById(subjectId);
//       if (!subject) return res.status(404).json({ error: "Subject not found" });

//       const material = subject.materials.id(contentId);
//       if (!material)
//         return res.status(404).json({ error: "Material not found" });

//       if (title !== undefined) material.title = title;
//       if (htmlContent !== undefined) material.htmlContent = htmlContent;

//       await subject.save();
//       res.json(subject);
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   },
// );

// app.put(
//   "/api/subjects/:subjectId/content/quizzes/:contentId",
//   async (req, res) => {
//     try {
//       const { subjectId, contentId } = req.params;
//       const { title, questions } = req.body;

//       const subject = await Subject.findById(subjectId);
//       if (!subject) return res.status(404).json({ error: "Subject not found" });

//       const quiz = subject.quizzes.id(contentId);
//       if (!quiz) return res.status(404).json({ error: "Quiz not found" });

//       if (title !== undefined) quiz.title = title;
//       if (questions !== undefined) quiz.questions = questions;

//       await subject.save();
//       res.json(subject);
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   },
// );

// app.put("/api/subjects/:subjectId/tasks/:taskId", async (req, res) => {
//   try {
//     const { subjectId, taskId } = req.params;
//     const { title, topic, questions } = req.body;

//     const subject = await Subject.findById(subjectId);
//     if (!subject) return res.status(404).json({ error: "Subject not found" });

//     const task = subject.tasks.id(taskId);
//     if (!task) return res.status(404).json({ error: "Task not found" });

//     if (title !== undefined) task.title = title;
//     if (topic !== undefined) task.topic = topic;
//     if (questions !== undefined) task.questions = questions;

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
//     res.status(400).json({
//       error: "Failed tracking quiz submission payload: " + err.message,
//     });
//   }
// });

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

// // --- ADMIN: STUDENT PROGRESS MONITORING ENDPOINT ---
// // Returns full progress data for all students across all subjects
// app.get("/api/admin/student-progress", async (req, res) => {
//   try {
//     // Fetch all students with their assigned subjects
//     const students = await User.find({ role: "student" }).populate(
//       "assignedSubjects",
//     );
//     const allSubjects = await Subject.find();

//     const progressReport = await Promise.all(
//       students.map(async (student) => {
//         const subjectProgress = await Promise.all(
//           student.assignedSubjects.map(async (subject) => {
//             // Get task submissions for this student + subject
//             const taskSubmissions = await Submission.find({
//               username: student.username,
//               subjectId: subject._id,
//             });

//             // Get quiz submissions for this student + subject
//             const quizSubmissions = await QuizSubmission.find({
//               username: student.username,
//               subjectId: subject._id,
//             });

//             // Build task progress map
//             const taskProgress = subject.tasks.map((task) => {
//               const record = taskSubmissions.find(
//                 (r) => r.taskId === task._id.toString(),
//               );
//               const totalQ = task.questions.length || 1;
//               const completedQ = record?.completedQuestions?.length || 0;
//               const scoresMap = record?.scores
//                 ? Object.fromEntries(record.scores)
//                 : {};
//               const scoreValues = Object.values(scoresMap);
//               const avgScore =
//                 scoreValues.length > 0
//                   ? Math.round(
//                       scoreValues.reduce((a, b) => a + b, 0) /
//                         scoreValues.length,
//                     )
//                   : 0;

//               return {
//                 taskId: task._id,
//                 title: task.title,
//                 topic: task.topic,
//                 totalQuestions: totalQ,
//                 completedQuestions: completedQ,
//                 percentage: Math.min(
//                   Math.round((completedQ / totalQ) * 100),
//                   100,
//                 ),
//                 isCompleted: record?.isCompleted || false,
//                 avgScore,
//                 scores: scoresMap,
//               };
//             });

//             // Build quiz progress map
//             const quizProgress = subject.quizzes.map((quiz) => {
//               const record = quizSubmissions.find(
//                 (r) => r.quizId === quiz._id.toString(),
//               );
//               return {
//                 quizId: quiz._id,
//                 title: quiz.title,
//                 isCompleted: record?.isCompleted || false,
//                 correctAnswers: record?.correctAnswers || 0,
//                 totalQuestions: record?.totalQuestions || 0,
//                 percentage: record?.percentage || 0,
//                 scoreString: record
//                   ? `${record.correctAnswers} / ${record.totalQuestions}`
//                   : "—",
//               };
//             });

//             // Compute averages
//             const completedTasks = taskProgress.filter(
//               (t) => t.isCompleted,
//             ).length;
//             const completedQuizzes = quizProgress.filter(
//               (q) => q.isCompleted,
//             ).length;
//             const taskAvgScore =
//               taskProgress.length > 0
//                 ? Math.round(
//                     taskProgress.reduce((a, t) => a + t.avgScore, 0) /
//                       taskProgress.length,
//                   )
//                 : 0;
//             const quizAvgScore =
//               quizProgress.filter((q) => q.isCompleted).length > 0
//                 ? Math.round(
//                     quizProgress
//                       .filter((q) => q.isCompleted)
//                       .reduce((a, q) => a + q.percentage, 0) /
//                       quizProgress.filter((q) => q.isCompleted).length,
//                   )
//                 : 0;

//             return {
//               subjectId: subject._id,
//               subjectName: subject.name,
//               taskProgress,
//               quizProgress,
//               summary: {
//                 totalTasks: subject.tasks.length,
//                 completedTasks,
//                 totalQuizzes: subject.quizzes.length,
//                 completedQuizzes,
//                 taskAvgScore,
//                 quizAvgScore,
//               },
//             };
//           }),
//         );

//         return {
//           studentId: student._id,
//           username: student.username,
//           subjectProgress,
//         };
//       }),
//     );

//     res.json(progressReport);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Failed to build progress report: " + err.message });
//   }
// });

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
//     const { username, password, mobile, email } = req.body;
//     const rawPassword = password || "student123";
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(rawPassword, salt);

//     const newStudent = new User({
//       username,
//       password: hashedPassword,
//       role: "student",
//       assignedSubjects: [],
//       mobile: mobile || "",
//       email: email || "",
//     });

//     await newStudent.save();

//     // Send welcome email if email provided
//     if (email) {
//       try {
//         await transporter.sendMail({
//           from: `"LMS Portal" <${process.env.EMAIL_USER}>`,
//           to: email,
//           subject: "Your LMS Account Has Been Created",
//           html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1d; color: #e2e8f0; padding: 2rem; border-radius: 12px; border: 1px solid #1e2d45;">
//               <h2 style="color: #3b82f6;">Welcome to LMS Portal</h2>
//               <p>Your student account has been successfully created by the administrator.</p>
//               <div style="background: #111827; border: 1px solid #1e2d45; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
//                 <p style="margin: 0 0 8px 0;"><strong style="color: #94a3b8;">Username:</strong> <span style="color: #38bdf8; font-family: monospace;">${username}</span></p>
//                 <p style="margin: 0;"><strong style="color: #94a3b8;">Password:</strong> <span style="color: #38bdf8; font-family: monospace;">${rawPassword}</span></p>
//               </div>
//               <p style="color: #64748b; font-size: 0.85rem;">Please log in and keep your credentials safe. Contact your administrator if you have any issues.</p>
//               <p style="color: #64748b; font-size: 0.8rem; margin-top: 2rem;">— LMS ENGINE v2.0</p>
//             </div>
//           `,
//         });
//       } catch (mailErr) {
//         console.error("Mail send failed:", mailErr.message);
//       }
//     }

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

// // Add this after the existing DELETE content route
// app.delete("/api/subjects/:id", async (req, res) => {
//   try {
//     const deleted = await Subject.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ error: "Subject not found." });

//     // Also clean up all submissions and quiz submissions for this subject
//     await Submission.deleteMany({ subjectId: req.params.id });
//     await QuizSubmission.deleteMany({ subjectId: req.params.id });

//     // Remove this subject from all students' assignedSubjects
//     await User.updateMany(
//       { assignedSubjects: req.params.id },
//       { $pull: { assignedSubjects: req.params.id } },
//     );

//     res.json({
//       success: true,
//       message: "Subject and all related data deleted.",
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Subject deletion failed: " + err.message });
//   }
// });

// app.delete("/api/students/:id", async (req, res) => {
//   try {
//     const student = await User.findByIdAndDelete(req.params.id);
//     if (!student) return res.status(404).json({ error: "Student not found." });

//     // Clean up all their submissions and quiz submissions
//     await Submission.deleteMany({ username: student.username });
//     await QuizSubmission.deleteMany({ username: student.username });

//     res.json({
//       success: true,
//       message: "Student account and all records deleted.",
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Student deletion failed: " + err.message });
//   }
// });

// const otpStore = new Map(); // { email: { otp, expiry, username } }

// // ── Subject Access Requests ──────────────────────────────────────────────────
// const SubjectRequestSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, default: "" },
//   subjectId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Subject",
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["pending", "approved", "rejected"],
//     default: "pending",
//   },
//   requestedAt: { type: Date, default: Date.now },
// });
// const SubjectRequest = mongoose.model("SubjectRequest", SubjectRequestSchema);

// // Sign Up
// app.post("/api/auth/signup", async (req, res) => {
//   try {
//     const { username, password, email, mobile } = req.body;
//     if (!username || !password)
//       return res
//         .status(400)
//         .json({ error: "Username and password are required." });
//     // const existing = await User.findOne({ username });
//     // if (existing) return res.status(400).json({ error: "Username already taken." });
//     const existing = await User.findOne({ username });
//     if (existing)
//       return res.status(400).json({ error: "Username already taken." });
//     if (email) {
//       const emailExists = await User.findOne({ email });
//       if (emailExists)
//         return res
//           .status(400)
//           .json({ error: "An account with this email already exists." });
//     }
//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(password, salt);
//     const newUser = new User({
//       username,
//       password: hashed,
//       role: "student",
//       assignedSubjects: [],
//       email: email || "",
//       mobile: mobile || "",
//     });
//     // await newUser.save();
//     // res.status(201).json({ username: newUser.username, role: newUser.role, token: "mock-session-jwt-string-placeholder" });
//     await newUser.save();

//     if (email) {
//       try {
//         await transporter.sendMail({
//           from: `"LMS Portal" <${process.env.EMAIL_USER}>`,
//           to: email,
//           subject: "Welcome to LMS Portal!",
//           html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1d; color: #e2e8f0; padding: 2rem; border-radius: 12px; border: 1px solid #1e2d45;">
//               <h2 style="color: #3b82f6;">🎓 Welcome to LMS Portal</h2>
//               <p>Hi <strong>${username}</strong>, your student account has been created successfully!</p>
//               <div style="background: #111827; border: 1px solid #1e2d45; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
//                 <p style="margin: 0 0 8px 0;"><strong style="color: #94a3b8;">Username:</strong> <span style="color: #38bdf8; font-family: monospace;">${username}</span></p>
//               </div>
//               <p>You can now log in and browse available subjects. Request access to any subject you'd like to enroll in — an admin will review and approve your request.</p>
//               <p style="color: #64748b; font-size: 0.8rem; margin-top: 2rem;">— LMS ENGINE v2.0</p>
//             </div>
//           `,
//         });
//       } catch (mailErr) {
//         console.error("Welcome mail send failed:", mailErr.message);
//       }
//     }

//     res.status(201).json({
//       username: newUser.username,
//       role: newUser.role,
//       token: "mock-session-jwt-string-placeholder",
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Request subject access
// app.post("/api/subject-requests", async (req, res) => {
//   try {
//     const { username, subjectId } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) return res.status(404).json({ error: "User not found." });
//     // Check already assigned
//     if (user.assignedSubjects.map((id) => id.toString()).includes(subjectId))
//       return res
//         .status(400)
//         .json({ error: "Already assigned to this subject." });
//     // Check already pending
//     const existing = await SubjectRequest.findOne({
//       username,
//       subjectId,
//       status: "pending",
//     });
//     if (existing)
//       return res.status(400).json({ error: "Request already pending." });
//     const request = new SubjectRequest({
//       username,
//       email: user.email,
//       subjectId,
//     });
//     await request.save();
//     res.status(201).json(request);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Get all pending requests (admin)
// app.get("/api/subject-requests", async (req, res) => {
//   try {
//     const requests = await SubjectRequest.find({ status: "pending" }).populate(
//       "subjectId",
//       "name",
//     );
//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Approve or reject a request
// app.put("/api/subject-requests/:id", async (req, res) => {
//   try {
//     const { action } = req.body; // "approve" | "reject"
//     const request = await SubjectRequest.findById(req.params.id).populate(
//       "subjectId",
//       "name",
//     );
//     if (!request) return res.status(404).json({ error: "Request not found." });
//     request.status = action === "approve" ? "approved" : "rejected";
//     await request.save();

//     if (action === "approve") {
//       await User.findOneAndUpdate(
//         { username: request.username },
//         { $addToSet: { assignedSubjects: request.subjectId._id } },
//       );
//     }

//     // Send email if available
//     if (request.email) {
//       const subjectName = request.subjectId?.name || "the subject";
//       const approved = action === "approve";
//       try {
//         await transporter.sendMail({
//           from: `"LMS Portal" <${process.env.EMAIL_USER}>`,
//           to: request.email,
//           subject: approved
//             ? `Access Granted: ${subjectName}`
//             : `Access Update: ${subjectName}`,
//           html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1d; color: #e2e8f0; padding: 2rem; border-radius: 12px; border: 1px solid #1e2d45;">
//               <h2 style="color: ${approved ? "#22c55e" : "#f87171"};">${approved ? "✅ Access Approved" : "❌ Access Not Granted"}</h2>
//               <p>Hi <strong>${request.username}</strong>,</p>
//               ${
//                 approved
//                   ? `<p>Great news! Your request to access <strong style="color:#38bdf8;">${subjectName}</strong> has been <strong style="color:#22c55e;">approved</strong>. You can now log in and start learning.</p>`
//                   : `<p>We regret to inform you that your request to access <strong style="color:#38bdf8;">${subjectName}</strong> has not been approved at this time. Please contact your administrator for more information.</p>`
//               }
//               <p style="color: #64748b; font-size: 0.8rem; margin-top: 2rem;">— LMS ENGINE v2.0</p>
//             </div>
//           `,
//         });
//       } catch (mailErr) {
//         console.error("Mail send failed:", mailErr.message);
//       }
//     }

//     res.json(request);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Get requests for a specific student (to know pending/approved status)
// app.get("/api/subject-requests/student/:username", async (req, res) => {
//   try {
//     const requests = await SubjectRequest.find({
//       username: req.params.username,
//     });
//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/auth/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email, role: "student" });
//     if (!user)
//       return res
//         .status(404)
//         .json({ error: "No account found with this email." });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     otpStore.set(email, {
//       otp,
//       expiry: Date.now() + 10 * 60 * 1000,
//       username: user.username,
//     });

//     await transporter.sendMail({
//       from: `"LMS Portal" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Password Reset OTP",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0f1d; color: #e2e8f0; padding: 2rem; border-radius: 12px; border: 1px solid #1e2d45;">
//           <h2 style="color: #3b82f6;">Password Reset Request</h2>
//           <p>Your OTP for password reset is:</p>
//           <div style="background: #111827; border: 1px solid #3b82f6; border-radius: 8px; padding: 1rem; text-align: center; margin: 1.5rem 0;">
//             <span style="font-size: 2rem; font-family: monospace; color: #38bdf8; letter-spacing: 8px;">${otp}</span>
//           </div>
//           <p style="color: #64748b; font-size: 0.85rem;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
//         </div>
//       `,
//     });

//     res.json({ success: true, message: "OTP sent to your email." });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to send OTP: " + err.message });
//   }
// });

// app.post("/api/auth/verify-otp", async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;
//     const record = otpStore.get(email);
//     if (!record)
//       return res
//         .status(400)
//         .json({ error: "No OTP request found. Please try again." });
//     if (Date.now() > record.expiry) {
//       otpStore.delete(email);
//       return res.status(400).json({ error: "OTP expired. Request a new one." });
//     }
//     if (record.otp !== otp)
//       return res.status(400).json({ error: "Invalid OTP." });

//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(newPassword, salt);
//     await User.findOneAndUpdate({ email }, { password: hashed });
//     otpStore.delete(email);

//     res.json({ success: true, message: "Password reset successfully." });
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
import nodemailer from "nodemailer";

dotenv.config();
const app = express();

// app.use(cors());

app.use(
  cors({
    origin: "https://pratheebahub.onrender.com",
  }),
);

app.use(express.json());

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// const MONGO_URI =
//   process.env.MONGO_URI || "mongodb://127.0.0.1:27017/subjectPortal";
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("MongoDB Database Connected Successfully"))
//   .catch((err) => console.error("Database connection failure:", err));

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://Pratheeba:PratheebaMongoDBAtlas@cluster0.ixnufht.mongodb.net/subjectPortal?appName=Cluster0"; 
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Database Connected Successfully"))
  .catch((err) => console.error("Database connection failure:", err));



const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coverImage: { type: String, default: "" },
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
  mobile: { type: String, default: "" },
  email: { type: String, default: "" },
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

app.put("/api/subjects/:id", async (req, res) => {
  try {
    const { name, coverImage } = req.body;
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ error: "Subject not found." });
    if (name !== undefined) subject.name = name;
    if (coverImage !== undefined) subject.coverImage = coverImage;
    await subject.save();
    res.json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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

// Add this after the POST /api/subjects/:id/content route
app.put(
  "/api/subjects/:subjectId/content/materials/:contentId",
  async (req, res) => {
    try {
      const { subjectId, contentId } = req.params;
      const { title, htmlContent } = req.body;

      const subject = await Subject.findById(subjectId);
      if (!subject) return res.status(404).json({ error: "Subject not found" });

      const material = subject.materials.id(contentId);
      if (!material)
        return res.status(404).json({ error: "Material not found" });

      if (title !== undefined) material.title = title;
      if (htmlContent !== undefined) material.htmlContent = htmlContent;

      await subject.save();
      res.json(subject);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
);

app.put(
  "/api/subjects/:subjectId/content/quizzes/:contentId",
  async (req, res) => {
    try {
      const { subjectId, contentId } = req.params;
      const { title, questions } = req.body;

      const subject = await Subject.findById(subjectId);
      if (!subject) return res.status(404).json({ error: "Subject not found" });

      const quiz = subject.quizzes.id(contentId);
      if (!quiz) return res.status(404).json({ error: "Quiz not found" });

      if (title !== undefined) quiz.title = title;
      if (questions !== undefined) quiz.questions = questions;

      await subject.save();
      res.json(subject);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
);

app.put("/api/subjects/:subjectId/tasks/:taskId", async (req, res) => {
  try {
    const { subjectId, taskId } = req.params;
    const { title, topic, questions } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    const task = subject.tasks.id(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (title !== undefined) task.title = title;
    if (topic !== undefined) task.topic = topic;
    if (questions !== undefined) task.questions = questions;

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
    const { username, password, mobile, email } = req.body;
    const rawPassword = password || "student123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    const newStudent = new User({
      username,
      password: hashedPassword,
      role: "student",
      assignedSubjects: [],
      mobile: mobile || "",
      email: email || "",
    });

    await newStudent.save();

    // Send welcome email if email provided
    if (email) {
      try {
        await transporter.sendMail({
          from: `"LMS Portal" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Your LMS Account Has Been Created",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1d; color: #e2e8f0; padding: 2rem; border-radius: 12px; border: 1px solid #1e2d45;">
              <h2 style="color: #3b82f6;">Welcome to LMS Portal</h2>
              <p>Your student account has been successfully created by the administrator.</p>
              <div style="background: #111827; border: 1px solid #1e2d45; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
                <p style="margin: 0 0 8px 0;"><strong style="color: #94a3b8;">Username:</strong> <span style="color: #38bdf8; font-family: monospace;">${username}</span></p>
                <p style="margin: 0;"><strong style="color: #94a3b8;">Password:</strong> <span style="color: #38bdf8; font-family: monospace;">${rawPassword}</span></p>
              </div>
              <p style="color: #64748b; font-size: 0.85rem;">Please log in and keep your credentials safe. Contact your administrator if you have any issues.</p>
              <p style="color: #64748b; font-size: 0.8rem; margin-top: 2rem;">— LMS ENGINE v2.0</p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error("Mail send failed:", mailErr.message);
      }
    }

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
    if (!deleted) return res.status(404).json({ error: "Subject not found." });

    // Also clean up all submissions and quiz submissions for this subject
    await Submission.deleteMany({ subjectId: req.params.id });
    await QuizSubmission.deleteMany({ subjectId: req.params.id });

    // Remove this subject from all students' assignedSubjects
    await User.updateMany(
      { assignedSubjects: req.params.id },
      { $pull: { assignedSubjects: req.params.id } },
    );

    res.json({
      success: true,
      message: "Subject and all related data deleted.",
    });
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

const otpStore = new Map(); // { email: { otp, expiry, username } }

// ── Subject Access Requests ──────────────────────────────────────────────────
const SubjectRequestSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, default: "" },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  requestedAt: { type: Date, default: Date.now },
});
const SubjectRequest = mongoose.model("SubjectRequest", SubjectRequestSchema);

// Sign Up
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, password, email, mobile } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    // const existing = await User.findOne({ username });
    // if (existing) return res.status(400).json({ error: "Username already taken." });
    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ error: "Username already taken." });
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists)
        return res
          .status(400)
          .json({ error: "An account with this email already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      password: hashed,
      role: "student",
      assignedSubjects: [],
      email: email || "",
      mobile: mobile || "",
    });
    // await newUser.save();
    // res.status(201).json({ username: newUser.username, role: newUser.role, token: "mock-session-jwt-string-placeholder" });
    await newUser.save();

    if (email) {
      try {
        await transporter.sendMail({
          from: `"LMS Portal" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Welcome to LMS Portal!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1d; color: #e2e8f0; padding: 2rem; border-radius: 12px; border: 1px solid #1e2d45;">
              <h2 style="color: #3b82f6;">🎓 Welcome to LMS Portal</h2>
              <p>Hi <strong>${username}</strong>, your student account has been created successfully!</p>
              <div style="background: #111827; border: 1px solid #1e2d45; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
                <p style="margin: 0 0 8px 0;"><strong style="color: #94a3b8;">Username:</strong> <span style="color: #38bdf8; font-family: monospace;">${username}</span></p>
              </div>
              <p>You can now log in and browse available subjects. Request access to any subject you'd like to enroll in — an admin will review and approve your request.</p>
              <p style="color: #64748b; font-size: 0.8rem; margin-top: 2rem;">— LMS ENGINE v2.0</p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error("Welcome mail send failed:", mailErr.message);
      }
    }

    res.status(201).json({
      username: newUser.username,
      role: newUser.role,
      token: "mock-session-jwt-string-placeholder",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Request subject access
app.post("/api/subject-requests", async (req, res) => {
  try {
    const { username, subjectId } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found." });
    // Check already assigned
    if (user.assignedSubjects.map((id) => id.toString()).includes(subjectId))
      return res
        .status(400)
        .json({ error: "Already assigned to this subject." });
    // Check already pending
    const existing = await SubjectRequest.findOne({
      username,
      subjectId,
      status: "pending",
    });
    if (existing)
      return res.status(400).json({ error: "Request already pending." });
    const request = new SubjectRequest({
      username,
      email: user.email,
      subjectId,
    });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all pending requests (admin)
app.get("/api/subject-requests", async (req, res) => {
  try {
    const requests = await SubjectRequest.find({ status: "pending" }).populate(
      "subjectId",
      "name",
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve or reject a request
app.put("/api/subject-requests/:id", async (req, res) => {
  try {
    const { action } = req.body; // "approve" | "reject"
    const request = await SubjectRequest.findById(req.params.id).populate(
      "subjectId",
      "name",
    );
    if (!request) return res.status(404).json({ error: "Request not found." });
    request.status = action === "approve" ? "approved" : "rejected";
    await request.save();

    if (action === "approve") {
      await User.findOneAndUpdate(
        { username: request.username },
        { $addToSet: { assignedSubjects: request.subjectId._id } },
      );
    }

    // Send email if available
    if (request.email) {
      const subjectName = request.subjectId?.name || "the subject";
      const approved = action === "approve";
      try {
        await transporter.sendMail({
          from: `"LMS Portal" <${process.env.EMAIL_USER}>`,
          to: request.email,
          subject: approved
            ? `Access Granted: ${subjectName}`
            : `Access Update: ${subjectName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1d; color: #e2e8f0; padding: 2rem; border-radius: 12px; border: 1px solid #1e2d45;">
              <h2 style="color: ${approved ? "#22c55e" : "#f87171"};">${approved ? "✅ Access Approved" : "❌ Access Not Granted"}</h2>
              <p>Hi <strong>${request.username}</strong>,</p>
              ${
                approved
                  ? `<p>Great news! Your request to access <strong style="color:#38bdf8;">${subjectName}</strong> has been <strong style="color:#22c55e;">approved</strong>. You can now log in and start learning.</p>`
                  : `<p>We regret to inform you that your request to access <strong style="color:#38bdf8;">${subjectName}</strong> has not been approved at this time. Please contact your administrator for more information.</p>`
              }
              <p style="color: #64748b; font-size: 0.8rem; margin-top: 2rem;">— LMS ENGINE v2.0</p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error("Mail send failed:", mailErr.message);
      }
    }

    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get requests for a specific student (to know pending/approved status)
app.get("/api/subject-requests/student/:username", async (req, res) => {
  try {
    const requests = await SubjectRequest.find({
      username: req.params.username,
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, role: "student" });
    if (!user)
      return res
        .status(404)
        .json({ error: "No account found with this email." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, {
      otp,
      expiry: Date.now() + 10 * 60 * 1000,
      username: user.username,
    });

    await transporter.sendMail({
      from: `"LMS Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0f1d; color: #e2e8f0; padding: 2rem; border-radius: 12px; border: 1px solid #1e2d45;">
          <h2 style="color: #3b82f6;">Password Reset Request</h2>
          <p>Your OTP for password reset is:</p>
          <div style="background: #111827; border: 1px solid #3b82f6; border-radius: 8px; padding: 1rem; text-align: center; margin: 1.5rem 0;">
            <span style="font-size: 2rem; font-family: monospace; color: #38bdf8; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 0.85rem;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    res.status(500).json({ error: "Failed to send OTP: " + err.message });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = otpStore.get(email);
    if (!record)
      return res
        .status(400)
        .json({ error: "No OTP request found. Please try again." });
    if (Date.now() > record.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP expired. Request a new one." });
    }
    if (record.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP." });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    await User.findOneAndUpdate({ email }, { password: hashed });
    otpStore.delete(email);

    res.json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server executing operations on port ${PORT}`),
);
