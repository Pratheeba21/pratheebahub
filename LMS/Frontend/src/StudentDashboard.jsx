// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function StudentDashboard({ currentUser }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [assignedSubjects, setAssignedSubjects] = useState([]);
//   const [activeSubjectId, setActiveSubjectId] = useState(null);
//   const [activeTab, setActiveTab] = useState(null); // 'materials' | 'tasks' | 'quizzes'
//   const [activeHtmlContent, setActiveHtmlContent] = useState(null);

//   useEffect(() => {
//     fetchStudentCourses();
//   }, []);

//   const fetchStudentCourses = async () => {
//     try {
//       // Pull only the items assigned to this profile context identity
//       const resProfile = await axios.get(
//         `http://localhost:5000/api/user-context/${currentUser.username}`,
//       );
//       setAssignedSubjects(resProfile.data.assignedSubjects || []);
//     } catch (err) {
//       console.error("Error reading localized secure data layer payload:", err);
//     }
//   };

//   const selectedSubject = assignedSubjects.find(
//     (s) => s._id === activeSubjectId,
//   );

//   return (
//     <div className="dashboard-container">
//       {!sidebarOpen && (
//         <button
//           className="sidebar-toggle-floating"
//           onClick={() => setSidebarOpen(true)}>
//           ☰
//         </button>
//       )}

//       <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
//         <div className="sidebar-header">
//           <span className="sidebar-brand">STUDENT DESK</span>
//           <button
//             style={{
//               background: "none",
//               border: "none",
//               color: "var(--muted)",
//               cursor: "pointer",
//             }}
//             onClick={() => setSidebarOpen(false)}>
//             ✕
//           </button>
//         </div>

//         <div className="sidebar-menu-section">
//           <div className="sidebar-heading">My Registered Subjects</div>
//           {assignedSubjects.length === 0 ? (
//             <div
//               style={{
//                 padding: "1rem 1.5rem",
//                 fontSize: "0.85rem",
//                 color: "var(--muted)",
//               }}>
//               No courses currently mapped to your account. Contact Admin.
//             </div>
//           ) : (
//             assignedSubjects.map((sub) => (
//               <div
//                 key={sub._id}
//                 className={`sidebar-item ${activeSubjectId === sub._id ? "active" : ""}`}
//                 onClick={() => {
//                   setActiveSubjectId(sub._id);
//                   setActiveTab(null);
//                   setActiveHtmlContent(null);
//                 }}>
//                 📚 {sub.name}
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       <div className="main-viewport">
//         {selectedSubject ? (
//           <div>
//             <div className="hero">
//               <div className="hero-badge">Student Learning Portal</div>
//               <h1>{selectedSubject.name}</h1>
//               <p>
//                 Select a category layout block node below to access your dynamic
//                 resources
//               </p>
//             </div>

//             {!activeTab && (
//               <div className="content-grid-cards">
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--green)" }}
//                   onClick={() => setActiveTab("materials")}>
//                   <div className="interactive-card-icon">📘</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--green)" }}>
//                     Materials
//                   </div>
//                   <div className="interactive-card-desc">
//                     Review your study guides, code notes, and references.
//                   </div>
//                 </div>
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--amber)" }}
//                   onClick={() => setActiveTab("tasks")}>
//                   <div className="interactive-card-icon">📝</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--amber)" }}>
//                     Tasks
//                   </div>
//                   <div className="interactive-card-desc">
//                     Examine lab parameters and project assignment
//                     configurations.
//                   </div>
//                 </div>
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--pink)" }}
//                   onClick={() => setActiveTab("quizzes")}>
//                   <div className="interactive-card-icon">🎯</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--pink)" }}>
//                     Quizzes
//                   </div>
//                   <div className="interactive-card-desc">
//                     Complete your understanding validations and reviews.
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab && !activeHtmlContent && (
//               <div>
//                 <button
//                   className="action-btn close-view-btn"
//                   onClick={() => setActiveTab(null)}>
//                   ← Back to Categories
//                 </button>
//                 <h2
//                   style={{
//                     textTransform: "capitalize",
//                     marginBottom: "1.5rem",
//                     fontFamily: "JetBrains Mono",
//                   }}>
//                   Available {activeTab}
//                 </h2>

//                 {selectedSubject[activeTab]?.length === 0 ? (
//                   <p style={{ color: "var(--muted)" }}>
//                     No items have been assigned to this column yet.
//                   </p>
//                 ) : (
//                   selectedSubject[activeTab].map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="item-row-link"
//                       onClick={() => setActiveHtmlContent(item.htmlContent)}>
//                       <span>⚡ {item.title}</span>
//                       <span
//                         style={{ color: "var(--green)", fontSize: "0.85rem" }}>
//                         Launch Document Module →
//                       </span>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}

//             {activeHtmlContent && (
//               <div>
//                 <button
//                   className="action-btn close-view-btn"
//                   onClick={() => setActiveHtmlContent(null)}>
//                   ← Close Viewport Document
//                 </button>
//                 <div
//                   className="rendered-html-wrapper"
//                   dangerouslySetInnerHTML={{ __html: activeHtmlContent }}
//                 />
//               </div>
//             )}
//           </div>
//         ) : (
//           <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
//             <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
//             <h2>Welcome to Your LMS Workspace Hub</h2>
//             <p
//               style={{
//                 color: "var(--muted)",
//                 marginTop: "0.5rem",
//                 maxWidth: "460px",
//                 margin: "0.5rem auto 0",
//               }}>
//               Please select an assigned subject from the side navigation
//               workspace tree to open your lessons, challenges, and materials.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//ab was too gd

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function StudentDashboard({ currentUser }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [assignedSubjects, setAssignedSubjects] = useState([]);
//   const [activeSubjectId, setActiveSubjectId] = useState(null);
//   const [activeTab, setActiveTab] = useState(null);
//   const [activeHtmlContent, setActiveHtmlContent] = useState(null);

//   // Program Playground Execution Runtime Core State
//   const [activeTask, setActiveTask] = useState(null);
//   const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
//   const [selectedRuntimeLanguage, setSelectedRuntimeLanguage] =
//     useState("python");
//   const [studentCodeInput, setStudentCodeInput] = useState("");
//   const [consoleOutputLog, setConsoleOutputLog] = useState("");
//   const [isOutputValid, setIsOutputValid] = useState(null);

//   useEffect(() => {
//     fetchStudentCourses();
//   }, []);

//   const fetchStudentCourses = async () => {
//     try {
//       const resProfile = await axios.get(
//         `http://localhost:5000/api/user-context/${currentUser.username}`,
//       );
//       setAssignedSubjects(resProfile.data.assignedSubjects || []);
//     } catch (err) {
//       console.error("Error reading student profiles:", err);
//     }
//   };

//   const selectedSubject = assignedSubjects.find(
//     (s) => s._id === activeSubjectId,
//   );

//   // Instantiates Code Input states when changing questions or flipping sandbox runtime modes
//   const loadQuestionRuntimeState = (task, qIdx, lang) => {
//     const question = task.questions[qIdx];
//     if (!question) return;

//     setSelectedQuestionIndex(qIdx);
//     setSelectedRuntimeLanguage(lang);
//     setConsoleOutputLog("");
//     setIsOutputValid(null);

//     if (lang === "python") {
//       setStudentCodeInput(
//         question.initialPythonCode || "# Enter Python code\n",
//       );
//     } else {
//       setStudentCodeInput(
//         question.initialJavaCode || "public class Main {\n\n}",
//       );
//     }
//   };

//   // Safe client-side code engine simulation routine
//   const executeSandboxRuntimeEngine = () => {
//     setConsoleOutputLog("Initializing virtual execution pipeline layer...\n");

//     setTimeout(() => {
//       const currentQuestion = activeTask.questions[selectedQuestionIndex];
//       let consoleCapture = "";

//       if (selectedRuntimeLanguage === "python") {
//         // Advanced Client-Side Static String Execution Parser simulation
//         if (studentCodeInput.includes("print(")) {
//           const regexExtract = /print\s*\(\s*['"]([^'"]*)['"]\s*\)/g;
//           let matchGroup;
//           const linesCaptured = [];
//           while ((matchGroup = regexExtract.exec(studentCodeInput)) !== null) {
//             linesCaptured.push(matchGroup[1]);
//           }
//           consoleCapture =
//             linesCaptured.join("\n") ||
//             "Process executed with no stdout values.";
//         } else {
//           consoleCapture =
//             "Process completed. Error: No output returned to standard stdout stream pipelines.";
//         }
//       } else if (selectedRuntimeLanguage === "java") {
//         if (studentCodeInput.includes("System.out.println(")) {
//           const regexJavaExtract =
//             /System\.out\.println\s*\(\s*['"]([^'"]*)['"]\s*\)/g;
//           let matchGroup;
//           const linesCaptured = [];
//           while (
//             (matchGroup = regexJavaExtract.exec(studentCodeInput)) !== null
//           ) {
//             linesCaptured.push(matchGroup[1]);
//           }
//           consoleCapture =
//             linesCaptured.join("\n") || "Java Process standard output empty.";
//         } else {
//           consoleCapture =
//             "Compilation Error: Missing valid printing pipeline statements inside main framework.";
//         }
//       }

//       setConsoleOutputLog(consoleCapture);

//       // Cross check system expected assertions target matching metrics
//       const cleanedTarget = currentQuestion.expectedOutput.trim();
//       const cleanedCapture = consoleCapture.trim();

//       if (cleanedTarget && cleanedCapture === cleanedTarget) {
//         setIsOutputValid(true);
//       } else {
//         setIsOutputValid(false);
//       }
//     }, 900);
//   };

//   return (
//     <div className="dashboard-container">
//       {!sidebarOpen && (
//         <button
//           className="sidebar-toggle-floating"
//           onClick={() => setSidebarOpen(true)}>
//           ☰
//         </button>
//       )}

//       <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
//         <div className="sidebar-header">
//           <span className="sidebar-brand">STUDENT DESK</span>
//           <button
//             style={{
//               background: "none",
//               border: "none",
//               color: "var(--muted)",
//               cursor: "pointer",
//             }}
//             onClick={() => setSidebarOpen(false)}>
//             ✕
//           </button>
//         </div>
//         <div className="sidebar-menu-section">
//           <div className="sidebar-heading">My Registered Subjects</div>
//           {assignedSubjects.map((sub) => (
//             <div
//               key={sub._id}
//               className={`sidebar-item ${activeSubjectId === sub._id ? "active" : ""}`}
//               onClick={() => {
//                 setActiveSubjectId(sub._id);
//                 setActiveTab(null);
//                 setActiveHtmlContent(null);
//                 setActiveTask(null);
//               }}>
//               📚 {sub.name}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="main-viewport">
//         {selectedSubject ? (
//           <div>
//             <div className="hero">
//               <div className="hero-badge">Student Core Engine</div>
//               <h1>{selectedSubject.name}</h1>
//             </div>

//             {/* Hub Category Cards Grid Map Rendering */}
//             {!activeTab && !activeTask && (
//               <div className="content-grid-cards">
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--green)" }}
//                   onClick={() => setActiveTab("materials")}>
//                   <div className="interactive-card-icon">📘</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--green)" }}>
//                     Materials
//                   </div>
//                   <div className="interactive-card-desc">
//                     Review your text books, structural outlines, and style
//                     guides.
//                   </div>
//                 </div>
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--amber)" }}
//                   onClick={() => setActiveTab("tasks")}>
//                   <div className="interactive-card-icon">📝</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--amber)" }}>
//                     Tasks Runtime
//                   </div>
//                   <div className="interactive-card-desc">
//                     Open the programming editor workspace to submit executable
//                     code assignments.
//                   </div>
//                 </div>
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--pink)" }}
//                   onClick={() => setActiveTab("quizzes")}>
//                   <div className="interactive-card-icon">🎯</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--pink)" }}>
//                     Quizzes
//                   </div>
//                   <div className="interactive-card-desc">
//                     Complete knowledge checkpoints.
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Item Listing Index Layer Map */}
//             {activeTab && !activeHtmlContent && !activeTask && (
//               <div>
//                 <button
//                   className="action-btn close-view-btn"
//                   onClick={() => setActiveTab(null)}>
//                   ← Back to Hub
//                 </button>
//                 <h2
//                   style={{
//                     textTransform: "capitalize",
//                     marginBottom: "1.5rem",
//                     fontFamily: "JetBrains Mono",
//                   }}>
//                   Your Assigned {activeTab}
//                 </h2>

//                 {selectedSubject[activeTab]?.length === 0 ? (
//                   <p style={{ color: "var(--muted)" }}>
//                     No entries have been posted to this cluster index.
//                   </p>
//                 ) : (
//                   selectedSubject[activeTab].map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="item-row-link"
//                       onClick={() => {
//                         if (activeTab === "tasks") {
//                           setActiveTask(item);
//                           loadQuestionRuntimeState(
//                             item,
//                             0,
//                             item.questions[0]?.allowedLanguages[0] || "python",
//                           );
//                         } else {
//                           setActiveHtmlContent(item.htmlContent);
//                         }
//                       }}>
//                       <span>
//                         ⚡ {item.title}{" "}
//                         {item.topic && (
//                           <span
//                             style={{
//                               color: "var(--muted)",
//                               fontSize: "0.8rem",
//                             }}>
//                             — Topic: {item.topic}
//                           </span>
//                         )}
//                       </span>
//                       <span
//                         style={{ color: "var(--blue)", fontSize: "0.85rem" }}>
//                         Launch Workspace →
//                       </span>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}

//             {/* Traditional HTML Viewer for Materials/Quizzes */}
//             {activeHtmlContent && (
//               <div>
//                 <button
//                   className="action-btn close-view-btn"
//                   onClick={() => setActiveHtmlContent(null)}>
//                   ← Close Viewport Document
//                 </button>
//                 <div
//                   className="rendered-html-wrapper"
//                   dangerouslySetInnerHTML={{ __html: activeHtmlContent }}
//                 />
//               </div>
//             )}

//             {/* DYNAMIC INTERACTIVE MULTI-QUESTION COMPILER ENVIRONMENT DESK CONTAINER */}
//             {activeTask && (
//               <div>
//                 <button
//                   className="action-btn close-view-btn"
//                   onClick={() => {
//                     setActiveTask(null);
//                     setActiveTab("tasks");
//                   }}>
//                   ← Exit Code Workspace
//                 </button>

//                 <div
//                   style={{
//                     background: "var(--surface)",
//                     border: "1px solid var(--border)",
//                     padding: "1.5rem",
//                     borderRadius: "12px",
//                     marginBottom: "1.5rem",
//                   }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}>
//                     <div>
//                       <span
//                         className="hero-badge"
//                         style={{
//                           color: "var(--amber)",
//                           borderColor: "var(--amber)",
//                         }}>
//                         Task Playground Active
//                       </span>
//                       <h2 style={{ marginTop: "0.5rem" }}>
//                         {activeTask.title}
//                       </h2>
//                       <span
//                         style={{
//                           fontSize: "0.85rem",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--muted)",
//                         }}>
//                         Topic Area: {activeTask.topic}
//                       </span>
//                     </div>

//                     {/* Horizontal Question Pagination Bar Selector Grid */}
//                     <div style={{ display: "flex", gap: "8px" }}>
//                       {activeTask.questions.map((_, index) => (
//                         <button
//                           key={index}
//                           className="action-btn"
//                           style={{
//                             padding: "6px 12px",
//                             background:
//                               selectedQuestionIndex === index
//                                 ? "var(--amber)"
//                                 : "var(--bg)",
//                             color:
//                               selectedQuestionIndex === index
//                                 ? "var(--bg)"
//                                 : "var(--text)",
//                             borderColor: "var(--border)",
//                           }}
//                           onClick={() =>
//                             loadQuestionRuntimeState(
//                               activeTask,
//                               index,
//                               activeTask.questions[index].allowedLanguages[0] ||
//                                 "python",
//                             )
//                           }>
//                           Q{index + 1}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Split Compiler Workbench Frame Structure */}
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1.2fr",
//                     gap: "1.5rem",
//                     alignItems: "start",
//                   }}>
//                   {/* Left Column: Challenge Prompt Specification Block */}
//                   <div
//                     className="form-panel"
//                     style={{ margin: 0, minHeight: "450px" }}>
//                     <div
//                       className="form-title"
//                       style={{ color: "var(--blue)" }}>
//                       📋 Challenge Specification Node #
//                       {selectedQuestionIndex + 1}
//                     </div>
//                     <p
//                       style={{
//                         fontSize: "0.95rem",
//                         lineHeight: "1.6",
//                         color: "#c4cfe0",
//                         whiteSpace: "pre-wrap",
//                       }}>
//                       {
//                         activeTask.questions[selectedQuestionIndex]
//                           ?.questionText
//                       }
//                     </p>

//                     <div
//                       style={{
//                         marginTop: "2rem",
//                         paddingTop: "1.5rem",
//                         borderTop: "1px solid var(--border)",
//                       }}>
//                       <span
//                         style={{
//                           fontSize: "0.75rem",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--muted)",
//                           display: "block",
//                           marginBottom: "0.5rem",
//                         }}>
//                         EXPECTED VERIFICATION OUTPUT VERDICT ASSERTION:
//                       </span>
//                       <div
//                         style={{
//                           background: "#090d16",
//                           border: "1px solid var(--border)",
//                           padding: "0.75rem",
//                           borderRadius: "6px",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--green)",
//                           fontSize: "0.85rem",
//                         }}>
//                         {
//                           activeTask.questions[selectedQuestionIndex]
//                             ?.expectedOutput
//                         }
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Column: Dynamic Code Input Sandbox Area Terminal Wrapper */}
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: "1rem",
//                     }}>
//                     <div
//                       className="form-panel"
//                       style={{ margin: 0, paddingBottom: "1rem" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           marginBottom: "1rem",
//                         }}>
//                         <span className="form-title" style={{ margin: 0 }}>
//                           💻 Source Compiler Frame
//                         </span>

//                         {/* Interactive Language Selector Buttons Grid */}
//                         <div
//                           style={{
//                             display: "flex",
//                             gap: "5px",
//                             background: "var(--bg)",
//                             padding: "4px",
//                             borderRadius: "6px",
//                           }}>
//                           {activeTask.questions[
//                             selectedQuestionIndex
//                           ]?.allowedLanguages.map((lang) => (
//                             <button
//                               key={lang}
//                               style={{
//                                 background:
//                                   selectedRuntimeLanguage === lang
//                                     ? "var(--surface2)"
//                                     : "transparent",
//                                 color:
//                                   selectedRuntimeLanguage === lang
//                                     ? "var(--blue)"
//                                     : "var(--muted)",
//                                 border: "none",
//                                 padding: "4px 10px",
//                                 borderRadius: "4px",
//                                 cursor: "pointer",
//                                 fontFamily: "JetBrains Mono",
//                                 fontSize: "0.75rem",
//                                 textTransform: "uppercase",
//                               }}
//                               onClick={() =>
//                                 loadQuestionRuntimeState(
//                                   activeTask,
//                                   selectedQuestionIndex,
//                                   lang,
//                                 )
//                               }>
//                               {lang}
//                             </button>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Monospaced Editor Textarea Input Rig Box */}
//                       <div
//                         style={{
//                           position: "relative",
//                           background: "#040810",
//                           borderRadius: "8px",
//                           border: "1px solid #1a2535",
//                         }}>
//                         <textarea
//                           style={{
//                             width: "100%",
//                             minHeight: "260px",
//                             background: "transparent",
//                             border: "none",
//                             outline: "none",
//                             color: "#e2e8f0",
//                             padding: "1rem",
//                             fontFamily: "JetBrains Mono, monospace",
//                             fontSize: "0.85rem",
//                             lineHeight: "1.6",
//                             resize: "vertical",
//                           }}
//                           value={studentCodeInput}
//                           onChange={(e) => setStudentCodeInput(e.target.value)}
//                         />
//                       </div>

