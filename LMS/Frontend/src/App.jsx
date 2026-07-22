// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_BASE = "http://localhost:5000/api";

// export default function App() {
//   // System Authentication/Identity Mocks
//   const [currentUser, setCurrentUser] = useState({
//     username: "admin_root",
//     role: "admin",
//   });
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   // Application Global Core State Managers
//   const [subjects, setSubjects] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [activeSubjectId, setActiveSubjectId] = useState(null);
//   const [activeTab, setActiveTab] = useState(null); // 'materials' | 'tasks' | 'quizzes'
//   const [activeHtmlContent, setActiveHtmlContent] = useState(null);

//   // Form Management States
//   const [newSubjectName, setNewSubjectName] = useState("");
//   const [newStudentUser, setNewStudentUser] = useState("");
//   const [contentForm, setContentForm] = useState({
//     title: "",
//     type: "materials",
//     html: "",
//   });

//   useEffect(() => {
//     fetchCoreData();
//   }, [currentUser]);

//   const fetchCoreData = async () => {
//     try {
//       const resSubs = await axios.get(`${API_BASE}/subjects`);
//       setSubjects(resSubs.data);

//       if (currentUser.role === "admin") {
//         const resStuds = await axios.get(`${API_BASE}/students`);
//         setStudents(resStuds.data);
//       } else {
//         // Fetch specific profile rules if context is student profile
//         const resProfile = await axios.get(
//           `${API_BASE}/user-context/${currentUser.username}`,
//         );
//         setSubjects(resProfile.data.assignedSubjects);
//       }
//     } catch (err) {
//       console.error("Error synchronized data layer payload fetch:", err);
//     }
//   };

//   const handleCreateSubject = async (e) => {
//     e.preventDefault();
//     if (!newSubjectName) return;
//     try {
//       await axios.post(`${API_BASE}/subjects`, { name: newSubjectName });
//       setNewSubjectName("");
//       fetchCoreData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleCreateStudent = async (e) => {
//     e.preventDefault();
//     if (!newStudentUser) return;
//     try {
//       await axios.post(`${API_BASE}/students`, { username: newStudentUser });
//       setNewStudentUser("");
//       fetchCoreData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleUploadContent = async (e) => {
//     e.preventDefault();
//     if (!activeSubjectId || !contentForm.title || !contentForm.html) return;
//     try {
//       await axios.post(`${API_BASE}/subjects/${activeSubjectId}/content`, {
//         type: contentForm.type,
//         title: contentForm.title,
//         htmlContent: contentForm.html,
//       });
//       setContentForm({ title: "", type: "materials", html: "" });
//       fetchCoreData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleToggleSubjectAssignment = async (
//     studentId,
//     subjectId,
//     isAssigned,
//   ) => {
//     const student = students.find((s) => s._id === studentId);
//     let currentAssignedIds = student.assignedSubjects.map((s) => s._id || s);

//     if (isAssigned) {
//       currentAssignedIds = currentAssignedIds.filter((id) => id !== subjectId);
//     } else {
//       currentAssignedIds.push(subjectId);
//     }

//     try {
//       await axios.put(`${API_BASE}/students/${studentId}/assign`, {
//         subjectIds: currentAssignedIds,
//       });
//       fetchCoreData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const selectedSubject = subjects.find((s) => s._id === activeSubjectId);

//   return (
//     <div className="dashboard-container">
//       {/* Floating Toggle Trigger Element when layout is closed */}
//       {!sidebarOpen && (
//         <button
//           className="sidebar-toggle-floating"
//           onClick={() => setSidebarOpen(true)}>
//           ☰
//         </button>
//       )}

//       {/* Side Navigation Control Rig */}
//       <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
//         <div className="sidebar-header">
//           <span className="sidebar-brand">PORTAL V1</span>
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
//           <div className="sidebar-heading">Profile Context</div>
//           <div
//             style={{ padding: "0.5rem 1.5rem", display: "flex", gap: "10px" }}>
//             <button
//               className="action-btn"
//               style={{ padding: "4px 8px" }}
//               onClick={() =>
//                 setCurrentUser({ username: "admin_root", role: "admin" })
//               }>
//               Admin
//             </button>
//             <button
//               className="action-btn"
//               style={{ padding: "4px 8px" }}
//               onClick={() =>
//                 setCurrentUser({ username: "student_01", role: "student" })
//               }>
//               Student
//             </button>
//           </div>
//           <div
//             style={{
//               padding: "0.5rem 1.5rem",
//               fontSize: "0.8rem",
//               color: "var(--green)",
//             }}>
//             Active: {currentUser.username} ({currentUser.role})
//           </div>

