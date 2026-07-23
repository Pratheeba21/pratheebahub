
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Modal, { useModal } from "./Modal";

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";


// export default function StudentDashboard({ currentUser, sidebarOpen, setSidebarOpen }) {
//   //const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [assignedSubjects, setAssignedSubjects] = useState([]);
//   const [activeSubjectId, setActiveSubjectId] = useState(null);
//   const [activeTab, setActiveTab] = useState(null);
//   const [activeHtmlContent, setActiveHtmlContent] = useState(null);

//   // Task Sandbox States
//   const [activeTask, setActiveTask] = useState(null);
//   const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
//   const [selectedRuntimeLanguage, setSelectedRuntimeLanguage] =
//     useState("python");
//   const [studentCodeInput, setStudentCodeInput] = useState("");
//   const [consoleOutputLog, setConsoleOutputLog] = useState("");
//   const [isOutputValid, setIsOutputValid] = useState(null);

//   // Added Unified Quiz Component Engine State Structures
//   const [activeQuiz, setActiveQuiz] = useState(null);
//   //   const [quizUserAnswers, setQuizUserAnswers] = useState(
//   //     new Array(20).fill(null),
//   //   );
//   const [quizUserAnswers, setQuizUserAnswers] = useState([]);
//   const [quizSubmittedState, setQuizSubmittedState] = useState(false);
//   const [quizResultsMetadata, setQuizResultsMetadata] = useState({
//     correct: 0,
//     wrong: 0,
//     pct: 0,
//     msg: "",
//   });

//   // Persistence Sync Arrays
//   const [submissionRecords, setSubmissionRecords] = useState([]);
//   const [quizRecords, setQuizRecords] = useState([]);

//   const [myProgressData, setMyProgressData] = useState([]);
//   const [progressLoading, setProgressLoading] = useState(false);

//   const [allSubjects, setAllSubjects] = useState([]);
//   const [myRequests, setMyRequests] = useState([]);
//   const [requestingSubjectId, setRequestingSubjectId] = useState(null);

//   const { modal, showAlert, showConfirm, close: closeModal } = useModal();

//   useEffect(() => {
//     fetchStudentCourses();
//   }, []);

//   useEffect(() => {
//     if (activeSubjectId) {
//       fetchSubmissionRecords();
//       fetchQuizRecords();
//     }
//   }, [activeSubjectId]);

//   useEffect(() => {
//     if (activeTab === "__progress__") {
//       fetchMyProgress();
//     }
//   }, [activeTab]);

//   // Persistent task code draft auto-saving buffer module
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

//   // Persistent quiz draft auto-saving module hook
//   useEffect(() => {
//     if (activeQuiz && !quizSubmittedState) {
//       const quizCacheKey = `lms_quiz_cache_${currentUser.username}_${activeQuiz._id}`;
//       localStorage.setItem(quizCacheKey, JSON.stringify(quizUserAnswers));
//     }
//   }, [quizUserAnswers, activeQuiz, quizSubmittedState]);

//   const fetchStudentCourses = async () => {
//     try {
//       const resProfile = await axios.get(
//         `${API_BASE}/user-context/${currentUser.username}`,
//       );
//       setAssignedSubjects(resProfile.data.assignedSubjects || []);
//       const resSubs = await axios.get(`${API_BASE}/subjects`);
//       setAllSubjects(resSubs.data);
//       const resReqs = await axios.get(
//         `${API_BASE}/subject-requests/student/${currentUser.username}`,
//       );
//       setMyRequests(resReqs.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchSubmissionRecords = async () => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/submissions/${currentUser.username}/${activeSubjectId}`,
//       );
//       setSubmissionRecords(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchQuizRecords = async () => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/quiz-submissions/${currentUser.username}/${activeSubjectId}`,
//       );
//       setQuizRecords(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchMyProgress = async () => {
//     setProgressLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/admin/student-progress`);
//       const mine = res.data.find((s) => s.username === currentUser.username);
//       setMyProgressData(mine ? mine.subjectProgress : []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setProgressLoading(false);
//     }
//   };

//   const selectedSubject = assignedSubjects.find(
//     (s) => s._id === activeSubjectId,
//   );

//   // Progress calculations for tasks link blocks
//   const getTaskProgressMetrics = (taskId) => {
//     const match = submissionRecords.find((r) => r.taskId === taskId);
//     if (!match) return { percentage: 0, isCompleted: false, scores: {} };
//     const totalQuestionsCount =
//       selectedSubject?.tasks?.find((t) => t._id === taskId)?.questions
//         ?.length || 1;
//     const completedCount = match.completedQuestions?.length || 0;
//     return {
//       percentage: Math.min(
//         Math.round((completedCount / totalQuestionsCount) * 100),
//         100,
//       ),
//       isCompleted: match.isCompleted,
//       scores: match.scores || {},
//     };
//   };

//   const getSubjectTaskCounters = () => {
//     if (!selectedSubject || !selectedSubject.tasks)
//       return { completed: 0, total: 0 };
//     let finished = 0;
//     selectedSubject.tasks.forEach((t) => {
//       const match = submissionRecords.find((r) => r.taskId === t._id);
//       if (match && match.isCompleted) finished++;
//     });
//     return { completed: finished, total: selectedSubject.tasks.length };
//   };

//   // Quiz progress counters for the subject
//   const getSubjectQuizCounters = () => {
//     if (!selectedSubject || !selectedSubject.quizzes)
//       return { completed: 0, total: 0, avgScore: 0 };
//     let finished = 0;
//     let totalPct = 0;
//     selectedSubject.quizzes.forEach((q) => {
//       const record = quizRecords.find((r) => r.quizId === q._id);
//       if (record && record.isCompleted) {
//         finished++;
//         totalPct += record.percentage || 0;
//       }
//     });
//     return {
//       completed: finished,
//       total: selectedSubject.quizzes.length,
//       avgScore: finished > 0 ? Math.round(totalPct / finished) : 0,
//     };
//   };

//   // Helper calculation log for quiz index links
//   const getQuizProgressMetrics = (quizId) => {
//     const record = quizRecords.find((r) => r.quizId === quizId);
//     if (record) {
//       return {
//         isCompleted: true,
//         percentage: record.percentage,
//         scoreString: `${record.correctAnswers} / ${record.totalQuestions}`,
//         correctAnswers: record.correctAnswers,
//         totalQuestions: record.totalQuestions,
//       };
//     }
//     return {
//       isCompleted: false,
//       percentage: 0,
//       scoreString: "",
//       correctAnswers: 0,
//       totalQuestions: 0,
//     };
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
//       setStudentCodeInput(
//         lang === "python"
//           ? question.initialPythonCode || "# Enter Python code\n"
//           : question.initialJavaCode || "public class Main {\n\n}",
//       );
//     }
//   };


//   const launchQuizWorkspace = (quiz) => {
//     setActiveQuiz(quiz);
//     const qCount = (quiz.questions || []).length;

//     const dbRecord = quizRecords.find((r) => r.quizId === quiz._id);
//     if (dbRecord) {
//       setQuizUserAnswers(dbRecord.userAnswersArray);
//       setQuizSubmittedState(true);
//       generateQuizFeedbackMessage(
//         dbRecord.percentage,
//         dbRecord.correctAnswers,
//         quiz.questions,
//       );
//     } else {
//       const quizCacheKey = `lms_quiz_cache_${currentUser.username}_${quiz._id}`;
//       const savedDraft = localStorage.getItem(quizCacheKey);
//       setQuizUserAnswers(
//         savedDraft ? JSON.parse(savedDraft) : new Array(qCount).fill(null),
//       );
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



//   const generateQuizFeedbackMessage = (pct, correct, questions) => {
//     const total = (questions || activeQuiz?.questions || []).length;
//     let msg = "";
//     if (pct === 100)
//       msg = "🏆 Perfect score! Outstanding — you have mastered this topic!";
//     else if (pct >= 80)
//       msg = "🎉 Excellent work! You have a strong understanding.";
//     else if (pct >= 60) msg = "👍 Good effort! Revisit the topics you missed.";
//     else if (pct >= 40) msg = "📚 Keep going! Reread the study material.";
//     else
//       msg =
//         "💪 Don't give up! Go through the material carefully and try again.";
//     setQuizResultsMetadata({ correct, wrong: total - correct, pct, msg });
//   };



//   const executeQuizEvaluationSubmission = async () => {
//     const questions = activeQuiz.questions || [];
//     let correctCount = 0;
//     questions.forEach((q, i) => {
//       if (quizUserAnswers[i] === q.correctIndex) correctCount++;
//     });
//     const finalPct = Math.round((correctCount / questions.length) * 100);
//     generateQuizFeedbackMessage(finalPct, correctCount, questions);
//     setQuizSubmittedState(true);

//     try {
//       await axios.post(`${API_BASE}/quiz-submissions`, {
//         username: currentUser.username,
//         subjectId: activeSubjectId,
//         quizId: activeQuiz._id,
//         correctAnswers: correctCount,
//         totalQuestions: questions.length,
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

 

//   const handleResetQuizAttempts = async () => {

//     const confirmed = await showConfirm(
//       "Reset Quiz",
//       "Are you sure you want to reset your score and re-attempt this quiz?",
//       "warning",
//     );
//     if (!confirmed) return;
//     try {
//       await axios.delete(
//         `${API_BASE}/quiz-submissions/${currentUser.username}/${activeSubjectId}/${activeQuiz._id}`,
//       );
//       localStorage.removeItem(
//         `lms_quiz_cache_${currentUser.username}_${activeQuiz._id}`,
//       );
//       setQuizUserAnswers(
//         new Array((activeQuiz.questions || []).length).fill(null),
//       );
//       setQuizSubmittedState(false);
//       fetchQuizRecords();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleRequestAccess = async (subjectId) => {
//     setRequestingSubjectId(subjectId);
//     try {
//       await axios.post(`${API_BASE}/subject-requests`, {
//         username: currentUser.username,
//         subjectId,
//       });
//       const resReqs = await axios.get(
//         `${API_BASE}/subject-requests/student/${currentUser.username}`,
//       );
//       setMyRequests(resReqs.data);
//       await showAlert(
//         "Request Sent",
//         "Your access request has been submitted. The admin will review it shortly.",
//         "success",
//       );
//     } catch (err) {
//       await showAlert(
//         "Error",
//         err.response?.data?.error || "Failed to send request.",
//         "danger",
//       );
//     } finally {
//       setRequestingSubjectId(null);
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
//           let matchGroup,
//             lines = [];
//           while ((matchGroup = regexExtract.exec(studentCodeInput)) !== null)
//             lines.push(matchGroup[1]);
//           consoleCapture =
//             lines.join("\n") || "Process executed with no stdout values.";
//         } else
//           consoleCapture =
//             "Error: No output returned to standard stdout stream.";
//       } else if (selectedRuntimeLanguage === "java") {
//         if (studentCodeInput.includes("System.out.println(")) {
//           const regexJavaExtract =
//             /System\.out\.println\s*\(\s*['"]([^'"]*)['"]\s*\)/g;
//           let matchGroup,
//             lines = [];
//           while (
//             (matchGroup = regexJavaExtract.exec(studentCodeInput)) !== null
//           )
//             lines.push(matchGroup[1]);
//           consoleCapture = lines.join("\n") || "Java Process output empty.";
//         } else
//           consoleCapture =
//             "Compilation Error: Missing printing statement pipeline.";
//       }