//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "flex-end",
//                           marginTop: "1rem",
//                         }}>
//                         <button
//                           className="action-btn"
//                           style={{
//                             borderColor: "var(--green)",
//                             color: "var(--green)",
//                           }}
//                           onClick={executeSandboxRuntimeEngine}>
//                           ⚡ Run Code Script Assertions
//                         </button>
//                       </div>
//                     </div>

//                     {/* Output Virtual Execution Feedback Stream Console Log Terminal */}
//                     <div
//                       className="form-panel"
//                       style={{ margin: 0, background: "#05070b" }}>
//                       <div
//                         className="output-label"
//                         style={{ color: "var(--muted)" }}>
//                         System Output Pipeline Stream
//                       </div>
//                       <div
//                         style={{
//                           minHeight: "100px",
//                           fontFamily: "JetBrains Mono",
//                           fontSize: "0.82rem",
//                           whiteSpace: "pre-wrap",
//                           color: "#6ee7b7",
//                           lineHeight: "1.5",
//                           marginTop: "0.5rem",
//                         }}>
//                         {consoleOutputLog ||
//                           "Terminal awaiting execution stack loop trigger signals..."}
//                       </div>

//                       {isOutputValid !== null && (
//                         <div
//                           style={{
//                             marginTop: "1rem",
//                             padding: "0.5rem 1rem",
//                             borderRadius: "6px",
//                             border:
//                               "1px solid " +
//                               (isOutputValid ? "var(--green)" : "var(--red)"),
//                             background: isOutputValid ? "#052e16" : "#4c0519",
//                             color: isOutputValid
//                               ? "var(--green)"
//                               : "var(--red)",
//                             fontSize: "0.8rem",
//                             fontFamily: "JetBrains Mono",
//                           }}>
//                           {isOutputValid
//                             ? "✔ VERDICT MATCH: All validation tests matching execution targets perfectly."
//                             : "✕ VERDICT FAULT: Output metrics did not match assertion conditions pattern rules."}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
//             <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
//             <h2>Welcome to Your LMS Workspace Hub</h2>
//             <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
//               Please select an assigned subject from the side navigation tree
//               structure.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//ab was too too good

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function StudentDashboard({ currentUser }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [assignedSubjects, setAssignedSubjects] = useState([]);
//   const [activeSubjectId, setActiveSubjectId] = useState(null);
//   const [activeTab, setActiveTab] = useState(null);
//   const [activeHtmlContent, setActiveHtmlContent] = useState(null);

//   // Program Playground Execution Runtime Core State
//   const [activeTask, setActiveTask] = useState(null);
//   const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
//   const [selectedRuntimeLanguage, setSelectedRuntimeLanguage] =
//     useState("python");
//   const [studentCodeInput, setStudentCodeInput] = useState("");
//   const [consoleOutputLog, setConsoleOutputLog] = useState("");
//   const [isOutputValid, setIsOutputValid] = useState(null);

//   // Added Submission & Grading Tracking State Management Controls
//   const [submissionRecords, setSubmissionRecords] = useState([]);

//   useEffect(() => {
//     fetchStudentCourses();
//   }, []);

//   useEffect(() => {
//     if (activeSubjectId) {
//       fetchSubmissionRecords();
//     }
//   }, [activeSubjectId]);

//   // Hook to watch and save current active code writing buffers persistently to disk cache layer
//   useEffect(() => {
//     if (activeTask) {
//       const cacheStorageKey = `lms_code_cache_${currentUser.username}_${activeTask._id}_${selectedQuestionIndex}_${selectedRuntimeLanguage}`;
//       localStorage.setItem(cacheStorageKey, studentCodeInput);
//     }
//   }, [
//     studentCodeInput,
//     activeTask,
//     selectedQuestionIndex,
//     selectedRuntimeLanguage,
//   ]);

//   const fetchStudentCourses = async () => {
//     try {
//       const resProfile = await axios.get(
//         `http://localhost:5000/api/user-context/${currentUser.username}`,
//       );
//       setAssignedSubjects(resProfile.data.assignedSubjects || []);
//     } catch (err) {
//       console.error("Error reading student profiles:", err);
//     }
//   };

//   const fetchSubmissionRecords = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/submissions/${currentUser.username}/${activeSubjectId}`,
//       );
//       setSubmissionRecords(res.data);
//     } catch (err) {
//       console.error(
//         "Failed synchronization with database grading arrays:",
//         err,
//       );
//     }
//   };

//   const selectedSubject = assignedSubjects.find(
//     (s) => s._id === activeSubjectId,
//   );

//   // Helper routine to query and return progress metrics matching a unique specific assignment loop node
//   const getTaskProgressMetrics = (taskId) => {
//     const match = submissionRecords.find((r) => r.taskId === taskId);
//     if (!match) return { percentage: 0, isCompleted: false, scores: {} };

//     const totalQuestionsCount = activeSubjectId
//       ? selectedSubject?.tasks?.find((t) => t._id === taskId)?.questions
//           ?.length || 1
//       : 1;

//     const completedCount = match.completedQuestions?.length || 0;
//     const computedPercent = Math.round(
//       (completedCount / totalQuestionsCount) * 100,
//     );

//     return {
//       percentage: Math.min(computedPercent, 100),
//       isCompleted: match.isCompleted,
//       scores: match.scores || {},
//     };
//   };

//   // Instantiates Code Input states when changing questions or flipping sandbox runtime modes
//   const loadQuestionRuntimeState = (task, qIdx, lang) => {
//     const question = task.questions[qIdx];
//     if (!question) return;

//     setSelectedQuestionIndex(qIdx);
//     setSelectedRuntimeLanguage(lang);
//     setConsoleOutputLog("");
//     setIsOutputValid(null);

//     // Dynamic verification parsing check: Inspect if local storage cache layers contain saved progress text
//     const cacheStorageKey = `lms_code_cache_${currentUser.username}_${task._id}_${qIdx}_${lang}`;
//     const persistedCode = localStorage.getItem(cacheStorageKey);

//     if (persistedCode !== null) {
//       setStudentCodeInput(persistedCode);
//     } else {
//       if (lang === "python") {
//         setStudentCodeInput(
//           question.initialPythonCode || "# Enter Python code\n",
//         );
//       } else {
//         setStudentCodeInput(
//           question.initialJavaCode || "public class Main {\n\n}",
//         );
//       }
//     }
//   };

//   // Safe client-side code engine simulation routine
//   const executeSandboxRuntimeEngine = () => {
//     setConsoleOutputLog("Initializing virtual execution pipeline layer...\n");

//     setTimeout(() => {
//       const currentQuestion = activeTask.questions[selectedQuestionIndex];
//       let consoleCapture = "";

//       if (selectedRuntimeLanguage === "python") {
//         if (studentCodeInput.includes("print(")) {
//           const regexExtract = /print\s*\(\s*['"]([^'"]*)['"]\s*\)/g;
//           let matchGroup;
//           const linesCaptured = [];
//           while ((matchGroup = regexExtract.exec(studentCodeInput)) !== null) {
//             linesCaptured.push(matchGroup[1]);
//           }
//           consoleCapture =
//             linesCaptured.join("\n") ||
//             "Process executed with no stdout values.";
//         } else {
//           consoleCapture =
//             "Process completed. Error: No output returned to standard stdout stream pipelines.";
//         }
//       } else if (selectedRuntimeLanguage === "java") {
//         if (studentCodeInput.includes("System.out.println(")) {
//           const regexJavaExtract =
//             /System\.out\.println\s*\(\s*['"]([^'"]*)['"]\s*\)/g;
//           let matchGroup;
//           const linesCaptured = [];
//           while (
//             (matchGroup = regexJavaExtract.exec(studentCodeInput)) !== null
//           ) {
//             linesCaptured.push(matchGroup[1]);
//           }
//           consoleCapture =
//             linesCaptured.join("\n") || "Java Process standard output empty.";
//         } else {
//           consoleCapture =
//             "Compilation Error: Missing valid printing pipeline statements inside main framework.";
//         }
//       }

//       setConsoleOutputLog(consoleCapture);

//       const cleanedTarget = currentQuestion.expectedOutput.trim();
//       const cleanedCapture = consoleCapture.trim();

//       if (cleanedTarget && cleanedCapture === cleanedTarget) {
//         setIsOutputValid(true);
//       } else {
//         setIsOutputValid(false);
//       }
//     }, 900);
//   };

//   // Dispatch submission data payload log directly onto MongoDB store
//   const handleFinalTaskSubmit = async () => {
//     if (!isOutputValid) return;
//     try {
//       await axios.post(
//         "http://localhost:5000/api/submissions/submit-question",
//         {
//           username: currentUser.username,
//           subjectId: activeSubjectId,
//           taskId: activeTask._id,
//           questionIndex: selectedQuestionIndex,
//           score: 100, // Granting maximum marks on passing standard assertion matches
//           totalQuestions: activeTask.questions.length,
//         },
//       );

//       alert("Question solution logged and locked securely!");
//       fetchSubmissionRecords(); // Refresh current display states logic metrics
//     } catch (err) {
//       console.error("Submission routine error stack capture:", err);
//       alert("Operational submission synchronization routine error.");
//     }
//   };

//   const currentActiveQuestionProgress = activeTask
//     ? getTaskProgressMetrics(activeTask._id)
//     : null;
//   const isCurrentQuestionSubmitted =
//     currentActiveQuestionProgress?.scores?.[
//       selectedQuestionIndex.toString()
//     ] !== undefined;

//   return (
//     <div className="dashboard-container">
//       {!sidebarOpen && (
//         <button
//           className="sidebar-toggle-floating"
//           onClick={() => setSidebarOpen(true)}>
//           ☰
//         </button>
//       )}

//       <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
//         <div className="sidebar-header">
//           <span className="sidebar-brand">STUDENT DESK</span>
//           <button
//             style={{
//               background: "none",
//               border: "none",
//               color: "var(--muted)",
//               cursor: "pointer",
//             }}
//             onClick={() => setSidebarOpen(false)}>
//             ✕
//           </button>
//         </div>
//         <div className="sidebar-menu-section">
//           <div className="sidebar-heading">My Registered Subjects</div>
//           {assignedSubjects.map((sub) => (
//             <div
//               key={sub._id}
//               className={`sidebar-item ${activeSubjectId === sub._id ? "active" : ""}`}
//               onClick={() => {
//                 setActiveSubjectId(sub._id);
//                 setActiveTab(null);
//                 setActiveHtmlContent(null);
//                 setActiveTask(null);
//               }}>
//               📚 {sub.name}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="main-viewport">
//         {selectedSubject ? (
//           <div>
//             <div className="hero">
//               <div className="hero-badge">Student Core Engine</div>
//               <h1>{selectedSubject.name}</h1>
//             </div>

//             {/* Hub Category Cards Grid Map Rendering */}
//             {!activeTab && !activeTask && (
//               <div className="content-grid-cards">
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--green)" }}
//                   onClick={() => setActiveTab("materials")}>
//                   <div className="interactive-card-icon">📘</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--green)" }}>
//                     Materials
//                   </div>
//                   <div className="interactive-card-desc">
//                     Review your text books, structural outlines, and style
//                     guides.
//                   </div>
//                 </div>
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--amber)" }}
//                   onClick={() => setActiveTab("tasks")}>
//                   <div className="interactive-card-icon">📝</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--amber)" }}>
//                     Tasks Runtime
//                   </div>
//                   <div className="interactive-card-desc">
//                     Open the programming editor workspace to submit executable
//                     code assignments.
//                   </div>
//                 </div>
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--pink)" }}
//                   onClick={() => setActiveTab("quizzes")}>
//                   <div className="interactive-card-icon">🎯</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--pink)" }}>
//                     Quizzes
//                   </div>
//                   <div className="interactive-card-desc">
//                     Complete knowledge checkpoints.
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Item Listing Index Layer Map */}
//             {activeTab && !activeHtmlContent && !activeTask && (
//               <div>
//                 <button
//                   className="action-btn close-view-btn"
//                   onClick={() => setActiveTab(null)}>
//                   ← Back to Hub
//                 </button>
//                 <h2
//                   style={{
//                     textTransform: "capitalize",
//                     marginBottom: "1.5rem",
//                     fontFamily: "JetBrains Mono",
//                   }}>
//                   Your Assigned {activeTab}
//                 </h2>

//                 {selectedSubject[activeTab]?.length === 0 ? (
//                   <p style={{ color: "var(--muted)" }}>
//                     No entries have been posted to this cluster index.
//                   </p>
//                 ) : (
//                   selectedSubject[activeTab].map((item, idx) => {
//                     const progress = getTaskProgressMetrics(item._id);
//                     return (
//                       <div
//                         key={item._id || idx}
//                         className="item-row-link"
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "stretch",
//                           gap: "10px",
//                         }}
//                         onClick={() => {
//                           if (activeTab === "tasks") {
//                             setActiveTask(item);
//                             loadQuestionRuntimeState(
//                               item,
//                               0,
//                               item.questions[0]?.allowedLanguages[0] ||
//                                 "python",
//                             );
//                           }
//                         }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             width: "100%",
//                           }}>
//                           <span>
//                             {progress.isCompleted ? "✅" : "⚡"} {item.title}{" "}
//                             {item.topic && (
//                               <span
//                                 style={{
//                                   color: "var(--muted)",
//                                   fontSize: "0.8rem",
//                                 }}>
//                                 — Topic: {item.topic}
//                               </span>
//                             )}
//                           </span>
//                           <span
//                             style={{
//                               color: "var(--blue)",
//                               fontSize: "0.85rem",
//                             }}>
//                             {progress.isCompleted
//                               ? "Review Lab →"
//                               : "Launch Workspace →"}
//                           </span>
//                         </div>

//                         {/* Live Task Tracking Horizontal Progress Percent Vector Component bar */}
//                         {activeTab === "tasks" && (
//                           <div style={{ width: "100%", marginTop: "5px" }}>
//                             <div
//                               style={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 fontSize: "0.72rem",
//                                 fontFamily: "JetBrains Mono",
//                                 color: "var(--muted)",
//                                 marginBottom: "4px",
//                               }}>
//                               <span>PROGRESS METRICS TRACKER</span>
//                               <span
//                                 style={{
//                                   color: progress.isCompleted
//                                     ? "var(--green)"
//                                     : "var(--amber)",
//                                 }}>
//                                 {progress.percentage}% COMPLETE
//                               </span>
//                             </div>
//                             <div
//                               style={{
//                                 width: "100%",
//                                 height: "6px",
//                                 background: "#0a0f1d",
//                                 borderRadius: "20px",
//                                 overflow: "hidden",
//                                 border: "1px solid var(--border)",
//                               }}>
//                               <div
//                                 style={{
//                                   width: `${progress.percentage}%`,
//                                   height: "100%",
//                                   background: progress.isCompleted
//                                     ? "linear-gradient(90deg, var(--green), var(--teal))"
//                                     : "linear-gradient(90deg, var(--amber), var(--purple))",
//                                   transition: "width 0.4s ease",
//                                 }}></div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             )}

//             {/* Traditional HTML Viewer for Materials/Quizzes */}
//             {activeHtmlContent && (
//               <div>
//                 <button
//                   className="action-btn close-view-btn"
//                   onClick={() => setActiveHtmlContent(null)}>
//                   ← Close Viewport Document
//                 </button>
//                 <div
//                   className="rendered-html-wrapper"
//                   dangerouslySetInnerHTML={{ __html: activeHtmlContent }}
//                 />
//               </div>
//             )}

//             {/* DYNAMIC INTERACTIVE MULTI-QUESTION COMPILER ENVIRONMENT DESK CONTAINER */}
//             {activeTask && (
//               <div>
//                 <button
//                   className="action-btn close-view-btn"
//                   onClick={() => {
//                     setActiveTask(null);
//                     setActiveTab("tasks");
//                   }}>
//                   ← Exit Code Workspace
//                 </button>

//                 <div
//                   style={{
//                     background: "var(--surface)",
//                     border: "1px solid var(--border)",
//                     padding: "1.5rem",
//                     borderRadius: "12px",
//                     marginBottom: "1.5rem",
//                   }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}>
//                     <div>
//                       <span
//                         className="hero-badge"
//                         style={{
//                           color: currentActiveQuestionProgress?.isCompleted
//                             ? "var(--green)"
//                             : "var(--amber)",
//                           borderColor:
//                             currentActiveQuestionProgress?.isCompleted
//                               ? "var(--green)"
//                               : "var(--amber)",
//                         }}>
//                         {currentActiveQuestionProgress?.isCompleted
//                           ? "Assignment Completed"
//                           : "Task Playground Active"}
//                       </span>
//                       <h2 style={{ marginTop: "0.5rem" }}>
//                         {activeTask.title}
//                       </h2>
//                       <span
//                         style={{
//                           fontSize: "0.85rem",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--muted)",
//                         }}>
//                         Topic Area: {activeTask.topic}
//                       </span>
//                     </div>

//                     {/* Horizontal Question Pagination Bar Selector Grid */}
//                     <div style={{ display: "flex", gap: "8px" }}>
//                       {activeTask.questions.map((_, index) => {
//                         const isQuestionDone =
//                           currentActiveQuestionProgress?.scores?.[
//                             index.toString()
//                           ] !== undefined;
//                         return (
//                           <button
//                             key={index}
//                             className="action-btn"
//                             style={{
//                               padding: "6px 12px",
//                               background:
//                                 selectedQuestionIndex === index
//                                   ? "var(--amber)"
//                                   : "var(--bg)",
//                               color:
//                                 selectedQuestionIndex === index
//                                   ? "var(--bg)"
//                                   : isQuestionDone
//                                     ? "var(--green)"
//                                     : "var(--text)",
//                               borderColor: isQuestionDone
//                                 ? "var(--green-dim)"
//                                 : "var(--border)",
//                             }}
//                             onClick={() =>
//                               loadQuestionRuntimeState(
//                                 activeTask,
//                                 index,
//                                 activeTask.questions[index]
//                                   .allowedLanguages[0] || "python",
//                               )
//                             }>
//                             Q{index + 1} {isQuestionDone && "✓"}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Split Compiler Workbench Frame Structure */}
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1.2fr",
//                     gap: "1.5rem",
//                     alignItems: "start",
//                   }}>
//                   {/* Left Column: Challenge Prompt Specification Block */}
//                   <div
//                     className="form-panel"
//                     style={{ margin: 0, minHeight: "450px" }}>
//                     <div
//                       className="form-title"
//                       style={{ color: "var(--blue)" }}>
//                       📋 Challenge Specification Node #
//                       {selectedQuestionIndex + 1}
//                     </div>
//                     <p
//                       style={{
//                         fontSize: "0.95rem",
//                         lineHeight: "1.6",
//                         color: "#c4cfe0",
//                         whiteSpace: "pre-wrap",
//                       }}>
//                       {
//                         activeTask.questions[selectedQuestionIndex]
//                           ?.questionText
//                       }
//                     </p>

//                     <div
//                       style={{
//                         marginTop: "2rem",
//                         paddingTop: "1.5rem",
//                         borderTop: "1px solid var(--border)",
//                       }}>
//                       <span
//                         style={{
//                           fontSize: "0.75rem",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--muted)",
//                           display: "block",
//                           marginBottom: "0.5rem",
//                         }}>
//                         EXPECTED VERIFICATION OUTPUT VERDICT ASSERTION:
//                       </span>
//                       <div
//                         style={{
//                           background: "#090d16",
//                           border: "1px solid var(--border)",
//                           padding: "0.75rem",
//                           borderRadius: "6px",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--green)",
//                           fontSize: "0.85rem",
//                         }}>
//                         {
//                           activeTask.questions[selectedQuestionIndex]
//                             ?.expectedOutput
//                         }
//                       </div>
//                     </div>