//           <div className="sidebar-heading">Subjects Module</div>
//           {subjects.map((sub) => (
//             <div
//               key={sub._id}
//               className={`sidebar-item ${activeSubjectId === sub._id ? "active" : ""}`}
//               onClick={() => {
//                 setActiveSubjectId(sub._id);
//                 setActiveTab(null);
//                 setActiveHtmlContent(null);
//               }}>
//               📚 {sub.name}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Primary Dynamic Viewport Window */}
//       <div className="main-viewport">
//         {selectedSubject ? (
//           <div>
//             <div className="hero">
//               <div className="hero-badge">Subject Viewport</div>
//               <h1>{selectedSubject.name}</h1>
//             </div>

//             {/* Float Card Layout Matrix Component Block */}
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
//                     Review your subject materials guidelines, books, and
//                     reference code.
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
//                     Pending operational assignments and code execution
//                     directives.
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
//                     Evaluate comprehension metrics through knowledge
//                     checkpoints.
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Content Item Index or Compiled Dynamic Template Injector Render Target */}
//             {activeTab && !activeHtmlContent && (
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
//                   {activeTab} Module Index
//                 </h2>

//                 {selectedSubject[activeTab]?.length === 0 ? (
//                   <p style={{ color: "var(--muted)" }}>
//                     No elements populated inside this resource cluster.
//                   </p>
//                 ) : (
//                   selectedSubject[activeTab].map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="item-row-link"
//                       onClick={() => setActiveHtmlContent(item.htmlContent)}>
//                       <span>⚡ {item.title}</span>
//                       <span
//                         style={{ color: "var(--blue)", fontSize: "0.85rem" }}>
//                         Launch Document →
//                       </span>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}

//             {/* Displaying raw HTML Content matching your attached structure styles safely */}
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

//             {/* Section Component: Admin Content Aggregation Rig */}
//             {currentUser.role === "admin" && !activeHtmlContent && (
//               <div className="form-panel" style={{ marginTop: "4rem" }}>
//                 <div className="form-title">
//                   ➕ Inject Content Node Into: {selectedSubject.name}
//                 </div>
//                 <form onSubmit={handleUploadContent}>
//                   <input
//                     type="text"
//                     className="input-field"
//                     placeholder="Resource Document Title (e.g., Python Basics Lesson 1)"
//                     value={contentForm.title}
//                     onChange={(e) =>
//                       setContentForm({ ...contentForm, title: e.target.value })
//                     }
//                   />
//                   <select
//                     className="input-field"
//                     value={contentForm.type}
//                     onChange={(e) =>
//                       setContentForm({ ...contentForm, type: e.target.value })
//                     }>
//                     <option value="materials">Materials Section</option>
//                     <option value="tasks">Tasks Section</option>
//                     <option value="quizzes">Quizzes Section</option>
//                   </select>
//                   <textarea
//                     className="input-field"
//                     style={{ minHeight: "180px", fontFamily: "JetBrains Mono" }}
//                     placeholder="Paste your raw customized HTML code element block structure here..."
//                     value={contentForm.html}
//                     onChange={(e) =>
//                       setContentForm({ ...contentForm, html: e.target.value })
//                     }
//                   />
//                   <button type="submit" className="action-btn">
//                     Upload and Map Component
//                   </button>
//                 </form>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div
//             style={{ textAlign: "center", padding: "4rem color:var(--muted)" }}>
//             <h2>No Active Subject Workspace Selected</h2>
//             <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
//               Select an option from the system routing tree to get started.
//             </p>
//           </div>
//         )}

//         {/* Global Administrative Operations Section Block */}
//         {currentUser.role === "admin" && (
//           <div
//             style={{
//               marginTop: "4rem",
//               borderTop: "1px solid var(--border)",
//               paddingTop: "2rem",
//             }}>
//             <h2
//               style={{
//                 fontFamily: "JetBrains Mono",
//                 marginBottom: "2rem",
//                 color: "var(--purple)",
//               }}>
//               ⚙️ MASTER CONTROL MANAGEMENT PANEL
//             </h2>