//       setConsoleOutputLog(consoleCapture);
//       if (consoleCapture.trim() === currentQuestion.expectedOutput.trim())
//         setIsOutputValid(true);
//       else setIsOutputValid(false);
//     }, 900);
//   };

//   const handleFinalTaskSubmit = async () => {
//     if (!isOutputValid) return;
//     try {
//       await axios.post(`${API_BASE}/submissions/submit-question`, {
//         username: currentUser.username,
//         subjectId: activeSubjectId,
//         taskId: activeTask._id,
//         questionIndex: selectedQuestionIndex,
//         score: 100,
//         totalQuestions: activeTask.questions.length,
//       });
//       //   alert("Question solution logged and locked securely!");
//       await showAlert(
//         "Submitted!",
//         "Question solution logged and locked securely!",
//         "success",
//       );

//       fetchSubmissionRecords();
//     } catch (err) {
//       //   alert("Submission error.");
//       await showAlert(
//         "Error",
//         "Submission failed. Please try again.",
//         "danger",
//       );
//     }
//   };

//   const taskSummary = getSubjectTaskCounters();
//   const quizSummary = getSubjectQuizCounters();
//   //   const answeredQuizCount = quizUserAnswers.filter((a) => a !== null).length;
//   const answeredQuizCount = quizUserAnswers.filter((a) => a !== null).length;
//   const activeQuizQuestions = activeQuiz?.questions || [];


//   // const renderMyProgress = () => {
//   //   if (progressLoading)
//   //     return (
//   //       <div
//   //         style={{
//   //           padding: "3rem",
//   //           textAlign: "center",
//   //           color: "var(--muted)",
//   //           fontFamily: "JetBrains Mono",
//   //         }}>
//   //         Loading your progress...
//   //       </div>
//   //     );
//   const renderMyProgress = () => {
//     if (progressLoading)
//       return (
//         <div
//           style={{
//             padding: "3rem",
//             textAlign: "center",
//             color: "var(--muted)",
//             fontFamily: "JetBrains Mono",
//           }}>
//           Loading your progress...
//         </div>
//       );

//     if (assignedSubjects.length === 0)
//       return (
//         <div>
//           <div className="hero">
//             <div className="hero-badge">My Analytics</div>
//             <h1>📊 My Progress</h1>
//           </div>
//           <div
//             style={{
//               textAlign: "center",
//               padding: "5rem 2rem",
//               background: "var(--surface)",
//               borderRadius: "16px",
//               border: "1px solid var(--border)",
//             }}>
//             <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
//             <h2
//               style={{
//                 fontFamily: "JetBrains Mono",
//                 color: "var(--text)",
//                 marginBottom: "0.75rem",
//               }}>
//               No Progress Data Yet
//             </h2>
//             <p
//               style={{
//                 color: "var(--muted)",
//                 fontFamily: "JetBrains Mono",
//                 fontSize: "0.85rem",
//                 maxWidth: "400px",
//                 margin: "0 auto 1.5rem",
//               }}>
//               You haven't been enrolled in any subjects yet. Browse the subject
//               catalogue and request access to start tracking your progress.
//             </p>
//             <button
//               className="action-btn"
//               style={{
//                 borderColor: "var(--blue)",
//                 color: "var(--blue)",
//                 padding: "10px 24px",
//               }}
//               onClick={() => {
//                 setActiveSubjectId(null);
//                 setActiveTab("__all_subjects__");
//               }}>
//               🌐 Browse All Subjects →
//             </button>
//           </div>
//         </div>
//       );

//     const totalTasks = myProgressData.reduce(
//       (a, s) => a + s.summary.totalTasks,
//       0,
//     );
//     const completedTasks = myProgressData.reduce(
//       (a, s) => a + s.summary.completedTasks,
//       0,
//     );
//     const totalQuizzes = myProgressData.reduce(
//       (a, s) => a + s.summary.totalQuizzes,
//       0,
//     );
//     const completedQuizzes = myProgressData.reduce(
//       (a, s) => a + s.summary.completedQuizzes,
//       0,
//     );
//     const quizAvg = myProgressData
//       .filter((s) => s.summary.completedQuizzes > 0)
//       .reduce((a, s, _, arr) => a + s.summary.quizAvgScore / arr.length, 0);

//     const barColors = [
//       "var(--blue)",
//       "var(--purple)",
//       "var(--pink)",
//       "var(--amber)",
//       "var(--green)",
//       "var(--teal)",
//     ];
//     const getColor = (pct) =>
//       pct >= 80 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "#ef4444";

//     return (
//       <div>
//         <div className="hero">
//           <div className="hero-badge">My Analytics</div>
//           <h1>📊 My Progress</h1>
//         </div>

//         {/* Summary Cards */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(4, 1fr)",
//             gap: "1rem",
//             marginBottom: "2rem",
//           }}>
//           {[
//             {
//               label: "Tasks Done",
//               value: `${completedTasks}/${totalTasks}`,
//               color: "var(--blue)",
//               pct: totalTasks
//                 ? Math.round((completedTasks / totalTasks) * 100)
//                 : 0,
//             },
//             {
//               label: "Quizzes Done",
//               value: `${completedQuizzes}/${totalQuizzes}`,
//               color: "var(--pink)",
//               pct: totalQuizzes
//                 ? Math.round((completedQuizzes / totalQuizzes) * 100)
//                 : 0,
//             },
//             {
//               label: "Quiz Avg",
//               value: `${Math.round(quizAvg)}%`,
//               color: getColor(quizAvg),
//               pct: Math.round(quizAvg),
//             },
//             {
//               label: "Subjects",
//               value: myProgressData.length,
//               color: "var(--purple)",
//               pct: 100,
//             },
//           ].map((card, i) => (
//             <div
//               key={i}
//               style={{
//                 background: "var(--surface)",
//                 border: `1px solid ${card.color}33`,
//                 borderRadius: "12px",
//                 padding: "1.25rem",
//               }}>
//               <div
//                 style={{
//                   fontFamily: "JetBrains Mono",
//                   fontSize: "1.6rem",
//                   fontWeight: "700",
//                   color: card.color,
//                 }}>
//                 {card.value}
//               </div>
//               <div
//                 style={{
//                   fontSize: "0.72rem",
//                   color: "var(--muted)",
//                   fontFamily: "JetBrains Mono",
//                   margin: "4px 0 10px",
//                 }}>
//                 {card.label}
//               </div>
//               <div
//                 style={{
//                   height: "4px",
//                   background: "#0a0f1d",
//                   borderRadius: "20px",
//                 }}>
//                 <div
//                   style={{
//                     width: `${card.pct}%`,
//                     height: "100%",
//                     background: card.color,
//                     borderRadius: "20px",
//                     transition: "width 0.5s ease",
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Bar Chart */}
//         {myProgressData.some((s) => s.summary.completedQuizzes > 0) && (
//           <div
//             style={{
//               background: "var(--surface)",
//               border: "1px solid var(--border)",
//               borderRadius: "12px",
//               padding: "1.5rem",
//               marginBottom: "2rem",
//             }}>
//             <div
//               style={{
//                 fontFamily: "JetBrains Mono",
//                 fontSize: "0.72rem",
//                 color: "var(--muted)",
//                 letterSpacing: "1.5px",
//                 textTransform: "uppercase",
//                 marginBottom: "1.25rem",
//               }}>
//               📈 Quiz Average by Subject
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-end",
//                 gap: "12px",
//                 height: "140px",
//               }}>
//               {myProgressData
//                 .filter((s) => s.summary.completedQuizzes > 0)
//                 .map((s, i) => {
//                   const pct = s.summary.quizAvgScore;
//                   const color = barColors[i % barColors.length];
//                   return (
//                     <div
//                       key={s.subjectId}
//                       style={{
//                         flex: 1,
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         height: "100%",
//                         justifyContent: "flex-end",
//                         gap: "6px",
//                       }}>
//                       <div
//                         style={{
//                           fontFamily: "JetBrains Mono",
//                           fontSize: "0.72rem",
//                           color,
//                         }}>
//                         {pct}%
//                       </div>
//                       <div
//                         style={{
//                           width: "100%",
//                           height: `${pct}%`,
//                           background: `linear-gradient(180deg, ${color}, ${color}55)`,
//                           borderRadius: "6px 6px 0 0",
//                           border: `1px solid ${color}`,
//                           minHeight: "4px",
//                         }}
//                       />
//                       <div
//                         style={{
//                           fontFamily: "JetBrains Mono",
//                           fontSize: "0.62rem",
//                           color: "var(--muted)",
//                           textAlign: "center",
//                         }}>
//                         {s.subjectName.length > 12
//                           ? s.subjectName.slice(0, 12) + "…"
//                           : s.subjectName}
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>
//         )}

//         {/* Per-subject breakdown */}
//         {myProgressData.map((subj, si) => (
//           <div key={subj.subjectId} style={{ marginBottom: "1.5rem" }}>
//             <div
//               style={{
//                 fontFamily: "JetBrains Mono",
//                 fontSize: "0.72rem",
//                 color: barColors[si % barColors.length],
//                 letterSpacing: "1.5px",
//                 textTransform: "uppercase",
//                 marginBottom: "0.75rem",
//               }}>
//               📚 {subj.subjectName}
//             </div>