//                     {/* Persistent scorecard display panel module item */}
//                     <div
//                       style={{
//                         marginTop: "2rem",
//                         paddingTop: "1.5rem",
//                         borderTop: "1px solid var(--border)",
//                       }}>
//                       <span
//                         style={{
//                           fontSize: "0.75rem",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--muted)",
//                           display: "block",
//                         }}>
//                         RECORDED PERFORMANCE SCORE VERDICT:
//                       </span>
//                       <div
//                         style={{
//                           fontSize: "1.8rem",
//                           fontWeight: "700",
//                           fontFamily: "JetBrains Mono",
//                           color: isCurrentQuestionSubmitted
//                             ? "var(--green)"
//                             : "var(--muted)",
//                           marginTop: "0.5rem",
//                         }}>
//                         {isCurrentQuestionSubmitted
//                           ? `${currentActiveQuestionProgress.scores[selectedQuestionIndex.toString()]} / 100`
//                           : "PENDING ATTEMPT SUBMISSION"}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Column: Dynamic Code Input Sandbox Area Terminal Wrapper */}
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: "1rem",
//                     }}>
//                     <div
//                       className="form-panel"
//                       style={{ margin: 0, paddingBottom: "1rem" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           marginBottom: "1rem",
//                         }}>
//                         <span className="form-title" style={{ margin: 0 }}>
//                           💻 Source Compiler Frame{" "}
//                           {isCurrentQuestionSubmitted && (
//                             <span
//                               style={{
//                                 color: "var(--green)",
//                                 fontSize: "0.8rem",
//                               }}>
//                               (SUBMITTED & COMPLETED)
//                             </span>
//                           )}
//                         </span>

//                         {/* Interactive Language Selector Buttons Grid */}
//                         <div
//                           style={{
//                             display: "flex",
//                             gap: "5px",
//                             background: "var(--bg)",
//                             padding: "4px",
//                             borderRadius: "6px",
//                           }}>
//                           {activeTask.questions[
//                             selectedQuestionIndex
//                           ]?.allowedLanguages.map((lang) => (
//                             <button
//                               key={lang}
//                               disabled={isCurrentQuestionSubmitted}
//                               style={{
//                                 background:
//                                   selectedRuntimeLanguage === lang
//                                     ? "var(--surface2)"
//                                     : "transparent",
//                                 color:
//                                   selectedRuntimeLanguage === lang
//                                     ? "var(--blue)"
//                                     : "var(--muted)",
//                                 border: "none",
//                                 padding: "4px 10px",
//                                 borderRadius: "4px",
//                                 cursor: isCurrentQuestionSubmitted
//                                   ? "not-allowed"
//                                   : "pointer",
//                                 fontFamily: "JetBrains Mono",
//                                 fontSize: "0.75rem",
//                                 textTransform: "uppercase",
//                               }}
//                               onClick={() =>
//                                 loadQuestionRuntimeState(
//                                   activeTask,
//                                   selectedQuestionIndex,
//                                   lang,
//                                 )
//                               }>
//                               {lang}
//                             </button>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Monospaced Editor Textarea Input Rig Box */}
//                       <div
//                         style={{
//                           position: "relative",
//                           background: "#040810",
//                           borderRadius: "8px",
//                           border: "1px solid #1a2535",
//                         }}>
//                         <textarea
//                           readOnly={isCurrentQuestionSubmitted}
//                           style={{
//                             width: "100%",
//                             minHeight: "260px",
//                             background: "transparent",
//                             border: "none",
//                             outline: "none",
//                             color: isCurrentQuestionSubmitted
//                               ? "var(--muted)"
//                               : "#e2e8f0",
//                             padding: "1rem",
//                             fontFamily: "JetBrains Mono, monospace",
//                             fontSize: "0.85rem",
//                             lineHeight: "1.6",
//                             resize: "vertical",
//                           }}
//                           value={studentCodeInput}
//                           onChange={(e) => setStudentCodeInput(e.target.value)}
//                         />
//                       </div>

//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "flex-end",
//                           gap: "10px",
//                           marginTop: "1rem",
//                         }}>
//                         <button
//                           disabled={isCurrentQuestionSubmitted}
//                           className="action-btn"
//                           style={{
//                             borderColor: "var(--green)",
//                             color: "var(--green)",
//                             opacity: isCurrentQuestionSubmitted ? 0.3 : 1,
//                             cursor: isCurrentQuestionSubmitted
//                               ? "not-allowed"
//                               : "pointer",
//                           }}
//                           onClick={executeSandboxRuntimeEngine}>
//                           ⚡ Run Code Script Assertions
//                         </button>

//                         {/* Submission Action Control Trigger Component Block */}
//                         {isOutputValid && !isCurrentQuestionSubmitted && (
//                           <button
//                             className="action-btn"
//                             style={{
//                               background: "var(--green)",
//                               color: "var(--bg)",
//                               borderColor: "var(--green)",
//                             }}
//                             onClick={handleFinalTaskSubmit}>
//                             💾 Submit Answer & Log Score
//                           </button>
//                         )}
//                       </div>
//                     </div>

//                     {/* Output Virtual Execution Feedback Stream Console Log Terminal */}
//                     <div
//                       className="form-panel"
//                       style={{ margin: 0, background: "#05070b" }}>
//                       <div
//                         className="output-label"
//                         style={{ color: "var(--muted)" }}>
//                         System Output Pipeline Stream
//                       </div>
//                       <div
//                         style={{
//                           minHeight: "100px",
//                           fontFamily: "JetBrains Mono",
//                           fontSize: "0.82rem",
//                           whiteSpace: "pre-wrap",
//                           color: "#6ee7b7",
//                           lineHeight: "1.5",
//                           marginTop: "0.5rem",
//                         }}>
//                         {consoleOutputLog ||
//                           "Terminal awaiting execution stack loop trigger signals..."}
//                       </div>

//                       {isOutputValid !== null && (
//                         <div
//                           style={{
//                             marginTop: "1rem",
//                             padding: "0.5rem 1rem",
//                             borderRadius: "6px",
//                             border:
//                               "1px solid " +
//                               (isOutputValid ? "var(--green)" : "var(--red)"),
//                             background: isOutputValid ? "#052e16" : "#4c0519",
//                             color: isOutputValid
//                               ? "var(--green)"
//                               : "var(--red)",
//                             fontSize: "0.8rem",
//                             fontFamily: "JetBrains Mono",
//                           }}>
//                           {isOutputValid
//                             ? "✔ VERDICT MATCH: All validation tests matching execution targets perfectly."
//                             : "✕ VERDICT FAULT: Output metrics did not match assertion conditions pattern rules."}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
//             <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
//             <h2>Welcome to Your LMS Workspace Hub</h2>
//             <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
//               Please select an assigned subject from the side navigation tree
//               structure.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//ab was too too too good

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function StudentDashboard({ currentUser }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [assignedSubjects, setAssignedSubjects] = useState([]);
//   const [activeSubjectId, setActiveSubjectId] = useState(null);
//   const [activeTab, setActiveTab] = useState(null);
//   const [activeHtmlContent, setActiveHtmlContent] = useState(null);

//   // Program Playground Execution Runtime Core State
//   const [activeTask, setActiveTask] = useState(null);
//   const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
//   const [selectedRuntimeLanguage, setSelectedRuntimeLanguage] =
//     useState("python");
//   const [studentCodeInput, setStudentCodeInput] = useState("");
//   const [consoleOutputLog, setConsoleOutputLog] = useState("");
//   const [isOutputValid, setIsOutputValid] = useState(null);

//   // Submission & Grading Tracking State Management Controls
//   const [submissionRecords, setSubmissionRecords] = useState([]);

//   useEffect(() => {
//     fetchStudentCourses();
//   }, []);

//   useEffect(() => {
//     if (activeSubjectId) {
//       fetchSubmissionRecords();
//     }
//   }, [activeSubjectId]);

//   useEffect(() => {
//     if (activeTask) {
//       const cacheStorageKey = `lms_code_cache_${currentUser.username}_${activeTask._id}_${selectedQuestionIndex}_${selectedRuntimeLanguage}`;
//       localStorage.setItem(cacheStorageKey, studentCodeInput);
//     }
//   }, [
//     studentCodeInput,
//     activeTask,
//     selectedQuestionIndex,
//     selectedRuntimeLanguage,
//   ]);

//   const fetchStudentCourses = async () => {
//     try {
//       const resProfile = await axios.get(
//         `http://localhost:5000/api/user-context/${currentUser.username}`,
//       );
//       setAssignedSubjects(resProfile.data.assignedSubjects || []);
//     } catch (err) {
//       console.error("Error reading student profiles:", err);
//     }
//   };

//   const fetchSubmissionRecords = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/submissions/${currentUser.username}/${activeSubjectId}`,
//       );
//       setSubmissionRecords(res.data);
//     } catch (err) {
//       console.error(
//         "Failed synchronization with database grading arrays:",
//         err,
//       );
//     }
//   };

//   const selectedSubject = assignedSubjects.find(
//     (s) => s._id === activeSubjectId,
//   );

//   // Helper routine to query and return progress metrics matching a unique specific assignment loop node
//   const getTaskProgressMetrics = (taskId) => {
//     const match = submissionRecords.find((r) => r.taskId === taskId);
//     if (!match) return { percentage: 0, isCompleted: false, scores: {} };

//     const totalQuestionsCount = activeSubjectId
//       ? selectedSubject?.tasks?.find((t) => t._id === taskId)?.questions
//           ?.length || 1
//       : 1;

//     const completedCount = match.completedQuestions?.length || 0;
//     const computedPercent = Math.round(
//       (completedCount / totalQuestionsCount) * 100,
//     );

//     return {
//       percentage: Math.min(computedPercent, 100),
//       isCompleted: match.isCompleted,
//       scores: match.scores || {},
//     };
//   };

//   // Logic calculation block to pull dynamic cumulative counters for Task Hub view headers
//   const getSubjectTaskCounters = () => {
//     if (!selectedSubject || !selectedSubject.tasks)
//       return { completed: 0, total: 0 };
//     const totalTasksCount = selectedSubject.tasks.length;

//     let fullyFinishedCount = 0;
//     selectedSubject.tasks.forEach((task) => {
//       const matchRecord = submissionRecords.find((r) => r.taskId === task._id);
//       if (matchRecord && matchRecord.isCompleted) {
//         fullyFinishedCount++;
//       }
//     });

//     return {
//       completed: fullyFinishedCount,
//       total: totalTasksCount,
//     };
//   };

//   // Instantiates Code Input states when changing questions or flipping sandbox runtime modes
//   const loadQuestionRuntimeState = (task, qIdx, lang) => {
//     const question = task.questions[qIdx];
//     if (!question) return;

//     setSelectedQuestionIndex(qIdx);
//     setSelectedRuntimeLanguage(lang);
//     setConsoleOutputLog("");
//     setIsOutputValid(null);

//     const cacheStorageKey = `lms_code_cache_${currentUser.username}_${task._id}_${qIdx}_${lang}`;
//     const persistedCode = localStorage.getItem(cacheStorageKey);

//     if (persistedCode !== null) {
//       setStudentCodeInput(persistedCode);
//     } else {
//       if (lang === "python") {
//         setStudentCodeInput(
//           question.initialPythonCode || "# Enter Python code\n",
//         );
//       } else {
//         setStudentCodeInput(
//           question.initialJavaCode || "public class Main {\n\n}",
//         );
//       }
//     }
//   };

//   const executeSandboxRuntimeEngine = () => {
//     setConsoleOutputLog("Initializing virtual execution pipeline layer...\n");

//     setTimeout(() => {
//       const currentQuestion = activeTask.questions[selectedQuestionIndex];
//       let consoleCapture = "";

//       if (selectedRuntimeLanguage === "python") {
//         if (studentCodeInput.includes("print(")) {
//           const regexExtract = /print\s*\(\s*['"]([^'"]*)['"]\s*\)/g;
//           let matchGroup;
//           const linesCaptured = [];
//           while ((matchGroup = regexExtract.exec(studentCodeInput)) !== null) {
//             linesCaptured.push(matchGroup[1]);
//           }
//           consoleCapture =
//             linesCaptured.join("\n") ||
//             "Process executed with no stdout values.";
//         } else {
//           consoleCapture =
//             "Process completed. Error: No output returned to standard stdout stream pipelines.";
//         }
//       } else if (selectedRuntimeLanguage === "java") {
//         if (studentCodeInput.includes("System.out.println(")) {
//           const regexJavaExtract =
//             /System\.out\.println\s*\(\s*['"]([^'"]*)['"]\s*\)/g;
//           let matchGroup;
//           const linesCaptured = [];
//           while (
//             (matchGroup = regexJavaExtract.exec(studentCodeInput)) !== null
//           ) {
//             linesCaptured.push(matchGroup[1]);
//           }
//           consoleCapture =
//             linesCaptured.join("\n") || "Java Process standard output empty.";
//         } else {
//           consoleCapture =
//             "Compilation Error: Missing valid printing pipeline statements inside main framework.";
//         }
//       }

//       setConsoleOutputLog(consoleCapture);

//       const cleanedTarget = currentQuestion.expectedOutput.trim();
//       const cleanedCapture = consoleCapture.trim();

//       if (cleanedTarget && cleanedCapture === cleanedTarget) {
//         setIsOutputValid(true);
//       } else {
//         setIsOutputValid(false);
//       }
//     }, 900);
//   };

//   const handleFinalTaskSubmit = async () => {
//     if (!isOutputValid) return;
//     try {
//       await axios.post(
//         "http://localhost:5000/api/submissions/submit-question",
//         {
//           username: currentUser.username,
//           subjectId: activeSubjectId,
//           taskId: activeTask._id,
//           questionIndex: selectedQuestionIndex,
//           score: 100,
//           totalQuestions: activeTask.questions.length,
//         },
//       );

//       alert("Question solution logged and locked securely!");
//       fetchSubmissionRecords();
//     } catch (err) {
//       console.error("Submission routine error stack capture:", err);
//       alert("Operational submission synchronization routine error.");
//     }
//   };

//   const currentActiveQuestionProgress = activeTask
//     ? getTaskProgressMetrics(activeTask._id)
//     : null;
//   const isCurrentQuestionSubmitted =
//     currentActiveQuestionProgress?.scores?.[
//       selectedQuestionIndex.toString()
//     ] !== undefined;
//   const taskSummary = getSubjectTaskCounters();

//   return (
//     <div className="dashboard-container">
//       {!sidebarOpen && (
//         <button
//           className="sidebar-toggle-floating"
//           onClick={() => setSidebarOpen(true)}>
//           ☰
//         </button>
//       )}

//       <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
//         <div className="sidebar-header">
//           <span className="sidebar-brand">STUDENT DESK</span>
//           <button
//             style={{
//               background: "none",
//               border: "none",
//               color: "var(--muted)",
//               cursor: "pointer",
//             }}
//             onClick={() => setSidebarOpen(false)}>
//             ✕
//           </button>
//         </div>
//         <div className="sidebar-menu-section">
//           <div className="sidebar-heading">My Registered Subjects</div>
//           {assignedSubjects.map((sub) => (
//             <div
//               key={sub._id}
//               className={`sidebar-item ${activeSubjectId === sub._id ? "active" : ""}`}
//               onClick={() => {
//                 setActiveSubjectId(sub._id);
//                 setActiveTab(null);
//                 setActiveHtmlContent(null);
//                 setActiveTask(null);
//               }}>
//               📚 {sub.name}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="main-viewport">
//         {selectedSubject ? (
//           <div>
//             <div className="hero">
//               <div className="hero-badge">Student Core Engine</div>
//               <h1>{selectedSubject.name}</h1>
//             </div>

//             {/* Hub Category Cards Grid Map Rendering */}
//             {!activeTab && !activeTask && (
//               <div className="content-grid-cards">
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--green)" }}
//                   onClick={() => setActiveTab("materials")}>
//                   <div className="interactive-card-icon">📘</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--green)" }}>
//                     Materials
//                   </div>
//                   <div className="interactive-card-desc">
//                     Review your text books, structural outlines, and style
//                     guides.
//                   </div>
//                 </div>
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--amber)" }}
//                   onClick={() => setActiveTab("tasks")}>
//                   <div className="interactive-card-icon">📝</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--amber)" }}>
//                     Tasks Runtime
//                   </div>
//                   <div className="interactive-card-desc">
//                     Open the programming editor workspace to submit executable
//                     code assignments.
//                   </div>
//                 </div>
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--pink)" }}
//                   onClick={() => setActiveTab("quizzes")}>
//                   <div className="interactive-card-icon">🎯</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--pink)" }}>
//                     Quizzes
//                   </div>
//                   <div className="interactive-card-desc">
//                     Complete knowledge checkpoints.
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Item Listing Index Layer Map */}
//             {activeTab && !activeHtmlContent && !activeTask && (
//               <div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "1.5rem",
//                   }}>
//                   <button
//                     className="action-btn close-view-btn"
//                     style={{ margin: 0 }}
//                     onClick={() => setActiveTab(null)}>
//                     ← Back to Hub
//                   </button>

//                   {/* Dynamic Completed Count Ratio Header element display widget */}
//                   {activeTab === "tasks" && (
//                     <div
//                       style={{
//                         fontFamily: "JetBrains Mono",
//                         fontSize: "0.85rem",
//                         background: "#0a1628",
//                         border: "1px solid var(--blue)",
//                         padding: "6px 14px",
//                         borderRadius: "20px",
//                         color: "var(--blue)",
//                       }}>
//                       TASKS MASTERED:{" "}
//                       <b style={{ fontSize: "1rem", color: "var(--text)" }}>
//                         {taskSummary.completed}
//                       </b>{" "}
//                       / {taskSummary.total}
//                     </div>
//                   )}
//                 </div>

//                 <h2
//                   style={{
//                     textTransform: "capitalize",
//                     marginBottom: "1.5rem",
//                     fontFamily: "JetBrains Mono",
//                   }}>
//                   Your Assigned {activeTab}
//                 </h2>

//                 {selectedSubject[activeTab]?.length === 0 ? (
//                   <p style={{ color: "var(--muted)" }}>
//                     No entries have been posted to this cluster index.
//                   </p>
//                 ) : (
//                   selectedSubject[activeTab].map((item, idx) => {
//                     const progress = getTaskProgressMetrics(item._id);
//                     return (
//                       <div
//                         key={item._id || idx}
//                         className="item-row-link"
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "stretch",
//                           gap: "10px",
//                         }}
//                         onClick={() => {
//                           if (activeTab === "tasks") {
//                             setActiveTask(item);
//                             loadQuestionRuntimeState(
//                               item,
//                               0,
//                               item.questions[0]?.allowedLanguages[0] ||
//                                 "python",
//                             );
//                           }
//                         }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             width: "100%",
//                           }}>
//                           <span>
//                             {progress.isCompleted ? "✅" : "⚡"} {item.title}{" "}
//                             {item.topic && (
//                               <span
//                                 style={{
//                                   color: "var(--muted)",
//                                   fontSize: "0.8rem",
//                                 }}>
//                                 — Topic: {item.topic}
//                               </span>
//                             )}
//                           </span>
//                           <span
//                             style={{
//                               color: "var(--blue)",
//                               fontSize: "0.85rem",
//                             }}>
//                             {progress.isCompleted
//                               ? "Review Lab →"
//                               : "Launch Workspace →"}
//                           </span>
//                         </div>