//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "2rem",
//               }}>
//               {/* Box 1: Add Subject Creation */}
//               <div className="form-panel">
//                 <div className="form-title">Add New Subject Group</div>
//                 <form onSubmit={handleCreateSubject}>
//                   <input
//                     type="text"
//                     className="input-field"
//                     placeholder="Subject Name (e.g., Advanced Python Engine)"
//                     value={newSubjectName}
//                     onChange={(e) => setNewSubjectName(e.target.value)}
//                   />
//                   <button type="submit" className="action-btn">
//                     Instantiate Subject
//                   </button>
//                 </form>
//               </div>

//               {/* Box 2: Create Student Identity Profile */}
//               <div className="form-panel">
//                 <div className="form-title">
//                   Provision Student Entry Account
//                 </div>
//                 <form onSubmit={handleCreateStudent}>
//                   <input
//                     type="text"
//                     className="input-field"
//                     placeholder="Unique Identification Handle (e.g., student_01)"
//                     value={newStudentUser}
//                     onChange={(e) => setNewStudentUser(e.target.value)}
//                   />
//                   <button type="submit" className="action-btn">
//                     Register Identity
//                   </button>
//                 </form>
//               </div>
//             </div>

//             {/* Rule Assignment Verification Matrix Container Table Layout */}
//             <div className="form-panel">
//               <div className="form-title">
//                 Student Access Matrix Permissions Table
//               </div>
//               <table className="full-table">
//                 <thead>
//                   <tr>
//                     <th>Student ID Username</th>
//                     <th>
//                       Assigned Course Access Rules Matrix Mapping Control Grid
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.map((student) => (
//                     <tr key={student._id}>
//                       <td>{student.username}</td>
//                       <td>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             gap: "10px",
//                           }}>
//                           {subjects.map((sub) => {
//                             const isAssigned = student.assignedSubjects.some(
//                               (s) => (s._id || s) === sub._id,
//                             );
//                             return (
//                               <label
//                                 key={sub._id}
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   gap: "5px",
//                                   cursor: "pointer",
//                                   fontSize: "0.8rem",
//                                 }}>
//                                 <input
//                                   type="checkbox"
//                                   checked={isAssigned}
//                                   onChange={() =>
//                                     handleToggleSubjectAssignment(
//                                       student._id,
//                                       sub._id,
//                                       isAssigned,
//                                     )
//                                   }
//                                 />
//                                 {sub.name}
//                               </label>
//                             );
//                           })}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import Login from "./Login";
// import AdminDashboard from "./AdminDashboard";
// import StudentDashboard from "./StudentDashboard";

// export default function App() {
//   const [currentUser, setCurrentUser] = useState(null); // Managed profile context payload { username, role, token }
//   const [systemLoading, setSystemLoading] = useState(true);

//   useEffect(() => {
//     // Validate persistence session token key
//     const sessionAuth = localStorage.getItem("lms_auth_session");
//     if (sessionAuth) {
//       setCurrentUser(JSON.parse(sessionAuth));
//     }
//     setSystemLoading(false);
//   }, []);

//   const handleLoginSuccess = (userPayload) => {
//     localStorage.setItem("lms_auth_session", JSON.stringify(userPayload));
//     setCurrentUser(userPayload);
//   };

//   const handleSystemLogout = () => {
//     localStorage.removeItem("lms_auth_session");
//     setCurrentUser(null);
//   };

//   if (systemLoading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "100vh",
//           background: "var(--bg)",
//           fontFamily: "JetBrains Mono",
//           color: "var(--blue)",
//         }}>
//         Loading System Engine Infrastructure...
//       </div>
//     );
//   }

//   // Enforce the login screen if no session exists
//   if (!currentUser) {
//     return <Login onLoginSuccess={handleLoginSuccess} />;
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "var(--bg)",
//         position: "relative",
//       }}>
//       {/* Universal Top Navigation Header Segment */}
//       <header
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "0.75rem 2rem",
//           background: "var(--surface)",
//           borderBottom: "1px solid var(--border)",
//           fontSize: "0.85rem",
//         }}>
//         <div>
//           <span style={{ color: "var(--muted)" }}>Account Profile: </span>
//           <span
//             style={{
//               fontFamily: "JetBrains Mono",
//               color: "var(--text)",
//               fontWeight: "600",
//             }}>
//             {currentUser.username}
//           </span>
//           <span
//             className="badge b-purple"
//             style={{ marginLeft: "10px", textTransform: "uppercase" }}>
//             {currentUser.role}
//           </span>
//         </div>
//         <button
//           className="action-btn"
//           style={{
//             padding: "4px 12px",
//             background: "#3b1111",
//             border: "1px solid #7f1d1d",
//             color: "#f87171",
//           }}
//           onClick={handleSystemLogout}>
//           Sign Out
//         </button>
//       </header>

//       {/* Role Routing Logic */}
//       {currentUser.role === "admin" ? (
//         <AdminDashboard currentUser={currentUser} />
//       ) : (
//         <StudentDashboard currentUser={currentUser} />
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import Login from "./Login";
// import AdminDashboard from "./AdminDashboard";
// import StudentDashboard from "./StudentDashboard";

// function TopHeader({ currentUser, onLogout }) {
//   const [time, setTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formatTime = (d) =>
//     d.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     });

//   const formatDate = (d) =>
//     d.toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//     });

//   const greet = () => {
//     const h = time.getHours();
//     if (h < 12) return "Good Morning";
//     if (h < 17) return "Good Afternoon";
//     return "Good Evening";
//   };

//   return (
//     <header
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "0 2rem",
//         height: "52px",
//         background: "var(--surface)",
//         borderBottom: "1px solid var(--border)",
//         position: "sticky",
//         top: 0,
//         zIndex: 150,
//       }}>
//       {/* Left — greeting */}
//       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//         <div
//           style={{
//             width: "6px",
//             height: "6px",
//             borderRadius: "50%",
//             background: "var(--green)",
//             boxShadow: "0 0 6px var(--green)",
//             animation: "pulse 2s infinite",
//           }}
//         />
//         <span
//           style={{
//             fontFamily: "JetBrains Mono",
//             fontSize: "0.78rem",
//             color: "var(--muted)",
//           }}>
//           {greet()},{" "}
//           <span style={{ color: "var(--text)", fontWeight: "600" }}>
//             {currentUser.username}
//           </span>
//         </span>
//         <span
//           style={{
//             fontFamily: "JetBrains Mono",
//             fontSize: "0.62rem",
//             background: currentUser.role === "admin" ? "#1a0a28" : "#0a1628",
//             color:
//               currentUser.role === "admin" ? "var(--purple)" : "var(--blue)",
//             border: `1px solid ${currentUser.role === "admin" ? "var(--purple-dim)" : "var(--blue-dim)"}`,
//             padding: "2px 8px",
//             borderRadius: "20px",
//             textTransform: "uppercase",
//             letterSpacing: "1px",
//           }}>
//           {currentUser.role}
//         </span>
//       </div>

//       {/* Center — app identity */}
//       <div
//         style={{
//           position: "absolute",
//           left: "50%",
//           transform: "translateX(-50%)",
//           display: "flex",
//           alignItems: "center",
//           gap: "8px",
//         }}>
//         <span
//           style={{
//             fontFamily: "JetBrains Mono",
//             fontSize: "0.75rem",
//             fontWeight: "700",
//             letterSpacing: "2px",
//             background: "linear-gradient(135deg, var(--blue), var(--purple))",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}>
//           ⬡ LMS PORTAL
//         </span>
//         <span
//           style={{
//             fontFamily: "JetBrains Mono",
//             fontSize: "0.58rem",
//             color: "var(--muted)",
//             background: "var(--bg)",
//             border: "1px solid var(--border)",
//             padding: "1px 6px",
//             borderRadius: "4px",
//           }}>
//           v2.0
//         </span>
//       </div>

//       {/* Right — clock + logout */}
//       <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//         <div style={{ textAlign: "right" }}>
//           <div
//             style={{
//               fontFamily: "JetBrains Mono",
//               fontSize: "0.82rem",
//               color: "var(--text)",
//               fontWeight: "600",
//               letterSpacing: "0.5px",
//             }}>
//             {formatTime(time)}
//           </div>
//           <div
//             style={{
//               fontFamily: "JetBrains Mono",
//               fontSize: "0.62rem",
//               color: "var(--muted)",
//               marginTop: "1px",
//             }}>
//             {formatDate(time)}
//           </div>
//         </div>

//         <div
//           style={{ width: "1px", height: "28px", background: "var(--border)" }}
//         />

//         <button
//           onClick={onLogout}
//           style={{
//             background: "#1a0808",
//             border: "1px solid #4a1515",
//             color: "#f87171",
//             padding: "5px 14px",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontFamily: "JetBrains Mono",
//             fontSize: "0.75rem",
//             letterSpacing: "0.5px",
//             transition: "all 0.2s",
//             display: "flex",
//             alignItems: "center",
//             gap: "6px",
//           }}
//           onMouseOver={(e) => {
//             e.currentTarget.style.background = "#3b1111";
//             e.currentTarget.style.borderColor = "#7f1d1d";
//           }}
//           onMouseOut={(e) => {
//             e.currentTarget.style.background = "#1a0808";
//             e.currentTarget.style.borderColor = "#4a1515";
//           }}>
//           ⏻ Sign Out
//         </button>
//       </div>

//       <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.4; }
//         }
//       `}</style>
//     </header>
//   );
// }

// export default function App() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [systemLoading, setSystemLoading] = useState(true);

//   useEffect(() => {
//     const sessionAuth = localStorage.getItem("lms_auth_session");
//     if (sessionAuth) {
//       setCurrentUser(JSON.parse(sessionAuth));
//     }
//     setSystemLoading(false);
//   }, []);

//   const handleLoginSuccess = (userPayload) => {
//     localStorage.setItem("lms_auth_session", JSON.stringify(userPayload));
//     setCurrentUser(userPayload);
//   };

//   const handleSystemLogout = () => {
//     localStorage.removeItem("lms_auth_session");
//     setCurrentUser(null);
//   };

//   if (systemLoading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "100vh",
//           background: "var(--bg)",
//           fontFamily: "JetBrains Mono",
//           color: "var(--blue)",
//           gap: "10px",
//         }}>
//         <div
//           style={{
//             width: "8px",
//             height: "8px",
//             borderRadius: "50%",
//             background: "var(--blue)",
//             animation: "pulse 1s infinite",
//           }}
//         />
//         Booting System Engine...
//       </div>
//     );
//   }

//   if (!currentUser) {
//     return <Login onLoginSuccess={handleLoginSuccess} />;
//   }

//   return (
//     <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
//       <TopHeader currentUser={currentUser} onLogout={handleSystemLogout} />
//       {currentUser.role === "admin" ? (
//         <AdminDashboard currentUser={currentUser} />
//       ) : (
//         <StudentDashboard currentUser={currentUser} />
//       )}
//     </div>
//   );
// }

//ab was good

// import React, { useState, useEffect } from "react";
// import Login from "./Login";
// import AdminDashboard from "./AdminDashboard";
// import StudentDashboard from "./StudentDashboard";

// function TopHeader({ currentUser, onLogout, sidebarOpen, setSidebarOpen }) {
//   const [time, setTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formatTime = (d) =>
//     d.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     });

//   const formatDate = (d) =>
//     d.toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//     });

//   const greet = () => {
//     const h = time.getHours();
//     if (h < 12) return "Good Morning";
//     if (h < 17) return "Good Afternoon";
//     return "Good Evening";
//   };

//   return (
//     <header
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "0 2rem 0 1.25rem",
//         height: "52px",
//         background: "var(--surface)",
//         borderBottom: "1px solid var(--border)",
//         position: "fixed",
//         top: 0,
//         left: sidebarOpen ? "280px" : "0px",
//         right: 0,
//         zIndex: 150,
//         transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//       }}>
//       {/* Left — sidebar toggle + greeting */}
//       <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
//           style={{
//             background: "var(--bg)",
//             border: "1px solid var(--border)",
//             color: "var(--muted)",
//             width: "32px",
//             height: "32px",
//             borderRadius: "8px",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: "0.9rem",
//             flexShrink: 0,
//             transition: "all 0.2s",
//           }}
//           onMouseOver={(e) => {
//             e.currentTarget.style.borderColor = "var(--blue)";
//             e.currentTarget.style.color = "var(--blue)";
//           }}
//           onMouseOut={(e) => {
//             e.currentTarget.style.borderColor = "var(--border)";
//             e.currentTarget.style.color = "var(--muted)";
//           }}>
//           {sidebarOpen ? "←" : "☰"}
//         </button>

//         <div
//           style={{ width: "1px", height: "24px", background: "var(--border)" }}
//         />

//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <div
//             style={{
//               width: "6px",
//               height: "6px",
//               borderRadius: "50%",
//               background: "var(--green)",
//               boxShadow: "0 0 6px var(--green)",
//               animation: "pulse 2s infinite",
//             }}
//           />
//           <span
//             style={{
//               fontFamily: "JetBrains Mono",
//               fontSize: "0.76rem",
//               color: "var(--muted)",
//             }}>
//             {greet()}
//           </span>
//         </div>
//       </div>

//       {/* Center — app identity */}
//       <div
//         style={{
//           position: "absolute",
//           left: "50%",
//           transform: "translateX(-50%)",
//           display: "flex",
//           alignItems: "center",
//           gap: "8px",
//         }}>
//         <span
//           style={{
//             fontFamily: "JetBrains Mono",
//             fontSize: "0.75rem",
//             fontWeight: "700",
//             letterSpacing: "2px",
//             background: "linear-gradient(135deg, var(--blue), var(--purple))",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}>
//           ⬡ LMS PORTAL
//         </span>
//         <span
//           style={{
//             fontFamily: "JetBrains Mono",
//             fontSize: "0.58rem",
//             color: "var(--muted)",
//             background: "var(--bg)",
//             border: "1px solid var(--border)",
//             padding: "1px 6px",
//             borderRadius: "4px",
//           }}>
//           v2.0
//         </span>
//       </div>

//       {/* Right — clock + logout */}
//       <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//         <div style={{ textAlign: "right" }}>
//           <div
//             style={{
//               fontFamily: "JetBrains Mono",
//               fontSize: "0.82rem",
//               color: "var(--text)",
//               fontWeight: "600",
//               letterSpacing: "0.5px",
//             }}>
//             {formatTime(time)}
//           </div>
//           <div
//             style={{
//               fontFamily: "JetBrains Mono",
//               fontSize: "0.62rem",
//               color: "var(--muted)",
//               marginTop: "1px",
//             }}>
//             {formatDate(time)}
//           </div>
//         </div>

//         <div
//           style={{ width: "1px", height: "28px", background: "var(--border)" }}
//         />

//         <button
//           onClick={onLogout}
//           style={{
//             background: "#1a0808",
//             border: "1px solid #4a1515",
//             color: "#f87171",
//             padding: "5px 14px",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontFamily: "JetBrains Mono",
//             fontSize: "0.75rem",
//             letterSpacing: "0.5px",
//             transition: "all 0.2s",
//             display: "flex",
//             alignItems: "center",
//             gap: "6px",
//           }}
//           onMouseOver={(e) => {
//             e.currentTarget.style.background = "#3b1111";
//             e.currentTarget.style.borderColor = "#7f1d1d";
//           }}
//           onMouseOut={(e) => {
//             e.currentTarget.style.background = "#1a0808";
//             e.currentTarget.style.borderColor = "#4a1515";
//           }}>
//           ⏻ Sign Out
//         </button>
//       </div>

//       <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.4; }
//         }
//       `}</style>
//     </header>
//   );
// }

// export default function App() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [systemLoading, setSystemLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   useEffect(() => {
//     const sessionAuth = localStorage.getItem("lms_auth_session");
//     if (sessionAuth) {
//       setCurrentUser(JSON.parse(sessionAuth));
//     }
//     setSystemLoading(false);
//   }, []);

//   const handleLoginSuccess = (userPayload) => {
//     localStorage.setItem("lms_auth_session", JSON.stringify(userPayload));
//     setCurrentUser(userPayload);
//   };

//   const handleSystemLogout = () => {
//     localStorage.removeItem("lms_auth_session");
//     setCurrentUser(null);
//   };

//   if (systemLoading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "100vh",
//           background: "var(--bg)",
//           fontFamily: "JetBrains Mono",
//           color: "var(--blue)",
//           gap: "10px",
//         }}>
//         <div
//           style={{
//             width: "8px",
//             height: "8px",
//             borderRadius: "50%",
//             background: "var(--blue)",
//             animation: "pulse 1s infinite",
//           }}
//         />
//         Booting System Engine...
//       </div>
//     );
//   }

//   if (!currentUser) {
//     return <Login onLoginSuccess={handleLoginSuccess} />;
//   }

//   return (
//     <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
//       <TopHeader
//         currentUser={currentUser}
//         onLogout={handleSystemLogout}
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />
//       {/* Spacer so content doesn't hide under fixed header */}
//       <div style={{ paddingTop: "52px" }}>
//         {currentUser.role === "admin" ? (
//           <AdminDashboard
//             currentUser={currentUser}
//             sidebarOpen={sidebarOpen}
//             setSidebarOpen={setSidebarOpen}
//           />
//         ) : (
//           <StudentDashboard
//             currentUser={currentUser}
//             sidebarOpen={sidebarOpen}
//             setSidebarOpen={setSidebarOpen}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

//prev ver

import React, { useState, useEffect } from "react";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

function TopHeader({ currentUser, onLogout, sidebarOpen, setSidebarOpen }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const formatDate = (d) =>
    d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const greet = () => {
    const h = time.getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 2rem 0 1.25rem",
        height: "52px",
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "fixed",
        top: 0,
        left: sidebarOpen ? "280px" : "0px",
        right: 0,
        zIndex: 150,
        transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
      {/* Left — sidebar toggle + greeting */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            color: "var(--muted)",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.9rem",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "var(--blue)";
            e.currentTarget.style.color = "var(--blue)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--muted)";
          }}>
          {sidebarOpen ? "←" : "☰"}
        </button>

        <div
          style={{ width: "1px", height: "24px", background: "var(--border)" }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--green)",
              boxShadow: "0 0 6px var(--green)",
              animation: "pulse 2s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: "0.76rem",
              color: "var(--muted)",
            }}>
            {greet()}
          </span>
        </div>
      </div>

      {/* Center — app identity */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: "0.75rem",
            fontWeight: "700",
            letterSpacing: "2px",
            background: "linear-gradient(135deg, var(--blue), var(--purple))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
          ⬡ LMS PORTAL
        </span>
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: "0.58rem",
            color: "var(--muted)",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            padding: "1px 6px",
            borderRadius: "4px",
          }}>
          v2.0
        </span>
      </div>

      {/* Right — clock + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: "0.82rem",
              color: "var(--text)",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}>
            {formatTime(time)}
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: "0.62rem",
              color: "var(--muted)",
              marginTop: "1px",
            }}>
            {formatDate(time)}
          </div>
        </div>

        <div
          style={{ width: "1px", height: "28px", background: "var(--border)" }}
        />

        <button
          onClick={onLogout}
          style={{
            background: "#1a0808",
            border: "1px solid #4a1515",
            color: "#f87171",
            padding: "5px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "JetBrains Mono",
            fontSize: "0.75rem",
            letterSpacing: "0.5px",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#3b1111";
            e.currentTarget.style.borderColor = "#7f1d1d";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#1a0808";
            e.currentTarget.style.borderColor = "#4a1515";
          }}>
          ⏻ Sign Out
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </header>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [systemLoading, setSystemLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const sessionAuth = localStorage.getItem("lms_auth_session");
    if (sessionAuth) {
      setCurrentUser(JSON.parse(sessionAuth));
    }
    setSystemLoading(false);
  }, []);

  const handleLoginSuccess = (userPayload) => {
    localStorage.setItem("lms_auth_session", JSON.stringify(userPayload));
    setCurrentUser(userPayload);
  };

  const handleSystemLogout = () => {
    localStorage.removeItem("lms_auth_session");
    setCurrentUser(null);
  };

  if (systemLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "var(--bg)",
          fontFamily: "JetBrains Mono",
          color: "var(--blue)",
          gap: "10px",
        }}>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--blue)",
            animation: "pulse 1s infinite",
          }}
        />
        Booting System Engine...
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <TopHeader
        currentUser={currentUser}
        onLogout={handleSystemLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* Spacer so content doesn't hide under fixed header */}
      <div style={{ paddingTop: "52px" }}>
        {currentUser.role === "admin" ? (
          <AdminDashboard
            currentUser={currentUser}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        ) : (
          <StudentDashboard
            currentUser={currentUser}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}
      </div>
    </div>
  );
}