//             {subj.taskProgress.length > 0 && (
//               <div
//                 style={{
//                   background: "var(--surface)",
//                   border: "1px solid var(--border)",
//                   borderRadius: "10px",
//                   overflow: "hidden",
//                   marginBottom: "1rem",
//                 }}>
//                 <table
//                   style={{
//                     width: "100%",
//                     borderCollapse: "collapse",
//                     fontFamily: "JetBrains Mono",
//                     fontSize: "0.78rem",
//                   }}>
//                   <thead>
//                     <tr
//                       style={{
//                         background: "#0a1628",
//                         borderBottom: "1px solid var(--border)",
//                       }}>
//                       {[
//                         "Task",
//                         "Progress",
//                         "Questions",
//                         "Avg Score",
//                         "Status",
//                       ].map((h) => (
//                         <th
//                           key={h}
//                           style={{
//                             padding: "10px 14px",
//                             textAlign: "left",
//                             color: "var(--muted)",
//                             fontWeight: "600",
//                             fontSize: "0.65rem",
//                             letterSpacing: "1px",
//                             textTransform: "uppercase",
//                           }}>
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {subj.taskProgress.map((task, ti) => (
//                       <tr
//                         key={task.taskId}
//                         style={{
//                           borderBottom:
//                             ti < subj.taskProgress.length - 1
//                               ? "1px solid var(--border)"
//                               : "none",
//                           background:
//                             ti % 2 === 0 ? "transparent" : "#ffffff05",
//                         }}>
//                         <td
//                           style={{
//                             padding: "10px 14px",
//                             color: "var(--text)",
//                             fontWeight: "600",
//                           }}>
//                           {task.title}
//                         </td>
//                         <td style={{ padding: "10px 14px", minWidth: "120px" }}>
//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: "8px",
//                             }}>
//                             <div
//                               style={{
//                                 flex: 1,
//                                 height: "6px",
//                                 background: "#0a0f1d",
//                                 borderRadius: "20px",
//                                 overflow: "hidden",
//                               }}>
//                               <div
//                                 style={{
//                                   width: `${task.percentage}%`,
//                                   height: "100%",
//                                   background: task.isCompleted
//                                     ? "var(--green)"
//                                     : "var(--amber)",
//                                   borderRadius: "20px",
//                                 }}
//                               />
//                             </div>
//                             <span
//                               style={{
//                                 color: "var(--muted)",
//                                 fontSize: "0.68rem",
//                               }}>
//                               {task.percentage}%
//                             </span>
//                           </div>
//                         </td>
//                         <td
//                           style={{
//                             padding: "10px 14px",
//                             color: "var(--blue)",
//                           }}>
//                           {task.completedQuestions}/{task.totalQuestions}
//                         </td>
//                         <td style={{ padding: "10px 14px" }}>
//                           {task.avgScore > 0 ? (
//                             <span
//                               style={{
//                                 color: getColor(task.avgScore),
//                                 fontWeight: "700",
//                               }}>
//                               {task.avgScore}/100
//                             </span>
//                           ) : (
//                             <span style={{ color: "var(--muted)" }}>—</span>
//                           )}
//                         </td>
//                         <td style={{ padding: "10px 14px" }}>
//                           <span
//                             style={{
//                               padding: "3px 10px",
//                               borderRadius: "20px",
//                               fontSize: "0.68rem",
//                               fontWeight: "700",
//                               background: task.isCompleted
//                                 ? "#052e16"
//                                 : "#1c1002",
//                               color: task.isCompleted
//                                 ? "var(--green)"
//                                 : "var(--amber)",
//                               border: `1px solid ${task.isCompleted ? "var(--green)" : "var(--amber)"}`,
//                             }}>
//                             {task.isCompleted ? "✓ DONE" : "IN PROGRESS"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {subj.quizProgress.length > 0 && (
//               <div
//                 style={{
//                   background: "var(--surface)",
//                   border: "1px solid var(--border)",
//                   borderRadius: "10px",
//                   overflow: "hidden",
//                 }}>
//                 <table
//                   style={{
//                     width: "100%",
//                     borderCollapse: "collapse",
//                     fontFamily: "JetBrains Mono",
//                     fontSize: "0.78rem",
//                   }}>
//                   <thead>
//                     <tr
//                       style={{
//                         background: "#1f0214",
//                         borderBottom: "1px solid var(--border)",
//                       }}>
//                       {["Quiz", "Score", "Percentage", "Status"].map((h) => (
//                         <th
//                           key={h}
//                           style={{
//                             padding: "10px 14px",
//                             textAlign: "left",
//                             color: "var(--muted)",
//                             fontWeight: "600",
//                             fontSize: "0.65rem",
//                             letterSpacing: "1px",
//                             textTransform: "uppercase",
//                           }}>
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {subj.quizProgress.map((quiz, qi) => (
//                       <tr
//                         key={quiz.quizId}
//                         style={{
//                           borderBottom:
//                             qi < subj.quizProgress.length - 1
//                               ? "1px solid var(--border)"
//                               : "none",
//                           background:
//                             qi % 2 === 0 ? "transparent" : "#ffffff05",
//                         }}>
//                         <td
//                           style={{
//                             padding: "10px 14px",
//                             color: "var(--text)",
//                             fontWeight: "600",
//                           }}>
//                           {quiz.title}
//                         </td>
//                         <td
//                           style={{
//                             padding: "10px 14px",
//                             color: quiz.isCompleted
//                               ? "var(--text)"
//                               : "var(--muted)",
//                           }}>
//                           {quiz.isCompleted ? quiz.scoreString : "—"}
//                         </td>
//                         <td style={{ padding: "10px 14px", minWidth: "140px" }}>
//                           {quiz.isCompleted ? (
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "8px",
//                               }}>
//                               <div
//                                 style={{
//                                   flex: 1,
//                                   height: "6px",
//                                   background: "#0a0f1d",
//                                   borderRadius: "20px",
//                                   overflow: "hidden",
//                                 }}>
//                                 <div
//                                   style={{
//                                     width: `${quiz.percentage}%`,
//                                     height: "100%",
//                                     background: getColor(quiz.percentage),
//                                     borderRadius: "20px",
//                                   }}
//                                 />
//                               </div>
//                               <span
//                                 style={{
//                                   color: getColor(quiz.percentage),
//                                   fontWeight: "700",
//                                   fontSize: "0.72rem",
//                                 }}>
//                                 {quiz.percentage}%
//                               </span>
//                             </div>
//                           ) : (
//                             <span style={{ color: "var(--muted)" }}>—</span>
//                           )}
//                         </td>
//                         <td style={{ padding: "10px 14px" }}>
//                           <span
//                             style={{
//                               padding: "3px 10px",
//                               borderRadius: "20px",
//                               fontSize: "0.68rem",
//                               fontWeight: "700",
//                               background: quiz.isCompleted
//                                 ? "#052e16"
//                                 : "#0a0f1d",
//                               color: quiz.isCompleted
//                                 ? getColor(quiz.percentage)
//                                 : "var(--muted)",
//                               border: `1px solid ${quiz.isCompleted ? getColor(quiz.percentage) : "var(--border)"}`,
//                             }}>
//                             {quiz.isCompleted
//                               ? `✓ ${quiz.percentage >= 80 ? "GREAT" : quiz.percentage >= 50 ? "PASS" : "WEAK"}`
//                               : "NOT ATTEMPTED"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {subj.taskProgress.length === 0 &&
//               subj.quizProgress.length === 0 && (
//                 <div
//                   style={{
//                     padding: "1rem",
//                     color: "var(--muted)",
//                     fontFamily: "JetBrains Mono",
//                     fontSize: "0.8rem",
//                   }}>
//                   No activity yet.
//                 </div>
//               )}
//           </div>
//         ))}

//         {myProgressData.length === 0 && !progressLoading && (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "4rem",
//               color: "var(--muted)",
//               fontFamily: "JetBrains Mono",
//               fontSize: "0.85rem",
//             }}>
//             No progress data yet. Start completing tasks and quizzes!
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderAllSubjects = () => {
//     const assignedIds = assignedSubjects.map((s) => s._id);
//     return (
//       <div>
//         <div className="hero">
//           <div className="hero-badge">Subject Catalogue</div>
//           <h1>All Available Subjects</h1>
//         </div>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//             gap: "1.25rem",
//           }}>
//           {allSubjects.map((sub) => {
//             const isAssigned = assignedIds.includes(sub._id);
//             const req = myRequests.find(
//               (r) =>
//                 r.subjectId === sub._id ||
//                 r.subjectId?._id === sub._id ||
//                 r.subjectId === sub._id.toString(),
//             );
//             const isPending = req?.status === "pending";
//             const isRejected = req?.status === "rejected";
//             return (
//               <div
//                 key={sub._id}
//                 style={{
//                   background: "var(--surface)",
//                   border: "1px solid var(--border)",
//                   borderRadius: "14px",
//                   overflow: "hidden",
//                   transition: "transform 0.2s",
//                 }}
//                 onMouseOver={(e) =>
//                   (e.currentTarget.style.transform = "translateY(-2px)")
//                 }
//                 onMouseOut={(e) =>
//                   (e.currentTarget.style.transform = "translateY(0)")
//                 }>
//                 <div
//                   style={{
//                     height: "120px",
//                     background: "linear-gradient(135deg, #0a1628, #1a0a28)",
//                     position: "relative",
//                     overflow: "hidden",
//                   }}>
//                   {sub.coverImage ? (
//                     <img
//                       src={sub.coverImage}
//                       alt={sub.name}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                       onError={(e) => {
//                         e.target.style.display = "none";
//                       }}
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: "2.5rem",
//                         opacity: 0.3,
//                       }}>
//                       📚
//                     </div>
//                   )}
//                   {isAssigned && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: 8,
//                         right: 8,
//                         background: "#052e16",
//                         border: "1px solid var(--green)",
//                         borderRadius: "20px",
//                         padding: "2px 10px",
//                         fontFamily: "JetBrains Mono",
//                         fontSize: "0.62rem",
//                         color: "var(--green)",
//                       }}>
//                       ✓ Enrolled
//                     </div>
//                   )}
//                 </div>
//                 <div style={{ padding: "1rem" }}>
//                   <div
//                     style={{
//                       fontWeight: "700",
//                       fontSize: "0.95rem",
//                       color: "var(--text)",
//                       marginBottom: "0.75rem",
//                     }}>
//                     {sub.name}
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "6px",
//                       flexWrap: "wrap",
//                       marginBottom: "1rem",
//                     }}>
//                     <span
//                       style={{
//                         fontFamily: "JetBrains Mono",
//                         fontSize: "0.62rem",
//                         background: "#0a1222",
//                         border: "1px solid var(--blue-dim)",
//                         padding: "2px 8px",
//                         borderRadius: "10px",
//                         color: "var(--muted)",
//                       }}>
//                       📘 {sub.materials?.length || 0}
//                     </span>
//                     <span
//                       style={{
//                         fontFamily: "JetBrains Mono",
//                         fontSize: "0.62rem",
//                         background: "#1c1002",
//                         border: "1px solid var(--amber-dim)",
//                         padding: "2px 8px",
//                         borderRadius: "10px",
//                         color: "var(--muted)",
//                       }}>
//                       📝 {sub.tasks?.length || 0}
//                     </span>
//                     <span
//                       style={{
//                         fontFamily: "JetBrains Mono",
//                         fontSize: "0.62rem",
//                         background: "#1f0214",
//                         border: "1px solid var(--pink-dim)",
//                         padding: "2px 8px",
//                         borderRadius: "10px",
//                         color: "var(--muted)",
//                       }}>
//                       🎯 {sub.quizzes?.length || 0}
//                     </span>
//                   </div>
//                   {isAssigned ? (
//                     <button
//                       className="action-btn"
//                       style={{
//                         width: "100%",
//                         borderColor: "var(--green)",
//                         color: "var(--green)",
//                         padding: "7px 0",
//                         fontSize: "0.78rem",
//                       }}
//                       onClick={() => {
//                         setActiveSubjectId(sub._id);
//                         setActiveTab(null);
//                         setActiveHtmlContent(null);
//                         setActiveTask(null);
//                         setActiveQuiz(null);
//                       }}>
//                       Open Subject →
//                     </button>
//                   ) : isPending ? (
//                     <button
//                       disabled
//                       style={{
//                         width: "100%",
//                         padding: "7px 0",
//                         fontSize: "0.78rem",
//                         fontFamily: "JetBrains Mono",
//                         background: "#1c1002",
//                         border: "1px solid var(--amber)",
//                         color: "var(--amber)",
//                         borderRadius: "8px",
//                         cursor: "not-allowed",
//                       }}>
//                       ⏳ Request Pending
//                     </button>
//                   ) : (
//                     <button
//                       className="action-btn"
//                       style={{
//                         width: "100%",
//                         padding: "7px 0",
//                         fontSize: "0.78rem",
//                         opacity: requestingSubjectId === sub._id ? 0.6 : 1,
//                       }}
//                       disabled={requestingSubjectId === sub._id}
//                       onClick={() => handleRequestAccess(sub._id)}>
//                       {isRejected ? "Request Again →" : "Request Access →"}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="dashboard-container">
//       <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
//         {/* Header */}
//         <div className="sidebar-header">
//           <span className="sidebar-brand">⬡ STUDENT DESK</span>
//         </div>

//         {/* User Profile Block */}
//         <div className="sidebar-profile">
//           <div className="sidebar-avatar">
//             {currentUser.username[0].toUpperCase()}
//           </div>
//           <div style={{ overflow: "hidden" }}>
//             <div className="sidebar-username">{currentUser.username}</div>
//             <span className="sidebar-role-badge sidebar-role-student">
//               student
//             </span>
//           </div>
//         </div>

//         {/* Nav */}
//         <div className="sidebar-menu-section">
//           <div className="sidebar-heading">Explore</div>
//           <div
//             className={`sidebar-item ${activeTab === "__all_subjects__" ? "active" : ""}`}
//             onClick={() => {
//               setActiveSubjectId(null);
//               setActiveTab("__all_subjects__");
//               setActiveHtmlContent(null);
//               setActiveTask(null);
//               setActiveQuiz(null);
//             }}>
//             <span style={{ fontSize: "1rem" }}>🌐</span> All Subjects
//             {allSubjects.length > 0 && (
//               <span
//                 style={{
//                   marginLeft: "auto",
//                   background: "var(--blue-dim)",
//                   border: "1px solid var(--blue)",
//                   color: "var(--blue)",
//                   fontFamily: "JetBrains Mono",
//                   fontSize: "0.62rem",
//                   padding: "1px 7px",
//                   borderRadius: "10px",
//                 }}>
//                 {allSubjects.length}
//               </span>
//             )}
//           </div>
//           <div className="sidebar-heading">My Subjects</div>
//           {assignedSubjects.length === 0 ? (
//             <div
//               style={{
//                 padding: "1rem 1.5rem",
//                 fontSize: "0.78rem",
//                 color: "var(--muted)",
//                 fontFamily: "JetBrains Mono",
//                 fontStyle: "italic",
//               }}>
//               No subjects assigned yet.
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
//                   setActiveTask(null);
//                   setActiveQuiz(null);
//                 }}>
//                 <span className="sidebar-subject-dot"></span>
//                 {sub.name}
//               </div>
//             ))
//           )}
//         </div>
//         <div className="sidebar-heading">My Progress</div>
//         <div
//           className={`sidebar-item ${activeTab === "__progress__" ? "active" : ""}`}
//           onClick={() => {
//             setActiveSubjectId(null);
//             setActiveTab("__progress__");
//             setActiveHtmlContent(null);
//             setActiveTask(null);
//             setActiveQuiz(null);
//           }}>
//           <span style={{ fontSize: "1rem" }}>📊</span> My Progress
//         </div>

//         <div className="sidebar-footer">
//           <span>●</span> LMS ENGINE v2.0
//         </div>
//       </div>

//       <div
//         className="main-viewport"
//         style={{ marginLeft: sidebarOpen ? "280px" : "0px" }}>
//         {activeTab === "__progress__" && !activeSubjectId && renderMyProgress()}
//         {activeTab === "__all_subjects__" &&
//           !activeSubjectId &&
//           renderAllSubjects()}
//         {/* {selectedSubject ? ( */}
//         {selectedSubject && activeTab !== "__progress__" ? (
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

//                   {/* Task mastery counter */}
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

//                   {/* Quiz mastery counter */}
//                   {activeTab === "quizzes" && (
//                     <div style={{ display: "flex", gap: "10px" }}>
//                       <div
//                         style={{
//                           fontFamily: "JetBrains Mono",
//                           fontSize: "0.85rem",
//                           background: "#1a0a28",
//                           border: "1px solid var(--pink)",
//                           padding: "6px 14px",
//                           borderRadius: "20px",
//                           color: "var(--pink)",
//                         }}>
//                         QUIZZES DONE:{" "}
//                         <b style={{ fontSize: "1rem", color: "var(--text)" }}>
//                           {quizSummary.completed}
//                         </b>{" "}
//                         / {quizSummary.total}
//                       </div>
//                       {quizSummary.completed > 0 && (
//                         <div
//                           style={{
//                             fontFamily: "JetBrains Mono",
//                             fontSize: "0.85rem",
//                             background: "#0a1a0a",
//                             border: "1px solid var(--green)",
//                             padding: "6px 14px",
//                             borderRadius: "20px",
//                             color: "var(--green)",
//                           }}>
//                           AVG SCORE:{" "}
//                           <b style={{ fontSize: "1rem", color: "var(--text)" }}>
//                             {quizSummary.avgScore}%
//                           </b>
//                         </div>
//                       )}
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

//                         {/* Task progress bar */}
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

//                         {/* Quiz progress bar */}
//                         {activeTab === "quizzes" && (
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
//                               <span>QUIZ PERFORMANCE TRACKER</span>
//                               <span
//                                 style={{
//                                   color: quizProg.isCompleted
//                                     ? "var(--green)"
//                                     : "var(--muted)",
//                                 }}>
//                                 {quizProg.isCompleted
//                                   ? `SCORE: ${quizProg.percentage}%`
//                                   : "NOT ATTEMPTED"}
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
//                                   width: `${quizProg.percentage}%`,
//                                   height: "100%",
//                                   background: quizProg.isCompleted
//                                     ? quizProg.percentage >= 80
//                                       ? "linear-gradient(90deg, var(--green), var(--teal))"
//                                       : quizProg.percentage >= 50
//                                         ? "linear-gradient(90deg, var(--amber), var(--pink))"
//                                         : "linear-gradient(90deg, #ef4444, var(--pink))"
//                                     : "transparent",
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
//                     {activeQuizQuestions.length} questions · evaluate
//                     comprehension matrices instantly
//                   </div>
//                 </div>

//                 {!quizSubmittedState && (
//                   <>
//                     <div className="progress-bar-wrap">
//                       <div
//                         className="progress-bar"
//                         style={{
//                           width: `${(answeredQuizCount / activeQuizQuestions.length) * 100}%`,
//                         }}></div>
//                     </div>
//                     <div className="q-counter">
//                       {answeredQuizCount} / {activeQuizQuestions.length}{" "}
//                       answered
//                     </div>

//                     {activeQuizQuestions.map((q, i) => (
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
//                         {/* <div
//                           className="q-text"
//                           dangerouslySetInnerHTML={{ __html: q.q }}></div> */}
//                         <div
//                           className="q-text"
//                           dangerouslySetInnerHTML={{
//                             __html: q.questionText,
//                           }}></div>
//                         <div className="options">
//                           {(q.options || []).map((o, j) => (
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
//                           answeredQuizCount === activeQuizQuestions.length
//                             ? "var(--blue)"
//                             : "transparent",
//                       }}
//                       disabled={answeredQuizCount < activeQuizQuestions.length}
//                       onClick={executeQuizEvaluationSubmission}>
//                       Submit Quiz Session to Grading Server →
//                     </button>
//                   </>
//                 )}

//                 {/* POST-SUBMISSION DETAILED SCORECARD PANEL */}
//                 {quizSubmittedState && (
//                   <div className="result-panel" style={{ display: "block" }}>
//                     <div className="result-score">
//                       {quizResultsMetadata.correct} /{" "}
//                       {activeQuizQuestions.length}
//                     </div>
//                     <div className="result-label">
//                       Verified Performance Score
//                     </div>
//                     <div className="stat-row">
//                       <div className="stat">
//                         <div className="stat-val s-green">
//                           {quizResultsMetadata.correct}
//                         </div>
//                         <div className="stat-lab">Correct</div>
//                       </div>
//                       <div className="stat">
//                         <div className="stat-val s-red">
//                           {quizResultsMetadata.wrong}
//                         </div>
//                         <div className="stat-lab">Wrong</div>
//                       </div>
//                       <div className="stat">
//                         <div className="stat-val s-blue">
//                           {quizResultsMetadata.pct}%
//                         </div>
//                         <div className="stat-lab">Percentage</div>
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
//                       {activeQuizQuestions.map((q, i) => {
//                         const ua = quizUserAnswers[i];
//                         const isRight = ua === q.correctIndex;

//                         const strip = (s) => s.replace(/<[^>]+>/g, "");
//                         return (
//                           <div
//                             className={`review-item ${isRight ? "r-correct" : "r-wrong"}`}
//                             key={i}>
//                             <div className="review-q">
//                               Q{i + 1}: {strip(q.questionText)}
//                             </div>
//                             <div
//                               className={`review-a ${isRight ? "" : "r-wrong"}`}>
//                               Your Selection:{" "}
//                               {ua !== null ? strip(q.options[ua]) : "Skipped"}
//                             </div>
//                             {!isRight && (
//                               <div className="review-correct-ans">
//                                 ✓ Valid Answer:{" "}
//                                 {strip(q.options[q.correctIndex])}
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
//         ) : activeTab !== "__progress__" && activeTab !== "__all_subjects__" ? (
//           <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
//             <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
//             <h2>Welcome to Your LMS Workspace Hub</h2>
//             <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
//               Please select an assigned subject from the side navigation tree
//               structure.
//             </p>
//           </div>
//         ) : null}
//       </div>
//       <Modal modal={modal} close={closeModal} />
//     </div>
//   );
// }

//prev ver




import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal, { useModal } from "./Modal";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export default function StudentDashboard({
  currentUser,
  sidebarOpen,
  setSidebarOpen,
}) {
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

  const [allSubjects, setAllSubjects] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [requestingSubjectId, setRequestingSubjectId] = useState(null);

  // // ── Workspace switcher + Course browsing state ──────────────────────────
  // const [workspaceMode, setWorkspaceMode] = useState("subjects"); // "subjects" | "courses"
  // const [courses, setCourses] = useState([]);
  // const [activeCourseId, setActiveCourseId] = useState(null);

  // ── Workspace switcher + Course browsing state ──────────────────────────
  // const [workspaceMode, setWorkspaceMode] = useState("subjects"); // "subjects" | "courses"
  const [workspaceMode, setWorkspaceMode] = useState("subjects"); // "subjects" | "courses" | "all_courses"
  const [subjectSearch, setSubjectSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [myCourseRequests, setMyCourseRequests] = useState([]);
  const [requestingCourseId, setRequestingCourseId] = useState(null);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [activeTopicContentType, setActiveTopicContentType] = useState(null); // "materials" | "quizzes" | "labPracticals"
  const [activeCourseHtmlContent, setActiveCourseHtmlContent] = useState(null);

  // Ephemeral (practice-only, not persisted) course quiz state
  const [activeCourseQuiz, setActiveCourseQuiz] = useState(null);
  const [courseQuizAnswers, setCourseQuizAnswers] = useState([]);
  const [courseQuizSubmitted, setCourseQuizSubmitted] = useState(false);

  const { modal, showAlert, showConfirm, close: closeModal } = useModal();

  useEffect(() => {
    fetchStudentCourses();
  }, []);

  // useEffect(() => {
  //   fetchCourses();
  // }, []);

  // useEffect(() => {
  //   fetchCourses();
  //   fetchCourseAccess();
  // }, []);

  useEffect(() => {
    fetchCourseAccess();
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
      const resSubs = await axios.get(`${API_BASE}/subjects`);
      setAllSubjects(resSubs.data);
      const resReqs = await axios.get(
        `${API_BASE}/subject-requests/student/${currentUser.username}`,
      );
      setMyRequests(resReqs.data);
    } catch (err) {
      console.error(err);
    }
  };

  // const fetchCourses = async () => {
  //   try {
  //     const res = await axios.get(`${API_BASE}/courses`);
  //     setCourses(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const fetchCourseAccess = async () => {
    try {
      const res = await axios.get(`${API_BASE}/courses`); // ADD THIS LINE
      setCourses(res.data); // ADD THIS LINE
      const resProfile = await axios.get(
        `${API_BASE}/user-context/${currentUser.username}`,
      );
      setAssignedCourses(resProfile.data.assignedCourses || []);
      const resReqs = await axios.get(
        `${API_BASE}/course-requests/student/${currentUser.username}`,
      );
      setMyCourseRequests(resReqs.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestCourseAccess = async (courseId) => {
    setRequestingCourseId(courseId);
    try {
      await axios.post(`${API_BASE}/course-requests`, {
        username: currentUser.username,
        courseId,
      });
      const resReqs = await axios.get(
        `${API_BASE}/course-requests/student/${currentUser.username}`,
      );
      setMyCourseRequests(resReqs.data);
      await showAlert(
        "Request Sent",
        "Your access request has been submitted. The admin will review it shortly.",
        "success",
      );
    } catch (err) {
      await showAlert(
        "Error",
        err.response?.data?.error || "Failed to send request.",
        "danger",
      );
    } finally {
      setRequestingCourseId(null);
    }
  };

  const launchCourseQuiz = (quiz) => {
    setActiveCourseQuiz(quiz);
    setCourseQuizAnswers(new Array((quiz.questions || []).length).fill(null));
    setCourseQuizSubmitted(false);
  };

  const handleSelectCourseQuizOption = (qIdx, optIdx) => {
    if (courseQuizSubmitted) return;
    const updated = [...courseQuizAnswers];
    updated[qIdx] = optIdx;
    setCourseQuizAnswers(updated);
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

  const selectedCourse = courses.find((c) => c._id === activeCourseId);
  const selectedModule = selectedCourse?.modules.find(
    (m) => m._id === activeModuleId,
  );
  const selectedTopic = selectedModule?.topics.find(
    (t) => t._id === activeTopicId,
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

  const handleResetQuizAttempts = async () => {
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

  const handleRequestAccess = async (subjectId) => {
    setRequestingSubjectId(subjectId);
    try {
      await axios.post(`${API_BASE}/subject-requests`, {
        username: currentUser.username,
        subjectId,
      });
      const resReqs = await axios.get(
        `${API_BASE}/subject-requests/student/${currentUser.username}`,
      );
      setMyRequests(resReqs.data);
      await showAlert(
        "Request Sent",
        "Your access request has been submitted. The admin will review it shortly.",
        "success",
      );
    } catch (err) {
      await showAlert(
        "Error",
        err.response?.data?.error || "Failed to send request.",
        "danger",
      );
    } finally {
      setRequestingSubjectId(null);
    }
  };

  // const executeSandboxRuntimeEngine = () => {
  //   setConsoleOutputLog("Initializing virtual execution pipeline layer...\n");
  //   setTimeout(() => {
  //     const currentQuestion = activeTask.questions[selectedQuestionIndex];
  //     let consoleCapture = "";

  //     if (selectedRuntimeLanguage === "python") {
  //       if (studentCodeInput.includes("print(")) {
  //         const regexExtract = /print\s*\(\s*['"]([^'"]*)['"]\s*\)/g;
  //         let matchGroup,
  //           lines = [];
  //         while ((matchGroup = regexExtract.exec(studentCodeInput)) !== null)
  //           lines.push(matchGroup[1]);
  //         consoleCapture =
  //           lines.join("\n") || "Process executed with no stdout values.";
  //       } else
  //         consoleCapture =
  //           "Error: No output returned to standard stdout stream.";
  //     } else if (selectedRuntimeLanguage === "java") {
  //       if (studentCodeInput.includes("System.out.println(")) {
  //         const regexJavaExtract =
  //           /System\.out\.println\s*\(\s*['"]([^'"]*)['"]\s*\)/g;
  //         let matchGroup,
  //           lines = [];
  //         while (
  //           (matchGroup = regexJavaExtract.exec(studentCodeInput)) !== null
  //         )
  //           lines.push(matchGroup[1]);
  //         consoleCapture = lines.join("\n") || "Java Process output empty.";
  //       } else
  //         consoleCapture =
  //           "Compilation Error: Missing printing statement pipeline.";
  //     }

  //     setConsoleOutputLog(consoleCapture);
  //     if (consoleCapture.trim() === currentQuestion.expectedOutput.trim())
  //       setIsOutputValid(true);
  //     else setIsOutputValid(false);
  //   }, 900);
  // };

  const executeSandboxRuntimeEngine = async () => {
    setConsoleOutputLog("Initializing virtual execution pipeline layer...\n");
    const currentQuestion = activeTask.questions[selectedQuestionIndex];

    // const languageMap = {
    //   python: { language: "python", version: "3.10.0" },
    //   java: { language: "java", version: "15.0.2" },
    // };

    const languageMap = {
      python: { language: "python", version: "*" },
      java: { language: "java", version: "*" },
    };

    const runtime = languageMap[selectedRuntimeLanguage];
    if (!runtime) {
      setConsoleOutputLog("Error: Unsupported runtime language selected.");
      setIsOutputValid(false);
      return;
    }

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: runtime.language,
          version: runtime.version,
          // files: [{ name: "main", content: studentCodeInput }],
          files: [
            {
              name:
                selectedRuntimeLanguage === "java" ? "Main.java" : "main.py",
              content: studentCodeInput,
            },
          ],
        }),
      });

      // const data = await response.json();
      // const output =
      //   data?.run?.stdout ||
      //   data?.run?.stderr ||
      //   "Process executed with no stdout values.";
      // const trimmedOutput = output.trimEnd();

      // setConsoleOutputLog(trimmedOutput);

      // if (trimmedOutput.trim() === currentQuestion.expectedOutput.trim())
      //   setIsOutputValid(true);
      // else setIsOutputValid(false);

      const data = await response.json();

      if (!response.ok || !data?.run) {
        setConsoleOutputLog(
          `Error: ${data?.message || "Execution runtime unavailable. Please try again."}`,
        );
        setIsOutputValid(false);
        return;
      }

      const output =
        data.run.stdout ||
        data.run.stderr ||
        data?.compile?.stderr ||
        "Process executed with no stdout values.";
      const trimmedOutput = output.trimEnd();

      setConsoleOutputLog(trimmedOutput);

      if (trimmedOutput.trim() === currentQuestion.expectedOutput.trim())
        setIsOutputValid(true);
      else setIsOutputValid(false);

    } catch (err) {
      setConsoleOutputLog(
        "Error: Failed to reach execution runtime. Check your connection.",
      );
      setIsOutputValid(false);
    }
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

  // const renderMyProgress = () => {
  //   if (progressLoading)
  //     return (
  //       <div
  //         style={{
  //           padding: "3rem",
  //           textAlign: "center",
  //           color: "var(--muted)",
  //           fontFamily: "JetBrains Mono",
  //         }}>
  //         Loading your progress...
  //       </div>
  //     );
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

    if (assignedSubjects.length === 0)
      return (
        <div>
          <div className="hero">
            <div className="hero-badge">My Analytics</div>
            <h1>📊 My Progress</h1>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              background: "var(--surface)",
              borderRadius: "16px",
              border: "1px solid var(--border)",
            }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
            <h2
              style={{
                fontFamily: "JetBrains Mono",
                color: "var(--text)",
                marginBottom: "0.75rem",
              }}>
              No Progress Data Yet
            </h2>
            <p
              style={{
                color: "var(--muted)",
                fontFamily: "JetBrains Mono",
                fontSize: "0.85rem",
                maxWidth: "400px",
                margin: "0 auto 1.5rem",
              }}>
              You haven't been enrolled in any subjects yet. Browse the subject
              catalogue and request access to start tracking your progress.
            </p>
            <button
              className="action-btn"
              style={{
                borderColor: "var(--blue)",
                color: "var(--blue)",
                padding: "10px 24px",
              }}
              onClick={() => {
                setActiveSubjectId(null);
                setActiveTab("__all_subjects__");
              }}>
              🌐 Browse All Subjects →
            </button>
          </div>
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

  const renderAllSubjects = () => {
    const assignedIds = assignedSubjects.map((s) => s._id);
    return (
      <div>
        <div className="hero">
          <div className="hero-badge">Subject Catalogue</div>
          <h1>All Available Subjects</h1>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}>
          {allSubjects.map((sub) => {
            const isAssigned = assignedIds.includes(sub._id);
            const req = myRequests.find(
              (r) =>
                r.subjectId === sub._id ||
                r.subjectId?._id === sub._id ||
                r.subjectId === sub._id.toString(),
            );
            const isPending = req?.status === "pending";
            const isRejected = req?.status === "rejected";
            return (
              <div
                key={sub._id}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  overflow: "hidden",
                  transition: "transform 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }>
                <div
                  style={{
                    height: "120px",
                    background: "linear-gradient(135deg, #0a1628, #1a0a28)",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                  {sub.coverImage ? (
                    <img
                      src={sub.coverImage}
                      alt={sub.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2.5rem",
                        opacity: 0.3,
                      }}>
                      📚
                    </div>
                  )}
                  {isAssigned && (
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "#052e16",
                        border: "1px solid var(--green)",
                        borderRadius: "20px",
                        padding: "2px 10px",
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.62rem",
                        color: "var(--green)",
                      }}>
                      ✓ Enrolled
                    </div>
                  )}
                </div>
                <div style={{ padding: "1rem" }}>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "0.95rem",
                      color: "var(--text)",
                      marginBottom: "0.75rem",
                    }}>
                    {sub.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                      marginBottom: "1rem",
                    }}>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.62rem",
                        background: "#0a1222",
                        border: "1px solid var(--blue-dim)",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        color: "var(--muted)",
                      }}>
                      📘 {sub.materials?.length || 0}
                    </span>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.62rem",
                        background: "#1c1002",
                        border: "1px solid var(--amber-dim)",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        color: "var(--muted)",
                      }}>
                      📝 {sub.tasks?.length || 0}
                    </span>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.62rem",
                        background: "#1f0214",
                        border: "1px solid var(--pink-dim)",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        color: "var(--muted)",
                      }}>
                      🎯 {sub.quizzes?.length || 0}
                    </span>
                  </div>
                  {isAssigned ? (
                    <button
                      className="action-btn"
                      style={{
                        width: "100%",
                        borderColor: "var(--green)",
                        color: "var(--green)",
                        padding: "7px 0",
                        fontSize: "0.78rem",
                      }}
                      onClick={() => {
                        setActiveSubjectId(sub._id);
                        setActiveTab(null);
                        setActiveHtmlContent(null);
                        setActiveTask(null);
                        setActiveQuiz(null);
                      }}>
                      Open Subject →
                    </button>
                  ) : isPending ? (
                    <button
                      disabled
                      style={{
                        width: "100%",
                        padding: "7px 0",
                        fontSize: "0.78rem",
                        fontFamily: "JetBrains Mono",
                        background: "#1c1002",
                        border: "1px solid var(--amber)",
                        color: "var(--amber)",
                        borderRadius: "8px",
                        cursor: "not-allowed",
                      }}>
                      ⏳ Request Pending
                    </button>
                  ) : (
                    <button
                      className="action-btn"
                      style={{
                        width: "100%",
                        padding: "7px 0",
                        fontSize: "0.78rem",
                        opacity: requestingSubjectId === sub._id ? 0.6 : 1,
                      }}
                      disabled={requestingSubjectId === sub._id}
                      onClick={() => handleRequestAccess(sub._id)}>
                      {isRejected ? "Request Again →" : "Request Access →"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // const renderCourseBrowser = () => (
  //   <div>
  //     <div className="hero">
  //       <div className="hero-badge">Course Catalogue</div>
  //       <h1>All Available Courses</h1>
  //     </div>
  //     {courses.length === 0 ? (
  //       <p style={{ color: "var(--muted)" }}>No courses available yet.</p>
  //     ) : (
  //       <div
  //         style={{
  //           display: "grid",
  //           gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  //           gap: "1.25rem",
  //         }}>
  //         {courses.map((course) => (
  //           <div
  //             key={course._id}
  //             style={{
  //               background: "var(--surface)",
  //               border: "1px solid var(--border)",
  //               borderRadius: "14px",
  //               padding: "1.25rem",
  //             }}>
  //             <div
  //               style={{
  //                 fontWeight: "700",
  //                 fontSize: "0.95rem",
  //                 color: "var(--text)",
  //                 marginBottom: "0.75rem",
  //               }}>
  //               {course.name}
  //             </div>
  //             <span
  //               style={{
  //                 fontFamily: "JetBrains Mono",
  //                 fontSize: "0.62rem",
  //                 background: "#0a1222",
  //                 border: "1px solid var(--blue-dim)",
  //                 padding: "2px 8px",
  //                 borderRadius: "10px",
  //                 color: "var(--muted)",
  //               }}>
  //               📦 {course.modules?.length || 0} module
  //               {(course.modules?.length || 0) !== 1 ? "s" : ""}
  //             </span>
  //             <button
  //               className="action-btn"
  //               style={{
  //                 width: "100%",
  //                 marginTop: "1rem",
  //                 borderColor: "var(--purple)",
  //                 color: "var(--purple)",
  //               }}
  //               onClick={() => {
  //                 setActiveCourseId(course._id);
  //                 setActiveModuleId(null);
  //                 setActiveTopicId(null);
  //                 setActiveTopicContentType(null);
  //               }}>
  //               Open Course →
  //             </button>
  //           </div>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );

  const renderCourseBrowser = () => {
    const assignedIds = assignedCourses.map((c) => c._id);
    return (
      <div>
        <div className="hero">
          <div className="hero-badge">Course Catalogue</div>
          <h1>All Available Courses</h1>
        </div>
        {courses.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No courses available yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}>
            {courses.map((course) => {
              const isAssigned = assignedIds.includes(course._id);
              const req = myCourseRequests.find(
                (r) =>
                  r.courseId === course._id ||
                  r.courseId?._id === course._id ||
                  r.courseId === course._id.toString(),
              );
              const isPending = req?.status === "pending";
              const isRejected = req?.status === "rejected";
              return (
                <div
                  key={course._id}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "14px",
                    overflow: "hidden",
                    transition: "transform 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "translateY(-2px)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }>
                  <div
                    style={{
                      height: "120px",
                      background: "linear-gradient(135deg, #0a1628, #1a0a28)",
                      position: "relative",
                      overflow: "hidden",
                    }}>
                    {course.coverImage ? (
                      <img
                        src={course.coverImage}
                        alt={course.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "2.5rem",
                          opacity: 0.3,
                        }}>
                        🎓
                      </div>
                    )}
                    {isAssigned && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "#052e16",
                          border: "1px solid var(--green)",
                          borderRadius: "20px",
                          padding: "2px 10px",
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.62rem",
                          color: "var(--green)",
                        }}>
                        ✓ Enrolled
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "1rem" }}>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "0.95rem",
                        color: "var(--text)",
                        marginBottom: "0.75rem",
                      }}>
                      {course.name}
                    </div>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.62rem",
                        background: "#0a1222",
                        border: "1px solid var(--blue-dim)",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        color: "var(--muted)",
                      }}>
                      📦 {course.modules?.length || 0} module
                      {(course.modules?.length || 0) !== 1 ? "s" : ""}
                    </span>
                    <div style={{ marginTop: "1rem" }}>
                      {isAssigned ? (
                        <button
                          className="action-btn"
                          style={{
                            width: "100%",
                            borderColor: "var(--purple)",
                            color: "var(--purple)",
                            padding: "7px 0",
                            fontSize: "0.78rem",
                          }}
                          onClick={() => {
                            setActiveCourseId(course._id);
                            setActiveModuleId(null);
                            setActiveTopicId(null);
                            setActiveTopicContentType(null);
                          }}>
                          Open Course →
                        </button>
                      ) : isPending ? (
                        <button
                          disabled
                          style={{
                            width: "100%",
                            padding: "7px 0",
                            fontSize: "0.78rem",
                            fontFamily: "JetBrains Mono",
                            background: "#1c1002",
                            border: "1px solid var(--amber)",
                            color: "var(--amber)",
                            borderRadius: "8px",
                            cursor: "not-allowed",
                          }}>
                          ⏳ Request Pending
                        </button>
                      ) : (
                        <button
                          className="action-btn"
                          style={{
                            width: "100%",
                            padding: "7px 0",
                            fontSize: "0.78rem",
                            opacity:
                              requestingCourseId === course._id ? 0.6 : 1,
                          }}
                          disabled={requestingCourseId === course._id}
                          onClick={() => handleRequestCourseAccess(course._id)}>
                          {isRejected ? "Request Again →" : "Request Access →"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // return (
  //   <div className="dashboard-container">
  return (
    <>
      {/* <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px 24px",
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}>
        <button
          onClick={() => {
            setWorkspaceMode("subjects");
            setActiveCourseId(null);
          }}
          style={{
            background:
              workspaceMode === "subjects" ? "var(--blue)" : "transparent",
            color: workspaceMode === "subjects" ? "var(--bg)" : "var(--muted)",
            border: "1px solid var(--blue)",
            borderRadius: "8px",
            padding: "6px 16px",
            fontFamily: "JetBrains Mono",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}>
          📚 Subjects
        </button>
        <button
          onClick={() => {
            setWorkspaceMode("courses");
            setActiveSubjectId(null);
            setActiveTab(null);
          }}
          style={{
            background:
              workspaceMode === "courses" ? "var(--purple)" : "transparent",
            color: workspaceMode === "courses" ? "var(--bg)" : "var(--muted)",
            border: "1px solid var(--purple)",
            borderRadius: "8px",
            padding: "6px 16px",
            fontFamily: "JetBrains Mono",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}>
          🎓 Courses
        </button>
      </div> */}
      <div className="dashboard-container">
        <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          {/* Header */}
          <div className="sidebar-header">
            <span className="sidebar-brand">⬡ STUDENT DESK</span>
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

          {/* ── SUBJECTS SECTION ── */}
          <div className="sidebar-menu-section">
            <div className="sidebar-heading">Explore Subjects</div>
            <div
              className={`sidebar-item ${activeTab === "__all_subjects__" && workspaceMode === "subjects" ? "active" : ""}`}
              onClick={() => {
                setWorkspaceMode("subjects");
                setActiveSubjectId(null);
                setActiveTab("__all_subjects__");
                setActiveHtmlContent(null);
                setActiveTask(null);
                setActiveQuiz(null);
                setActiveCourseId(null);
              }}>
              <span style={{ fontSize: "1rem" }}>🌐</span> All Subjects
              {allSubjects.length > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "var(--blue-dim)",
                    border: "1px solid var(--blue)",
                    color: "var(--blue)",
                    fontFamily: "JetBrains Mono",
                    fontSize: "0.62rem",
                    padding: "1px 7px",
                    borderRadius: "10px",
                  }}>
                  {allSubjects.length}
                </span>
              )}
            </div>

            <div className="sidebar-heading">My Subjects</div>

            {/* Subject Search */}
            <div style={{ padding: "0 0.75rem 0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#0a0f1d",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "5px 10px",
                  gap: "6px",
                }}>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--text)",
                    fontFamily: "JetBrains Mono",
                    fontSize: "0.72rem",
                    width: "100%",
                  }}
                />
                {subjectSearch && (
                  <span
                    style={{
                      cursor: "pointer",
                      color: "var(--muted)",
                      fontSize: "0.75rem",
                    }}
                    onClick={() => setSubjectSearch("")}>
                    ✕
                  </span>
                )}
              </div>
            </div>

            {assignedSubjects.length === 0 ? (
              <div
                style={{
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                  fontFamily: "JetBrains Mono",
                  fontStyle: "italic",
                }}>
                No subjects assigned yet.
              </div>
            ) : (
              (() => {
                const filtered = assignedSubjects.filter((s) =>
                  s.name.toLowerCase().includes(subjectSearch.toLowerCase()),
                );
                return filtered.length === 0 ? (
                  <div
                    style={{
                      padding: "0.75rem 1.5rem",
                      fontSize: "0.72rem",
                      color: "var(--muted)",
                      fontFamily: "JetBrains Mono",
                      fontStyle: "italic",
                    }}>
                    No matches found.
                  </div>
                ) : (
                  filtered.map((sub) => (
                    <div
                      key={sub._id}
                      className={`sidebar-item ${activeSubjectId === sub._id ? "active" : ""}`}
                      onClick={() => {
                        setWorkspaceMode("subjects");
                        setActiveSubjectId(sub._id);
                        setActiveTab(null);
                        setActiveHtmlContent(null);
                        setActiveTask(null);
                        setActiveQuiz(null);
                        setActiveCourseId(null);
                      }}>
                      <span className="sidebar-subject-dot"></span>
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                        {sub.name}
                      </span>
                    </div>
                  ))
                );
              })()
            )}

            {/* My Progress */}
            <div className="sidebar-heading">My Progress</div>
            <div
              className={`sidebar-item ${activeTab === "__progress__" ? "active" : ""}`}
              onClick={() => {
                setWorkspaceMode("subjects");
                setActiveSubjectId(null);
                setActiveTab("__progress__");
                setActiveHtmlContent(null);
                setActiveTask(null);
                setActiveQuiz(null);
                setActiveCourseId(null);
              }}>
              <span style={{ fontSize: "1rem" }}>📊</span> My Progress
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              margin: "0.5rem 1rem",
              borderTop: "1px solid var(--border)",
              opacity: 0.5,
            }}
          />

          {/* ── COURSES SECTION ── */}
          <div className="sidebar-menu-section">
            <div className="sidebar-heading">Explore Courses</div>
            <div
              className={`sidebar-item ${workspaceMode === "courses" && !activeCourseId ? "active" : ""}`}
              onClick={() => {
                setWorkspaceMode("courses");
                setActiveCourseId(null);
                setActiveModuleId(null);
                setActiveTopicId(null);
                setActiveTopicContentType(null);
                setActiveSubjectId(null);
                setActiveTab(null);
              }}>
              <span style={{ fontSize: "1rem" }}>🌐</span> All Courses
              {courses.length > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "var(--blue-dim)",
                    border: "1px solid var(--purple)",
                    color: "var(--purple)",
                    fontFamily: "JetBrains Mono",
                    fontSize: "0.62rem",
                    padding: "1px 7px",
                    borderRadius: "10px",
                  }}>
                  {courses.length}
                </span>
              )}
            </div>

            <div className="sidebar-heading">My Courses</div>

            {/* Course Search */}
            <div style={{ padding: "0 0.75rem 0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#0a0f1d",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "5px 10px",
                  gap: "6px",
                }}>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--text)",
                    fontFamily: "JetBrains Mono",
                    fontSize: "0.72rem",
                    width: "100%",
                  }}
                />
                {courseSearch && (
                  <span
                    style={{
                      cursor: "pointer",
                      color: "var(--muted)",
                      fontSize: "0.75rem",
                    }}
                    onClick={() => setCourseSearch("")}>
                    ✕
                  </span>
                )}
              </div>
            </div>

            {assignedCourses.length === 0 ? (
              <div
                style={{
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                  fontFamily: "JetBrains Mono",
                  fontStyle: "italic",
                }}>
                No courses assigned yet.
              </div>
            ) : (
              (() => {
                const filtered = assignedCourses.filter((c) =>
                  c.name.toLowerCase().includes(courseSearch.toLowerCase()),
                );
                return filtered.length === 0 ? (
                  <div
                    style={{
                      padding: "0.75rem 1.5rem",
                      fontSize: "0.72rem",
                      color: "var(--muted)",
                      fontFamily: "JetBrains Mono",
                      fontStyle: "italic",
                    }}>
                    No matches found.
                  </div>
                ) : (
                  filtered.map((course) => (
                    <div
                      key={course._id}
                      className={`sidebar-item ${activeCourseId === course._id ? "active" : ""}`}
                      onClick={() => {
                        setWorkspaceMode("courses");
                        setActiveCourseId(course._id);
                        setActiveModuleId(null);
                        setActiveTopicId(null);
                        setActiveTopicContentType(null);
                        setActiveSubjectId(null);
                        setActiveTab(null);
                      }}>
                      <span
                        className="sidebar-subject-dot"
                        style={{ background: "var(--purple)" }}></span>
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                        {course.name}
                      </span>
                    </div>
                  ))
                );
              })()
            )}
          </div>

          <div className="sidebar-footer">
            <span>●</span> LMS ENGINE v2.0
          </div>
        </div>

        {/* <div
          className="main-viewport"
          style={{ marginLeft: sidebarOpen ? "280px" : "0px" }}>
          {activeTab === "__progress__" &&
            !activeSubjectId &&
            renderMyProgress()} */}
        <div
          className="main-viewport"
          style={{ marginLeft: sidebarOpen ? "280px" : "0px" }}>
          {workspaceMode === "subjects" && (
            <>
              {activeTab === "__progress__" &&
                !activeSubjectId &&
                renderMyProgress()}
              {activeTab === "__all_subjects__" &&
                !activeSubjectId &&
                renderAllSubjects()}
              {/* {selectedSubject ? ( */}
              {selectedSubject && activeTab !== "__progress__" ? (
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
                          Review your textbooks, outlines, and reference
                          blueprints.
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
                  {activeTab &&
                    !activeHtmlContent &&
                    !activeTask &&
                    !activeQuiz && (
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
                              <b
                                style={{
                                  fontSize: "1rem",
                                  color: "var(--text)",
                                }}>
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
                                <b
                                  style={{
                                    fontSize: "1rem",
                                    color: "var(--text)",
                                  }}>
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
                                  <b
                                    style={{
                                      fontSize: "1rem",
                                      color: "var(--text)",
                                    }}>
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
                                    {activeTab === "quizzes" &&
                                    quizProg?.isCompleted
                                      ? `Completed (${quizProg.scoreString}) →`
                                      : "Launch Workspace →"}
                                  </span>
                                </div>

                                {/* Task progress bar */}
                                {activeTab === "tasks" && (
                                  <div
                                    style={{ width: "100%", marginTop: "5px" }}>
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
                                  <div
                                    style={{ width: "100%", marginTop: "5px" }}>
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
                                borderColor: getTaskProgressMetrics(
                                  activeTask._id,
                                ).isCompleted
                                  ? "var(--green)"
                                  : "var(--amber)",
                              }}>
                              {getTaskProgressMetrics(activeTask._id)
                                .isCompleted
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
                            {/* <div
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
                            </div> */}
                            <div
                              style={{
                                background: "#090d16",
                                border: "1px solid var(--border)",
                                padding: "0.75rem",
                                borderRadius: "6px",
                                fontFamily: "JetBrains Mono",
                                color: "var(--green)",
                                fontSize: "0.85rem",
                                whiteSpace: "pre-wrap",
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
                                  getTaskProgressMetrics(activeTask._id)
                                    .scores?.[
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
                              <span
                                className="form-title"
                                style={{ margin: 0 }}>
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
                                      getTaskProgressMetrics(activeTask._id)
                                        .scores?.[
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
                                  getTaskProgressMetrics(activeTask._id)
                                    .scores?.[
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
                                onChange={(e) =>
                                  setStudentCodeInput(e.target.value)
                                }
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
                                  getTaskProgressMetrics(activeTask._id)
                                    .scores?.[
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
                                    onClick={() =>
                                      handleSelectQuizOption(i, j)
                                    }>
                                    <div className="opt-circle">
                                      {String.fromCharCode(64 + 1 + j)}
                                    </div>
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: o,
                                      }}></span>
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
                            disabled={
                              answeredQuizCount < activeQuizQuestions.length
                            }
                            onClick={executeQuizEvaluationSubmission}>
                            Submit Quiz Session to Grading Server →
                          </button>
                        </>
                      )}

                      {/* POST-SUBMISSION DETAILED SCORECARD PANEL */}
                      {quizSubmittedState && (
                        <div
                          className="result-panel"
                          style={{ display: "block" }}>
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
                          <div className="result-msg">
                            {quizResultsMetadata.msg}
                          </div>

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
                                    {ua !== null
                                      ? strip(q.options[ua])
                                      : "Skipped"}
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
              ) : //           ) : activeTab !== "__progress__" &&
              //             activeTab !== "__all_subjects__" ? (
              //             <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
              //               <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
              //               <h2>Welcome to Your LMS Workspace Hub</h2>
              //               <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
              //                 Please select an assigned subject from the side navigation tree
              //                 structure.
              //               </p>
              //             </div>
              //           ) : null}
              //         </div>
              //         {/* <Modal modal={modal} close={closeModal} />
              //     </div>
              //   );
              // } */}

              //         <Modal modal={modal} close={closeModal} />
              //       </div>
              //     </>
              //   );
              // }

              activeTab !== "__progress__" &&
                activeTab !== "__all_subjects__" ? (
                <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                    🚀
                  </div>
                  <h2>Welcome to Your LMS Workspace Hub</h2>
                  <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
                    Please select an assigned subject from the side navigation
                    tree structure.
                  </p>
                </div>
              ) : null}
            </>
          )}

          {workspaceMode === "courses" && (
            <>
              {!selectedCourse && renderCourseBrowser()}

              {selectedCourse && (
                <div>
                  <div className="hero">
                    <div className="hero-badge">Course Workspace</div>
                    <h1>{selectedCourse.name}</h1>
                  </div>

                  {/* Breadcrumb */}
                  <div
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: "0.78rem",
                      color: "var(--muted)",
                      marginBottom: "1.5rem",
                    }}>
                    <span
                      style={{ cursor: "pointer", color: "var(--blue)" }}
                      onClick={() => {
                        setActiveModuleId(null);
                        setActiveTopicId(null);
                        setActiveTopicContentType(null);
                      }}>
                      {selectedCourse.name}
                    </span>
                    {selectedModule && (
                      <>
                        {" › "}
                        <span
                          style={{ cursor: "pointer", color: "var(--blue)" }}
                          onClick={() => {
                            setActiveTopicId(null);
                            setActiveTopicContentType(null);
                          }}>
                          {selectedModule.title}
                        </span>
                      </>
                    )}
                    {selectedTopic && (
                      <>
                        {" › "}
                        <span
                          style={{ cursor: "pointer", color: "var(--blue)" }}
                          onClick={() => setActiveTopicContentType(null)}>
                          Topic {selectedModule.order}.{selectedTopic.order} —{" "}
                          {selectedTopic.title}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Module grid */}
                  {!activeModuleId && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: "1.25rem",
                      }}>
                      {(selectedCourse.modules || []).map((mod) => (
                        <div
                          key={mod._id}
                          style={{
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            borderRadius: "14px",
                            padding: "1.25rem",
                          }}>
                          <div
                            style={{
                              fontFamily: "JetBrains Mono",
                              fontSize: "0.65rem",
                              color: "var(--amber)",
                              marginBottom: "6px",
                            }}>
                            MODULE {mod.order}
                          </div>
                          <div
                            style={{
                              fontWeight: "700",
                              color: "var(--text)",
                              marginBottom: "0.75rem",
                            }}>
                            {mod.title}
                          </div>
                          <button
                            className="action-btn"
                            style={{
                              width: "100%",
                              borderColor: "var(--blue)",
                              color: "var(--blue)",
                            }}
                            onClick={() => {
                              setActiveModuleId(mod._id);
                              setActiveTopicId(null);
                              setActiveTopicContentType(null);
                            }}>
                            Open →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Topic grid */}
                  {activeModuleId && !activeTopicId && selectedModule && (
                    <div>
                      <button
                        className="action-btn close-view-btn"
                        onClick={() => setActiveModuleId(null)}>
                        ← Back to Modules
                      </button>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(260px, 1fr))",
                          gap: "1.25rem",
                        }}>
                        {(selectedModule.topics || []).map((topic) => (
                          <div
                            key={topic._id}
                            style={{
                              background: "var(--surface)",
                              border: "1px solid var(--border)",
                              borderRadius: "14px",
                              padding: "1.25rem",
                            }}>
                            <div
                              style={{
                                fontFamily: "JetBrains Mono",
                                fontSize: "0.65rem",
                                color: "var(--pink)",
                                marginBottom: "6px",
                              }}>
                              TOPIC {selectedModule.order}.{topic.order}
                            </div>
                            <div
                              style={{
                                fontWeight: "700",
                                color: "var(--text)",
                                marginBottom: "0.75rem",
                              }}>
                              {topic.title}
                            </div>
                            <button
                              className="action-btn"
                              style={{
                                width: "100%",
                                borderColor: "var(--blue)",
                                color: "var(--blue)",
                              }}
                              onClick={() => {
                                setActiveTopicId(topic._id);
                                setActiveTopicContentType(null);
                              }}>
                              Open →
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Topic workspace — 3 cards */}
                  {activeTopicId &&
                    !activeTopicContentType &&
                    !activeCourseHtmlContent &&
                    !activeCourseQuiz &&
                    selectedTopic && (
                      <div>
                        <button
                          className="action-btn close-view-btn"
                          onClick={() => setActiveTopicId(null)}>
                          ← Back to Topics
                        </button>
                        <h2
                          style={{
                            fontFamily: "JetBrains Mono",
                            margin: "1rem 0 1.5rem",
                          }}>
                          Topic {selectedModule.order}.{selectedTopic.order} —{" "}
                          {selectedTopic.title}
                        </h2>
                        <div className="content-grid-cards">
                          <div
                            className="interactive-card"
                            style={{ "--accent-color": "var(--green)" }}
                            onClick={() =>
                              setActiveTopicContentType("materials")
                            }>
                            <div className="interactive-card-icon">📘</div>
                            <div
                              className="interactive-card-title"
                              style={{ color: "var(--green)" }}>
                              Materials
                            </div>
                            <div className="interactive-card-desc">
                              Review reference notes for this topic.
                            </div>
                          </div>
                          <div
                            className="interactive-card"
                            style={{ "--accent-color": "var(--pink)" }}
                            onClick={() =>
                              setActiveTopicContentType("quizzes")
                            }>
                            <div className="interactive-card-icon">🎯</div>
                            <div
                              className="interactive-card-title"
                              style={{ color: "var(--pink)" }}>
                              Quizzes
                            </div>
                            <div className="interactive-card-desc">
                              Practice knowledge checks.
                            </div>
                          </div>
                          <div
                            className="interactive-card"
                            style={{ "--accent-color": "var(--teal)" }}
                            onClick={() =>
                              setActiveTopicContentType("labPracticals")
                            }>
                            <div className="interactive-card-icon">🧪</div>
                            <div
                              className="interactive-card-title"
                              style={{ color: "var(--teal)" }}>
                              Lab Practicals
                            </div>
                            <div className="interactive-card-desc">
                              Hands-on code walkthroughs and breakdowns.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Content list */}
                  {activeTopicContentType &&
                    !activeCourseHtmlContent &&
                    !activeCourseQuiz &&
                    (() => {
                      const items =
                        selectedTopic?.[activeTopicContentType] || [];
                      const meta = {
                        materials: { icon: "📘", label: "Materials" },
                        quizzes: { icon: "🎯", label: "Quizzes" },
                        labPracticals: { icon: "🧪", label: "Lab Practicals" },
                      }[activeTopicContentType];
                      return (
                        <div>
                          <button
                            className="action-btn close-view-btn"
                            onClick={() => setActiveTopicContentType(null)}>
                            ← Back to Topic
                          </button>
                          <h2
                            style={{
                              fontFamily: "JetBrains Mono",
                              margin: "1rem 0 1.5rem",
                            }}>
                            {meta.icon} {meta.label}
                          </h2>
                          {items.length === 0 ? (
                            <p style={{ color: "var(--muted)" }}>
                              Nothing here yet.
                            </p>
                          ) : (
                            items.map((item) => (
                              <div
                                key={item._id}
                                className="item-row-link"
                                onClick={() => {
                                  if (activeTopicContentType === "quizzes")
                                    launchCourseQuiz(item);
                                  else
                                    setActiveCourseHtmlContent(
                                      item.htmlContent,
                                    );
                                }}>
                                ⚡ {item.title}
                              </div>
                            ))
                          )}
                        </div>
                      );
                    })()}

                  {/* Viewer: Material / Lab Practical */}
                  {activeCourseHtmlContent && (
                    <div>
                      <button
                        className="action-btn close-view-btn"
                        onClick={() => setActiveCourseHtmlContent(null)}>
                        ← Close Viewport Document
                      </button>
                      <div
                        className="rendered-html-wrapper"
                        dangerouslySetInnerHTML={{
                          __html: activeCourseHtmlContent,
                        }}
                      />
                    </div>
                  )}

                  {/* Practice quiz (ephemeral, score not saved) */}
                  {activeCourseQuiz && (
                    <div
                      className="quiz-wrap"
                      style={{ minHeight: "auto", padding: 0 }}>
                      <button
                        className="action-btn close-view-btn"
                        onClick={() => setActiveCourseQuiz(null)}>
                        ← Exit Quiz Room
                      </button>
                      <div className="quiz-hero">
                        <div className="quiz-badge">🎓 Course Quiz</div>
                        <div className="quiz-title">
                          {activeCourseQuiz.title}
                        </div>
                        <div className="quiz-sub">
                          {(activeCourseQuiz.questions || []).length} questions
                          · practice mode, score isn't saved
                        </div>
                      </div>
                      {!courseQuizSubmitted ? (
                        <>
                          {(activeCourseQuiz.questions || []).map((q, i) => (
                            <div
                              className="q-card"
                              key={i}
                              style={{
                                borderLeft:
                                  courseQuizAnswers[i] !== null
                                    ? "3px solid var(--blue)"
                                    : "1px solid var(--border)",
                              }}>
                              <div className="q-num">
                                Question {String(i + 1).padStart(2, "0")}
                              </div>
                              <div className="q-text">{q.questionText}</div>
                              <div className="options">
                                {(q.options || []).map((opt, j) => (
                                  <button
                                    key={j}
                                    className={`opt ${courseQuizAnswers[i] === j ? "selected" : ""}`}
                                    onClick={() =>
                                      handleSelectCourseQuizOption(i, j)
                                    }>
                                    <div className="opt-circle">
                                      {String.fromCharCode(65 + j)}
                                    </div>
                                    <span>{opt}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                          <button
                            className="submit-btn"
                            style={{
                              background: courseQuizAnswers.every(
                                (a) => a !== null,
                              )
                                ? "var(--blue)"
                                : "transparent",
                            }}
                            disabled={courseQuizAnswers.some((a) => a === null)}
                            onClick={() => setCourseQuizSubmitted(true)}>
                            Check My Answers →
                          </button>
                        </>
                      ) : (
                        <div
                          className="result-panel"
                          style={{ display: "block" }}>
                          {(() => {
                            const correct = (
                              activeCourseQuiz.questions || []
                            ).filter(
                              (q, i) => courseQuizAnswers[i] === q.correctIndex,
                            ).length;
                            const total = activeCourseQuiz.questions.length;
                            const pct = Math.round((correct / total) * 100);
                            return (
                              <>
                                <div className="result-score">
                                  {correct} / {total}
                                </div>
                                <div className="result-label">
                                  Practice Score
                                </div>
                                <div className="stat-row">
                                  <div className="stat">
                                    <div className="stat-val s-green">
                                      {correct}
                                    </div>
                                    <div className="stat-lab">Correct</div>
                                  </div>
                                  <div className="stat">
                                    <div className="stat-val s-red">
                                      {total - correct}
                                    </div>
                                    <div className="stat-lab">Wrong</div>
                                  </div>
                                  <div className="stat">
                                    <div className="stat-val s-blue">
                                      {pct}%
                                    </div>
                                    <div className="stat-lab">Percentage</div>
                                  </div>
                                </div>
                                <button
                                  className="retry-btn"
                                  onClick={() => {
                                    setCourseQuizAnswers(
                                      new Array(total).fill(null),
                                    );
                                    setCourseQuizSubmitted(false);
                                  }}>
                                  ↺ Retry
                                </button>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <Modal modal={modal} close={closeModal} />
      </div>
      //{" "}
    </>
  );
}

//bfr upd