//                         {activeTab === "tasks" && (
//                           <div style={{ width: "100%", marginTop: "5px" }}>
//                             <div
//                               style={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 fontSize: "0.72rem",
//                                 fontFamily: "JetBrains Mono",
//                                 color: "var(--muted)",
//                                 marginBottom: "4px",
//                               }}>
//                               <span>PROGRESS METRICS TRACKER</span>
//                               <span
//                                 style={{
//                                   color: progress.isCompleted
//                                     ? "var(--green)"
//                                     : "var(--amber)",
//                                 }}>
//                                 {progress.percentage}% COMPLETE
//                               </span>
//                             </div>
//                             <div
//                               style={{
//                                 width: "100%",
//                                 height: "6px",
//                                 background: "#0a0f1d",
//                                 borderRadius: "20px",
//                                 overflow: "hidden",
//                                 border: "1px solid var(--border)",
//                               }}>
//                               <div
//                                 style={{
//                                   width: `${progress.percentage}%`,
//                                   height: "100%",
//                                   background: progress.isCompleted
//                                     ? "linear-gradient(90deg, var(--green), var(--teal))"
//                                     : "linear-gradient(90deg, var(--amber), var(--purple))",
//                                   transition: "width 0.4s ease",
//                                 }}></div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             )}

//             {activeHtmlContent && (
//               <div>
//                 <button
//                   className="action-btn close-view-btn"
//                   onClick={() => setActiveHtmlContent(null)}>
//                   ← Close Viewport Document
//                 </button>
//                 <div
//                   className="rendered-html-wrapper"
//                   dangerouslySetInnerHTML={{ __html: activeHtmlContent }}
//                 />
//               </div>
//             )}

//             {activeTask && (
//               <div>
//                 <button
//                   className="action-btn close-view-btn"
//                   onClick={() => {
//                     setActiveTask(null);
//                     setActiveTab("tasks");
//                   }}>
//                   ← Exit Code Workspace
//                 </button>

//                 <div
//                   style={{
//                     background: "var(--surface)",
//                     border: "1px solid var(--border)",
//                     padding: "1.5rem",
//                     borderRadius: "12px",
//                     marginBottom: "1.5rem",
//                   }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}>
//                     <div>
//                       <span
//                         className="hero-badge"
//                         style={{
//                           color: currentActiveQuestionProgress?.isCompleted
//                             ? "var(--green)"
//                             : "var(--amber)",
//                           borderColor:
//                             currentActiveQuestionProgress?.isCompleted
//                               ? "var(--green)"
//                               : "var(--amber)",
//                         }}>
//                         {currentActiveQuestionProgress?.isCompleted
//                           ? "Assignment Completed"
//                           : "Task Playground Active"}
//                       </span>
//                       <h2 style={{ marginTop: "0.5rem" }}>
//                         {activeTask.title}
//                       </h2>
//                       <span
//                         style={{
//                           fontSize: "0.85rem",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--muted)",
//                         }}>
//                         Topic Area: {activeTask.topic}
//                       </span>
//                     </div>

//                     <div style={{ display: "flex", gap: "8px" }}>
//                       {activeTask.questions.map((_, index) => {
//                         const isQuestionDone =
//                           currentActiveQuestionProgress?.scores?.[
//                             index.toString()
//                           ] !== undefined;
//                         return (
//                           <button
//                             key={index}
//                             className="action-btn"
//                             style={{
//                               padding: "6px 12px",
//                               background:
//                                 selectedQuestionIndex === index
//                                   ? "var(--amber)"
//                                   : "var(--bg)",
//                               color:
//                                 selectedQuestionIndex === index
//                                   ? "var(--bg)"
//                                   : isQuestionDone
//                                     ? "var(--green)"
//                                     : "var(--text)",
//                               borderColor: isQuestionDone
//                                 ? "var(--green-dim)"
//                                 : "var(--border)",
//                             }}
//                             onClick={() =>
//                               loadQuestionRuntimeState(
//                                 activeTask,
//                                 index,
//                                 activeTask.questions[index]
//                                   .allowedLanguages[0] || "python",
//                               )
//                             }>
//                             Q{index + 1} {isQuestionDone && "✓"}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1.2fr",
//                     gap: "1.5rem",
//                     alignItems: "start",
//                   }}>
//                   <div
//                     className="form-panel"
//                     style={{ margin: 0, minHeight: "450px" }}>
//                     <div
//                       className="form-title"
//                       style={{ color: "var(--blue)" }}>
//                       📋 Challenge Specification Node #
//                       {selectedQuestionIndex + 1}
//                     </div>
//                     <p
//                       style={{
//                         fontSize: "0.95rem",
//                         lineHeight: "1.6",
//                         color: "#c4cfe0",
//                         whiteSpace: "pre-wrap",
//                       }}>
//                       {
//                         activeTask.questions[selectedQuestionIndex]
//                           ?.questionText
//                       }
//                     </p>

//                     <div
//                       style={{
//                         marginTop: "2rem",
//                         paddingTop: "1.5rem",
//                         borderTop: "1px solid var(--border)",
//                       }}>
//                       <span
//                         style={{
//                           fontSize: "0.75rem",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--muted)",
//                           display: "block",
//                           marginBottom: "0.5rem",
//                         }}>
//                         EXPECTED VERIFICATION OUTPUT VERDICT ASSERTION:
//                       </span>
//                       <div
//                         style={{
//                           background: "#090d16",
//                           border: "1px solid var(--border)",
//                           padding: "0.75rem",
//                           borderRadius: "6px",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--green)",
//                           fontSize: "0.85rem",
//                         }}>
//                         {
//                           activeTask.questions[selectedQuestionIndex]
//                             ?.expectedOutput
//                         }
//                       </div>
//                     </div>

//                     <div
//                       style={{
//                         marginTop: "2rem",
//                         paddingTop: "1.5rem",
//                         borderTop: "1px solid var(--border)",
//                       }}>
//                       <span
//                         style={{
//                           fontSize: "0.75rem",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--muted)",
//                           display: "block",
//                         }}>
//                         RECORDED PERFORMANCE SCORE VERDICT:
//                       </span>
//                       <div
//                         style={{
//                           fontSize: "1.8rem",
//                           fontWeight: "700",
//                           fontFamily: "JetBrains Mono",
//                           color: isCurrentQuestionSubmitted
//                             ? "var(--green)"
//                             : "var(--muted)",
//                           marginTop: "0.5rem",
//                         }}>
//                         {isCurrentQuestionSubmitted
//                           ? `${currentActiveQuestionProgress.scores[selectedQuestionIndex.toString()]} / 100`
//                           : "PENDING ATTEMPT SUBMISSION"}
//                       </div>
//                     </div>
//                   </div>

//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: "1rem",
//                     }}>
//                     <div
//                       className="form-panel"
//                       style={{ margin: 0, paddingBottom: "1rem" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           marginBottom: "1rem",
//                         }}>
//                         <span className="form-title" style={{ margin: 0 }}>
//                           💻 Source Compiler Frame{" "}
//                           {isCurrentQuestionSubmitted && (
//                             <span
//                               style={{
//                                 color: "var(--green)",
//                                 fontSize: "0.8rem",
//                               }}>
//                               (SUBMITTED & COMPLETED)
//                             </span>
//                           )}
//                         </span>

//                         <div
//                           style={{
//                             display: "flex",
//                             gap: "5px",
//                             background: "var(--bg)",
//                             padding: "4px",
//                             borderRadius: "6px",
//                           }}>
//                           {activeTask.questions[
//                             selectedQuestionIndex
//                           ]?.allowedLanguages.map((lang) => (
//                             <button
//                               key={lang}
//                               disabled={isCurrentQuestionSubmitted}
//                               style={{
//                                 background:
//                                   selectedRuntimeLanguage === lang
//                                     ? "var(--surface2)"
//                                     : "transparent",
//                                 color:
//                                   selectedRuntimeLanguage === lang
//                                     ? "var(--blue)"
//                                     : "var(--muted)",
//                                 border: "none",
//                                 padding: "4px 10px",
//                                 borderRadius: "4px",
//                                 cursor: isCurrentQuestionSubmitted
//                                   ? "not-allowed"
//                                   : "pointer",
//                                 fontFamily: "JetBrains Mono",
//                                 fontSize: "0.75rem",
//                                 textTransform: "uppercase",
//                               }}
//                               onClick={() =>
//                                 loadQuestionRuntimeState(
//                                   activeTask,
//                                   selectedQuestionIndex,
//                                   lang,
//                                 )
//                               }>
//                               {lang}
//                             </button>
//                           ))}
//                         </div>
//                       </div>

//                       <div
//                         style={{
//                           position: "relative",
//                           background: "#040810",
//                           borderRadius: "8px",
//                           border: "1px solid #1a2535",
//                         }}>
//                         <textarea
//                           disabled={isCurrentQuestionSubmitted}
//                           style={{
//                             width: "100%",
//                             minHeight: "260px",
//                             background: "transparent",
//                             border: "none",
//                             outline: "none",
//                             color: isCurrentQuestionSubmitted
//                               ? "var(--muted)"
//                               : "#e2e8f0",
//                             padding: "1rem",
//                             fontFamily: "JetBrains Mono, monospace",
//                             fontSize: "0.85rem",
//                             lineHeight: "1.6",
//                             resize: "vertical",
//                           }}
//                           value={studentCodeInput}
//                           onChange={(e) => setStudentCodeInput(e.target.value)}
//                         />
//                       </div>

//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "flex-end",
//                           gap: "10px",
//                           marginTop: "1rem",
//                         }}>
//                         <button
//                           disabled={isCurrentQuestionSubmitted}
//                           className="action-btn"
//                           style={{
//                             borderColor: "var(--green)",
//                             color: "var(--green)",
//                             opacity: isCurrentQuestionSubmitted ? 0.3 : 1,
//                             cursor: isCurrentQuestionSubmitted
//                               ? "not-allowed"
//                               : "pointer",
//                           }}
//                           onClick={executeSandboxRuntimeEngine}>
//                           ⚡ Run Code Script Assertions
//                         </button>

//                         {isOutputValid && !isCurrentQuestionSubmitted && (
//                           <button
//                             className="action-btn"
//                             style={{
//                               background: "var(--green)",
//                               color: "var(--bg)",
//                               borderColor: "var(--green)",
//                             }}
//                             onClick={handleFinalTaskSubmit}>
//                             💾 Submit Answer & Log Score
//                           </button>
//                         )}
//                       </div>
//                     </div>

//                     <div
//                       className="form-panel"
//                       style={{ margin: 0, background: "#05070b" }}>
//                       <div
//                         className="output-label"
//                         style={{ color: "var(--muted)" }}>
//                         System Output Pipeline Stream
//                       </div>
//                       <div
//                         style={{
//                           minHeight: "100px",
//                           fontFamily: "JetBrains Mono",
//                           fontSize: "0.82rem",
//                           whiteSpace: "pre-wrap",
//                           color: "#6ee7b7",
//                           lineHeight: "1.5",
//                           marginTop: "0.5rem",
//                         }}>
//                         {consoleOutputLog ||
//                           "Terminal awaiting execution stack loop trigger signals..."}
//                       </div>

