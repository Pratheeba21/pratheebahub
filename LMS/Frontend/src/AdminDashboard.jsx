import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal, { useModal } from "./Modal";

// const API_BASE = "http://localhost:5000/api";

// const API_BASE = import.meta.env.VITE_API_BASE;

// With fallback value
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// Or with validation
if (!import.meta.env.VITE_API_BASE) {
  console.error("API_BASE is not defined in .env file");
}

export default function AdminDashboard({ currentUser, sidebarOpen, setSidebarOpen }) {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [activeHtmlContent, setActiveHtmlContent] = useState(null);

  // Progress monitor state
  const [activeView, setActiveView] = useState(null); // null | "progress" | "subjects" | "students"
  const [progressReport, setProgressReport] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);

  const [newSubjectName, setNewSubjectName] = useState("");
  const [newStudentUser, setNewStudentUser] = useState("");
  const [newStudentPass, setNewStudentPass] = useState("");
  const [selectedProgressStudent, setSelectedProgressStudent] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  // Generic standard text form state controls
  const [contentForm, setContentForm] = useState({
    title: "",
    type: "materials",
    html: "",
  });

  // Specialized multi-question task creation states
  const [taskTopic, setTaskTopic] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [questionCount, setQuestionCount] = useState(1);
  const [taskQuestions, setTaskQuestions] = useState([
    {
      questionText: "",
      allowedLanguages: ["python"],
      initialPythonCode: "print('Hello')",
      initialJavaCode:
        'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello");\n  }\n}',
      expectedOutput: "Hello",
    },
  ]);

  // Quiz creation states
  const [quizTitle, setQuizTitle] = useState("");
  const [quizQuestionCount, setQuizQuestionCount] = useState(1);
  const [quizQuestions, setQuizQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctIndex: 0 },
  ]);

  // Admin quiz preview state
  const [previewQuiz, setPreviewQuiz] = useState(null);
  const [previewAnswers, setPreviewAnswers] = useState([]);
  const [previewSubmitted, setPreviewSubmitted] = useState(false);

  const { modal, showAlert, showConfirm, close: closeModal } = useModal();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const resSubs = await axios.get(`${API_BASE}/subjects`);
      setSubjects(resSubs.data);
      const resStuds = await axios.get(`${API_BASE}/students`);
      setStudents(resStuds.data);
    } catch (err) {
      console.error("Error updating admin control layers:", err);
    }
  };

  const fetchProgressReport = async () => {
    setProgressLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/student-progress`);
      setProgressReport(res.data);
    } catch (err) {
      console.error("Failed to load progress report:", err);
    } finally {
      setProgressLoading(false);
    }
  };

  const handleQuestionCountChange = (count) => {
    const val = parseInt(count) || 1;
    setQuestionCount(val);
    const baseQuestions = [...taskQuestions];
    if (baseQuestions.length < val) {
      while (baseQuestions.length < val) {
        baseQuestions.push({
          questionText: "",
          allowedLanguages: ["python"],
          initialPythonCode: "# Type your initial starting boilerplate here\n",
          initialJavaCode:
            "public class Main {\n    public static void main(String[] args) {\n        // Your starter code\n    }\n}",
          expectedOutput: "",
        });
      }
    } else {
      baseQuestions.splice(val);
    }
    setTaskQuestions(baseQuestions);
  };

  const updateQuestionField = (index, key, value) => {
    const updated = [...taskQuestions];
    updated[index][key] = value;
    setTaskQuestions(updated);
  };

  const handleQuizQuestionCountChange = (count) => {
    const val = parseInt(count) || 1;
    setQuizQuestionCount(val);
    const base = [...quizQuestions];
    while (base.length < val)
      base.push({ questionText: "", options: ["", "", "", ""], correctIndex: 0 });
    base.splice(val);
    setQuizQuestions(base);
  };

  const updateQuizQuestionField = (index, key, value) => {
    const updated = [...quizQuestions];
    updated[index][key] = value;
    setQuizQuestions(updated);
  };

  const updateQuizOption = (qIdx, optIdx, value) => {
    const updated = [...quizQuestions];
    updated[qIdx].options[optIdx] = value;
    setQuizQuestions(updated);
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!activeSubjectId || !quizTitle) return;
    try {
      await axios.post(`${API_BASE}/subjects/${activeSubjectId}/content`, {
        type: "quizzes",
        title: quizTitle,
        htmlContent: "",
        questions: quizQuestions,
      });
      setQuizTitle("");
      setQuizQuestionCount(1);
      setQuizQuestions([{ questionText: "", options: ["", "", "", ""], correctIndex: 0 }]);
      fetchAdminData();
      await showAlert("Quiz Created", "Quiz created successfully!", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName) return;
    try {
      await axios.post(`${API_BASE}/subjects`, { name: newSubjectName });
      setNewSubjectName("");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!newStudentUser || !newStudentPass) return;
    try {
      await axios.post(`${API_BASE}/students`, {
        username: newStudentUser,
        password: newStudentPass,
      });
      setNewStudentUser("");
      setNewStudentPass("");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadContent = async (e) => {
    e.preventDefault();
    if (!activeSubjectId || !contentForm.title || !contentForm.html || !activeTab) return;
    try {
      await axios.post(`${API_BASE}/subjects/${activeSubjectId}/content`, {
        type: activeTab,
        title: contentForm.title,
        htmlContent: contentForm.html,
      });
      setContentForm({ title: "", html: "" });
      fetchAdminData();
      await showAlert(
        "Upload Complete",
        `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} uploaded successfully!`,
        "success",
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateInteractiveTask = async (e) => {
    e.preventDefault();
    if (!activeSubjectId || !taskTitle || !taskTopic) return;
    try {
      await axios.post(`${API_BASE}/subjects/${activeSubjectId}/tasks`, {
        title: taskTitle,
        topic: taskTopic,
        questions: taskQuestions,
      });
      setTaskTitle("");
      setTaskTopic("");
      setQuestionCount(1);
      setTaskQuestions([{
        questionText: "",
        allowedLanguages: ["python"],
        initialPythonCode: "",
        initialJavaCode: "",
        expectedOutput: "",
      }]);
      fetchAdminData();
      await showAlert("Task Created", "Interactive program task node generated successfully!", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContent = async (e, contentId) => {
    e.stopPropagation();
    const confirmed = await showConfirm(
      "Delete Content",
      "Are you sure you want to delete this content module element?",
      "danger",
    );
    if (!confirmed) return;
    try {
      await axios.delete(
        `${API_BASE}/subjects/${activeSubjectId}/content/${activeTab}/${contentId}`,
      );
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubject = async (e, subjectId, subjectName) => {
    e.stopPropagation();
    const confirmed = await showConfirm(
      "Delete Subject",
      `Permanently delete "${subjectName}" and all its materials, tasks, quizzes, and student records? This cannot be undone.`,
      "danger",
    );
    if (!confirmed) return;
    try {
      await axios.delete(`${API_BASE}/subjects/${subjectId}`);
      if (activeSubjectId === subjectId) {
        setActiveSubjectId(null);
        setActiveTab(null);
        setActiveHtmlContent(null);
        setActiveView(null);
      }
      fetchAdminData();
      await showAlert("Subject Deleted", `"${subjectName}" has been permanently removed.`, "danger");
    } catch (err) {
      console.error(err);
      await showAlert("Error", "Failed to delete subject. Please try again.", "danger");
    }
  };

  const handleDeleteStudent = async (e, studentId, studentUsername) => {
    e.stopPropagation();
    const confirmed = await showConfirm(
      "Delete Student",
      `Permanently delete account "${studentUsername}" and all their submission records? This cannot be undone.`,
      "danger",
    );
    if (!confirmed) return;
    try {
      await axios.delete(`${API_BASE}/students/${studentId}`);
      fetchAdminData();
      await showAlert("Student Deleted", `"${studentUsername}" has been permanently removed.`, "danger");
    } catch (err) {
      console.error(err);
      await showAlert("Error", "Failed to delete student. Please try again.", "danger");
    }
  };

  const handleToggleSubjectAssignment = async (studentId, subjectId, isAssigned) => {
    const student = students.find((s) => s._id === studentId);
    let currentAssignedIds = student.assignedSubjects.map((s) => s._id || s);
    if (isAssigned) {
      currentAssignedIds = currentAssignedIds.filter((id) => id !== subjectId);
    } else {
      currentAssignedIds.push(subjectId);
    }
    try {
      await axios.put(`${API_BASE}/students/${studentId}/assign`, {
        subjectIds: currentAssignedIds,
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const getScoreBadgeColor = (pct) => {
    if (pct >= 80) return "var(--green)";
    if (pct >= 50) return "var(--amber)";
    return "#ef4444";
  };

  const selectedSubject = subjects.find((s) => s._id === activeSubjectId);

  // ─── Subjects Manager View ────────────────────────────────────────────────
  const renderSubjectsManager = () => (
    <div>
      <div className="hero">
        <div className="hero-badge">Subject Registry</div>
        <h1>All Subjects</h1>
      </div>

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
          onClick={() => setActiveView(null)}>
          ← Back to Control Overview
        </button>
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: "0.78rem",
            background: "#0a1628",
            border: "1px solid var(--blue)",
            padding: "5px 14px",
            borderRadius: "20px",
            color: "var(--blue)",
          }}>
          TOTAL: <b style={{ color: "var(--text)" }}>{subjects.length}</b>
        </div>
      </div>

      {/* {subjects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)", fontFamily: "JetBrains Mono", fontSize: "0.85rem" }}>
          No subjects created yet. Add one from the Control Overview.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {subjects.map((sub, idx) => ( */}
      <div style={{ marginBottom: "1.25rem", position: "relative" }}>
        <input
          type="text"
          className="input-field"
          style={{ margin: 0, paddingLeft: "2.2rem" }}
          placeholder="Search subjects by name..."
          value={subjectSearch}
          onChange={(e) => setSubjectSearch(e.target.value)}
        />
        <span
          style={{
            position: "absolute",
            left: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted)",
            fontSize: "0.85rem",
            pointerEvents: "none",
          }}>
          🔍
        </span>
      </div>

      {(() => {
        const filtered = subjects.filter((s) =>
          s.name.toLowerCase().includes(subjectSearch.toLowerCase()),
        );
        return filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              color: "var(--muted)",
              fontFamily: "JetBrains Mono",
              fontSize: "0.85rem",
            }}>
            {subjectSearch
              ? `No subjects matching "${subjectSearch}"`
              : "No subjects created yet. Add one from the Control Overview."}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}>
            {filtered.map((sub, idx) => (
              <div
                key={sub._id}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "border-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderColor = "var(--blue-dim)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background:
                        "linear-gradient(135deg, var(--blue-dim), #0a0f1d)",
                      border: "1px solid var(--blue-dim)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "JetBrains Mono",
                      fontSize: "0.75rem",
                      color: "var(--blue)",
                      fontWeight: "700",
                      flexShrink: 0,
                    }}>
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "0.95rem",
                        color: "var(--text)",
                        marginBottom: "4px",
                      }}>
                      {sub.name}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span
                        style={{
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.65rem",
                          background: "#0a1222",
                          border: "1px solid var(--blue-dim)",
                          padding: "1px 7px",
                          borderRadius: "10px",
                          color: "var(--muted)",
                        }}>
                        📘 {sub.materials?.length || 0} materials
                      </span>
                      <span
                        style={{
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.65rem",
                          background: "#1c1002",
                          border: "1px solid var(--amber-dim)",
                          padding: "1px 7px",
                          borderRadius: "10px",
                          color: "var(--muted)",
                        }}>
                        📝 {sub.tasks?.length || 0} tasks
                      </span>
                      <span
                        style={{
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.65rem",
                          background: "#1f0214",
                          border: "1px solid var(--pink-dim)",
                          padding: "1px 7px",
                          borderRadius: "10px",
                          color: "var(--muted)",
                        }}>
                        🎯 {sub.quizzes?.length || 0} quizzes
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}>
                  <button
                    className="action-btn"
                    style={{
                      padding: "6px 16px",
                      fontSize: "0.78rem",
                      borderColor: "var(--blue)",
                      color: "var(--blue)",
                    }}
                    onClick={() => {
                      setActiveSubjectId(sub._id);
                      setActiveTab(null);
                      setActiveHtmlContent(null);
                      setActiveView(null);
                    }}>
                    Open →
                  </button>
                  <button
                    style={{
                      background: "#1a0808",
                      border: "1px solid #4a1515",
                      color: "#f87171",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontFamily: "JetBrains Mono",
                      fontSize: "0.78rem",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#3b1111";
                      e.currentTarget.style.borderColor = "#7f1d1d";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "#1a0808";
                      e.currentTarget.style.borderColor = "#4a1515";
                    }}
                    onClick={(e) => handleDeleteSubject(e, sub._id, sub.name)}>
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );

  // ─── Students Manager View ────────────────────────────────────────────────
  const renderStudentsManager = () => (
    <div>
      <div className="hero">
        <div className="hero-badge">Student Registry</div>
        <h1>All Students</h1>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}>
        {/* <button className="action-btn close-view-btn" style={{ margin: 0 }} onClick={() => setActiveView(null)}>
          ← Back to Control Overview
        </button> */}
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: "0.78rem",
            background: "#1a0a28",
            border: "1px solid var(--purple)",
            padding: "5px 14px",
            borderRadius: "20px",
            color: "var(--purple)",
          }}>
          TOTAL: <b style={{ color: "var(--text)" }}>{students.length}</b>
        </div>
      </div>

      {/* {students.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)", fontFamily: "JetBrains Mono", fontSize: "0.85rem" }}>
          No students registered yet. Add one from the Control Overview.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {students.map((student) => { */}
      <div style={{ marginBottom: "1.25rem", position: "relative" }}>
        <input
          type="text"
          className="input-field"
          style={{ margin: 0, paddingLeft: "2.2rem" }}
          placeholder="Search students by username..."
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
        />
        <span
          style={{
            position: "absolute",
            left: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted)",
            fontSize: "0.85rem",
            pointerEvents: "none",
          }}>
          🔍
        </span>
      </div>

      {(() => {
        const filtered = students.filter((s) =>
          s.username.toLowerCase().includes(studentSearch.toLowerCase()),
        );
        return filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              color: "var(--muted)",
              fontFamily: "JetBrains Mono",
              fontSize: "0.85rem",
            }}>
            {studentSearch
              ? `No students matching "${studentSearch}"`
              : "No students registered yet. Add one from the Control Overview."}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}>
            {filtered.map((student) => {
              const assignedIds = student.assignedSubjects.map(
                (s) => s._id || s,
              );
              return (
                <div
                  key={student._id}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    transition: "border-color 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.borderColor = "var(--purple-dim)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }>
                  {/* Student header row */}
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid var(--border)",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background:
                            "linear-gradient(135deg, var(--purple-dim), #0a0f1d)",
                          border: "1px solid var(--purple-dim)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "JetBrains Mono",
                          fontSize: "1rem",
                          color: "var(--purple)",
                          fontWeight: "700",
                          flexShrink: 0,
                        }}>
                        {student.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: "600",
                            fontSize: "0.95rem",
                            color: "var(--text)",
                            marginBottom: "4px",
                          }}>
                          {student.username}
                        </div>
                        <span
                          style={{
                            fontFamily: "JetBrains Mono",
                            fontSize: "0.65rem",
                            background: "#150c2e",
                            border: "1px solid var(--purple-dim)",
                            padding: "1px 7px",
                            borderRadius: "10px",
                            color: "var(--muted)",
                          }}>
                          📚 {assignedIds.length} subject
                          {assignedIds.length !== 1 ? "s" : ""} assigned
                        </span>
                      </div>
                    </div>
                    <button
                      style={{
                        background: "#0a1628",
                        border: "1px solid var(--blue)",
                        color: "var(--blue)",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.78rem",
                      }}
                      onClick={async () => {
                        await fetchProgressReport();
                        setExpandedStudent(student._id);
                        setActiveView("studentProgress");
                        setSelectedProgressStudent(student._id);
                      }}>
                      📊 Progress
                    </button>
                    <button
                      style={{
                        background: "#1a0808",
                        border: "1px solid #4a1515",
                        color: "#f87171",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.78rem",
                        transition: "all 0.2s",
                        flexShrink: 0,
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#3b1111";
                        e.currentTarget.style.borderColor = "#7f1d1d";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#1a0808";
                        e.currentTarget.style.borderColor = "#4a1515";
                      }}
                      onClick={(e) =>
                        handleDeleteStudent(e, student._id, student.username)
                      }>
                      🗑 Delete Account
                    </button>
                  </div>

                  {/* Subject assignment grid */}
                  <div style={{ padding: "1rem 1.25rem" }}>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        fontFamily: "JetBrains Mono",
                        color: "var(--muted)",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        marginBottom: "0.75rem",
                      }}>
                      Subject Access Control
                    </div>
                    {subjects.length === 0 ? (
                      <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                        No subjects available to assign.
                      </p>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}>
                        {subjects.map((sub) => {
                          const isAssigned = assignedIds.some(
                            (id) => id === sub._id,
                          );
                          return (
                            <button
                              key={sub._id}
                              onClick={() =>
                                handleToggleSubjectAssignment(
                                  student._id,
                                  sub._id,
                                  isAssigned,
                                )
                              }
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "5px 12px",
                                borderRadius: "20px",
                                border: `1px solid ${isAssigned ? "var(--green)" : "var(--border)"}`,
                                background: isAssigned
                                  ? "#052e16"
                                  : "var(--bg)",
                                color: isAssigned
                                  ? "var(--green)"
                                  : "var(--muted)",
                                fontFamily: "JetBrains Mono",
                                fontSize: "0.72rem",
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              onMouseOver={(e) => {
                                if (!isAssigned) {
                                  e.currentTarget.style.borderColor =
                                    "var(--blue)";
                                  e.currentTarget.style.color = "var(--blue)";
                                }
                              }}
                              onMouseOut={(e) => {
                                if (!isAssigned) {
                                  e.currentTarget.style.borderColor =
                                    "var(--border)";
                                  e.currentTarget.style.color = "var(--muted)";
                                }
                              }}>
                              <span style={{ fontSize: "0.7rem" }}>
                                {isAssigned ? "✓" : "+"}
                              </span>
                              {sub.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
    </div>
  );


  const renderStudentProgress = () => {
    const studentData = progressReport.find(
      (s) => s.studentId === selectedProgressStudent,
    );
    if (!studentData)
      return (
        <div
          style={{
            padding: "2rem",
            color: "var(--muted)",
            fontFamily: "JetBrains Mono",
          }}>
          Loading...
        </div>
      );

    const allSubjects = studentData.subjectProgress;
    const totalTasks = allSubjects.reduce(
      (a, s) => a + s.summary.totalTasks,
      0,
    );
    const completedTasks = allSubjects.reduce(
      (a, s) => a + s.summary.completedTasks,
      0,
    );
    const totalQuizzes = allSubjects.reduce(
      (a, s) => a + s.summary.totalQuizzes,
      0,
    );
    const completedQuizzes = allSubjects.reduce(
      (a, s) => a + s.summary.completedQuizzes,
      0,
    );
    const quizAvg = allSubjects
      .filter((s) => s.summary.completedQuizzes > 0)
      .reduce((a, s, _, arr) => a + s.summary.quizAvgScore / arr.length, 0);

    // Bar chart: per-subject quiz avg
    const barMax = 100;
    const barColors = [
      "var(--blue)",
      "var(--purple)",
      "var(--pink)",
      "var(--amber)",
      "var(--green)",
      "var(--teal)",
    ];

    return (
      <div>
        <div className="hero">
          <div className="hero-badge">Student Analytics</div>
          <h1>📊 {studentData.username}</h1>
        </div>

        <button
          className="action-btn close-view-btn"
          style={{ marginBottom: "1.5rem" }}
          onClick={() => {
            setActiveView("students");
            setSelectedProgressStudent(null);
            setProgressReport([]);
          }}>
          ← Back to All Students
        </button>

        {/* ── Summary stat cards ── */}
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
              color: getScoreBadgeColor(quizAvg),
              pct: Math.round(quizAvg),
            },
            {
              label: "Subjects",
              value: allSubjects.length,
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
                  marginTop: "4px",
                  marginBottom: "10px",
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

        {/* ── Bar chart: Quiz score per subject ── */}
        {allSubjects.some((s) => s.summary.completedQuizzes > 0) && (
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
              {allSubjects
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
                          transition: "height 0.5s ease",
                          position: "relative",
                          minHeight: "4px",
                        }}
                      />
                      <div
                        style={{
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.62rem",
                          color: "var(--muted)",
                          textAlign: "center",
                          wordBreak: "break-word",
                          maxWidth: "70px",
                        }}>
                        {s.subjectName.length > 12
                          ? s.subjectName.slice(0, 12) + "…"
                          : s.subjectName}
                      </div>
                    </div>
                  );
                })}
            </div>
            {/* Y-axis reference lines */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "16px",
                marginTop: "8px",
              }}>
              {[100, 80, 50].map((v) => (
                <span
                  key={v}
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: "0.6rem",
                    color: "var(--muted)",
                  }}>
                  — {v}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Per-subject detail table ── */}
        {allSubjects.map((subj, si) => (
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

            {/* Tasks table */}
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
                        "Topic",
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
                        <td
                          style={{
                            padding: "10px 14px",
                            color: "var(--muted)",
                          }}>
                          {task.topic}
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
                                color: getScoreBadgeColor(task.avgScore),
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

            {/* Quizzes table */}
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
                                    background: getScoreBadgeColor(
                                      quiz.percentage,
                                    ),
                                    borderRadius: "20px",
                                  }}
                                />
                              </div>
                              <span
                                style={{
                                  color: getScoreBadgeColor(quiz.percentage),
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
                                ? getScoreBadgeColor(quiz.percentage)
                                : "var(--muted)",
                              border: `1px solid ${quiz.isCompleted ? getScoreBadgeColor(quiz.percentage) : "var(--border)"}`,
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
      </div>
    );
  };

  // ─── Control Overview (simplified — no student table) ─────────────────────
  const renderControlOverview = () => (
    <div>
      <div className="hero">
        <div className="hero-badge">Global Master Operations Console</div>
        <h1>Welcome Back, Principal Admin</h1>
      </div>

   

      {/* Creation forms */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div className="form-panel">
          <div className="form-title">➕ Add New Subject</div>
          <form onSubmit={handleCreateSubject}>
            <input
              type="text"
              className="input-field"
              placeholder="Subject name (e.g., Python Fundamentals)"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
            />
            <button type="submit" className="action-btn">
              Instantiate Subject Core
            </button>
          </form>
        </div>

        <div className="form-panel">
          <div className="form-title">👤 Register New Student</div>
          <form onSubmit={handleCreateStudent}>
            <input
              type="text"
              className="input-field"
              placeholder="Account username"
              value={newStudentUser}
              onChange={(e) => setNewStudentUser(e.target.value)}
            />
            <input
              type="password"
              className="input-field"
              placeholder="Initial password"
              value={newStudentPass}
              onChange={(e) => setNewStudentPass(e.target.value)}
            />
            <button type="submit" className="action-btn">
              Register Student Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* ── Sidebar ── */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <span className="sidebar-brand">⬡ ADMIN HUB</span>
        </div>

        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            {currentUser.username[0].toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div className="sidebar-username">{currentUser.username}</div>
            <span
              className={`sidebar-role-badge ${currentUser.role === "admin" ? "sidebar-role-admin" : "sidebar-role-student"}`}>
              {currentUser.role}
            </span>
          </div>
        </div>

        <div className="sidebar-menu-section">
          <div className="sidebar-heading">Core Workspace</div>
          <div
            className={`sidebar-item ${activeSubjectId === null && activeView === null ? "active" : ""}`}
            onClick={() => {
              setActiveSubjectId(null);
              setActiveTab(null);
              setActiveHtmlContent(null);
              setActiveView(null);
            }}>
            <span style={{ fontSize: "1rem" }}>⚙️</span> Control Overview
          </div>

          <div
            className={`sidebar-item ${activeView === "students" ? "active" : ""}`}
            onClick={() => {
              setActiveSubjectId(null);
              setActiveTab(null);
              setActiveHtmlContent(null);
              setActiveView("students");
            }}>
            <span style={{ fontSize: "1rem" }}>👥</span> All Students

          </div>

          <div className="sidebar-heading">Subjects</div>
          <div
            className={`sidebar-item ${activeView === "subjects" ? "active" : ""}`}
            onClick={() => {
              setActiveSubjectId(null);
              setActiveTab(null);
              setActiveHtmlContent(null);
              setActiveView("subjects");
            }}>
            <span style={{ fontSize: "1rem" }}>📚</span> All Subjects
            {subjects.length > 0 && (
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
                {subjects.length}
              </span>
            )}
          </div>
          {subjects.map((sub) => (
            <div
              key={sub._id}
              className={`sidebar-item ${activeSubjectId === sub._id ? "active" : ""}`}
              onClick={() => {
                setActiveSubjectId(sub._id);
                setActiveTab(null);
                setActiveHtmlContent(null);
                setActiveView(null);
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
          ))}
        </div>

        <div className="sidebar-footer">
          <span>●</span> LMS ENGINE v2.0
        </div>
      </div>

      {/* ── Main Viewport ── */}
      <div
        className="main-viewport"
        style={{ marginLeft: sidebarOpen ? "280px" : "0px" }}>
        {/* Progress Monitor */}
        {/* {activeView === "progress" && !activeSubjectId && renderProgressMonitor()} */}
        {activeView === "studentProgress" &&
          !activeSubjectId &&
          renderStudentProgress()}
        {/* Subjects Manager */}
        {activeView === "subjects" &&
          !activeSubjectId &&
          renderSubjectsManager()}

        {/* Students Manager */}
        {activeView === "students" &&
          !activeSubjectId &&
          renderStudentsManager()}

        {/* Subject Content Management */}
        {selectedSubject && activeView !== "progress" ? (
          <div>
            <div className="hero">
              <div className="hero-badge">Course Management Console</div>
              <h1>{selectedSubject.name}</h1>
            </div>

            {!activeTab && !activeHtmlContent && (
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
                    Inject reference nodes and study blueprints.
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
                    Tasks Workspace
                  </div>
                  <div className="interactive-card-desc">
                    Generate multi-language runtime coding task vectors.
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
                    Build and manage quiz question sets.
                  </div>
                </div>
              </div>
            )}

            {activeTab && !activeHtmlContent && (
              <div>
                <button
                  className="action-btn close-view-btn"
                  onClick={() => setActiveTab(null)}>
                  ← Back to Hub
                </button>
                <h2
                  style={{
                    textTransform: "capitalize",
                    marginBottom: "1.5rem",
                    fontFamily: "JetBrains Mono",
                  }}>
                  {activeTab} Content Index Engine
                </h2>

                {selectedSubject[activeTab]?.length === 0 ? (
                  <p style={{ color: "var(--muted)" }}>
                    No items populated inside this block category hook.
                  </p>
                ) : (
                  selectedSubject[activeTab].map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="item-row-link"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                      <span
                        onClick={() => {
                          if (activeTab !== "tasks")
                            setActiveHtmlContent(item.htmlContent);
                        }}
                        style={{ cursor: "pointer", flexGrow: 1 }}>
                        ⚡ {item.title}{" "}
                        {item.topic && (
                          <span
                            style={{
                              color: "var(--muted)",
                              fontSize: "0.8rem",
                            }}>
                            ({item.topic})
                          </span>
                        )}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}>
                        {activeTab !== "tasks" && (
                          <button
                            className="action-btn"
                            style={{
                              padding: "4px 10px",
                              fontSize: "0.75rem",
                              borderColor: "var(--blue)",
                              color: "var(--blue)",
                            }}
                            onClick={() => {
                              if (activeTab === "quizzes") {
                                setPreviewQuiz(item);
                                setPreviewAnswers(
                                  new Array((item.questions || []).length).fill(
                                    null,
                                  ),
                                );
                                setPreviewSubmitted(false);
                                setActiveHtmlContent("__quiz_preview__");
                              } else {
                                setActiveHtmlContent(item.htmlContent);
                              }
                            }}>
                            View
                          </button>
                        )}
                        <button
                          className="action-btn"
                          style={{
                            padding: "4px 10px",
                            background: "#3b1111",
                            border: "1px solid #7f1d1d",
                            color: "#f87171",
                            fontSize: "0.75rem",
                          }}
                          onClick={(e) => handleDeleteContent(e, item._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {/* Form routing */}
                {activeTab === "tasks" ? (
                  <div className="form-panel" style={{ marginTop: "3rem" }}>
                    <div
                      className="form-title"
                      style={{ color: "var(--amber)" }}>
                      📝 GENERATE INTERACTIVE RUNTIME TASKS PERMIT
                    </div>
                    <form onSubmit={handleCreateInteractiveTask}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1rem",
                        }}>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Task Container Title (e.g., Lab Assignment 02)"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                        />
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Topic Classification (e.g., Iteration Structures)"
                          value={taskTopic}
                          onChange={(e) => setTaskTopic(e.target.value)}
                        />
                      </div>
                      <label
                        style={{
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.8rem",
                          color: "var(--muted)",
                        }}>
                        HOW MANY QUESTIONS?
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="input-field"
                        style={{ marginTop: "0.5rem" }}
                        value={questionCount}
                        onChange={(e) =>
                          handleQuestionCountChange(e.target.value)
                        }
                      />
                      {taskQuestions.map((q, index) => (
                        <div
                          key={index}
                          style={{
                            borderLeft: "2px solid var(--amber)",
                            paddingLeft: "1rem",
                            marginBottom: "2rem",
                            marginTop: "1rem",
                          }}>
                          <h4 style={{ color: "var(--text)" }}>
                            Question #{index + 1} Formulation Parameters
                          </h4>
                          <textarea
                            className="input-field"
                            style={{ minHeight: "70px", marginTop: "0.5rem" }}
                            placeholder="Type Question / Challenge Statement description here..."
                            value={q.questionText}
                            onChange={(e) =>
                              updateQuestionField(
                                index,
                                "questionText",
                                e.target.value,
                              )
                            }
                          />
                          <label
                            style={{
                              fontSize: "0.8rem",
                              fontFamily: "JetBrains Mono",
                              color: "var(--muted)",
                            }}>
                            ALLOWED RUNTIME CONFIGURATIONS
                          </label>
                          <div
                            style={{
                              display: "flex",
                              gap: "15px",
                              margin: "0.5rem 0 1rem",
                            }}>
                            <label>
                              <input
                                type="checkbox"
                                checked={q.allowedLanguages.includes("python")}
                                onChange={(e) => {
                                  const curr = [...q.allowedLanguages];
                                  if (e.target.checked) curr.push("python");
                                  else curr.splice(curr.indexOf("python"), 1);
                                  updateQuestionField(
                                    index,
                                    "allowedLanguages",
                                    curr,
                                  );
                                }}
                              />{" "}
                              Python Runtime
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={q.allowedLanguages.includes("java")}
                                onChange={(e) => {
                                  const curr = [...q.allowedLanguages];
                                  if (e.target.checked) curr.push("java");
                                  else curr.splice(curr.indexOf("java"), 1);
                                  updateQuestionField(
                                    index,
                                    "allowedLanguages",
                                    curr,
                                  );
                                }}
                              />{" "}
                              Java Runtime
                            </label>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "1rem",
                            }}>
                            <div>
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  fontFamily: "JetBrains Mono",
                                  color: "var(--green)",
                                }}>
                                Initial Python Boilerplate
                              </span>
                              <textarea
                                className="input-field"
                                style={{
                                  fontFamily: "JetBrains Mono",
                                  minHeight: "100px",
                                  fontSize: "0.8rem",
                                }}
                                value={q.initialPythonCode}
                                onChange={(e) =>
                                  updateQuestionField(
                                    index,
                                    "initialPythonCode",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  fontFamily: "JetBrains Mono",
                                  color: "var(--blue)",
                                }}>
                                Initial Java Boilerplate
                              </span>
                              <textarea
                                className="input-field"
                                style={{
                                  fontFamily: "JetBrains Mono",
                                  minHeight: "100px",
                                  fontSize: "0.8rem",
                                }}
                                value={q.initialJavaCode}
                                onChange={(e) =>
                                  updateQuestionField(
                                    index,
                                    "initialJavaCode",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="Expected Console Output (For validation)"
                            value={q.expectedOutput}
                            onChange={(e) =>
                              updateQuestionField(
                                index,
                                "expectedOutput",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      ))}
                      <button
                        type="submit"
                        className="action-btn"
                        style={{
                          borderColor: "var(--amber)",
                          color: "var(--amber)",
                        }}>
                        Compile & Save Coding Task Node
                      </button>
                    </form>
                  </div>
                ) : activeTab === "quizzes" ? (
                  <div className="form-panel" style={{ marginTop: "3rem" }}>
                    <div
                      className="form-title"
                      style={{ color: "var(--pink)" }}>
                      🎯 BUILD QUIZ — Add Questions & Options
                    </div>
                    <form onSubmit={handleCreateQuiz}>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Quiz Title (e.g., Python Fundamentals Quiz)"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                      />
                      <label
                        style={{
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.8rem",
                          color: "var(--muted)",
                        }}>
                        NUMBER OF QUESTIONS
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        className="input-field"
                        style={{ marginTop: "0.5rem" }}
                        value={quizQuestionCount}
                        onChange={(e) =>
                          handleQuizQuestionCountChange(e.target.value)
                        }
                      />
                      {quizQuestions.map((q, qi) => (
                        <div
                          key={qi}
                          style={{
                            borderLeft: "2px solid var(--pink)",
                            paddingLeft: "1rem",
                            marginBottom: "2rem",
                            marginTop: "1rem",
                          }}>
                          <h4
                            style={{
                              color: "var(--text)",
                              marginBottom: "0.75rem",
                            }}>
                            Question #{qi + 1}
                          </h4>
                          <textarea
                            className="input-field"
                            style={{ minHeight: "60px" }}
                            placeholder="Question text (HTML supported)"
                            value={q.questionText}
                            onChange={(e) =>
                              updateQuizQuestionField(
                                qi,
                                "questionText",
                                e.target.value,
                              )
                            }
                          />
                          <label
                            style={{
                              fontSize: "0.75rem",
                              fontFamily: "JetBrains Mono",
                              color: "var(--muted)",
                              display: "block",
                              marginBottom: "0.5rem",
                            }}>
                            OPTIONS (mark the correct one)
                          </label>
                          {q.options.map((opt, oi) => (
                            <div
                              key={oi}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "6px",
                              }}>
                              <input
                                type="radio"
                                name={`correct_${qi}`}
                                checked={q.correctIndex === oi}
                                onChange={() =>
                                  updateQuizQuestionField(
                                    qi,
                                    "correctIndex",
                                    oi,
                                  )
                                }
                                style={{
                                  accentColor: "var(--green)",
                                  flexShrink: 0,
                                }}
                              />
                              <input
                                type="text"
                                className="input-field"
                                style={{
                                  margin: 0,
                                  flex: 1,
                                  border:
                                    q.correctIndex === oi
                                      ? "1px solid var(--green)"
                                      : "1px solid var(--border)",
                                }}
                                placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                                value={opt}
                                onChange={(e) =>
                                  updateQuizOption(qi, oi, e.target.value)
                                }
                              />
                              {q.correctIndex === oi && (
                                <span
                                  style={{
                                    fontSize: "0.7rem",
                                    color: "var(--green)",
                                    fontFamily: "JetBrains Mono",
                                    flexShrink: 0,
                                  }}>
                                  ✓ CORRECT
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                      <button
                        type="submit"
                        className="action-btn"
                        style={{
                          borderColor: "var(--pink)",
                          color: "var(--pink)",
                        }}>
                        💾 Save Quiz to Database
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="form-panel" style={{ marginTop: "3rem" }}>
                    <div
                      className="form-title"
                      style={{ color: "var(--green)" }}>
                      ➕ Inject New 📘 Material Content Node
                    </div>
                    <form onSubmit={handleUploadContent}>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Resource Topic Header"
                        value={contentForm.title}
                        onChange={(e) =>
                          setContentForm({
                            ...contentForm,
                            title: e.target.value,
                          })
                        }
                      />
                      <textarea
                        className="input-field"
                        style={{
                          minHeight: "200px",
                          fontFamily: "JetBrains Mono",
                        }}
                        placeholder="Paste full raw HTML structure code template here..."
                        value={contentForm.html}
                        onChange={(e) =>
                          setContentForm({
                            ...contentForm,
                            html: e.target.value,
                          })
                        }
                      />
                      <button type="submit" className="action-btn">
                        Map and Complete Content Upload
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {activeHtmlContent && (
              <div>
                <button
                  className="action-btn close-view-btn"
                  onClick={() => {
                    setActiveHtmlContent(null);
                    setPreviewQuiz(null);
                  }}>
                  ← Close Viewport Document
                </button>

                {activeHtmlContent === "__quiz_preview__" && previewQuiz ? (
                  <div
                    className="quiz-wrap"
                    style={{ minHeight: "auto", padding: 0 }}>
                    <div className="quiz-hero">
                      <div className="quiz-badge">👁️ Admin Preview</div>
                      <div className="quiz-title">{previewQuiz.title}</div>
                      <div className="quiz-sub">
                        {(previewQuiz.questions || []).length} questions ·
                        preview mode
                      </div>
                    </div>

                    {!previewSubmitted ? (
                      <>
                        {(previewQuiz.questions || []).map((q, i) => (
                          <div
                            className="q-card"
                            key={i}
                            style={{
                              borderLeft:
                                previewAnswers[i] !== null
                                  ? "3px solid var(--blue)"
                                  : "1px solid var(--border)",
                            }}>
                            <div className="q-num">
                              Question {String(i + 1).padStart(2, "0")}
                            </div>
                            <div
                              className="q-text"
                              dangerouslySetInnerHTML={{
                                __html: q.questionText,
                              }}
                            />
                            <div className="options">
                              {(q.options || []).map((opt, j) => (
                                <button
                                  key={j}
                                  className={`opt ${previewAnswers[i] === j ? "selected" : ""}`}
                                  onClick={() => {
                                    const upd = [...previewAnswers];
                                    upd[i] = j;
                                    setPreviewAnswers(upd);
                                  }}>
                                  <div className="opt-circle">
                                    {String.fromCharCode(65 + j)}
                                  </div>
                                  <span
                                    dangerouslySetInnerHTML={{ __html: opt }}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button
                          className="submit-btn"
                          style={{
                            background: previewAnswers.every((a) => a !== null)
                              ? "var(--blue)"
                              : "transparent",
                          }}
                          disabled={previewAnswers.some((a) => a === null)}
                          onClick={() => setPreviewSubmitted(true)}>
                          Submit Preview →
                        </button>
                      </>
                    ) : (
                      <div
                        className="result-panel"
                        style={{ display: "block" }}>
                        {(() => {
                          const correct = (previewQuiz.questions || []).filter(
                            (q, i) => previewAnswers[i] === q.correctIndex,
                          ).length;
                          const total = previewQuiz.questions.length;
                          const pct = Math.round((correct / total) * 100);
                          return (
                            <>
                              <div className="result-score">
                                {correct} / {total}
                              </div>
                              <div className="result-label">Preview Score</div>
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
                                  <div className="stat-val s-blue">{pct}%</div>
                                  <div className="stat-lab">Percentage</div>
                                </div>
                              </div>
                              <div className="answer-review">
                                {(previewQuiz.questions || []).map((q, i) => {
                                  const ua = previewAnswers[i];
                                  const isRight = ua === q.correctIndex;
                                  const strip = (s) =>
                                    s.replace(/<[^>]+>/g, "");
                                  return (
                                    <div
                                      className={`review-item ${isRight ? "r-correct" : "r-wrong"}`}
                                      key={i}>
                                      <div className="review-q">
                                        Q{i + 1}: {strip(q.questionText)}
                                      </div>
                                      <div
                                        className={`review-a ${isRight ? "" : "r-wrong"}`}>
                                        Your answer:{" "}
                                        {ua !== null
                                          ? strip(q.options[ua])
                                          : "Skipped"}
                                      </div>
                                      {!isRight && (
                                        <div className="review-correct-ans">
                                          ✓ Correct:{" "}
                                          {strip(q.options[q.correctIndex])}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              <button
                                className="retry-btn"
                                onClick={() => {
                                  setPreviewAnswers(
                                    new Array(
                                      previewQuiz.questions.length,
                                    ).fill(null),
                                  );
                                  setPreviewSubmitted(false);
                                }}>
                                ↺ Retry Preview
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ) : (
                  <iframe
                    srcDoc={activeHtmlContent}
                    title="Content Preview"
                    style={{
                      width: "100%",
                      minHeight: "85vh",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      background: "#0f1117",
                    }}
                    sandbox="allow-scripts allow-same-origin"
                  />
                )}
              </div>
            )}
          </div>
        ) : (

          !activeSubjectId &&
          activeView !== "progress" &&
          activeView !== "subjects" &&
          activeView !== "students" &&
          activeView !== "studentProgress" &&
          renderControlOverview()
        )}
      </div>

      <Modal modal={modal} close={closeModal} />
    </div>
  );
}