//                       {isOutputValid !== null && (
//                         <div
//                           style={{
//                             marginTop: "1rem",
//                             padding: "0.5rem 1rem",
//                             borderRadius: "6px",
//                             border:
//                               "1px solid " +
//                               (isOutputValid ? "var(--green)" : "var(--red)"),
//                             background: isOutputValid ? "#052e16" : "#4c0519",
//                             color: isOutputValid
//                               ? "var(--green)"
//                               : "var(--red)",
//                             fontSize: "0.8rem",
//                             fontFamily: "JetBrains Mono",
//                           }}>
//                           {isOutputValid
//                             ? "✔ VERDICT MATCH: All validation tests matching execution targets perfectly."
//                             : "✕ VERDICT FAULT: Output metrics did not match assertion conditions pattern rules."}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
//             <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
//             <h2>Welcome to Your LMS Workspace Hub</h2>
//             <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
//               Please select an assigned subject from the side navigation tree
//               structure.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//ab was too too too too good

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function StudentDashboard({ currentUser }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [assignedSubjects, setAssignedSubjects] = useState([]);
//   const [activeSubjectId, setActiveSubjectId] = useState(null);
//   const [activeTab, setActiveTab] = useState(null);
//   const [activeHtmlContent, setActiveHtmlContent] = useState(null);

//   // Task Sandbox States
//   const [activeTask, setActiveTask] = useState(null);
//   const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
//   const [selectedRuntimeLanguage, setSelectedRuntimeLanguage] = useState("python");
//   const [studentCodeInput, setStudentCodeInput] = useState("");
//   const [consoleOutputLog, setConsoleOutputLog] = useState("");
//   const [isOutputValid, setIsOutputValid] = useState(null);

//   // Added Unified Quiz Component Engine State Structures
//   const [activeQuiz, setActiveQuiz] = useState(null);
//   const [quizUserAnswers, setQuizUserAnswers] = useState(new Array(20).fill(null));
//   const [quizSubmittedState, setQuizSubmittedState] = useState(false);
//   const [quizResultsMetadata, setQuizResultsMetadata] = useState({ correct: 0, wrong: 0, pct: 0, msg: "" });

//   // Persistence Sync Arrays
//   const [submissionRecords, setSubmissionRecords] = useState([]);
//   const [quizRecords, setQuizRecords] = useState([]);

//   // Static Hardcoded Question Data Pool Object extracted cleanly for local calculations
//   const quizQuestionsPool = [
//     {q:"What is the correct output of <span class='code-inline'>print(2 ** 8)</span>?",opts:["16","256","128","64"],ans:1},
//     {q:"Which of the following creates an empty <strong>set</strong> in Python?",opts:["<span class='code-inline'>empty = {}</span>","<span class='code-inline'>empty = set()</span>","<span class='code-inline'>empty = []</span>","<span class='code-inline'>empty = ()</span>"],ans:1},
//     {q:"What does <span class='code-inline'>print(\"A\",\"B\",\"C\", sep=\"-\")</span> output?",opts:["A B C","A-B-C","ABC","-A-B-C-"],ans:1},
//     {q:"What is the data type of the value <span class='code-inline'>True</span> in Python?",opts:["str","int","bool","NoneType"],ans:2},
//     {q:"Given <span class='code-inline'>fruits = [\"apple\",\"banana\",\"mango\"]</span>, what does <span class='code-inline'>fruits[-1]</span> return?",opts:["apple","banana","mango","IndexError"],ans:2},
//     {q:"Which list method removes and returns the last element?",opts:["remove()","delete()","pop()","discard()"],ans:2},
//     {q:"What is the output of <span class='code-inline'>print(10 // 3)</span>?",opts:["3.33","3","1","0"],ans:1},
//     {q:"A <strong>Tuple</strong> in Python is —",opts:["Ordered and mutable","Unordered and immutable","Ordered and immutable","Unordered and mutable"],ans:2},
//     {q:"Which operator checks if two variables point to the same object in memory?",opts:["==","equals()","is","in"],ans:2},
//     {q:"What does <span class='code-inline'>type(None)</span> return?",opts:["<class 'None'>","<class 'NoneType'>","<class 'null'>","<class 'undefined'>"],ans:1},
//     {q:"What is the output of <span class='code-inline'>print(\"py\" in \"python\")</span>?",opts:["py","True","False","Error"],ans:1},
//     {q:"Which function gives you both the index and value while looping a list?",opts:["zip()","range()","enumerate()","items()"],ans:2},
//     {q:"What is the result of <span class='code-inline'>{1,2,3} & {2,3,4}</span>?",opts:["{1,2,3,4}","{2,3}","{1,4}","{1,2,3,4,5}"],ans:1},
//     {q:"Which dictionary method safely returns <span class='code-inline'>None</span> when a key is not found (no error)?",opts:["dict[key]","dict.fetch(key)","dict.get(key)","dict.find(key)"],ans:2},
//     {q:"What does <span class='code-inline'>range(1, 10, 2)</span> produce?",opts:["1 3 5 7 9","1 2 3 4 5 6 7 8 9","2 4 6 8 10","0 2 4 6 8"],ans:0},
//     {q:"What is the output of the following? <br><span class='code-inline'>x = 5<br>x += 3<br>print(x)</span>",opts:["5","3","53","8"],ans:3},
//     {q:"Which statement about <strong>Sets</strong> is TRUE?",opts:["Sets allow duplicate values","Sets are ordered","Sets have no indexing","Sets are immutable"],ans:2},
//     {q:"What happens when you run <span class='code-inline'>print(\"hello\", end=\"\")</span>?",opts:["Prints hello on a new line","Prints hello with no newline after it","Prints an empty string","Raises a SyntaxError"],ans:1},
//     {q:"What does <span class='code-inline'>student.items()</span> return for a dictionary?",opts:["All keys only","All values only","All key-value pairs as tuples","The number of items"],ans:2},
//     {q:"Which of the following is NOT a valid single-element tuple?",opts:["(42,)","tuple([42])","(42)","t = 42,"],ans:2}
//   ];

//   useEffect(() => {
//     fetchStudentCourses();
//   }, []);

//   useEffect(() => {
//     if (activeSubjectId) {
//       fetchSubmissionRecords();
//       fetchQuizRecords();
//     }
//   }, [activeSubjectId]);

//   // Persistent task code draft auto-saving buffer module
//   useEffect(() => {
//     if (activeTask) {
//       const cacheStorageKey = `lms_code_cache_${currentUser.username}_${activeTask._id}_${selectedQuestionIndex}_${selectedRuntimeLanguage}`;
//       localStorage.setItem(cacheStorageKey, studentCodeInput);
//     }
//   }, [studentCodeInput, activeTask, selectedQuestionIndex, selectedRuntimeLanguage]);

//   // Persistent quiz draft auto-saving module hook
//   useEffect(() => {
//     if (activeQuiz && !quizSubmittedState) {
//       const quizCacheKey = `lms_quiz_cache_${currentUser.username}_${activeQuiz._id}`;
//       localStorage.setItem(quizCacheKey, JSON.stringify(quizUserAnswers));
//     }
//   }, [quizUserAnswers, activeQuiz, quizSubmittedState]);

//   const fetchStudentCourses = async () => {
//     try {
//       const resProfile = await axios.get(`http://localhost:5000/api/user-context/${currentUser.username}`);
//       setAssignedSubjects(resProfile.data.assignedSubjects || []);
//     } catch (err) { console.error(err); }
//   };

//   const fetchSubmissionRecords = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/submissions/${currentUser.username}/${activeSubjectId}`);
//       setSubmissionRecords(res.data);
//     } catch (err) { console.error(err); }
//   };

//   const fetchQuizRecords = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/quiz-submissions/${currentUser.username}/${activeSubjectId}`);
//       setQuizRecords(res.data);
//     } catch (err) { console.error(err); }
//   };

//   const selectedSubject = assignedSubjects.find((s) => s._id === activeSubjectId);

//   // Progress calculations for tasks link blocks
//   const getTaskProgressMetrics = (taskId) => {
//     const match = submissionRecords.find(r => r.taskId === taskId);
//     if (!match) return { percentage: 0, isCompleted: false, scores: {} };
//     const totalQuestionsCount = selectedSubject?.tasks?.find(t => t._id === taskId)?.questions?.length || 1;
//     const completedCount = match.completedQuestions?.length || 0;
//     return {
//       percentage: Math.min(Math.round((completedCount / totalQuestionsCount) * 100), 100),
//       isCompleted: match.isCompleted,
//       scores: match.scores || {}
//     };
//   };

//   const getSubjectTaskCounters = () => {
//     if (!selectedSubject || !selectedSubject.tasks) return { completed: 0, total: 0 };
//     let finished = 0;
//     selectedSubject.tasks.forEach(t => {
//       const match = submissionRecords.find(r => r.taskId === t._id);
//       if (match && match.isCompleted) finished++;
//     });
//     return { completed: finished, total: selectedSubject.tasks.length };
//   };

//   // Helper calculation log for quiz index links
//   const getQuizProgressMetrics = (quizId) => {
//     const record = quizRecords.find(r => r.quizId === quizId);
//     if (record) {
//       return { isCompleted: true, percentage: record.percentage, scoreString: `${record.correctAnswers} / ${record.totalQuestions}` };
//     }
//     return { isCompleted: false, percentage: 0, scoreString: "" };
//   };

//   const loadQuestionRuntimeState = (task, qIdx, lang) => {
//     const question = task.questions[qIdx];
//     if (!question) return;
//     setSelectedQuestionIndex(qIdx);
//     setSelectedRuntimeLanguage(lang);
//     setConsoleOutputLog("");
//     setIsOutputValid(null);

//     const cacheStorageKey = `lms_code_cache_${currentUser.username}_${task._id}_${qIdx}_${lang}`;
//     const persistedCode = localStorage.getItem(cacheStorageKey);
//     if (persistedCode !== null) {
//       setStudentCodeInput(persistedCode);
//     } else {
//       setStudentCodeInput(lang === "python" ? (question.initialPythonCode || "# Enter Python code\n") : (question.initialJavaCode || "public class Main {\n\n}"));
//     }
//   };

//   // Init/Reload specialized state tree vectors for quizzes
//   const launchQuizWorkspace = (quiz) => {
//     setActiveQuiz(quiz);

//     // Check if the database has a record for this quiz
//     const dbRecord = quizRecords.find(r => r.quizId === quiz._id);
//     if (dbRecord) {
//       setQuizUserAnswers(dbRecord.userAnswersArray);
//       setQuizSubmittedState(true);
//       generateQuizFeedbackMessage(dbRecord.percentage, dbRecord.correctAnswers);
//     } else {
//       // Check if local storage has unsubmitted progress
//       const quizCacheKey = `lms_quiz_cache_${currentUser.username}_${quiz._id}`;
//       const savedDraft = localStorage.getItem(quizCacheKey);

//       setQuizUserAnswers(savedDraft ? JSON.parse(savedDraft) : new Array(20).fill(null));
//       setQuizSubmittedState(false);
//       setIsOutputValid(null);
//     }
//   };

//   const handleSelectQuizOption = (qIdx, optIdx) => {
//     if (quizSubmittedState) return;
//     const updated = [...quizUserAnswers];
//     updated[qIdx] = optIdx;
//     setQuizUserAnswers(updated);
//   };

//   const generateQuizFeedbackMessage = (pct, correct) => {
//     let msg = "";
//     if (pct === 100) msg = "🏆 Perfect score! Outstanding — you have mastered Python fundamentals!";
//     else if (pct >= 80) msg = "🎉 Excellent work! You have a strong understanding of Python basics.";
//     else if (pct >= 60) msg = "👍 Good effort! You are on the right track. Revisit the topics you missed.";
//     else if (pct >= 40) msg = "📚 Keep going! There are some gaps to fill. Reread the study material.";
//     else msg = "💪 Don't give up! Go through the material carefully and try again.";

//     setQuizResultsMetadata({ correct, wrong: quizQuestionsPool.length - correct, pct, msg });
//   };

//   const executeQuizEvaluationSubmission = async () => {
//     let correctCount = 0;
//     quizQuestionsPool.forEach((q, i) => {
//       if (quizUserAnswers[i] === q.ans) correctCount++;
//     });

//     const finalPct = Math.round((correctCount / quizQuestionsPool.length) * 100);
//     generateQuizFeedbackMessage(finalPct, correctCount);
//     setQuizSubmittedState(true);

//     try {
//       await axios.post("http://localhost:5000/api/quiz-submissions", {
//         username: currentUser.username,
//         subjectId: activeSubjectId,
//         quizId: activeQuiz._id,
//         correctAnswers: correctCount,
//         totalQuestions: quizQuestionsPool.length,
//         percentage: finalPct,
//         userAnswersArray: quizUserAnswers
//       });

//       // Clear draft cache since it is committed to DB
//       localStorage.removeItem(`lms_quiz_cache_${currentUser.username}_${activeQuiz._id}`);
//       fetchQuizRecords();
//     } catch (err) {
//       console.error("Quiz submission failure:", err);
//     }
//   };

//   const handleResetQuizAttempts = async () => {
//     if (!window.confirm("Are you sure you want to reset your score and re-attempt this quiz?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/quiz-submissions/${currentUser.username}/${activeSubjectId}/${activeQuiz._id}`);
//       localStorage.removeItem(`lms_quiz_cache_${currentUser.username}_${activeQuiz._id}`);

//       setQuizUserAnswers(new Array(20).fill(null));
//       setQuizSubmittedState(false);
//       fetchQuizRecords();
//     } catch (err) { console.error(err); }
//   };

//   const executeSandboxRuntimeEngine = () => {
//     setConsoleOutputLog("Initializing virtual execution pipeline layer...\n");
//     setTimeout(() => {
//       const currentQuestion = activeTask.questions[selectedQuestionIndex];
//       let consoleCapture = "";

//       if (selectedRuntimeLanguage === "python") {
//         if (studentCodeInput.includes("print(")) {
//           const regexExtract = /print\s*\(\s*['"]([^'"]*)['"]\s*\)/g;
//           let matchGroup, lines = [];
//           while ((matchGroup = regexExtract.exec(studentCodeInput)) !== null) lines.push(matchGroup[1]);
//           consoleCapture = lines.join("\n") || "Process executed with no stdout values.";
//         } else consoleCapture = "Error: No output returned to standard stdout stream.";
//       } else if (selectedRuntimeLanguage === "java") {
//         if (studentCodeInput.includes("System.out.println(")) {
//           const regexJavaExtract = /System\.out\.println\s*\(\s*['"]([^'"]*)['"]\s*\)/g;
//           let matchGroup, lines = [];
//           while ((matchGroup = regexJavaExtract.exec(studentCodeInput)) !== null) lines.push(matchGroup[1]);
//           consoleCapture = lines.join("\n") || "Java Process output empty.";
//         } else consoleCapture = "Compilation Error: Missing printing statement pipeline.";
//       }

//       setConsoleOutputLog(consoleCapture);
//       if (consoleCapture.trim() === currentQuestion.expectedOutput.trim()) setIsOutputValid(true);
//       else setIsOutputValid(false);
//     }, 900);
//   };

//   const handleFinalTaskSubmit = async () => {
//     if (!isOutputValid) return;
//     try {
//       await axios.post("http://localhost:5000/api/submissions/submit-question", {
//         username: currentUser.username, subjectId: activeSubjectId, taskId: activeTask._id,
//         questionIndex: selectedQuestionIndex, score: 100, totalQuestions: activeTask.questions.length
//       });
//       alert("Question solution logged and locked securely!");
//       fetchSubmissionRecords();
//     } catch (err) { alert("Submission error."); }
//   };

//   const taskSummary = getSubjectTaskCounters();
//   const answeredQuizCount = quizUserAnswers.filter(a => a !== null).length;

//   return (
//     <div className="dashboard-container">
//       {!sidebarOpen && (
//         <button
//           className="sidebar-toggle-floating"
//           onClick={() => setSidebarOpen(true)}>
//           ☰
//         </button>
//       )}

//       <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
//         <div className="sidebar-header">
//           <span className="sidebar-brand">STUDENT DESK</span>
//           <button
//             style={{
//               background: "none",
//               border: "none",
//               color: "var(--muted)",
//               cursor: "pointer",
//             }}
//             onClick={() => setSidebarOpen(false)}>
//             ✕
//           </button>
//         </div>
//         <div className="sidebar-menu-section">
//           <div className="sidebar-heading">My Registered Subjects</div>
//           {assignedSubjects.map((sub) => (
//             <div
//               key={sub._id}
//               className={`sidebar-item ${activeSubjectId === sub._id ? "active" : ""}`}
//               onClick={() => {
//                 setActiveSubjectId(sub._id);
//                 setActiveTab(null);
//                 setActiveHtmlContent(null);
//                 setActiveTask(null);
//                 setActiveQuiz(null);
//               }}>
//               📚 {sub.name}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="main-viewport">
//         {selectedSubject ? (
//           <div>
//             <div className="hero">
//               <div className="hero-badge">Student Core Engine</div>
//               <h1>{selectedSubject.name}</h1>
//             </div>

//             {/* Hub Category Cards Grid Map Rendering */}
//             {!activeTab && !activeTask && !activeQuiz && (
//               <div className="content-grid-cards">
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--green)" }}
//                   onClick={() => setActiveTab("materials")}>
//                   <div className="interactive-card-icon">📘</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--green)" }}>
//                     Materials
//                   </div>
//                   <div className="interactive-card-desc">
//                     Review your textbooks, outlines, and reference blueprints.
//                   </div>
//                 </div>
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--amber)" }}
//                   onClick={() => setActiveTab("tasks")}>
//                   <div className="interactive-card-icon">📝</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--amber)" }}>
//                     Tasks Runtime
//                   </div>
//                   <div className="interactive-card-desc">
//                     Open the editor workspace to submit programming tasks.
//                   </div>
//                 </div>
//                 <div
//                   className="interactive-card"
//                   style={{ "--accent-color": "var(--pink)" }}
//                   onClick={() => setActiveTab("quizzes")}>
//                   <div className="interactive-card-icon">🎯</div>
//                   <div
//                     className="interactive-card-title"
//                     style={{ color: "var(--pink)" }}>
//                     Quizzes
//                   </div>
//                   <div className="interactive-card-desc">
//                     Complete evaluation metrics and knowledge checks.
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Item Listing Index Layer Map */}
//             {activeTab && !activeHtmlContent && !activeTask && !activeQuiz && (
//               <div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "1.5rem",
//                   }}>
//                   <button
//                     className="action-btn close-view-btn"
//                     style={{ margin: 0 }}
//                     onClick={() => setActiveTab(null)}>
//                     ← Back to Hub
//                   </button>
//                   {activeTab === "tasks" && (
//                     <div
//                       style={{
//                         fontFamily: "JetBrains Mono",
//                         fontSize: "0.85rem",
//                         background: "#0a1628",
//                         border: "1px solid var(--blue)",
//                         padding: "6px 14px",
//                         borderRadius: "20px",
//                         color: "var(--blue)",
//                       }}>
//                       TASKS MASTERED:{" "}
//                       <b style={{ fontSize: "1rem", color: "var(--text)" }}>
//                         {taskSummary.completed}
//                       </b>{" "}
//                       / {taskSummary.total}
//                     </div>
//                   )}
//                 </div>

//                 <h2
//                   style={{
//                     textTransform: "capitalize",
//                     marginBottom: "1.5rem",
//                     fontFamily: "JetBrains Mono",
//                   }}>
//                   Your Assigned {activeTab}
//                 </h2>

//                 {selectedSubject[activeTab]?.length === 0 ? (
//                   <p style={{ color: "var(--muted)" }}>
//                     No entries found in this cluster section index.
//                   </p>
//                 ) : (
//                   selectedSubject[activeTab].map((item, idx) => {
//                     const taskProg =
//                       activeTab === "tasks"
//                         ? getTaskProgressMetrics(item._id)
//                         : null;
//                     const quizProg =
//                       activeTab === "quizzes"
//                         ? getQuizProgressMetrics(item._id)
//                         : null;

//                     return (
//                       <div
//                         key={item._id || idx}
//                         className="item-row-link"
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "stretch",
//                           gap: "10px",
//                         }}
//                         onClick={() => {
//                           if (activeTab === "tasks") {
//                             setActiveTask(item);
//                             loadQuestionRuntimeState(
//                               item,
//                               0,
//                               item.questions[0]?.allowedLanguages[0] ||
//                                 "python",
//                             );
//                           } else if (activeTab === "quizzes") {
//                             launchQuizWorkspace(item);
//                           } else {
//                             setActiveHtmlContent(item.htmlContent);
//                           }
//                         }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             width: "100%",
//                           }}>
//                           <span>
//                             {activeTab === "tasks"
//                               ? taskProg.isCompleted
//                                 ? "✅"
//                                 : "⚡"
//                               : quizProg?.isCompleted
//                                 ? "💯"
//                                 : "⚡"}{" "}
//                             {item.title}
//                           </span>
//                           <span
//                             style={{
//                               color: "var(--blue)",
//                               fontSize: "0.85rem",
//                             }}>
//                             {activeTab === "quizzes" && quizProg?.isCompleted
//                               ? `Completed (${quizProg.scoreString}) →`
//                               : "Launch Workspace →"}
//                           </span>
//                         </div>

//                         {activeTab === "tasks" && (
//                           <div style={{ width: "100%", marginTop: "5px" }}>
//                             <div
//                               style={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 fontSize: "0.72rem",
//                                 fontFamily: "JetBrains Mono",
//                                 color: "var(--muted)",
//                                 marginBottom: "4px",
//                               }}>
//                               <span>PROGRESS METRICS TRACKER</span>
//                               <span
//                                 style={{
//                                   color: taskProg.isCompleted
//                                     ? "var(--green)"
//                                     : "var(--amber)",
//                                 }}>
//                                 {taskProg.percentage}% COMPLETE
//                               </span>
//                             </div>
//                             <div
//                               style={{
//                                 width: "100%",
//                                 height: "6px",
//                                 background: "#0a0f1d",
//                                 borderRadius: "20px",
//                                 overflow: "hidden",
//                                 border: "1px solid var(--border)",
//                               }}>
//                               <div
//                                 style={{
//                                   width: `${taskProg.percentage}%`,
//                                   height: "100%",
//                                   background: taskProg.isCompleted
//                                     ? "linear-gradient(90deg, var(--green), var(--teal))"
//                                     : "linear-gradient(90deg, var(--amber), var(--purple))",
//                                   transition: "width 0.4s ease",
//                                 }}></div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             )}

//             {/* Traditional HTML Viewer for Materials */}
//             {activeHtmlContent && (
//               <div>
//                 <button
//                   className="action-btn close-view-btn"
//                   onClick={() => setActiveHtmlContent(null)}>
//                   ← Close Viewport Document
//                 </button>
//                 <div
//                   className="rendered-html-wrapper"
//                   dangerouslySetInnerHTML={{ __html: activeHtmlContent }}
//                 />
//               </div>
//             )}

//             {/* DYNAMIC INTERACTIVE MULTI-QUESTION COMPILER ENVIRONMENT DESK CONTAINER */}
//             {activeTask && (
//               <div>
//                 <button
//                   className="action-btn close-view-btn"
//                   onClick={() => {
//                     setActiveTask(null);
//                     setActiveTab("tasks");
//                   }}>
//                   ← Exit Code Workspace
//                 </button>
//                 <div
//                   style={{
//                     background: "var(--surface)",
//                     border: "1px solid var(--border)",
//                     padding: "1.5rem",
//                     borderRadius: "12px",
//                     marginBottom: "1.5rem",
//                   }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}>
//                     <div>
//                       <span
//                         className="hero-badge"
//                         style={{
//                           color: getTaskProgressMetrics(activeTask._id)
//                             .isCompleted
//                             ? "var(--green)"
//                             : "var(--amber)",
//                           borderColor: getTaskProgressMetrics(activeTask._id)
//                             .isCompleted
//                             ? "var(--green)"
//                             : "var(--amber)",
//                         }}>
//                         {getTaskProgressMetrics(activeTask._id).isCompleted
//                           ? "Assignment Completed"
//                           : "Task Playground Active"}
//                       </span>
//                       <h2 style={{ marginTop: "0.5rem" }}>
//                         {activeTask.title}
//                       </h2>
//                     </div>

//                     <div style={{ display: "flex", gap: "8px" }}>
//                       {activeTask.questions.map((_, index) => {
//                         const isQuestionDone =
//                           getTaskProgressMetrics(activeTask._id).scores?.[
//                             index.toString()
//                           ] !== undefined;
//                         return (
//                           <button
//                             key={index}
//                             className="action-btn"
//                             style={{
//                               padding: "6px 12px",
//                               background:
//                                 selectedQuestionIndex === index
//                                   ? "var(--amber)"
//                                   : "var(--bg)",
//                               color:
//                                 selectedQuestionIndex === index
//                                   ? "var(--bg)"
//                                   : isQuestionDone
//                                     ? "var(--green)"
//                                     : "var(--text)",
//                               borderColor: isQuestionDone
//                                 ? "var(--green-dim)"
//                                 : "var(--border)",
//                             }}
//                             onClick={() =>
//                               loadQuestionRuntimeState(
//                                 activeTask,
//                                 index,
//                                 activeTask.questions[index]
//                                   .allowedLanguages[0] || "python",
//                               )
//                             }>
//                             Q{index + 1} {isQuestionDone && "✓"}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1.2fr",
//                     gap: "1.5rem",
//                     alignItems: "start",
//                   }}>
//                   <div
//                     className="form-panel"
//                     style={{ margin: 0, minHeight: "450px" }}>
//                     <div
//                       className="form-title"
//                       style={{ color: "var(--blue)" }}>
//                       📋 Challenge Specification Node #
//                       {selectedQuestionIndex + 1}
//                     </div>
//                     <p
//                       style={{
//                         fontSize: "0.95rem",
//                         lineHeight: "1.6",
//                         color: "#c4cfe0",
//                         whiteSpace: "pre-wrap",
//                       }}>
//                       {
//                         activeTask.questions[selectedQuestionIndex]
//                           ?.questionText
//                       }
//                     </p>
//                     <div
//                       style={{
//                         marginTop: "2rem",
//                         paddingTop: "1.5rem",
//                         borderTop: "1px solid var(--border)",
//                       }}>
//                       <span
//                         style={{
//                           fontSize: "0.75rem",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--muted)",
//                           display: "block",
//                           marginBottom: "0.5rem",
//                         }}>
//                         EXPECTED VERIFICATION OUTPUT VERDICT ASSERTION:
//                       </span>
//                       <div
//                         style={{
//                           background: "#090d16",
//                           border: "1px solid var(--border)",
//                           padding: "0.75rem",
//                           borderRadius: "6px",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--green)",
//                           fontSize: "0.85rem",
//                         }}>
//                         {
//                           activeTask.questions[selectedQuestionIndex]
//                             ?.expectedOutput
//                         }
//                       </div>
//                     </div>
//                     <div
//                       style={{
//                         marginTop: "2rem",
//                         paddingTop: "1.5rem",
//                         borderTop: "1px solid var(--border)",
//                       }}>
//                       <span
//                         style={{
//                           fontSize: "0.75rem",
//                           fontFamily: "JetBrains Mono",
//                           color: "var(--muted)",
//                           display: "block",
//                         }}>
//                         RECORDED PERFORMANCE SCORE VERDICT:
//                       </span>
//                       <div
//                         style={{
//                           fontSize: "1.8rem",
//                           fontWeight: "700",
//                           fontFamily: "JetBrains Mono",
//                           color:
//                             getTaskProgressMetrics(activeTask._id).scores?.[
//                               selectedQuestionIndex.toString()
//                             ] !== undefined
//                               ? "var(--green)"
//                               : "var(--muted)",
//                           marginTop: "0.5rem",
//                         }}>
//                         {getTaskProgressMetrics(activeTask._id).scores?.[
//                           selectedQuestionIndex.toString()
//                         ] !== undefined
//                           ? `${getTaskProgressMetrics(activeTask._id).scores[selectedQuestionIndex.toString()]} / 100`
//                           : "PENDING ATTEMPT SUBMISSION"}
//                       </div>
//                     </div>
//                   </div>

//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: "1rem",
//                     }}>
//                     <div
//                       className="form-panel"
//                       style={{ margin: 0, paddingBottom: "1rem" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           marginBottom: "1rem",
//                         }}>
//                         <span className="form-title" style={{ margin: 0 }}>
//                           💻 Source Compiler Frame
//                         </span>
//                         <div
//                           style={{
//                             display: "flex",
//                             gap: "5px",
//                             background: "var(--bg)",
//                             padding: "4px",
//                             borderRadius: "6px",
//                           }}>
//                           {activeTask.questions[
//                             selectedQuestionIndex
//                           ]?.allowedLanguages.map((lang) => (
//                             <button
//                               key={lang}
//                               disabled={
//                                 getTaskProgressMetrics(activeTask._id).scores?.[
//                                   selectedQuestionIndex.toString()
//                                 ] !== undefined
//                               }
//                               style={{
//                                 background:
//                                   selectedRuntimeLanguage === lang
//                                     ? "var(--surface2)"
//                                     : "transparent",
//                                 color:
//                                   selectedRuntimeLanguage === lang
//                                     ? "var(--blue)"
//                                     : "var(--muted)",
//                                 border: "none",
//                                 padding: "4px 10px",
//                                 borderRadius: "4px",
//                                 cursor: "pointer",
//                                 fontFamily: "JetBrains Mono",
//                                 fontSize: "0.75rem",
//                                 textTransform: "uppercase",
//                               }}
//                               onClick={() =>
//                                 loadQuestionRuntimeState(
//                                   activeTask,
//                                   selectedQuestionIndex,
//                                   lang,
//                                 )
//                               }>
//                               {lang}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                       <div
//                         style={{
//                           position: "relative",
//                           background: "#040810",
//                           borderRadius: "8px",
//                           border: "1px solid #1a2535",
//                         }}>
//                         <textarea
//                           disabled={
//                             getTaskProgressMetrics(activeTask._id).scores?.[
//                               selectedQuestionIndex.toString()
//                             ] !== undefined
//                           }
//                           style={{
//                             width: "100%",
//                             minHeight: "260px",
//                             background: "transparent",
//                             border: "none",
//                             outline: "none",
//                             color: "#e2e8f0",
//                             padding: "1rem",
//                             fontFamily: "JetBrains Mono, monospace",
//                             fontSize: "0.85rem",
//                             lineHeight: "1.6",
//                             resize: "vertical",
//                           }}
//                           value={studentCodeInput}
//                           onChange={(e) => setStudentCodeInput(e.target.value)}
//                         />
//                       </div>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "flex-end",
//                           gap: "10px",
//                           marginTop: "1rem",
//                         }}>
//                         <button
//                           disabled={
//                             getTaskProgressMetrics(activeTask._id).scores?.[
//                               selectedQuestionIndex.toString()
//                             ] !== undefined
//                           }
//                           className="action-btn"
//                           style={{
//                             borderColor: "var(--green)",
//                             color: "var(--green)",
//                           }}
//                           onClick={executeSandboxRuntimeEngine}>
//                           ⚡ Run Code Script Assertions
//                         </button>
//                         {isOutputValid &&
//                           getTaskProgressMetrics(activeTask._id).scores?.[
//                             selectedQuestionIndex.toString()
//                           ] === undefined && (
//                             <button
//                               className="action-btn"
//                               style={{
//                                 background: "var(--green)",
//                                 color: "var(--bg)",
//                                 borderColor: "var(--green)",
//                               }}
//                               onClick={handleFinalTaskSubmit}>
//                               💾 Submit Answer & Log Score
//                             </button>
//                           )}
//                       </div>
//                     </div>
//                     <div
//                       className="form-panel"
//                       style={{ margin: 0, background: "#05070b" }}>
//                       <div
//                         className="output-label"
//                         style={{ color: "var(--muted)" }}>
//                         System Output Pipeline Stream
//                       </div>
//                       <div
//                         style={{
//                           minHeight: "100px",
//                           fontFamily: "JetBrains Mono",
//                           fontSize: "0.82rem",
//                           whiteSpace: "pre-wrap",
//                           color: "#6ee7b7",
//                           lineHeight: "1.5",
//                           marginTop: "0.5rem",
//                         }}>
//                         {consoleOutputLog ||
//                           "Terminal awaiting trigger signals..."}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* DYNAMIC REACT INTERACTIVE NATIVE QUIZ ENGINE MODULE VIEWPORT */}
//             {activeQuiz && (
//               <div
//                 className="quiz-wrap"
//                 style={{ minHeight: "auto", padding: 0 }}>
//                 <button
//                   className="action-btn close-view-btn"
//                   onClick={() => {
//                     setActiveQuiz(null);
//                     setActiveTab("quizzes");
//                   }}>
//                   ← Exit Quiz Room
//                 </button>

//                 <div className="quiz-hero">
//                   <div className="quiz-badge">📘 Quiz Session Room</div>
//                   <div className="quiz-title">{activeQuiz.title}</div>
//                   <div className="quiz-sub">
//                     {quizQuestionsPool.length} questions · evaluate
//                     comprehension matrices instantly
//                   </div>
//                 </div>

//                 {!quizSubmittedState && (
//                   <>
//                     <div className="progress-bar-wrap">
//                       <div
//                         className="progress-bar"
//                         style={{
//                           width: `${(answeredQuizCount / quizQuestionsPool.length) * 100}%`,
//                         }}></div>
//                     </div>
//                     <div className="q-counter">
//                       {answeredQuizCount} / {quizQuestionsPool.length} answered
//                     </div>

//                     {quizQuestionsPool.map((q, i) => (
//                       <div
//                         className="q-card"
//                         key={i}
//                         style={{
//                           borderLeft:
//                             quizUserAnswers[i] !== null
//                               ? "3px solid var(--blue)"
//                               : "1px solid var(--border)",
//                         }}>
//                         <div className="q-num">
//                           Question {String(i + 1).padStart(2, "0")}
//                         </div>
//                         <div
//                           className="q-text"
//                           dangerouslySetInnerHTML={{ __html: q.q }}></div>
//                         <div className="options">
//                           {q.opts.map((o, j) => (
//                             <button
//                               key={j}
//                               className={`opt ${quizUserAnswers[i] === j ? "selected" : ""}`}
//                               onClick={() => handleSelectQuizOption(i, j)}>
//                               <div className="opt-circle">
//                                 {String.fromCharCode(64 + 1 + j)}
//                               </div>
//                               <span
//                                 dangerouslySetInnerHTML={{ __html: o }}></span>
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     ))}

//                     <button
//                       className="submit-btn"
//                       style={{
//                         background:
//                           answeredQuizCount === quizQuestionsPool.length
//                             ? "var(--blue)"
//                             : "transparent",
//                       }}
//                       disabled={answeredQuizCount < quizQuestionsPool.length}
//                       onClick={executeQuizEvaluationSubmission}>
//                       Submit Quiz Session to Grading Server →
//                     </button>
//                   </>
//                 )}

//                 {/* POST-SUBMISSION DETAILED SCORECARD PANEL */}
//                 {quizSubmittedState && (
//                   <div className="result-panel" style={{ display: "block" }}>
//                     <div className="result-score">
//                       {quizResultsMetadata.correct} / {quizQuestionsPool.length}
//                     </div>
//                     <div className="result-label">
//                       Verified Performance Score
//                     </div>
//                     <div className="stat-row">
//                       <div className="stat">
//                         <div class="stat-val s-green">
//                           {quizResultsMetadata.correct}
//                         </div>
//                         <div class="stat-lab">Correct</div>
//                       </div>
//                       <div className="stat">
//                         <div class="stat-val s-red">
//                           {quizResultsMetadata.wrong}
//                         </div>
//                         <div class="stat-lab">Wrong</div>
//                       </div>
//                       <div className="stat">
//                         <div class="stat-val s-blue">
//                           {quizResultsMetadata.pct}%
//                         </div>
//                         <div class="stat-lab">Percentage</div>
//                       </div>
//                     </div>
//                     <div className="result-msg">{quizResultsMetadata.msg}</div>

//                     <div className="answer-review">
//                       <div
//                         style={{
//                           fontSize: ".72rem",
//                           color: "#8892a4",
//                           letterSpacing: "1px",
//                           textTransform: "uppercase",
//                           marginBottom: ".8rem",
//                         }}>
//                         Answer Correction Matrix Logs
//                       </div>
//                       {quizQuestionsPool.map((q, i) => {
//                         const ua = quizUserAnswers[i];
//                         const isRight = ua === q.ans;
//                         const strip = (s) => s.replace(/<[^>]+>/g, "");
//                         return (
//                           <div
//                             className={`review-item ${isRight ? "r-correct" : "r-wrong"}`}
//                             key={i}>
//                             <div className="review-q">
//                               Q{i + 1}: {strip(q.q)}
//                             </div>
//                             <div
//                               className={`review-a ${isRight ? "" : "r-wrong"}`}>
//                               Your Selection:{" "}
//                               {ua !== null ? strip(q.opts[ua]) : "Skipped"}
//                             </div>
//                             {!isRight && (
//                               <div className="review-correct-ans">
//                                 ✓ Valid Answer: {strip(q.opts[q.ans])}
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>

//                     <button
//                       className="retry-btn"
//                       onClick={handleResetQuizAttempts}>
//                       ↺ Reset Session & Re-attempt Evaluation
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ) : (
//           <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
//             <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
//             <h2>Welcome to Your LMS Workspace Hub</h2>
//             <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
//               Please select an assigned subject from the side navigation tree
//               structure.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//ab was sm gd

import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal, { useModal } from "./Modal";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";


export default function StudentDashboard({ currentUser, sidebarOpen, setSidebarOpen }) {
  //const [sidebarOpen, setSidebarOpen] = useState(true);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [activeHtmlContent, setActiveHtmlContent] = useState(null);

  // Task Sandbox States
  const [activeTask, setActiveTask] = useState(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedRuntimeLanguage, setSelectedRuntimeLanguage] =
    useState("python");
  const [studentCodeInput, setStudentCodeInput] = useState("");
  const [consoleOutputLog, setConsoleOutputLog] = useState("");
  const [isOutputValid, setIsOutputValid] = useState(null);

  // Added Unified Quiz Component Engine State Structures
  const [activeQuiz, setActiveQuiz] = useState(null);
  //   const [quizUserAnswers, setQuizUserAnswers] = useState(
  //     new Array(20).fill(null),
  //   );
  const [quizUserAnswers, setQuizUserAnswers] = useState([]);
  const [quizSubmittedState, setQuizSubmittedState] = useState(false);
  const [quizResultsMetadata, setQuizResultsMetadata] = useState({
    correct: 0,
    wrong: 0,
    pct: 0,
    msg: "",
  });

  // Persistence Sync Arrays
  const [submissionRecords, setSubmissionRecords] = useState([]);
  const [quizRecords, setQuizRecords] = useState([]);

  const [myProgressData, setMyProgressData] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);

  const { modal, showAlert, showConfirm, close: closeModal } = useModal();

  useEffect(() => {
    fetchStudentCourses();
  }, []);

  useEffect(() => {
    if (activeSubjectId) {
      fetchSubmissionRecords();
      fetchQuizRecords();
    }
  }, [activeSubjectId]);

  useEffect(() => {
    if (activeTab === "__progress__") {
      fetchMyProgress();
    }
  }, [activeTab]);

  // Persistent task code draft auto-saving buffer module
  useEffect(() => {
    if (activeTask) {
      const cacheStorageKey = `lms_code_cache_${currentUser.username}_${activeTask._id}_${selectedQuestionIndex}_${selectedRuntimeLanguage}`;
      localStorage.setItem(cacheStorageKey, studentCodeInput);
    }
  }, [
    studentCodeInput,
    activeTask,
    selectedQuestionIndex,
    selectedRuntimeLanguage,
  ]);

  // Persistent quiz draft auto-saving module hook
  useEffect(() => {
    if (activeQuiz && !quizSubmittedState) {
      const quizCacheKey = `lms_quiz_cache_${currentUser.username}_${activeQuiz._id}`;
      localStorage.setItem(quizCacheKey, JSON.stringify(quizUserAnswers));
    }
  }, [quizUserAnswers, activeQuiz, quizSubmittedState]);

  const fetchStudentCourses = async () => {
    try {
      const resProfile = await axios.get(
        `${API_BASE}/user-context/${currentUser.username}`,
      );
      setAssignedSubjects(resProfile.data.assignedSubjects || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubmissionRecords = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/submissions/${currentUser.username}/${activeSubjectId}`,
      );
      setSubmissionRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuizRecords = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/quiz-submissions/${currentUser.username}/${activeSubjectId}`,
      );
      setQuizRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyProgress = async () => {
    setProgressLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/student-progress`);
      const mine = res.data.find((s) => s.username === currentUser.username);
      setMyProgressData(mine ? mine.subjectProgress : []);
    } catch (err) {
      console.error(err);
    } finally {
      setProgressLoading(false);
    }
  };

  const selectedSubject = assignedSubjects.find(
    (s) => s._id === activeSubjectId,
  );

  // Progress calculations for tasks link blocks
  const getTaskProgressMetrics = (taskId) => {
    const match = submissionRecords.find((r) => r.taskId === taskId);
    if (!match) return { percentage: 0, isCompleted: false, scores: {} };
    const totalQuestionsCount =
      selectedSubject?.tasks?.find((t) => t._id === taskId)?.questions
        ?.length || 1;
    const completedCount = match.completedQuestions?.length || 0;
    return {
      percentage: Math.min(
        Math.round((completedCount / totalQuestionsCount) * 100),
        100,
      ),
      isCompleted: match.isCompleted,
      scores: match.scores || {},
    };
  };

  const getSubjectTaskCounters = () => {
    if (!selectedSubject || !selectedSubject.tasks)
      return { completed: 0, total: 0 };
    let finished = 0;
    selectedSubject.tasks.forEach((t) => {
      const match = submissionRecords.find((r) => r.taskId === t._id);
      if (match && match.isCompleted) finished++;
    });
    return { completed: finished, total: selectedSubject.tasks.length };
  };

  // Quiz progress counters for the subject
  const getSubjectQuizCounters = () => {
    if (!selectedSubject || !selectedSubject.quizzes)
      return { completed: 0, total: 0, avgScore: 0 };
    let finished = 0;
    let totalPct = 0;
    selectedSubject.quizzes.forEach((q) => {
      const record = quizRecords.find((r) => r.quizId === q._id);
      if (record && record.isCompleted) {
        finished++;
        totalPct += record.percentage || 0;
      }
    });
    return {
      completed: finished,
      total: selectedSubject.quizzes.length,
      avgScore: finished > 0 ? Math.round(totalPct / finished) : 0,
    };
  };

  // Helper calculation log for quiz index links
  const getQuizProgressMetrics = (quizId) => {
    const record = quizRecords.find((r) => r.quizId === quizId);
    if (record) {
      return {
        isCompleted: true,
        percentage: record.percentage,
        scoreString: `${record.correctAnswers} / ${record.totalQuestions}`,
        correctAnswers: record.correctAnswers,
        totalQuestions: record.totalQuestions,
      };
    }
    return {
      isCompleted: false,
      percentage: 0,
      scoreString: "",
      correctAnswers: 0,
      totalQuestions: 0,
    };
  };

  const loadQuestionRuntimeState = (task, qIdx, lang) => {
    const question = task.questions[qIdx];
    if (!question) return;
    setSelectedQuestionIndex(qIdx);
    setSelectedRuntimeLanguage(lang);
    setConsoleOutputLog("");
    setIsOutputValid(null);

    const cacheStorageKey = `lms_code_cache_${currentUser.username}_${task._id}_${qIdx}_${lang}`;
    const persistedCode = localStorage.getItem(cacheStorageKey);
    if (persistedCode !== null) {
      setStudentCodeInput(persistedCode);
    } else {
      setStudentCodeInput(
        lang === "python"
          ? question.initialPythonCode || "# Enter Python code\n"
          : question.initialJavaCode || "public class Main {\n\n}",
      );
    }
  };

  // Init/Reload specialized state tree vectors for quizzes
  //   const launchQuizWorkspace = (quiz) => {
  //     setActiveQuiz(quiz);

  //     const dbRecord = quizRecords.find((r) => r.quizId === quiz._id);
  //     if (dbRecord) {
  //       setQuizUserAnswers(dbRecord.userAnswersArray);
  //       setQuizSubmittedState(true);
  //       generateQuizFeedbackMessage(dbRecord.percentage, dbRecord.correctAnswers);
  //     } else {
  //       const quizCacheKey = `lms_quiz_cache_${currentUser.username}_${quiz._id}`;
  //       const savedDraft = localStorage.getItem(quizCacheKey);

  //       setQuizUserAnswers(
  //         savedDraft ? JSON.parse(savedDraft) : new Array(20).fill(null),
  //       );
  //       setQuizSubmittedState(false);
  //       setIsOutputValid(null);
  //     }
  //   };

  const launchQuizWorkspace = (quiz) => {
    setActiveQuiz(quiz);
    const qCount = (quiz.questions || []).length;

    const dbRecord = quizRecords.find((r) => r.quizId === quiz._id);
    if (dbRecord) {
      setQuizUserAnswers(dbRecord.userAnswersArray);
      setQuizSubmittedState(true);
      generateQuizFeedbackMessage(
        dbRecord.percentage,
        dbRecord.correctAnswers,
        quiz.questions,
      );
    } else {
      const quizCacheKey = `lms_quiz_cache_${currentUser.username}_${quiz._id}`;
      const savedDraft = localStorage.getItem(quizCacheKey);
      setQuizUserAnswers(
        savedDraft ? JSON.parse(savedDraft) : new Array(qCount).fill(null),
      );
      setQuizSubmittedState(false);
      setIsOutputValid(null);
    }
  };

  const handleSelectQuizOption = (qIdx, optIdx) => {
    if (quizSubmittedState) return;
    const updated = [...quizUserAnswers];
    updated[qIdx] = optIdx;
    setQuizUserAnswers(updated);
  };

  //   const generateQuizFeedbackMessage = (pct, correct) => {
  //     let msg = "";
  //     if (pct === 100)
  //       msg =
  //         "🏆 Perfect score! Outstanding — you have mastered Python fundamentals!";
  //     else if (pct >= 80)
  //       msg =
  //         "🎉 Excellent work! You have a strong understanding of Python basics.";
  //     else if (pct >= 60)
  //       msg =
  //         "👍 Good effort! You are on the right track. Revisit the topics you missed.";
  //     else if (pct >= 40)
  //       msg =
  //         "📚 Keep going! There are some gaps to fill. Reread the study material.";
  //     else
  //       msg =
  //         "💪 Don't give up! Go through the material carefully and try again.";

  //     setQuizResultsMetadata({
  //       correct,
  //       wrong: quizQuestionsPool.length - correct,
  //       pct,
  //       msg,
  //     });
  //   };

  const generateQuizFeedbackMessage = (pct, correct, questions) => {
    const total = (questions || activeQuiz?.questions || []).length;
    let msg = "";
    if (pct === 100)
      msg = "🏆 Perfect score! Outstanding — you have mastered this topic!";
    else if (pct >= 80)
      msg = "🎉 Excellent work! You have a strong understanding.";
    else if (pct >= 60) msg = "👍 Good effort! Revisit the topics you missed.";
    else if (pct >= 40) msg = "📚 Keep going! Reread the study material.";
    else
      msg =
        "💪 Don't give up! Go through the material carefully and try again.";
    setQuizResultsMetadata({ correct, wrong: total - correct, pct, msg });
  };

  //   const executeQuizEvaluationSubmission = async () => {
  //     let correctCount = 0;
  //     quizQuestionsPool.forEach((q, i) => {
  //       if (quizUserAnswers[i] === q.ans) correctCount++;
  //     });

  //     const finalPct = Math.round(
  //       (correctCount / quizQuestionsPool.length) * 100,
  //     );
  //     generateQuizFeedbackMessage(finalPct, correctCount);
  //     setQuizSubmittedState(true);

  //     try {
  //       await axios.post("http://localhost:5000/api/quiz-submissions", {
  //         username: currentUser.username,
  //         subjectId: activeSubjectId,
  //         quizId: activeQuiz._id,
  //         correctAnswers: correctCount,
  //         totalQuestions: quizQuestionsPool.length,
  //         percentage: finalPct,
  //         userAnswersArray: quizUserAnswers,
  //       });

  //       localStorage.removeItem(
  //         `lms_quiz_cache_${currentUser.username}_${activeQuiz._id}`,
  //       );
  //       fetchQuizRecords();
  //     } catch (err) {
  //       console.error("Quiz submission failure:", err);
  //     }
  //   };

  const executeQuizEvaluationSubmission = async () => {
    const questions = activeQuiz.questions || [];
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (quizUserAnswers[i] === q.correctIndex) correctCount++;
    });
    const finalPct = Math.round((correctCount / questions.length) * 100);
    generateQuizFeedbackMessage(finalPct, correctCount, questions);
    setQuizSubmittedState(true);

    try {
      await axios.post(`${API_BASE}/quiz-submissions`, {
        username: currentUser.username,
        subjectId: activeSubjectId,
        quizId: activeQuiz._id,
        correctAnswers: correctCount,
        totalQuestions: questions.length,
        percentage: finalPct,
        userAnswersArray: quizUserAnswers,
      });
      localStorage.removeItem(
        `lms_quiz_cache_${currentUser.username}_${activeQuiz._id}`,
      );
      fetchQuizRecords();
    } catch (err) {
      console.error("Quiz submission failure:", err);
    }
  };

  //   const handleResetQuizAttempts = async () => {
  //     if (
  //       !window.confirm(
  //         "Are you sure you want to reset your score and re-attempt this quiz?",
  //       )
  //     )
  //       return;
  //     try {
  //       await axios.delete(
  //         `http://localhost:5000/api/quiz-submissions/${currentUser.username}/${activeSubjectId}/${activeQuiz._id}`,
  //       );
  //       localStorage.removeItem(
  //         `lms_quiz_cache_${currentUser.username}_${activeQuiz._id}`,
  //       );

  //       setQuizUserAnswers(new Array(20).fill(null));
  //       setQuizSubmittedState(false);
  //       fetchQuizRecords();
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  const handleResetQuizAttempts = async () => {
    //   if (
    //     !window.confirm(
    //       "Are you sure you want to reset your score and re-attempt this quiz?",
    //     )
    //   )
    //     return;
    const confirmed = await showConfirm(
      "Reset Quiz",
      "Are you sure you want to reset your score and re-attempt this quiz?",
      "warning",
    );
    if (!confirmed) return;
    try {
      await axios.delete(
        `${API_BASE}/quiz-submissions/${currentUser.username}/${activeSubjectId}/${activeQuiz._id}`,
      );
      localStorage.removeItem(
        `lms_quiz_cache_${currentUser.username}_${activeQuiz._id}`,
      );
      setQuizUserAnswers(
        new Array((activeQuiz.questions || []).length).fill(null),
      );
      setQuizSubmittedState(false);
      fetchQuizRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const executeSandboxRuntimeEngine = () => {
    setConsoleOutputLog("Initializing virtual execution pipeline layer...\n");
    setTimeout(() => {
      const currentQuestion = activeTask.questions[selectedQuestionIndex];
      let consoleCapture = "";

      if (selectedRuntimeLanguage === "python") {
        if (studentCodeInput.includes("print(")) {
          const regexExtract = /print\s*\(\s*['"]([^'"]*)['"]\s*\)/g;
          let matchGroup,
            lines = [];
          while ((matchGroup = regexExtract.exec(studentCodeInput)) !== null)
            lines.push(matchGroup[1]);
          consoleCapture =
            lines.join("\n") || "Process executed with no stdout values.";
        } else
          consoleCapture =
            "Error: No output returned to standard stdout stream.";
      } else if (selectedRuntimeLanguage === "java") {
        if (studentCodeInput.includes("System.out.println(")) {
          const regexJavaExtract =
            /System\.out\.println\s*\(\s*['"]([^'"]*)['"]\s*\)/g;
          let matchGroup,
            lines = [];
          while (
            (matchGroup = regexJavaExtract.exec(studentCodeInput)) !== null
          )
            lines.push(matchGroup[1]);
          consoleCapture = lines.join("\n") || "Java Process output empty.";
        } else
          consoleCapture =
            "Compilation Error: Missing printing statement pipeline.";
      }

      setConsoleOutputLog(consoleCapture);
      if (consoleCapture.trim() === currentQuestion.expectedOutput.trim())
        setIsOutputValid(true);
      else setIsOutputValid(false);
    }, 900);
  };

  const handleFinalTaskSubmit = async () => {
    if (!isOutputValid) return;
    try {
      await axios.post(`${API_BASE}/submissions/submit-question`, {
        username: currentUser.username,
        subjectId: activeSubjectId,
        taskId: activeTask._id,
        questionIndex: selectedQuestionIndex,
        score: 100,
        totalQuestions: activeTask.questions.length,
      });
      //   alert("Question solution logged and locked securely!");
      await showAlert(
        "Submitted!",
        "Question solution logged and locked securely!",
        "success",
      );

      fetchSubmissionRecords();
    } catch (err) {
      //   alert("Submission error.");
      await showAlert(
        "Error",
        "Submission failed. Please try again.",
        "danger",
      );
    }
  };

  const taskSummary = getSubjectTaskCounters();
  const quizSummary = getSubjectQuizCounters();
  //   const answeredQuizCount = quizUserAnswers.filter((a) => a !== null).length;
  const answeredQuizCount = quizUserAnswers.filter((a) => a !== null).length;
  const activeQuizQuestions = activeQuiz?.questions || [];


  const renderMyProgress = () => {
    if (progressLoading)
      return (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "JetBrains Mono",
          }}>
          Loading your progress...
        </div>
      );

    const totalTasks = myProgressData.reduce(
      (a, s) => a + s.summary.totalTasks,
      0,
    );
    const completedTasks = myProgressData.reduce(
      (a, s) => a + s.summary.completedTasks,
      0,
    );
    const totalQuizzes = myProgressData.reduce(
      (a, s) => a + s.summary.totalQuizzes,
      0,
    );
    const completedQuizzes = myProgressData.reduce(
      (a, s) => a + s.summary.completedQuizzes,
      0,
    );
    const quizAvg = myProgressData
      .filter((s) => s.summary.completedQuizzes > 0)
      .reduce((a, s, _, arr) => a + s.summary.quizAvgScore / arr.length, 0);

    const barColors = [
      "var(--blue)",
      "var(--purple)",
      "var(--pink)",
      "var(--amber)",
      "var(--green)",
      "var(--teal)",
    ];
    const getColor = (pct) =>
      pct >= 80 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "#ef4444";

    return (
      <div>
        <div className="hero">
          <div className="hero-badge">My Analytics</div>
          <h1>📊 My Progress</h1>
        </div>

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}>
          {[
            {
              label: "Tasks Done",
              value: `${completedTasks}/${totalTasks}`,
              color: "var(--blue)",
              pct: totalTasks
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0,
            },
            {
              label: "Quizzes Done",
              value: `${completedQuizzes}/${totalQuizzes}`,
              color: "var(--pink)",
              pct: totalQuizzes
                ? Math.round((completedQuizzes / totalQuizzes) * 100)
                : 0,
            },
            {
              label: "Quiz Avg",
              value: `${Math.round(quizAvg)}%`,
              color: getColor(quizAvg),
              pct: Math.round(quizAvg),
            },
            {
              label: "Subjects",
              value: myProgressData.length,
              color: "var(--purple)",
              pct: 100,
            },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: `1px solid ${card.color}33`,
                borderRadius: "12px",
                padding: "1.25rem",
              }}>
              <div
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: "1.6rem",
                  fontWeight: "700",
                  color: card.color,
                }}>
                {card.value}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--muted)",
                  fontFamily: "JetBrains Mono",
                  margin: "4px 0 10px",
                }}>
                {card.label}
              </div>
              <div
                style={{
                  height: "4px",
                  background: "#0a0f1d",
                  borderRadius: "20px",
                }}>
                <div
                  style={{
                    width: `${card.pct}%`,
                    height: "100%",
                    background: card.color,
                    borderRadius: "20px",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        {myProgressData.some((s) => s.summary.completedQuizzes > 0) && (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "2rem",
            }}>
            <div
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: "0.72rem",
                color: "var(--muted)",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}>
              📈 Quiz Average by Subject
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "12px",
                height: "140px",
              }}>
              {myProgressData
                .filter((s) => s.summary.completedQuizzes > 0)
                .map((s, i) => {
                  const pct = s.summary.quizAvgScore;
                  const color = barColors[i % barColors.length];
                  return (
                    <div
                      key={s.subjectId}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%",
                        justifyContent: "flex-end",
                        gap: "6px",
                      }}>
                      <div
                        style={{
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.72rem",
                          color,
                        }}>
                        {pct}%
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: `${pct}%`,
                          background: `linear-gradient(180deg, ${color}, ${color}55)`,
                          borderRadius: "6px 6px 0 0",
                          border: `1px solid ${color}`,
                          minHeight: "4px",
                        }}
                      />
                      <div
                        style={{
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.62rem",
                          color: "var(--muted)",
                          textAlign: "center",
                        }}>
                        {s.subjectName.length > 12
                          ? s.subjectName.slice(0, 12) + "…"
                          : s.subjectName}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Per-subject breakdown */}
        {myProgressData.map((subj, si) => (
          <div key={subj.subjectId} style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: "0.72rem",
                color: barColors[si % barColors.length],
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}>
              📚 {subj.subjectName}
            </div>

            {subj.taskProgress.length > 0 && (
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  marginBottom: "1rem",
                }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "JetBrains Mono",
                    fontSize: "0.78rem",
                  }}>
                  <thead>
                    <tr
                      style={{
                        background: "#0a1628",
                        borderBottom: "1px solid var(--border)",
                      }}>
                      {[
                        "Task",
                        "Progress",
                        "Questions",
                        "Avg Score",
                        "Status",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 14px",
                            textAlign: "left",
                            color: "var(--muted)",
                            fontWeight: "600",
                            fontSize: "0.65rem",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                          }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subj.taskProgress.map((task, ti) => (
                      <tr
                        key={task.taskId}
                        style={{
                          borderBottom:
                            ti < subj.taskProgress.length - 1
                              ? "1px solid var(--border)"
                              : "none",
                          background:
                            ti % 2 === 0 ? "transparent" : "#ffffff05",
                        }}>
                        <td
                          style={{
                            padding: "10px 14px",
                            color: "var(--text)",
                            fontWeight: "600",
                          }}>
                          {task.title}
                        </td>
                        <td style={{ padding: "10px 14px", minWidth: "120px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}>
                            <div
                              style={{
                                flex: 1,
                                height: "6px",
                                background: "#0a0f1d",
                                borderRadius: "20px",
                                overflow: "hidden",
                              }}>
                              <div
                                style={{
                                  width: `${task.percentage}%`,
                                  height: "100%",
                                  background: task.isCompleted
                                    ? "var(--green)"
                                    : "var(--amber)",
                                  borderRadius: "20px",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                color: "var(--muted)",
                                fontSize: "0.68rem",
                              }}>
                              {task.percentage}%
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            color: "var(--blue)",
                          }}>
                          {task.completedQuestions}/{task.totalQuestions}
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          {task.avgScore > 0 ? (
                            <span
                              style={{
                                color: getColor(task.avgScore),
                                fontWeight: "700",
                              }}>
                              {task.avgScore}/100
                            </span>
                          ) : (
                            <span style={{ color: "var(--muted)" }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span
                            style={{
                              padding: "3px 10px",
                              borderRadius: "20px",
                              fontSize: "0.68rem",
                              fontWeight: "700",
                              background: task.isCompleted
                                ? "#052e16"
                                : "#1c1002",
                              color: task.isCompleted
                                ? "var(--green)"
                                : "var(--amber)",
                              border: `1px solid ${task.isCompleted ? "var(--green)" : "var(--amber)"}`,
                            }}>
                            {task.isCompleted ? "✓ DONE" : "IN PROGRESS"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {subj.quizProgress.length > 0 && (
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "JetBrains Mono",
                    fontSize: "0.78rem",
                  }}>
                  <thead>
                    <tr
                      style={{
                        background: "#1f0214",
                        borderBottom: "1px solid var(--border)",
                      }}>
                      {["Quiz", "Score", "Percentage", "Status"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 14px",
                            textAlign: "left",
                            color: "var(--muted)",
                            fontWeight: "600",
                            fontSize: "0.65rem",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                          }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subj.quizProgress.map((quiz, qi) => (
                      <tr
                        key={quiz.quizId}
                        style={{
                          borderBottom:
                            qi < subj.quizProgress.length - 1
                              ? "1px solid var(--border)"
                              : "none",
                          background:
                            qi % 2 === 0 ? "transparent" : "#ffffff05",
                        }}>
                        <td
                          style={{
                            padding: "10px 14px",
                            color: "var(--text)",
                            fontWeight: "600",
                          }}>
                          {quiz.title}
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            color: quiz.isCompleted
                              ? "var(--text)"
                              : "var(--muted)",
                          }}>
                          {quiz.isCompleted ? quiz.scoreString : "—"}
                        </td>
                        <td style={{ padding: "10px 14px", minWidth: "140px" }}>
                          {quiz.isCompleted ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}>
                              <div
                                style={{
                                  flex: 1,
                                  height: "6px",
                                  background: "#0a0f1d",
                                  borderRadius: "20px",
                                  overflow: "hidden",
                                }}>
                                <div
                                  style={{
                                    width: `${quiz.percentage}%`,
                                    height: "100%",
                                    background: getColor(quiz.percentage),
                                    borderRadius: "20px",
                                  }}
                                />
                              </div>
                              <span
                                style={{
                                  color: getColor(quiz.percentage),
                                  fontWeight: "700",
                                  fontSize: "0.72rem",
                                }}>
                                {quiz.percentage}%
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: "var(--muted)" }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span
                            style={{
                              padding: "3px 10px",
                              borderRadius: "20px",
                              fontSize: "0.68rem",
                              fontWeight: "700",
                              background: quiz.isCompleted
                                ? "#052e16"
                                : "#0a0f1d",
                              color: quiz.isCompleted
                                ? getColor(quiz.percentage)
                                : "var(--muted)",
                              border: `1px solid ${quiz.isCompleted ? getColor(quiz.percentage) : "var(--border)"}`,
                            }}>
                            {quiz.isCompleted
                              ? `✓ ${quiz.percentage >= 80 ? "GREAT" : quiz.percentage >= 50 ? "PASS" : "WEAK"}`
                              : "NOT ATTEMPTED"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {subj.taskProgress.length === 0 &&
              subj.quizProgress.length === 0 && (
                <div
                  style={{
                    padding: "1rem",
                    color: "var(--muted)",
                    fontFamily: "JetBrains Mono",
                    fontSize: "0.8rem",
                  }}>
                  No activity yet.
                </div>
              )}
          </div>
        ))}

        {myProgressData.length === 0 && !progressLoading && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              color: "var(--muted)",
              fontFamily: "JetBrains Mono",
              fontSize: "0.85rem",
            }}>
            No progress data yet. Start completing tasks and quizzes!
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* {!sidebarOpen && (
        <button
          className="sidebar-toggle-floating"
          onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
      )} */}

      {/* <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <span className="sidebar-brand">STUDENT DESK</span>
          <button
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
            }}
            onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>
        <div className="sidebar-menu-section">
          <div className="sidebar-heading">My Registered Subjects</div>
          {assignedSubjects.map((sub) => (
            <div
              key={sub._id}
              className={`sidebar-item ${activeSubjectId === sub._id ? "active" : ""}`}
              onClick={() => {
                setActiveSubjectId(sub._id);
                setActiveTab(null);
                setActiveHtmlContent(null);
                setActiveTask(null);
                setActiveQuiz(null);
              }}>
              📚 {sub.name}
            </div>
          ))}
        </div>
      </div> */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        {/* Header */}
        <div className="sidebar-header">
          <span className="sidebar-brand">⬡ STUDENT DESK</span>
          {/* <button
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              fontSize: "1rem",
            }}
            onClick={() => setSidebarOpen(false)}>
            ✕
          </button> */}
        </div>

        {/* User Profile Block */}
        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            {currentUser.username[0].toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div className="sidebar-username">{currentUser.username}</div>
            <span className="sidebar-role-badge sidebar-role-student">
              student
            </span>
          </div>
        </div>

        {/* Nav */}
        <div className="sidebar-menu-section">
          <div className="sidebar-heading">My Subjects</div>
          {assignedSubjects.length === 0 ? (
            <div
              style={{
                padding: "1rem 1.5rem",
                fontSize: "0.78rem",
                color: "var(--muted)",
                fontFamily: "JetBrains Mono",
                fontStyle: "italic",
              }}>
              No subjects assigned yet.
            </div>
          ) : (
            assignedSubjects.map((sub) => (
              <div
                key={sub._id}
                className={`sidebar-item ${activeSubjectId === sub._id ? "active" : ""}`}
                onClick={() => {
                  setActiveSubjectId(sub._id);
                  setActiveTab(null);
                  setActiveHtmlContent(null);
                  setActiveTask(null);
                  setActiveQuiz(null);
                }}>
                <span className="sidebar-subject-dot"></span>
                {sub.name}
              </div>
            ))
          )}
        </div>
        <div className="sidebar-heading">My Progress</div>
        <div
          className={`sidebar-item ${activeTab === "__progress__" ? "active" : ""}`}
          onClick={() => {
            setActiveSubjectId(null);
            setActiveTab("__progress__");
            setActiveHtmlContent(null);
            setActiveTask(null);
            setActiveQuiz(null);
          }}>
          <span style={{ fontSize: "1rem" }}>📊</span> My Progress
        </div>

        <div className="sidebar-footer">
          <span>●</span> LMS ENGINE v2.0
        </div>
      </div>

      <div
        className="main-viewport"
        style={{ marginLeft: sidebarOpen ? "280px" : "0px" }}>
        {activeTab === "__progress__" && !activeSubjectId && renderMyProgress()}
        {selectedSubject ? (
          <div>
            <div className="hero">
              <div className="hero-badge">Student Core Engine</div>
              <h1>{selectedSubject.name}</h1>
            </div>

            {/* Hub Category Cards Grid Map Rendering */}
            {!activeTab && !activeTask && !activeQuiz && (
              <div className="content-grid-cards">
                <div
                  className="interactive-card"
                  style={{ "--accent-color": "var(--green)" }}
                  onClick={() => setActiveTab("materials")}>
                  <div className="interactive-card-icon">📘</div>
                  <div
                    className="interactive-card-title"
                    style={{ color: "var(--green)" }}>
                    Materials
                  </div>
                  <div className="interactive-card-desc">
                    Review your textbooks, outlines, and reference blueprints.
                  </div>
                </div>
                <div
                  className="interactive-card"
                  style={{ "--accent-color": "var(--amber)" }}
                  onClick={() => setActiveTab("tasks")}>
                  <div className="interactive-card-icon">📝</div>
                  <div
                    className="interactive-card-title"
                    style={{ color: "var(--amber)" }}>
                    Tasks Runtime
                  </div>
                  <div className="interactive-card-desc">
                    Open the editor workspace to submit programming tasks.
                  </div>
                </div>
                <div
                  className="interactive-card"
                  style={{ "--accent-color": "var(--pink)" }}
                  onClick={() => setActiveTab("quizzes")}>
                  <div className="interactive-card-icon">🎯</div>
                  <div
                    className="interactive-card-title"
                    style={{ color: "var(--pink)" }}>
                    Quizzes
                  </div>
                  <div className="interactive-card-desc">
                    Complete evaluation metrics and knowledge checks.
                  </div>
                </div>
              </div>
            )}

            {/* Item Listing Index Layer Map */}
            {activeTab && !activeHtmlContent && !activeTask && !activeQuiz && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}>
                  <button
                    className="action-btn close-view-btn"
                    style={{ margin: 0 }}
                    onClick={() => setActiveTab(null)}>
                    ← Back to Hub
                  </button>

                  {/* Task mastery counter */}
                  {activeTab === "tasks" && (
                    <div
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.85rem",
                        background: "#0a1628",
                        border: "1px solid var(--blue)",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        color: "var(--blue)",
                      }}>
                      TASKS MASTERED:{" "}
                      <b style={{ fontSize: "1rem", color: "var(--text)" }}>
                        {taskSummary.completed}
                      </b>{" "}
                      / {taskSummary.total}
                    </div>
                  )}

                  {/* Quiz mastery counter */}
                  {activeTab === "quizzes" && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <div
                        style={{
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.85rem",
                          background: "#1a0a28",
                          border: "1px solid var(--pink)",
                          padding: "6px 14px",
                          borderRadius: "20px",
                          color: "var(--pink)",
                        }}>
                        QUIZZES DONE:{" "}
                        <b style={{ fontSize: "1rem", color: "var(--text)" }}>
                          {quizSummary.completed}
                        </b>{" "}
                        / {quizSummary.total}
                      </div>
                      {quizSummary.completed > 0 && (
                        <div
                          style={{
                            fontFamily: "JetBrains Mono",
                            fontSize: "0.85rem",
                            background: "#0a1a0a",
                            border: "1px solid var(--green)",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            color: "var(--green)",
                          }}>
                          AVG SCORE:{" "}
                          <b style={{ fontSize: "1rem", color: "var(--text)" }}>
                            {quizSummary.avgScore}%
                          </b>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <h2
                  style={{
                    textTransform: "capitalize",
                    marginBottom: "1.5rem",
                    fontFamily: "JetBrains Mono",
                  }}>
                  Your Assigned {activeTab}
                </h2>

                {selectedSubject[activeTab]?.length === 0 ? (
                  <p style={{ color: "var(--muted)" }}>
                    No entries found in this cluster section index.
                  </p>
                ) : (
                  selectedSubject[activeTab].map((item, idx) => {
                    const taskProg =
                      activeTab === "tasks"
                        ? getTaskProgressMetrics(item._id)
                        : null;
                    const quizProg =
                      activeTab === "quizzes"
                        ? getQuizProgressMetrics(item._id)
                        : null;

                    return (
                      <div
                        key={item._id || idx}
                        className="item-row-link"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                          gap: "10px",
                        }}
                        onClick={() => {
                          if (activeTab === "tasks") {
                            setActiveTask(item);
                            loadQuestionRuntimeState(
                              item,
                              0,
                              item.questions[0]?.allowedLanguages[0] ||
                                "python",
                            );
                          } else if (activeTab === "quizzes") {
                            launchQuizWorkspace(item);
                          } else {
                            setActiveHtmlContent(item.htmlContent);
                          }
                        }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}>
                          <span>
                            {activeTab === "tasks"
                              ? taskProg.isCompleted
                                ? "✅"
                                : "⚡"
                              : quizProg?.isCompleted
                                ? "💯"
                                : "⚡"}{" "}
                            {item.title}
                          </span>
                          <span
                            style={{
                              color: "var(--blue)",
                              fontSize: "0.85rem",
                            }}>
                            {activeTab === "quizzes" && quizProg?.isCompleted
                              ? `Completed (${quizProg.scoreString}) →`
                              : "Launch Workspace →"}
                          </span>
                        </div>

                        {/* Task progress bar */}
                        {activeTab === "tasks" && (
                          <div style={{ width: "100%", marginTop: "5px" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "0.72rem",
                                fontFamily: "JetBrains Mono",
                                color: "var(--muted)",
                                marginBottom: "4px",
                              }}>
                              <span>PROGRESS METRICS TRACKER</span>
                              <span
                                style={{
                                  color: taskProg.isCompleted
                                    ? "var(--green)"
                                    : "var(--amber)",
                                }}>
                                {taskProg.percentage}% COMPLETE
                              </span>
                            </div>
                            <div
                              style={{
                                width: "100%",
                                height: "6px",
                                background: "#0a0f1d",
                                borderRadius: "20px",
                                overflow: "hidden",
                                border: "1px solid var(--border)",
                              }}>
                              <div
                                style={{
                                  width: `${taskProg.percentage}%`,
                                  height: "100%",
                                  background: taskProg.isCompleted
                                    ? "linear-gradient(90deg, var(--green), var(--teal))"
                                    : "linear-gradient(90deg, var(--amber), var(--purple))",
                                  transition: "width 0.4s ease",
                                }}></div>
                            </div>
                          </div>
                        )}

                        {/* Quiz progress bar */}
                        {activeTab === "quizzes" && (
                          <div style={{ width: "100%", marginTop: "5px" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "0.72rem",
                                fontFamily: "JetBrains Mono",
                                color: "var(--muted)",
                                marginBottom: "4px",
                              }}>
                              <span>QUIZ PERFORMANCE TRACKER</span>
                              <span
                                style={{
                                  color: quizProg.isCompleted
                                    ? "var(--green)"
                                    : "var(--muted)",
                                }}>
                                {quizProg.isCompleted
                                  ? `SCORE: ${quizProg.percentage}%`
                                  : "NOT ATTEMPTED"}
                              </span>
                            </div>
                            <div
                              style={{
                                width: "100%",
                                height: "6px",
                                background: "#0a0f1d",
                                borderRadius: "20px",
                                overflow: "hidden",
                                border: "1px solid var(--border)",
                              }}>
                              <div
                                style={{
                                  width: `${quizProg.percentage}%`,
                                  height: "100%",
                                  background: quizProg.isCompleted
                                    ? quizProg.percentage >= 80
                                      ? "linear-gradient(90deg, var(--green), var(--teal))"
                                      : quizProg.percentage >= 50
                                        ? "linear-gradient(90deg, var(--amber), var(--pink))"
                                        : "linear-gradient(90deg, #ef4444, var(--pink))"
                                    : "transparent",
                                  transition: "width 0.4s ease",
                                }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Traditional HTML Viewer for Materials */}
            {activeHtmlContent && (
              <div>
                <button
                  className="action-btn close-view-btn"
                  onClick={() => setActiveHtmlContent(null)}>
                  ← Close Viewport Document
                </button>
                <div
                  className="rendered-html-wrapper"
                  dangerouslySetInnerHTML={{ __html: activeHtmlContent }}
                />
              </div>
            )}

            {/* DYNAMIC INTERACTIVE MULTI-QUESTION COMPILER ENVIRONMENT DESK CONTAINER */}
            {activeTask && (
              <div>
                <button
                  className="action-btn close-view-btn"
                  onClick={() => {
                    setActiveTask(null);
                    setActiveTab("tasks");
                  }}>
                  ← Exit Code Workspace
                </button>
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    marginBottom: "1.5rem",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <div>
                      <span
                        className="hero-badge"
                        style={{
                          color: getTaskProgressMetrics(activeTask._id)
                            .isCompleted
                            ? "var(--green)"
                            : "var(--amber)",
                          borderColor: getTaskProgressMetrics(activeTask._id)
                            .isCompleted
                            ? "var(--green)"
                            : "var(--amber)",
                        }}>
                        {getTaskProgressMetrics(activeTask._id).isCompleted
                          ? "Assignment Completed"
                          : "Task Playground Active"}
                      </span>
                      <h2 style={{ marginTop: "0.5rem" }}>
                        {activeTask.title}
                      </h2>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      {activeTask.questions.map((_, index) => {
                        const isQuestionDone =
                          getTaskProgressMetrics(activeTask._id).scores?.[
                            index.toString()
                          ] !== undefined;
                        return (
                          <button
                            key={index}
                            className="action-btn"
                            style={{
                              padding: "6px 12px",
                              background:
                                selectedQuestionIndex === index
                                  ? "var(--amber)"
                                  : "var(--bg)",
                              color:
                                selectedQuestionIndex === index
                                  ? "var(--bg)"
                                  : isQuestionDone
                                    ? "var(--green)"
                                    : "var(--text)",
                              borderColor: isQuestionDone
                                ? "var(--green-dim)"
                                : "var(--border)",
                            }}
                            onClick={() =>
                              loadQuestionRuntimeState(
                                activeTask,
                                index,
                                activeTask.questions[index]
                                  .allowedLanguages[0] || "python",
                              )
                            }>
                            Q{index + 1} {isQuestionDone && "✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.2fr",
                    gap: "1.5rem",
                    alignItems: "start",
                  }}>
                  <div
                    className="form-panel"
                    style={{ margin: 0, minHeight: "450px" }}>
                    <div
                      className="form-title"
                      style={{ color: "var(--blue)" }}>
                      📋 Challenge Specification Node #
                      {selectedQuestionIndex + 1}
                    </div>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: "1.6",
                        color: "#c4cfe0",
                        whiteSpace: "pre-wrap",
                      }}>
                      {
                        activeTask.questions[selectedQuestionIndex]
                          ?.questionText
                      }
                    </p>
                    <div
                      style={{
                        marginTop: "2rem",
                        paddingTop: "1.5rem",
                        borderTop: "1px solid var(--border)",
                      }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontFamily: "JetBrains Mono",
                          color: "var(--muted)",
                          display: "block",
                          marginBottom: "0.5rem",
                        }}>
                        EXPECTED VERIFICATION OUTPUT VERDICT ASSERTION:
                      </span>
                      <div
                        style={{
                          background: "#090d16",
                          border: "1px solid var(--border)",
                          padding: "0.75rem",
                          borderRadius: "6px",
                          fontFamily: "JetBrains Mono",
                          color: "var(--green)",
                          fontSize: "0.85rem",
                        }}>
                        {
                          activeTask.questions[selectedQuestionIndex]
                            ?.expectedOutput
                        }
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: "2rem",
                        paddingTop: "1.5rem",
                        borderTop: "1px solid var(--border)",
                      }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontFamily: "JetBrains Mono",
                          color: "var(--muted)",
                          display: "block",
                        }}>
                        RECORDED PERFORMANCE SCORE VERDICT:
                      </span>
                      <div
                        style={{
                          fontSize: "1.8rem",
                          fontWeight: "700",
                          fontFamily: "JetBrains Mono",
                          color:
                            getTaskProgressMetrics(activeTask._id).scores?.[
                              selectedQuestionIndex.toString()
                            ] !== undefined
                              ? "var(--green)"
                              : "var(--muted)",
                          marginTop: "0.5rem",
                        }}>
                        {getTaskProgressMetrics(activeTask._id).scores?.[
                          selectedQuestionIndex.toString()
                        ] !== undefined
                          ? `${getTaskProgressMetrics(activeTask._id).scores[selectedQuestionIndex.toString()]} / 100`
                          : "PENDING ATTEMPT SUBMISSION"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}>
                    <div
                      className="form-panel"
                      style={{ margin: 0, paddingBottom: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1rem",
                        }}>
                        <span className="form-title" style={{ margin: 0 }}>
                          💻 Source Compiler Frame
                        </span>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            background: "var(--bg)",
                            padding: "4px",
                            borderRadius: "6px",
                          }}>
                          {activeTask.questions[
                            selectedQuestionIndex
                          ]?.allowedLanguages.map((lang) => (
                            <button
                              key={lang}
                              disabled={
                                getTaskProgressMetrics(activeTask._id).scores?.[
                                  selectedQuestionIndex.toString()
                                ] !== undefined
                              }
                              style={{
                                background:
                                  selectedRuntimeLanguage === lang
                                    ? "var(--surface2)"
                                    : "transparent",
                                color:
                                  selectedRuntimeLanguage === lang
                                    ? "var(--blue)"
                                    : "var(--muted)",
                                border: "none",
                                padding: "4px 10px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontFamily: "JetBrains Mono",
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                              }}
                              onClick={() =>
                                loadQuestionRuntimeState(
                                  activeTask,
                                  selectedQuestionIndex,
                                  lang,
                                )
                              }>
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          background: "#040810",
                          borderRadius: "8px",
                          border: "1px solid #1a2535",
                        }}>
                        <textarea
                          disabled={
                            getTaskProgressMetrics(activeTask._id).scores?.[
                              selectedQuestionIndex.toString()
                            ] !== undefined
                          }
                          style={{
                            width: "100%",
                            minHeight: "260px",
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "#e2e8f0",
                            padding: "1rem",
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: "0.85rem",
                            lineHeight: "1.6",
                            resize: "vertical",
                          }}
                          value={studentCodeInput}
                          onChange={(e) => setStudentCodeInput(e.target.value)}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "10px",
                          marginTop: "1rem",
                        }}>
                        <button
                          disabled={
                            getTaskProgressMetrics(activeTask._id).scores?.[
                              selectedQuestionIndex.toString()
                            ] !== undefined
                          }
                          className="action-btn"
                          style={{
                            borderColor: "var(--green)",
                            color: "var(--green)",
                          }}
                          onClick={executeSandboxRuntimeEngine}>
                          ⚡ Run Code Script Assertions
                        </button>
                        {isOutputValid &&
                          getTaskProgressMetrics(activeTask._id).scores?.[
                            selectedQuestionIndex.toString()
                          ] === undefined && (
                            <button
                              className="action-btn"
                              style={{
                                background: "var(--green)",
                                color: "var(--bg)",
                                borderColor: "var(--green)",
                              }}
                              onClick={handleFinalTaskSubmit}>
                              💾 Submit Answer & Log Score
                            </button>
                          )}
                      </div>
                    </div>
                    <div
                      className="form-panel"
                      style={{ margin: 0, background: "#05070b" }}>
                      <div
                        className="output-label"
                        style={{ color: "var(--muted)" }}>
                        System Output Pipeline Stream
                      </div>
                      <div
                        style={{
                          minHeight: "100px",
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.82rem",
                          whiteSpace: "pre-wrap",
                          color: "#6ee7b7",
                          lineHeight: "1.5",
                          marginTop: "0.5rem",
                        }}>
                        {consoleOutputLog ||
                          "Terminal awaiting trigger signals..."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC REACT INTERACTIVE NATIVE QUIZ ENGINE MODULE VIEWPORT */}
            {activeQuiz && (
              <div
                className="quiz-wrap"
                style={{ minHeight: "auto", padding: 0 }}>
                <button
                  className="action-btn close-view-btn"
                  onClick={() => {
                    setActiveQuiz(null);
                    setActiveTab("quizzes");
                  }}>
                  ← Exit Quiz Room
                </button>

                <div className="quiz-hero">
                  <div className="quiz-badge">📘 Quiz Session Room</div>
                  <div className="quiz-title">{activeQuiz.title}</div>
                  <div className="quiz-sub">
                    {activeQuizQuestions.length} questions · evaluate
                    comprehension matrices instantly
                  </div>
                </div>

                {!quizSubmittedState && (
                  <>
                    <div className="progress-bar-wrap">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${(answeredQuizCount / activeQuizQuestions.length) * 100}%`,
                        }}></div>
                    </div>
                    <div className="q-counter">
                      {answeredQuizCount} / {activeQuizQuestions.length}{" "}
                      answered
                    </div>

                    {activeQuizQuestions.map((q, i) => (
                      <div
                        className="q-card"
                        key={i}
                        style={{
                          borderLeft:
                            quizUserAnswers[i] !== null
                              ? "3px solid var(--blue)"
                              : "1px solid var(--border)",
                        }}>
                        <div className="q-num">
                          Question {String(i + 1).padStart(2, "0")}
                        </div>
                        {/* <div
                          className="q-text"
                          dangerouslySetInnerHTML={{ __html: q.q }}></div> */}
                        <div
                          className="q-text"
                          dangerouslySetInnerHTML={{
                            __html: q.questionText,
                          }}></div>
                        <div className="options">
                          {(q.options || []).map((o, j) => (
                            <button
                              key={j}
                              className={`opt ${quizUserAnswers[i] === j ? "selected" : ""}`}
                              onClick={() => handleSelectQuizOption(i, j)}>
                              <div className="opt-circle">
                                {String.fromCharCode(64 + 1 + j)}
                              </div>
                              <span
                                dangerouslySetInnerHTML={{ __html: o }}></span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      className="submit-btn"
                      style={{
                        background:
                          answeredQuizCount === activeQuizQuestions.length
                            ? "var(--blue)"
                            : "transparent",
                      }}
                      disabled={answeredQuizCount < activeQuizQuestions.length}
                      onClick={executeQuizEvaluationSubmission}>
                      Submit Quiz Session to Grading Server →
                    </button>
                  </>
                )}

                {/* POST-SUBMISSION DETAILED SCORECARD PANEL */}
                {quizSubmittedState && (
                  <div className="result-panel" style={{ display: "block" }}>
                    <div className="result-score">
                      {quizResultsMetadata.correct} /{" "}
                      {activeQuizQuestions.length}
                    </div>
                    <div className="result-label">
                      Verified Performance Score
                    </div>
                    <div className="stat-row">
                      <div className="stat">
                        <div className="stat-val s-green">
                          {quizResultsMetadata.correct}
                        </div>
                        <div className="stat-lab">Correct</div>
                      </div>
                      <div className="stat">
                        <div className="stat-val s-red">
                          {quizResultsMetadata.wrong}
                        </div>
                        <div className="stat-lab">Wrong</div>
                      </div>
                      <div className="stat">
                        <div className="stat-val s-blue">
                          {quizResultsMetadata.pct}%
                        </div>
                        <div className="stat-lab">Percentage</div>
                      </div>
                    </div>
                    <div className="result-msg">{quizResultsMetadata.msg}</div>

                    <div className="answer-review">
                      <div
                        style={{
                          fontSize: ".72rem",
                          color: "#8892a4",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          marginBottom: ".8rem",
                        }}>
                        Answer Correction Matrix Logs
                      </div>
                      {activeQuizQuestions.map((q, i) => {
                        const ua = quizUserAnswers[i];
                        const isRight = ua === q.correctIndex;
                        // const strip = (s) => s.replace(/<[^>]+>/g, "");
                        // return (
                        //   <div
                        //     className={`review-item ${isRight ? "r-correct" : "r-wrong"}`}
                        //     key={i}>
                        //     <div className="review-q">
                        //       Q{i + 1}: {strip(q.q)}
                        //     </div>
                        //     <div
                        //       className={`review-a ${isRight ? "" : "r-wrong"}`}>
                        //       Your Selection:{" "}
                        //       {ua !== null ? strip(q.opts[ua]) : "Skipped"}
                        //     </div>
                        //     {!isRight && (
                        //       <div className="review-correct-ans">
                        //         ✓ Valid Answer: {strip(q.opts[q.ans])}
                        //       </div>
                        //     )}
                        //   </div>
                        // );
                        const strip = (s) => s.replace(/<[^>]+>/g, "");
                        return (
                          <div
                            className={`review-item ${isRight ? "r-correct" : "r-wrong"}`}
                            key={i}>
                            <div className="review-q">
                              Q{i + 1}: {strip(q.questionText)}
                            </div>
                            <div
                              className={`review-a ${isRight ? "" : "r-wrong"}`}>
                              Your Selection:{" "}
                              {ua !== null ? strip(q.options[ua]) : "Skipped"}
                            </div>
                            {!isRight && (
                              <div className="review-correct-ans">
                                ✓ Valid Answer:{" "}
                                {strip(q.options[q.correctIndex])}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      className="retry-btn"
                      onClick={handleResetQuizAttempts}>
                      ↺ Reset Session & Re-attempt Evaluation
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
            <h2>Welcome to Your LMS Workspace Hub</h2>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
              Please select an assigned subject from the side navigation tree
              structure.
            </p>
          </div>
        )}
      </div>
      <Modal modal={modal} close={closeModal} />
    </div>
  );
}
