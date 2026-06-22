import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal, { useModal } from "./Modal";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

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
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentMobile, setNewStudentMobile] = useState("");
  const [selectedProgressStudent, setSelectedProgressStudent] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [editingSubject, setEditingSubject] = useState(null); // { _id, name, coverImage }

  const [subjectModalStudent, setSubjectModalStudent] = useState(null); // student object for modal
  const [subjectModalDropdown, setSubjectModalDropdown] = useState(""); // selected subject id in dropdown

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

  const [subjectRequests, setSubjectRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const [showCreateMaterial, setShowCreateMaterial] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);

  const [editingMaterial, setEditingMaterial] = useState(null); // { _id, title, htmlContent }
  
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
      const resReqs = await axios.get(`${API_BASE}/subject-requests`);
      setSubjectRequests(resReqs.data);
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

  const fetchSubjectRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/subject-requests`);
      setSubjectRequests(res.data);
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      await axios.put(`${API_BASE}/subject-requests/${requestId}`, { action });
      await showAlert(
        action === "approve" ? "Access Approved" : "Request Rejected",
        action === "approve"
          ? "Student has been granted access and notified by email."
          : "Student has been notified that access was not granted.",
        action === "approve" ? "success" : "danger",
      );
      fetchSubjectRequests();
      fetchAdminData();
    } catch (err) {
      await showAlert("Error", "Failed to process request.", "danger");
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
      base.push({
        questionText: "",
        options: ["", "", "", ""],
        correctIndex: 0,
      });
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
      setQuizQuestions([
        { questionText: "", options: ["", "", "", ""], correctIndex: 0 },
      ]);
      fetchAdminData();
      await showAlert("Quiz Created", "Quiz created successfully!", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditMaterial = async (e) => {
    e.preventDefault();
    if (!editingMaterial) return;
    try {
      await axios.put(
        `${API_BASE}/subjects/${activeSubjectId}/content/materials/${editingMaterial._id}`,
        {
          title: editingMaterial.title,
          htmlContent: editingMaterial.htmlContent,
        },
      );
      setEditingMaterial(null);
      fetchAdminData();
      await showAlert("Updated", "Material updated successfully!", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditQuiz = async (e) => {
    e.preventDefault();
    if (!editingQuiz) return;
    try {
      await axios.put(
        `${API_BASE}/subjects/${activeSubjectId}/content/quizzes/${editingQuiz._id}`,
        { title: editingQuiz.title, questions: editingQuiz.questions },
      );
      setEditingQuiz(null);
      fetchAdminData();
      await showAlert("Updated", "Quiz updated successfully!", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      await axios.put(
        `${API_BASE}/subjects/${activeSubjectId}/tasks/${editingTask._id}`,
        {
          title: editingTask.title,
          topic: editingTask.topic,
          questions: editingTask.questions,
        },
      );
      setEditingTask(null);
      fetchAdminData();
      await showAlert("Updated", "Task updated successfully!", "success");
    } catch (err) {
      console.error(err);
    }
  };

  // const handleCreateSubject = async (e) => {
  //   e.preventDefault();
  //   if (!newSubjectName) return;
  //   try {
  //     await axios.post(`${API_BASE}/subjects`, { name: newSubjectName });
  //     setNewSubjectName("");
  //     fetchAdminData();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName) return;
    try {
      await axios.post(`${API_BASE}/subjects`, { name: newSubjectName });
      const created = newSubjectName;
      setNewSubjectName("");
      fetchAdminData();
      await showAlert(
        "Subject Created",
        `"${created}" has been added successfully!`,
        "success",
      );
    } catch (err) {
      console.error(err);
      await showAlert("Error", "Failed to create subject.", "danger");
    }
  };

  const handleEditSubject = async (e) => {
    e.preventDefault();
    if (!editingSubject) return;
    try {
      await axios.put(`${API_BASE}/subjects/${editingSubject._id}`, {
        name: editingSubject.name,
        coverImage: editingSubject.coverImage,
      });
      setEditingSubject(null);
      fetchAdminData();
      await showAlert("Updated", "Subject updated successfully!", "success");
    } catch (err) {
      console.error(err);
      await showAlert("Error", "Failed to update subject.", "danger");
    }
  };

  // const handleCreateStudent = async (e) => {
  //   e.preventDefault();
  //   if (!newStudentUser || !newStudentPass) return;
  //   try {
  //     await axios.post(`${API_BASE}/students`, {
  //       username: newStudentUser,
  //       password: newStudentPass,
  //     });
  //     setNewStudentUser("");
  //     setNewStudentPass("");
  //     fetchAdminData();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!newStudentUser || !newStudentPass) return;
    try {
      await axios.post(`${API_BASE}/students`, {
        username: newStudentUser,
        password: newStudentPass,
        email: newStudentEmail,
        mobile: newStudentMobile,
      });
      setNewStudentUser("");
      setNewStudentPass("");
      setNewStudentEmail("");
      setNewStudentMobile("");
      fetchAdminData();
      await showAlert(
        "Account Created!",
        `Student "${newStudentUser}" has been registered successfully.${newStudentEmail ? " A welcome email with credentials has been sent." : ""}`,
        "success",
      );
    } catch (err) {
      console.error(err);
      await showAlert("Error", "Failed to create student account.", "danger");
    }
  };

  // const handleUploadContent = async (e) => {
  //   e.preventDefault();
  //   if (
  //     !activeSubjectId ||
  //     !contentForm.title ||
  //     !contentForm.html ||
  //     !activeTab
  //   )
  //     return;
  const handleUploadContent = async (e) => {
    e.preventDefault();
    if (
      !activeSubjectId ||
      !contentForm.title ||
      !contentForm.html ||
      activeTab !== "materials"
    )
      return;
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
      setTaskQuestions([
        {
          questionText: "",
          allowedLanguages: ["python"],
          initialPythonCode: "",
          initialJavaCode: "",
          expectedOutput: "",
        },
      ]);
      fetchAdminData();
      await showAlert(
        "Task Created",
        "Interactive program task node generated successfully!",
        "success",
      );
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
      await showAlert(
        "Subject Deleted",
        `"${subjectName}" has been permanently removed.`,
        "danger",
      );
    } catch (err) {
      console.error(err);
      await showAlert(
        "Error",
        "Failed to delete subject. Please try again.",
        "danger",
      );
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
      await showAlert(
        "Student Deleted",
        `"${studentUsername}" has been permanently removed.`,
        "danger",
      );
    } catch (err) {
      console.error(err);
      await showAlert(
        "Error",
        "Failed to delete student. Please try again.",
        "danger",
      );
    }
  };

  const handleToggleSubjectAssignment = async (
    studentId,
    subjectId,
    isAssigned,
  ) => {
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
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}>
            {filtered.map((sub, idx) => (
              <div key={sub._id}>
                <div
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${editingSubject?._id === sub._id ? "var(--blue)" : "var(--border)"}`,
                    borderRadius: "14px",
                    overflow: "hidden",
                    transition: "border-color 0.2s, transform 0.2s",
                    cursor: "default",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "translateY(-2px)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }>
                  {/* Cover image */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "150px",
                      background: "linear-gradient(135deg, #0a1628, #1a0a28)",
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
                          display: "block",
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
                          flexDirection: "column",
                          gap: "8px",
                        }}>
                        <div style={{ fontSize: "2.5rem", opacity: 0.3 }}>
                          📚
                        </div>
                        <span
                          style={{
                            fontFamily: "JetBrains Mono",
                            fontSize: "0.65rem",
                            color: "var(--muted)",
                            opacity: 0.6,
                          }}>
                          NO COVER IMAGE
                        </span>
                      </div>
                    )}
                    {/* Index badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "#0a0f1dcc",
                        border: "1px solid var(--blue-dim)",
                        borderRadius: "6px",
                        padding: "2px 8px",
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.65rem",
                        color: "var(--blue)",
                        fontWeight: "700",
                      }}>
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ padding: "1rem 1.1rem" }}>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "0.95rem",
                        color: "var(--text)",
                        marginBottom: "0.6rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                      {sub.name}
                    </div>

                    {/* Stats row */}
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

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="action-btn"
                        style={{
                          flex: 1,
                          padding: "6px 0",
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
                        className="action-btn"
                        style={{
                          padding: "6px 10px",
                          fontSize: "0.78rem",
                          borderColor: "var(--green)",
                          color: "var(--green)",
                        }}
                        onClick={() =>
                          setEditingSubject(
                            editingSubject?._id === sub._id
                              ? null
                              : {
                                  _id: sub._id,
                                  name: sub.name,
                                  coverImage: sub.coverImage || "",
                                },
                          )
                        }>
                        ✏
                      </button>
                      <button
                        style={{
                          background: "#1a0808",
                          border: "1px solid #4a1515",
                          color: "#f87171",
                          padding: "6px 10px",
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
                        onClick={(e) =>
                          handleDeleteSubject(e, sub._id, sub.name)
                        }>
                        🗑
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline edit panel */}
                {/* Inline edit panel */}
                {editingSubject?._id === sub._id && (
                  <div
                    style={{
                      background: "#0a1222",
                      border: "1px solid var(--blue)",
                      borderRadius: "10px",
                      padding: "1.1rem",
                      marginTop: "0.5rem",
                    }}>
                    <div
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.72rem",
                        color: "var(--blue)",
                        marginBottom: "0.75rem",
                        letterSpacing: "1px",
                      }}>
                      ✏ EDITING: {sub.name}
                    </div>
                    <form onSubmit={handleEditSubject}>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Subject name"
                        value={editingSubject.name}
                        onChange={(e) =>
                          setEditingSubject({
                            ...editingSubject,
                            name: e.target.value,
                          })
                        }
                      />
                      <input
                        type="url"
                        className="input-field"
                        placeholder="Cover image URL (https://...)"
                        value={editingSubject.coverImage}
                        onChange={(e) =>
                          setEditingSubject({
                            ...editingSubject,
                            coverImage: e.target.value,
                          })
                        }
                      />
                      {/* Live preview */}
                      {editingSubject.coverImage && (
                        <div style={{ marginBottom: "0.75rem" }}>
                          <div
                            style={{
                              fontFamily: "JetBrains Mono",
                              fontSize: "0.65rem",
                              color: "var(--muted)",
                              marginBottom: "4px",
                            }}>
                            PREVIEW
                          </div>
                          <img
                            src={editingSubject.coverImage}
                            alt="preview"
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid var(--border)",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="submit"
                          className="action-btn"
                          style={{
                            borderColor: "var(--blue)",
                            color: "var(--blue)",
                          }}>
                          💾 Save
                        </button>
                        <button
                          type="button"
                          className="action-btn"
                          style={{
                            borderColor: "var(--muted)",
                            color: "var(--muted)",
                          }}
                          onClick={() => setEditingSubject(null)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })()}
      {/* ── Subject Edit Modal ── */}
      {editingSubject && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingSubject(null);
          }}>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--blue)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "480px",
              padding: "1.75rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}>
              <div>
                <div
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: "0.65rem",
                    color: "var(--blue)",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}>
                  Editing Subject
                </div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "1rem",
                    color: "var(--text)",
                  }}>
                  {editingSubject.name}
                </div>
              </div>
              <button
                onClick={() => setEditingSubject(null)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--muted)",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubject}>
              <input
                type="text"
                className="input-field"
                placeholder="Subject name"
                value={editingSubject.name}
                onChange={(e) =>
                  setEditingSubject({ ...editingSubject, name: e.target.value })
                }
              />
              <input
                type="url"
                className="input-field"
                placeholder="Cover image URL (https://...)"
                value={editingSubject.coverImage}
                onChange={(e) =>
                  setEditingSubject({
                    ...editingSubject,
                    coverImage: e.target.value,
                  })
                }
              />
              {editingSubject.coverImage && (
                <div style={{ marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: "0.65rem",
                      color: "var(--muted)",
                      marginBottom: "6px",
                    }}>
                    COVER PREVIEW
                  </div>
                  <img
                    src={editingSubject.coverImage}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div
                style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
                <button
                  type="submit"
                  className="action-btn"
                  style={{
                    flex: 1,
                    borderColor: "var(--blue)",
                    color: "var(--blue)",
                  }}>
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  className="action-btn"
                  style={{ borderColor: "var(--muted)", color: "var(--muted)" }}
                  onClick={() => setEditingSubject(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // // ─── Students Manager View ────────────────────────────────────────────────
  // const renderStudentsManager = () => (
  //   <div>
  //     <div className="hero">
  //       <div className="hero-badge">Student Registry</div>
  //       <h1>All Students</h1>
  //     </div>

  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "space-between",
  //         alignItems: "center",
  //         marginBottom: "1.5rem",
  //       }}>
  //       {/* <button className="action-btn close-view-btn" style={{ margin: 0 }} onClick={() => setActiveView(null)}>
  //         ← Back to Control Overview
  //       </button> */}
  //       <div
  //         style={{
  //           fontFamily: "JetBrains Mono",
  //           fontSize: "0.78rem",
  //           background: "#1a0a28",
  //           border: "1px solid var(--purple)",
  //           padding: "5px 14px",
  //           borderRadius: "20px",
  //           color: "var(--purple)",
  //         }}>
  //         TOTAL: <b style={{ color: "var(--text)" }}>{students.length}</b>
  //       </div>
  //     </div>

  //     {/* {students.length === 0 ? (
  //       <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)", fontFamily: "JetBrains Mono", fontSize: "0.85rem" }}>
  //         No students registered yet. Add one from the Control Overview.
  //       </div>
  //     ) : (
  //       <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
  //         {students.map((student) => { */}
  //     <div style={{ marginBottom: "1.25rem", position: "relative" }}>
  //       <input
  //         type="text"
  //         className="input-field"
  //         style={{ margin: 0, paddingLeft: "2.2rem" }}
  //         placeholder="Search students by username..."
  //         value={studentSearch}
  //         onChange={(e) => setStudentSearch(e.target.value)}
  //       />
  //       <span
  //         style={{
  //           position: "absolute",
  //           left: "0.75rem",
  //           top: "50%",
  //           transform: "translateY(-50%)",
  //           color: "var(--muted)",
  //           fontSize: "0.85rem",
  //           pointerEvents: "none",
  //         }}>
  //         🔍
  //       </span>
  //     </div>

  //     {(() => {
  //       const filtered = students.filter((s) =>
  //         s.username.toLowerCase().includes(studentSearch.toLowerCase()),
  //       );
  //       return filtered.length === 0 ? (
  //         <div
  //           style={{
  //             textAlign: "center",
  //             padding: "4rem",
  //             color: "var(--muted)",
  //             fontFamily: "JetBrains Mono",
  //             fontSize: "0.85rem",
  //           }}>
  //           {studentSearch
  //             ? `No students matching "${studentSearch}"`
  //             : "No students registered yet. Add one from the Control Overview."}
  //         </div>
  //       ) : (
  //         <div
  //           style={{
  //             display: "flex",
  //             flexDirection: "column",
  //             gap: "0.75rem",
  //           }}>
  //           {filtered.map((student) => {
  //             const assignedIds = student.assignedSubjects.map(
  //               (s) => s._id || s,
  //             );
  //             return (
  //               <div
  //                 key={student._id}
  //                 style={{
  //                   background: "var(--surface)",
  //                   border: "1px solid var(--border)",
  //                   borderRadius: "10px",
  //                   overflow: "hidden",
  //                   transition: "border-color 0.2s",
  //                 }}
  //                 onMouseOver={(e) =>
  //                   (e.currentTarget.style.borderColor = "var(--purple-dim)")
  //                 }
  //                 onMouseOut={(e) =>
  //                   (e.currentTarget.style.borderColor = "var(--border)")
  //                 }>
  //                 {/* Student header row */}
  //                 <div
  //                   style={{
  //                     padding: "1rem 1.25rem",
  //                     display: "flex",
  //                     alignItems: "center",
  //                     justifyContent: "space-between",
  //                     borderBottom: "1px solid var(--border)",
  //                   }}>
  //                   <div
  //                     style={{
  //                       display: "flex",
  //                       alignItems: "center",
  //                       gap: "1rem",
  //                     }}>
  //                     <div
  //                       style={{
  //                         width: "40px",
  //                         height: "40px",
  //                         borderRadius: "10px",
  //                         background:
  //                           "linear-gradient(135deg, var(--purple-dim), #0a0f1d)",
  //                         border: "1px solid var(--purple-dim)",
  //                         display: "flex",
  //                         alignItems: "center",
  //                         justifyContent: "center",
  //                         fontFamily: "JetBrains Mono",
  //                         fontSize: "1rem",
  //                         color: "var(--purple)",
  //                         fontWeight: "700",
  //                         flexShrink: 0,
  //                       }}>
  //                       {student.username[0].toUpperCase()}
  //                     </div>
  //                     <div>
  //                       <div
  //                         style={{
  //                           fontWeight: "600",
  //                           fontSize: "0.95rem",
  //                           color: "var(--text)",
  //                           marginBottom: "4px",
  //                         }}>
  //                         {student.username}
  //                       </div>
  //                       <span
  //                         style={{
  //                           fontFamily: "JetBrains Mono",
  //                           fontSize: "0.65rem",
  //                           background: "#150c2e",
  //                           border: "1px solid var(--purple-dim)",
  //                           padding: "1px 7px",
  //                           borderRadius: "10px",
  //                           color: "var(--muted)",
  //                         }}>
  //                         📚 {assignedIds.length} subject
  //                         {assignedIds.length !== 1 ? "s" : ""} assigned
  //                       </span>
  //                     </div>
  //                   </div>
  //                   <button
  //                     style={{
  //                       background: "#0a1628",
  //                       border: "1px solid var(--blue)",
  //                       color: "var(--blue)",
  //                       padding: "6px 14px",
  //                       borderRadius: "8px",
  //                       cursor: "pointer",
  //                       fontFamily: "JetBrains Mono",
  //                       fontSize: "0.78rem",
  //                     }}
  //                     onClick={async () => {
  //                       await fetchProgressReport();
  //                       setExpandedStudent(student._id);
  //                       setActiveView("studentProgress");
  //                       setSelectedProgressStudent(student._id);
  //                     }}>
  //                     📊 Progress
  //                   </button>
  //                   <button
  //                     style={{
  //                       background: "#1a0808",
  //                       border: "1px solid #4a1515",
  //                       color: "#f87171",
  //                       padding: "6px 14px",
  //                       borderRadius: "8px",
  //                       cursor: "pointer",
  //                       fontFamily: "JetBrains Mono",
  //                       fontSize: "0.78rem",
  //                       transition: "all 0.2s",
  //                       flexShrink: 0,
  //                     }}
  //                     onMouseOver={(e) => {
  //                       e.currentTarget.style.background = "#3b1111";
  //                       e.currentTarget.style.borderColor = "#7f1d1d";
  //                     }}
  //                     onMouseOut={(e) => {
  //                       e.currentTarget.style.background = "#1a0808";
  //                       e.currentTarget.style.borderColor = "#4a1515";
  //                     }}
  //                     onClick={(e) =>
  //                       handleDeleteStudent(e, student._id, student.username)
  //                     }>
  //                     🗑 Delete Account
  //                   </button>
  //                 </div>

  //                 {/* Subject assignment grid */}
  //                 <div style={{ padding: "1rem 1.25rem" }}>
  //                   <div
  //                     style={{
  //                       fontSize: "0.65rem",
  //                       fontFamily: "JetBrains Mono",
  //                       color: "var(--muted)",
  //                       letterSpacing: "1.5px",
  //                       textTransform: "uppercase",
  //                       marginBottom: "0.75rem",
  //                     }}>
  //                     Subject Access Control
  //                   </div>
  //                   {subjects.length === 0 ? (
  //                     <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
  //                       No subjects available to assign.
  //                     </p>
  //                   ) : (
  //                     <div
  //                       style={{
  //                         display: "flex",
  //                         flexWrap: "wrap",
  //                         gap: "8px",
  //                       }}>
  //                       {subjects.map((sub) => {
  //                         const isAssigned = assignedIds.some(
  //                           (id) => id === sub._id,
  //                         );
  //                         return (
  //                           <button
  //                             key={sub._id}
  //                             onClick={() =>
  //                               handleToggleSubjectAssignment(
  //                                 student._id,
  //                                 sub._id,
  //                                 isAssigned,
  //                               )
  //                             }
  //                             style={{
  //                               display: "flex",
  //                               alignItems: "center",
  //                               gap: "6px",
  //                               padding: "5px 12px",
  //                               borderRadius: "20px",
  //                               border: `1px solid ${isAssigned ? "var(--green)" : "var(--border)"}`,
  //                               background: isAssigned
  //                                 ? "#052e16"
  //                                 : "var(--bg)",
  //                               color: isAssigned
  //                                 ? "var(--green)"
  //                                 : "var(--muted)",
  //                               fontFamily: "JetBrains Mono",
  //                               fontSize: "0.72rem",
  //                               cursor: "pointer",
  //                               transition: "all 0.2s",
  //                             }}
  //                             onMouseOver={(e) => {
  //                               if (!isAssigned) {
  //                                 e.currentTarget.style.borderColor =
  //                                   "var(--blue)";
  //                                 e.currentTarget.style.color = "var(--blue)";
  //                               }
  //                             }}
  //                             onMouseOut={(e) => {
  //                               if (!isAssigned) {
  //                                 e.currentTarget.style.borderColor =
  //                                   "var(--border)";
  //                                 e.currentTarget.style.color = "var(--muted)";
  //                               }
  //                             }}>
  //                             <span style={{ fontSize: "0.7rem" }}>
  //                               {isAssigned ? "✓" : "+"}
  //                             </span>
  //                             {sub.name}
  //                           </button>
  //                         );
  //                       })}
  //                     </div>
  //                   )}
  //                 </div>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       );
  //     })()}
  //   </div>
  // );

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
        <div style={{ position: "relative", flex: 1, maxWidth: "380px" }}>
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
              background: "var(--surface)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
            }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>👤</div>
            {studentSearch
              ? `No students matching "${studentSearch}"`
              : "No students registered yet."}
          </div>
        ) : (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              overflow: "hidden",
            }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "JetBrains Mono",
                fontSize: "0.8rem",
              }}>
              <thead>
                <tr
                  style={{
                    background: "#150c2e",
                    borderBottom: "2px solid var(--purple)",
                  }}>
                  {["Student", "Email", "Mobile", "Subjects", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          color: "var(--purple)",
                          fontWeight: "700",
                          fontSize: "0.65rem",
                          letterSpacing: "1.5px",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}>
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, idx) => {
                  const assignedIds = student.assignedSubjects.map(
                    (s) => s._id || s,
                  );
                  return (
                    <tr
                      key={student._id}
                      style={{
                        borderBottom:
                          idx < filtered.length - 1
                            ? "1px solid var(--border)"
                            : "none",
                        background: idx % 2 === 0 ? "transparent" : "#ffffff04",
                        transition: "background 0.15s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#150c2e55")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          idx % 2 === 0 ? "transparent" : "#ffffff04")
                      }>
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "9px",
                              background:
                                "linear-gradient(135deg, var(--purple-dim), #0a0f1d)",
                              border: "1px solid var(--purple-dim)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "JetBrains Mono",
                              fontSize: "0.9rem",
                              color: "var(--purple)",
                              fontWeight: "700",
                              flexShrink: 0,
                            }}>
                            {student.username[0].toUpperCase()}
                          </div>
                          <span
                            style={{ color: "var(--text)", fontWeight: "600" }}>
                            {student.username}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          color: "var(--muted)",
                          fontSize: "0.75rem",
                        }}>
                        {student.email || (
                          <span
                            style={{
                              color: "var(--border)",
                              fontStyle: "italic",
                            }}>
                            —
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          color: "var(--muted)",
                          fontSize: "0.75rem",
                        }}>
                        {student.mobile || (
                          <span
                            style={{
                              color: "var(--border)",
                              fontStyle: "italic",
                            }}>
                            —
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button
                          style={{
                            background: "#0a1222",
                            border: "1px solid var(--blue-dim)",
                            borderRadius: "20px",
                            padding: "4px 12px",
                            fontFamily: "JetBrains Mono",
                            fontSize: "0.68rem",
                            color: "var(--blue)",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = "var(--blue)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.borderColor =
                              "var(--blue-dim)";
                          }}
                          onClick={() => {
                            setSubjectModalStudent(student);
                            setSubjectModalDropdown("");
                          }}>
                          📚 {assignedIds.length} subject
                          {assignedIds.length !== 1 ? "s" : ""} →
                        </button>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "nowrap",
                          }}>
                          <button
                            style={{
                              background: "#0a1628",
                              border: "1px solid var(--blue)",
                              color: "var(--blue)",
                              padding: "5px 12px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontFamily: "JetBrains Mono",
                              fontSize: "0.72rem",
                              whiteSpace: "nowrap",
                              transition: "all 0.2s",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = "#0e1f3d";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = "#0a1628";
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
                              padding: "5px 12px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontFamily: "JetBrains Mono",
                              fontSize: "0.72rem",
                              whiteSpace: "nowrap",
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
                            onClick={(e) =>
                              handleDeleteStudent(
                                e,
                                student._id,
                                student.username,
                              )
                            }>
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })()}

      {/* ── Subject Assignment Modal ── */}
      {subjectModalStudent &&
        (() => {
          const student = subjectModalStudent;
          const assignedIds = student.assignedSubjects.map((s) => s._id || s);
          const assignedSubjectObjects = subjects.filter((s) =>
            assignedIds.some((id) => id === s._id),
          );
          const unassignedSubjects = subjects.filter(
            (s) => !assignedIds.some((id) => id === s._id),
          );
          return (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setSubjectModalStudent(null);
              }}>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--purple)",
                  borderRadius: "16px",
                  width: "100%",
                  maxWidth: "520px",
                  maxHeight: "80vh",
                  overflow: "auto",
                  padding: "1.75rem",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                }}>
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}>
                  <div>
                    <div
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.65rem",
                        color: "var(--purple)",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}>
                      Subject Access Control
                    </div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "1rem",
                        color: "var(--text)",
                      }}>
                      {student.username}
                    </div>
                  </div>
                  <button
                    onClick={() => setSubjectModalStudent(null)}
                    style={{
                      background: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--muted)",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    ✕
                  </button>
                </div>

                {/* Assigned subjects */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <div
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: "0.65rem",
                      color: "var(--muted)",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      marginBottom: "0.75rem",
                    }}>
                    Enrolled Subjects ({assignedSubjectObjects.length})
                  </div>
                  {assignedSubjectObjects.length === 0 ? (
                    <div
                      style={{
                        color: "var(--muted)",
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.8rem",
                        padding: "1rem",
                        background: "var(--bg)",
                        borderRadius: "8px",
                        border: "1px dashed var(--border)",
                      }}>
                      No subjects assigned yet.
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}>
                      {assignedSubjectObjects.map((sub) => (
                        <div
                          key={sub._id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "#052e16",
                            border: "1px solid var(--green)",
                            borderRadius: "8px",
                            padding: "8px 14px",
                          }}>
                          <span
                            style={{
                              fontFamily: "JetBrains Mono",
                              fontSize: "0.82rem",
                              color: "var(--green)",
                            }}>
                            ✓ {sub.name}
                          </span>
                          <button
                            style={{
                              background: "#1a0808",
                              border: "1px solid #4a1515",
                              color: "#f87171",
                              padding: "3px 10px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontFamily: "JetBrains Mono",
                              fontSize: "0.7rem",
                              transition: "all 0.2s",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = "#3b1111";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = "#1a0808";
                            }}
                            onClick={async () => {
                              await handleToggleSubjectAssignment(
                                student._id,
                                sub._id,
                                true,
                              );
                              const updated = await (
                                await fetch(`${API_BASE}/students`)
                              ).json();
                              const refreshed = updated.find(
                                (s) => s._id === student._id,
                              );
                              if (refreshed) setSubjectModalStudent(refreshed);
                            }}>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add new subject */}
                {unassignedSubjects.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.65rem",
                        color: "var(--muted)",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        marginBottom: "0.75rem",
                      }}>
                      Assign New Subject
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <select
                        value={subjectModalDropdown}
                        onChange={(e) =>
                          setSubjectModalDropdown(e.target.value)
                        }
                        style={{
                          flex: 1,
                          background: "var(--bg)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          color: "var(--text)",
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.8rem",
                          outline: "none",
                          cursor: "pointer",
                        }}>
                        <option value="">— Select a subject —</option>
                        {unassignedSubjects.map((sub) => (
                          <option key={sub._id} value={sub._id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="action-btn"
                        style={{
                          borderColor: "var(--blue)",
                          color: "var(--blue)",
                          padding: "8px 16px",
                          opacity: subjectModalDropdown ? 1 : 0.5,
                        }}
                        disabled={!subjectModalDropdown}
                        onClick={async () => {
                          if (!subjectModalDropdown) return;
                          await handleToggleSubjectAssignment(
                            student._id,
                            subjectModalDropdown,
                            false,
                          );
                          setSubjectModalDropdown("");
                          const updated = await (
                            await fetch(`${API_BASE}/students`)
                          ).json();
                          const refreshed = updated.find(
                            (s) => s._id === student._id,
                          );
                          if (refreshed) setSubjectModalStudent(refreshed);
                        }}>
                        + Assign
                      </button>
                    </div>
                  </div>
                )}
                {unassignedSubjects.length === 0 &&
                  assignedSubjectObjects.length > 0 && (
                    <div
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: "0.78rem",
                        color: "var(--muted)",
                        textAlign: "center",
                        marginTop: "1rem",
                        padding: "0.75rem",
                        background: "var(--bg)",
                        borderRadius: "8px",
                        border: "1px dashed var(--border)",
                      }}>
                      All available subjects are already assigned.
                    </div>
                  )}
              </div>
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
        }}>
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
            <input
              type="email"
              className="input-field"
              placeholder="Student email address"
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
            />
            <input
              type="tel"
              className="input-field"
              placeholder="Mobile number"
              value={newStudentMobile}
              onChange={(e) => setNewStudentMobile(e.target.value)}
            />
            <button type="submit" className="action-btn">
              Register Student Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // const renderSubjectRequests = () => (
  //   <div>
  //     <div className="hero">
  //       <div className="hero-badge">Access Control Queue</div>
  //       <h1>Subject Access Requests</h1>
  //     </div>
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "space-between",
  //         alignItems: "center",
  //         marginBottom: "1.5rem",
  //       }}>
  //       <button
  //         className="action-btn close-view-btn"
  //         style={{ margin: 0 }}
  //         onClick={() => setActiveView(null)}>
  //         ← Back to Control Overview
  //       </button>
  //       <div
  //         style={{
  //           fontFamily: "JetBrains Mono",
  //           fontSize: "0.78rem",
  //           background: "#1c1002",
  //           border: "1px solid var(--amber)",
  //           padding: "5px 14px",
  //           borderRadius: "20px",
  //           color: "var(--amber)",
  //         }}>
  //         PENDING:{" "}
  //         <b style={{ color: "var(--text)" }}>{subjectRequests.length}</b>
  //       </div>
  //     </div>

  //     {requestsLoading ? (
  //       <div
  //         style={{
  //           textAlign: "center",
  //           padding: "4rem",
  //           color: "var(--muted)",
  //           fontFamily: "JetBrains Mono",
  //         }}>
  //         Loading requests...
  //       </div>
  //     ) : subjectRequests.length === 0 ? (
  //       <div
  //         style={{
  //           textAlign: "center",
  //           padding: "4rem",
  //           color: "var(--muted)",
  //           fontFamily: "JetBrains Mono",
  //           fontSize: "0.85rem",
  //         }}>
  //         No pending access requests.
  //       </div>
  //     ) : (
  //       <div
  //         style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
  //         {subjectRequests.map((req) => (
  //           <div
  //             key={req._id}
  //             style={{
  //               background: "var(--surface)",
  //               border: "1px solid var(--border)",
  //               borderRadius: "10px",
  //               padding: "1.1rem 1.25rem",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "space-between",
  //               gap: "1rem",
  //               flexWrap: "wrap",
  //             }}>
  //             <div
  //               style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
  //               <div
  //                 style={{
  //                   width: "40px",
  //                   height: "40px",
  //                   borderRadius: "10px",
  //                   background:
  //                     "linear-gradient(135deg, var(--blue-dim), #0a0f1d)",
  //                   border: "1px solid var(--blue-dim)",
  //                   display: "flex",
  //                   alignItems: "center",
  //                   justifyContent: "center",
  //                   fontFamily: "JetBrains Mono",
  //                   fontSize: "1rem",
  //                   color: "var(--blue)",
  //                   fontWeight: "700",
  //                   flexShrink: 0,
  //                 }}>
  //                 {req.username[0].toUpperCase()}
  //               </div>
  //               <div>
  //                 <div
  //                   style={{
  //                     fontWeight: "600",
  //                     fontSize: "0.95rem",
  //                     color: "var(--text)",
  //                     marginBottom: "4px",
  //                   }}>
  //                   {req.username}
  //                 </div>
  //                 <div
  //                   style={{
  //                     fontFamily: "JetBrains Mono",
  //                     fontSize: "0.72rem",
  //                     color: "var(--muted)",
  //                   }}>
  //                   Requesting access to{" "}
  //                   <span style={{ color: "var(--blue)" }}>
  //                     {req.subjectId?.name || "Unknown Subject"}
  //                   </span>
  //                 </div>
  //                 {req.email && (
  //                   <div
  //                     style={{
  //                       fontFamily: "JetBrains Mono",
  //                       fontSize: "0.65rem",
  //                       color: "var(--muted)",
  //                       marginTop: "2px",
  //                     }}>
  //                     📧 {req.email}
  //                   </div>
  //                 )}
  //                 <div
  //                   style={{
  //                     fontFamily: "JetBrains Mono",
  //                     fontSize: "0.62rem",
  //                     color: "var(--muted)",
  //                     marginTop: "2px",
  //                   }}>
  //                   🕒 {new Date(req.requestedAt).toLocaleString()}
  //                 </div>
  //               </div>
  //             </div>
  //             <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
  //               <button
  //                 className="action-btn"
  //                 style={{
  //                   padding: "7px 18px",
  //                   borderColor: "var(--green)",
  //                   color: "var(--green)",
  //                   fontSize: "0.8rem",
  //                 }}
  //                 onClick={() => handleRequestAction(req._id, "approve")}>
  //                 ✓ Approve
  //               </button>
  //               <button
  //                 style={{
  //                   background: "#1a0808",
  //                   border: "1px solid #4a1515",
  //                   color: "#f87171",
  //                   padding: "7px 18px",
  //                   borderRadius: "8px",
  //                   cursor: "pointer",
  //                   fontFamily: "JetBrains Mono",
  //                   fontSize: "0.8rem",
  //                 }}
  //                 onMouseOver={(e) => {
  //                   e.currentTarget.style.background = "#3b1111";
  //                 }}
  //                 onMouseOut={(e) => {
  //                   e.currentTarget.style.background = "#1a0808";
  //                 }}
  //                 onClick={() => handleRequestAction(req._id, "reject")}>
  //                 ✕ Reject
  //               </button>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );

  const renderSubjectRequests = () => (
    <div>
      <div className="hero">
        <div className="hero-badge">Access Control Queue</div>
        <h1>Subject Access Requests</h1>
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
            background: "#1c1002",
            border: "1px solid var(--amber)",
            padding: "5px 14px",
            borderRadius: "20px",
            color: "var(--amber)",
          }}>
          PENDING:{" "}
          <b style={{ color: "var(--text)" }}>{subjectRequests.length}</b>
        </div>
      </div>

      {requestsLoading ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem",
            color: "var(--muted)",
            fontFamily: "JetBrains Mono",
          }}>
          Loading requests...
        </div>
      ) : subjectRequests.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem",
            color: "var(--muted)",
            fontFamily: "JetBrains Mono",
            fontSize: "0.85rem",
            background: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
          }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📭</div>
          No pending access requests at this time.
        </div>
      ) : (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            overflow: "hidden",
          }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "JetBrains Mono",
              fontSize: "0.8rem",
            }}>
            <thead>
              <tr
                style={{
                  background: "#1c1002",
                  borderBottom: "2px solid var(--amber)",
                }}>
                {[
                  "Student",
                  "Email",
                  "Requested Subject",
                  "Requested At",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      color: "var(--amber)",
                      fontWeight: "700",
                      fontSize: "0.65rem",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjectRequests.map((req, idx) => (
                <tr
                  key={req._id}
                  style={{
                    borderBottom:
                      idx < subjectRequests.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    background: idx % 2 === 0 ? "transparent" : "#ffffff04",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#1c100288")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      idx % 2 === 0 ? "transparent" : "#ffffff04")
                  }>
                  <td style={{ padding: "14px 16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}>
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "8px",
                          background:
                            "linear-gradient(135deg, var(--blue-dim), #0a0f1d)",
                          border: "1px solid var(--blue-dim)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.85rem",
                          color: "var(--blue)",
                          fontWeight: "700",
                          flexShrink: 0,
                        }}>
                        {req.username[0].toUpperCase()}
                      </div>
                      <span style={{ color: "var(--text)", fontWeight: "600" }}>
                        {req.username}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "var(--muted)",
                      fontSize: "0.75rem",
                    }}>
                    {req.email || (
                      <span
                        style={{ color: "var(--border)", fontStyle: "italic" }}>
                        —
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        background: "#0a1628",
                        border: "1px solid var(--blue-dim)",
                        borderRadius: "20px",
                        padding: "3px 12px",
                        color: "var(--blue)",
                        fontSize: "0.75rem",
                      }}>
                      📚 {req.subjectId?.name || "Unknown"}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "var(--muted)",
                      fontSize: "0.72rem",
                      whiteSpace: "nowrap",
                    }}>
                    🕒 {new Date(req.requestedAt).toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="action-btn"
                        style={{
                          padding: "5px 14px",
                          borderColor: "var(--green)",
                          color: "var(--green)",
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                        }}
                        onClick={() => handleRequestAction(req._id, "approve")}>
                        ✓ Approve
                      </button>
                      <button
                        style={{
                          background: "#1a0808",
                          border: "1px solid #4a1515",
                          color: "#f87171",
                          padding: "5px 14px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontFamily: "JetBrains Mono",
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                          transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#3b1111";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "#1a0808";
                        }}
                        onClick={() => handleRequestAction(req._id, "reject")}>
                        ✕ Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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

          <div
            className={`sidebar-item ${activeView === "requests" ? "active" : ""}`}
            onClick={() => {
              setActiveSubjectId(null);
              setActiveTab(null);
              setActiveHtmlContent(null);
              setActiveView("requests");
              fetchSubjectRequests();
            }}>
            <span style={{ fontSize: "1rem" }}>📬</span> Access Requests
            {subjectRequests.length > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  background: "#1c1002",
                  border: "1px solid var(--amber)",
                  color: "var(--amber)",
                  fontFamily: "JetBrains Mono",
                  fontSize: "0.62rem",
                  padding: "1px 7px",
                  borderRadius: "10px",
                }}>
                {subjectRequests.length}
              </span>
            )}
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

        {activeView === "requests" &&
          !activeSubjectId &&
          renderSubjectRequests()}

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
                {/* <button
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
                </h2> */}
                {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}>
                  <button
                    className="action-btn close-view-btn"
                    style={{ margin: 0 }}
                    onClick={() => {
                      setActiveTab(null);
                      setShowCreateMaterial(false);
                      setShowCreateTask(false);
                      setShowCreateQuiz(false);
                    }}>
                    ← Back to Hub
                  </button>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}>
                    <h2
                      style={{
                        textTransform: "capitalize",
                        fontFamily: "JetBrains Mono",
                        margin: 0,
                      }}>
                      {activeTab} Content Index Engine
                    </h2>
                    {activeTab === "materials" && (
                      <button
                        className="action-btn"
                        style={{
                          padding: "6px 16px",
                          fontSize: "0.8rem",
                          borderColor: showCreateMaterial
                            ? "var(--muted)"
                            : "var(--green)",
                          color: showCreateMaterial
                            ? "var(--muted)"
                            : "var(--green)",
                        }}
                        onClick={() => setShowCreateMaterial((v) => !v)}>
                        {showCreateMaterial ? "✕ Cancel" : "➕ New Material"}
                      </button>
                    )}
                    {activeTab === "tasks" && (
                      <button
                        className="action-btn"
                        style={{
                          padding: "6px 16px",
                          fontSize: "0.8rem",
                          borderColor: showCreateTask
                            ? "var(--muted)"
                            : "var(--amber)",
                          color: showCreateTask
                            ? "var(--muted)"
                            : "var(--amber)",
                        }}
                        onClick={() => setShowCreateTask((v) => !v)}>
                        {showCreateTask ? "✕ Cancel" : "➕ New Task"}
                      </button>
                    )}
                    {activeTab === "quizzes" && (
                      <button
                        className="action-btn"
                        style={{
                          padding: "6px 16px",
                          fontSize: "0.8rem",
                          borderColor: showCreateQuiz
                            ? "var(--muted)"
                            : "var(--pink)",
                          color: showCreateQuiz
                            ? "var(--muted)"
                            : "var(--pink)",
                        }}
                        onClick={() => setShowCreateQuiz((v) => !v)}>
                        {showCreateQuiz ? "✕ Cancel" : "➕ New Quiz"}
                      </button>
                    )}
                  </div>
                </div> */}

                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                    minHeight: "42px",
                  }}>
                  <button
                    className="action-btn close-view-btn"
                    style={{ margin: 0, position: "absolute", left: 0 }}
                    onClick={() => {
                      setActiveTab(null);
                      setShowCreateMaterial(false);
                      setShowCreateTask(false);
                      setShowCreateQuiz(false);
                    }}>
                    ← Back to Hub
                  </button>

                  <h2
                    style={{
                      textTransform: "capitalize",
                      fontFamily: "JetBrains Mono",
                      margin: 0,
                      textAlign: "center",
                    }}>
                    {activeTab} Content Index Engine
                  </h2>

                  <div style={{ position: "absolute", right: 0 }}>
                    {activeTab === "materials" && (
                      <button
                        className="action-btn"
                        style={{
                          padding: "6px 16px",
                          fontSize: "0.8rem",
                          borderColor: "var(--green)",
                          color: "var(--green)",
                        }}
                        onClick={() => setShowCreateMaterial(true)}>
                        ➕ New Material
                      </button>
                    )}
                    {activeTab === "tasks" && (
                      <button
                        className="action-btn"
                        style={{
                          padding: "6px 16px",
                          fontSize: "0.8rem",
                          borderColor: "var(--amber)",
                          color: "var(--amber)",
                        }}
                        onClick={() => setShowCreateTask(true)}>
                        ➕ New Task
                      </button>
                    )}
                    {activeTab === "quizzes" && (
                      <button
                        className="action-btn"
                        style={{
                          padding: "6px 16px",
                          fontSize: "0.8rem",
                          borderColor: "var(--pink)",
                          color: "var(--pink)",
                        }}
                        onClick={() => setShowCreateQuiz(true)}>
                        ➕ New Quiz
                      </button>
                    )}
                  </div>
                </div>

                {selectedSubject[activeTab]?.length === 0 ? (
                  <p style={{ color: "var(--muted)" }}>
                    No items populated inside this block category hook.
                  </p>
                ) : (
                  selectedSubject[activeTab].map((item, idx) => (
                    <div key={item._id || idx}>
                      <div
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
                          {/* ── Materials: Edit button ── */}
                          {activeTab === "materials" && (
                            <button
                              className="action-btn"
                              style={{
                                padding: "4px 10px",
                                fontSize: "0.75rem",
                                borderColor: "var(--green)",
                                color: "var(--green)",
                              }}
                              onClick={() =>
                                setEditingMaterial(
                                  editingMaterial?._id === item._id
                                    ? null
                                    : {
                                        _id: item._id,
                                        title: item.title,
                                        htmlContent: item.htmlContent,
                                      },
                                )
                              }>
                              {editingMaterial?._id === item._id
                                ? "Cancel"
                                : "✏ Edit"}
                            </button>
                          )}

                          {/* ── Quizzes: Edit button ── */}
                          {activeTab === "quizzes" && (
                            <button
                              className="action-btn"
                              style={{
                                padding: "4px 10px",
                                fontSize: "0.75rem",
                                borderColor: "var(--green)",
                                color: "var(--green)",
                              }}
                              onClick={() =>
                                setEditingQuiz(
                                  editingQuiz?._id === item._id
                                    ? null
                                    : {
                                        _id: item._id,
                                        title: item.title,
                                        questions: item.questions.map((q) => ({
                                          questionText: q.questionText,
                                          options: [...q.options],
                                          correctIndex: q.correctIndex,
                                        })),
                                      },
                                )
                              }>
                              {editingQuiz?._id === item._id
                                ? "Cancel"
                                : "✏ Edit"}
                            </button>
                          )}

                          {/* ── Tasks: Edit button ── */}
                          {activeTab === "tasks" && (
                            <button
                              className="action-btn"
                              style={{
                                padding: "4px 10px",
                                fontSize: "0.75rem",
                                borderColor: "var(--green)",
                                color: "var(--green)",
                              }}
                              onClick={() =>
                                setEditingTask(
                                  editingTask?._id === item._id
                                    ? null
                                    : {
                                        _id: item._id,
                                        title: item.title,
                                        topic: item.topic,
                                        questions: item.questions.map((q) => ({
                                          ...q,
                                          allowedLanguages: [
                                            ...q.allowedLanguages,
                                          ],
                                        })),
                                      },
                                )
                              }>
                              {editingTask?._id === item._id
                                ? "Cancel"
                                : "✏ Edit"}
                            </button>
                          )}

                          {/* ── Quizzes/Materials: View button ── */}
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
                                    new Array(
                                      (item.questions || []).length,
                                    ).fill(null),
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

                      {/* ── Inline edit: Materials ── */}
                      {activeTab === "materials" &&
                        editingMaterial?._id === item._id && (
                          <div
                            style={{
                              background: "#0a1222",
                              border: "1px solid var(--green)",
                              borderRadius: "10px",
                              padding: "1.25rem",
                              marginBottom: "1rem",
                            }}>
                            <div
                              style={{
                                fontFamily: "JetBrains Mono",
                                fontSize: "0.75rem",
                                color: "var(--green)",
                                marginBottom: "0.75rem",
                                letterSpacing: "1px",
                              }}>
                              ✏ EDITING: {item.title}
                            </div>
                            <form onSubmit={handleEditMaterial}>
                              <input
                                type="text"
                                className="input-field"
                                placeholder="Material title"
                                value={editingMaterial.title}
                                onChange={(e) =>
                                  setEditingMaterial({
                                    ...editingMaterial,
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
                                placeholder="HTML content..."
                                value={editingMaterial.htmlContent}
                                onChange={(e) =>
                                  setEditingMaterial({
                                    ...editingMaterial,
                                    htmlContent: e.target.value,
                                  })
                                }
                              />
                              <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                  type="submit"
                                  className="action-btn"
                                  style={{
                                    borderColor: "var(--green)",
                                    color: "var(--green)",
                                  }}>
                                  💾 Save Changes
                                </button>
                                <button
                                  type="button"
                                  className="action-btn"
                                  style={{
                                    borderColor: "var(--muted)",
                                    color: "var(--muted)",
                                  }}
                                  onClick={() => setEditingMaterial(null)}>
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                      {/* ── Inline edit: Quizzes ── */}
                      {activeTab === "quizzes" &&
                        editingQuiz?._id === item._id && (
                          <div
                            style={{
                              background: "#1f0214",
                              border: "1px solid var(--pink)",
                              borderRadius: "10px",
                              padding: "1.25rem",
                              marginBottom: "1rem",
                            }}>
                            <div
                              style={{
                                fontFamily: "JetBrains Mono",
                                fontSize: "0.75rem",
                                color: "var(--pink)",
                                marginBottom: "0.75rem",
                                letterSpacing: "1px",
                              }}>
                              ✏ EDITING QUIZ: {item.title}
                            </div>

                            <form onSubmit={handleEditQuiz}>
                              <input
                                type="text"
                                className="input-field"
                                placeholder="Quiz title"
                                value={editingQuiz.title}
                                onChange={(e) =>
                                  setEditingQuiz({
                                    ...editingQuiz,
                                    title: e.target.value,
                                  })
                                }
                              />

                              {/* Question count controls */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  marginBottom: "1rem",
                                }}>
                                <span
                                  style={{
                                    fontFamily: "JetBrains Mono",
                                    fontSize: "0.75rem",
                                    color: "var(--muted)",
                                  }}>
                                  QUESTIONS: {editingQuiz.questions.length}
                                </span>
                                <button
                                  type="button"
                                  className="action-btn"
                                  style={{
                                    padding: "3px 12px",
                                    fontSize: "0.75rem",
                                    borderColor: "var(--pink)",
                                    color: "var(--pink)",
                                  }}
                                  onClick={() =>
                                    setEditingQuiz({
                                      ...editingQuiz,
                                      questions: [
                                        ...editingQuiz.questions,
                                        {
                                          questionText: "",
                                          options: ["", "", "", ""],
                                          correctIndex: 0,
                                        },
                                      ],
                                    })
                                  }>
                                  + Add Question
                                </button>
                              </div>

                              {editingQuiz.questions.map((q, qi) => (
                                <div
                                  key={qi}
                                  style={{
                                    borderLeft: "2px solid var(--pink)",
                                    paddingLeft: "1rem",
                                    marginBottom: "1.5rem",
                                    marginTop: "1rem",
                                    position: "relative",
                                  }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      marginBottom: "0.75rem",
                                    }}>
                                    <h4
                                      style={{
                                        color: "var(--text)",
                                        margin: 0,
                                      }}>
                                      Question #{qi + 1}
                                    </h4>
                                    {editingQuiz.questions.length > 1 && (
                                      <button
                                        type="button"
                                        style={{
                                          background: "#1a0808",
                                          border: "1px solid #4a1515",
                                          color: "#f87171",
                                          padding: "3px 10px",
                                          borderRadius: "6px",
                                          cursor: "pointer",
                                          fontFamily: "JetBrains Mono",
                                          fontSize: "0.7rem",
                                        }}
                                        onClick={() => {
                                          const updated =
                                            editingQuiz.questions.filter(
                                              (_, i) => i !== qi,
                                            );
                                          setEditingQuiz({
                                            ...editingQuiz,
                                            questions: updated,
                                          });
                                        }}>
                                        🗑 Remove
                                      </button>
                                    )}
                                  </div>
                                  <textarea
                                    className="input-field"
                                    style={{ minHeight: "60px" }}
                                    placeholder="Question text"
                                    value={q.questionText}
                                    onChange={(e) => {
                                      const updated = [
                                        ...editingQuiz.questions,
                                      ];
                                      updated[qi] = {
                                        ...updated[qi],
                                        questionText: e.target.value,
                                      };
                                      setEditingQuiz({
                                        ...editingQuiz,
                                        questions: updated,
                                      });
                                    }}
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
                                        name={`edit_correct_${qi}`}
                                        checked={q.correctIndex === oi}
                                        onChange={() => {
                                          const updated = [
                                            ...editingQuiz.questions,
                                          ];
                                          updated[qi] = {
                                            ...updated[qi],
                                            correctIndex: oi,
                                          };
                                          setEditingQuiz({
                                            ...editingQuiz,
                                            questions: updated,
                                          });
                                        }}
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
                                        value={opt}
                                        onChange={(e) => {
                                          const updated = [
                                            ...editingQuiz.questions,
                                          ];
                                          const newOpts = [
                                            ...updated[qi].options,
                                          ];
                                          newOpts[oi] = e.target.value;
                                          updated[qi] = {
                                            ...updated[qi],
                                            options: newOpts,
                                          };
                                          setEditingQuiz({
                                            ...editingQuiz,
                                            questions: updated,
                                          });
                                        }}
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
                                      {/* Allow removing an option if more than 2 exist */}
                                      {q.options.length > 2 && (
                                        <button
                                          type="button"
                                          style={{
                                            background: "transparent",
                                            border: "none",
                                            color: "#f87171",
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
                                            flexShrink: 0,
                                          }}
                                          onClick={() => {
                                            const updated = [
                                              ...editingQuiz.questions,
                                            ];
                                            const newOpts = updated[
                                              qi
                                            ].options.filter(
                                              (_, i) => i !== oi,
                                            );
                                            const newCorrect =
                                              q.correctIndex >= newOpts.length
                                                ? newOpts.length - 1
                                                : q.correctIndex === oi
                                                  ? 0
                                                  : q.correctIndex > oi
                                                    ? q.correctIndex - 1
                                                    : q.correctIndex;
                                            updated[qi] = {
                                              ...updated[qi],
                                              options: newOpts,
                                              correctIndex: newCorrect,
                                            };
                                            setEditingQuiz({
                                              ...editingQuiz,
                                              questions: updated,
                                            });
                                          }}>
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                  {/* Add option button */}
                                  {q.options.length < 6 && (
                                    <button
                                      type="button"
                                      style={{
                                        background: "transparent",
                                        border: "1px dashed var(--pink)",
                                        color: "var(--pink)",
                                        padding: "4px 12px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontFamily: "JetBrains Mono",
                                        fontSize: "0.7rem",
                                        marginTop: "4px",
                                      }}
                                      onClick={() => {
                                        const updated = [
                                          ...editingQuiz.questions,
                                        ];
                                        updated[qi] = {
                                          ...updated[qi],
                                          options: [...updated[qi].options, ""],
                                        };
                                        setEditingQuiz({
                                          ...editingQuiz,
                                          questions: updated,
                                        });
                                      }}>
                                      + Add Option
                                    </button>
                                  )}
                                </div>
                              ))}

                              <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                  type="submit"
                                  className="action-btn"
                                  style={{
                                    borderColor: "var(--pink)",
                                    color: "var(--pink)",
                                  }}>
                                  💾 Save Quiz
                                </button>
                                <button
                                  type="button"
                                  className="action-btn"
                                  style={{
                                    borderColor: "var(--muted)",
                                    color: "var(--muted)",
                                  }}
                                  onClick={() => setEditingQuiz(null)}>
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                      {/* ── Inline edit: Tasks ── */}
                      {activeTab === "tasks" &&
                        editingTask?._id === item._id && (
                          <div
                            style={{
                              background: "#1c1002",
                              border: "1px solid var(--amber)",
                              borderRadius: "10px",
                              padding: "1.25rem",
                              marginBottom: "1rem",
                            }}>
                            <div
                              style={{
                                fontFamily: "JetBrains Mono",
                                fontSize: "0.75rem",
                                color: "var(--amber)",
                                marginBottom: "0.75rem",
                                letterSpacing: "1px",
                              }}>
                              ✏ EDITING TASK: {item.title}
                            </div>

                            <form onSubmit={handleEditTask}>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: "1rem",
                                }}>
                                <input
                                  type="text"
                                  className="input-field"
                                  placeholder="Task title"
                                  value={editingTask.title}
                                  onChange={(e) =>
                                    setEditingTask({
                                      ...editingTask,
                                      title: e.target.value,
                                    })
                                  }
                                />
                                <input
                                  type="text"
                                  className="input-field"
                                  placeholder="Topic"
                                  value={editingTask.topic}
                                  onChange={(e) =>
                                    setEditingTask({
                                      ...editingTask,
                                      topic: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              {/* Question count controls */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  marginBottom: "1rem",
                                }}>
                                <span
                                  style={{
                                    fontFamily: "JetBrains Mono",
                                    fontSize: "0.75rem",
                                    color: "var(--muted)",
                                  }}>
                                  QUESTIONS: {editingTask.questions.length}
                                </span>
                                <button
                                  type="button"
                                  className="action-btn"
                                  style={{
                                    padding: "3px 12px",
                                    fontSize: "0.75rem",
                                    borderColor: "var(--amber)",
                                    color: "var(--amber)",
                                  }}
                                  onClick={() =>
                                    setEditingTask({
                                      ...editingTask,
                                      questions: [
                                        ...editingTask.questions,
                                        {
                                          questionText: "",
                                          allowedLanguages: ["python"],
                                          initialPythonCode:
                                            "# Your starter code\n",
                                          initialJavaCode:
                                            "public class Main {\n    public static void main(String[] args) {\n        // Your starter code\n    }\n}",
                                          expectedOutput: "",
                                        },
                                      ],
                                    })
                                  }>
                                  + Add Question
                                </button>
                              </div>

                              {editingTask.questions.map((q, qi) => (
                                <div
                                  key={qi}
                                  style={{
                                    borderLeft: "2px solid var(--amber)",
                                    paddingLeft: "1rem",
                                    marginBottom: "2rem",
                                    marginTop: "1rem",
                                  }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      marginBottom: "0.5rem",
                                    }}>
                                    <h4
                                      style={{
                                        color: "var(--text)",
                                        margin: 0,
                                      }}>
                                      Question #{qi + 1}
                                    </h4>
                                    {editingTask.questions.length > 1 && (
                                      <button
                                        type="button"
                                        style={{
                                          background: "#1a0808",
                                          border: "1px solid #4a1515",
                                          color: "#f87171",
                                          padding: "3px 10px",
                                          borderRadius: "6px",
                                          cursor: "pointer",
                                          fontFamily: "JetBrains Mono",
                                          fontSize: "0.7rem",
                                        }}
                                        onClick={() => {
                                          const updated =
                                            editingTask.questions.filter(
                                              (_, i) => i !== qi,
                                            );
                                          setEditingTask({
                                            ...editingTask,
                                            questions: updated,
                                          });
                                        }}>
                                        🗑 Remove
                                      </button>
                                    )}
                                  </div>
                                  <textarea
                                    className="input-field"
                                    style={{
                                      minHeight: "70px",
                                      marginTop: "0.5rem",
                                    }}
                                    placeholder="Question / Challenge Statement"
                                    value={q.questionText}
                                    onChange={(e) => {
                                      const updated = [
                                        ...editingTask.questions,
                                      ];
                                      updated[qi] = {
                                        ...updated[qi],
                                        questionText: e.target.value,
                                      };
                                      setEditingTask({
                                        ...editingTask,
                                        questions: updated,
                                      });
                                    }}
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
                                    {["python", "java"].map((lang) => (
                                      <label key={lang}>
                                        <input
                                          type="checkbox"
                                          checked={q.allowedLanguages.includes(
                                            lang,
                                          )}
                                          onChange={(e) => {
                                            const updated = [
                                              ...editingTask.questions,
                                            ];
                                            let langs = [
                                              ...updated[qi].allowedLanguages,
                                            ];
                                            if (e.target.checked)
                                              langs.push(lang);
                                            else
                                              langs = langs.filter(
                                                (l) => l !== lang,
                                              );
                                            updated[qi] = {
                                              ...updated[qi],
                                              allowedLanguages: langs,
                                            };
                                            setEditingTask({
                                              ...editingTask,
                                              questions: updated,
                                            });
                                          }}
                                        />{" "}
                                        {lang === "python"
                                          ? "Python Runtime"
                                          : "Java Runtime"}
                                      </label>
                                    ))}
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
                                        onChange={(e) => {
                                          const updated = [
                                            ...editingTask.questions,
                                          ];
                                          updated[qi] = {
                                            ...updated[qi],
                                            initialPythonCode: e.target.value,
                                          };
                                          setEditingTask({
                                            ...editingTask,
                                            questions: updated,
                                          });
                                        }}
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
                                        onChange={(e) => {
                                          const updated = [
                                            ...editingTask.questions,
                                          ];
                                          updated[qi] = {
                                            ...updated[qi],
                                            initialJavaCode: e.target.value,
                                          };
                                          setEditingTask({
                                            ...editingTask,
                                            questions: updated,
                                          });
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <textarea
                                    className="input-field"
                                    placeholder="Expected Console Output"
                                    value={q.expectedOutput}
                                    onChange={(e) => {
                                      const updated = [
                                        ...editingTask.questions,
                                      ];
                                      updated[qi] = {
                                        ...updated[qi],
                                        expectedOutput: e.target.value,
                                      };
                                      setEditingTask({
                                        ...editingTask,
                                        questions: updated,
                                      });
                                    }}
                                  />
                                </div>
                              ))}

                              <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                  type="submit"
                                  className="action-btn"
                                  style={{
                                    borderColor: "var(--amber)",
                                    color: "var(--amber)",
                                  }}>
                                  💾 Save Task
                                </button>
                                <button
                                  type="button"
                                  className="action-btn"
                                  style={{
                                    borderColor: "var(--muted)",
                                    color: "var(--muted)",
                                  }}
                                  onClick={() => setEditingTask(null)}>
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                    </div>
                  ))
                )}

                {/* Form routing */}
                {activeTab === "tasks" && showCreateTask && (
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
                        <textarea
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
                )}
                {activeTab === "quizzes" && showCreateQuiz && (
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
                )}
                {activeTab === "materials" && showCreateMaterial && (
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

                {/* ── Modal: New Material ── */}
                {showCreateMaterial && (
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      background: "rgba(0,0,0,0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1000,
                    }}
                    onClick={(e) => {
                      if (e.target === e.currentTarget)
                        setShowCreateMaterial(false);
                    }}>
                    <div
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--green)",
                        borderRadius: "16px",
                        width: "100%",
                        maxWidth: "640px",
                        maxHeight: "85vh",
                        overflow: "auto",
                        padding: "2rem",
                        boxShadow: "0 24px 80px rgba(0,0,0,0.9)",
                      }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1.5rem",
                        }}>
                        <div>
                          <div
                            style={{
                              fontFamily: "JetBrains Mono",
                              fontSize: "0.65rem",
                              color: "var(--green)",
                              letterSpacing: "1.5px",
                              textTransform: "uppercase",
                              marginBottom: "4px",
                            }}>
                            {selectedSubject?.name}
                          </div>
                          <div
                            style={{
                              fontWeight: "700",
                              fontSize: "1.1rem",
                              color: "var(--text)",
                            }}>
                            ➕ New Material
                          </div>
                        </div>
                        <button
                          onClick={() => setShowCreateMaterial(false)}
                          style={{
                            background: "transparent",
                            border: "1px solid var(--border)",
                            color: "var(--muted)",
                            width: "34px",
                            height: "34px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          ✕
                        </button>
                      </div>
                      <form
                        onSubmit={async (e) => {
                          await handleUploadContent(e);
                          setShowCreateMaterial(false);
                        }}>
                        <label
                          style={{
                            fontFamily: "JetBrains Mono",
                            fontSize: "0.72rem",
                            color: "var(--muted)",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "6px",
                          }}>
                          Title
                        </label>
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
                        <label
                          style={{
                            fontFamily: "JetBrains Mono",
                            fontSize: "0.72rem",
                            color: "var(--muted)",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "6px",
                            marginTop: "1rem",
                          }}>
                          HTML Content
                        </label>
                        <textarea
                          className="input-field"
                          style={{
                            minHeight: "280px",
                            fontFamily: "JetBrains Mono",
                            fontSize: "0.8rem",
                          }}
                          placeholder="Paste full raw HTML content here..."
                          value={contentForm.html}
                          onChange={(e) =>
                            setContentForm({
                              ...contentForm,
                              html: e.target.value,
                            })
                          }
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "1rem",
                          }}>
                          <button
                            type="submit"
                            className="action-btn"
                            style={{
                              flex: 1,
                              borderColor: "var(--green)",
                              color: "var(--green)",
                              padding: "10px",
                            }}>
                            💾 Upload Material
                          </button>
                          <button
                            type="button"
                            className="action-btn"
                            style={{
                              borderColor: "var(--muted)",
                              color: "var(--muted)",
                              padding: "10px 18px",
                            }}
                            onClick={() => setShowCreateMaterial(false)}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* ── Modal: New Task ── */}
                {showCreateTask && (
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      background: "rgba(0,0,0,0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1000,
                    }}
                    onClick={(e) => {
                      if (e.target === e.currentTarget)
                        setShowCreateTask(false);
                    }}>
                    <div
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--amber)",
                        borderRadius: "16px",
                        width: "100%",
                        maxWidth: "780px",
                        maxHeight: "88vh",
                        overflow: "auto",
                        padding: "2rem",
                        boxShadow: "0 24px 80px rgba(0,0,0,0.9)",
                      }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1.5rem",
                        }}>
                        <div>
                          <div
                            style={{
                              fontFamily: "JetBrains Mono",
                              fontSize: "0.65rem",
                              color: "var(--amber)",
                              letterSpacing: "1.5px",
                              textTransform: "uppercase",
                              marginBottom: "4px",
                            }}>
                            {selectedSubject?.name}
                          </div>
                          <div
                            style={{
                              fontWeight: "700",
                              fontSize: "1.1rem",
                              color: "var(--text)",
                            }}>
                            📝 New Coding Task
                          </div>
                        </div>
                        <button
                          onClick={() => setShowCreateTask(false)}
                          style={{
                            background: "transparent",
                            border: "1px solid var(--border)",
                            color: "var(--muted)",
                            width: "34px",
                            height: "34px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          ✕
                        </button>
                      </div>
                      <form
                        onSubmit={async (e) => {
                          await handleCreateInteractiveTask(e);
                          setShowCreateTask(false);
                        }}>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                          }}>
                          <div>
                            <label
                              style={{
                                fontFamily: "JetBrains Mono",
                                fontSize: "0.72rem",
                                color: "var(--muted)",
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                                display: "block",
                                marginBottom: "6px",
                              }}>
                              Task Title
                            </label>
                            <input
                              type="text"
                              className="input-field"
                              style={{ margin: 0 }}
                              placeholder="e.g., Lab Assignment 02"
                              value={taskTitle}
                              onChange={(e) => setTaskTitle(e.target.value)}
                            />
                          </div>
                          <div>
                            <label
                              style={{
                                fontFamily: "JetBrains Mono",
                                fontSize: "0.72rem",
                                color: "var(--muted)",
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                                display: "block",
                                marginBottom: "6px",
                              }}>
                              Topic
                            </label>
                            <input
                              type="text"
                              className="input-field"
                              style={{ margin: 0 }}
                              placeholder="e.g., Iteration Structures"
                              value={taskTopic}
                              onChange={(e) => setTaskTopic(e.target.value)}
                            />
                          </div>
                        </div>
                        <div style={{ marginTop: "1rem" }}>
                          <label
                            style={{
                              fontFamily: "JetBrains Mono",
                              fontSize: "0.72rem",
                              color: "var(--muted)",
                              letterSpacing: "1px",
                              textTransform: "uppercase",
                              display: "block",
                              marginBottom: "6px",
                            }}>
                            Number of Questions
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            className="input-field"
                            style={{ margin: 0, maxWidth: "120px" }}
                            value={questionCount}
                            onChange={(e) =>
                              handleQuestionCountChange(e.target.value)
                            }
                          />
                        </div>
                        {taskQuestions.map((q, index) => (
                          <div
                            key={index}
                            style={{
                              borderLeft: "2px solid var(--amber)",
                              paddingLeft: "1rem",
                              marginTop: "1.5rem",
                              paddingBottom: "1rem",
                              borderBottom:
                                index < taskQuestions.length - 1
                                  ? "1px solid var(--border)"
                                  : "none",
                            }}>
                            <div
                              style={{
                                fontFamily: "JetBrains Mono",
                                fontSize: "0.72rem",
                                color: "var(--amber)",
                                marginBottom: "0.75rem",
                                letterSpacing: "1px",
                              }}>
                              QUESTION #{index + 1}
                            </div>
                            <textarea
                              className="input-field"
                              style={{ minHeight: "70px" }}
                              placeholder="Challenge statement..."
                              value={q.questionText}
                              onChange={(e) =>
                                updateQuestionField(
                                  index,
                                  "questionText",
                                  e.target.value,
                                )
                              }
                            />
                            <div
                              style={{
                                display: "flex",
                                gap: "15px",
                                margin: "0.5rem 0 1rem",
                              }}>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={q.allowedLanguages.includes(
                                    "python",
                                  )}
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
                                Python
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
                                Java
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
                                    fontSize: "0.72rem",
                                    fontFamily: "JetBrains Mono",
                                    color: "var(--green)",
                                    display: "block",
                                    marginBottom: "4px",
                                  }}>
                                  Python Boilerplate
                                </span>
                                <textarea
                                  className="input-field"
                                  style={{
                                    fontFamily: "JetBrains Mono",
                                    minHeight: "90px",
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
                                    fontSize: "0.72rem",
                                    fontFamily: "JetBrains Mono",
                                    color: "var(--blue)",
                                    display: "block",
                                    marginBottom: "4px",
                                  }}>
                                  Java Boilerplate
                                </span>
                                <textarea
                                  className="input-field"
                                  style={{
                                    fontFamily: "JetBrains Mono",
                                    minHeight: "90px",
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
                            <textarea
                              className="input-field"
                              placeholder="Expected Output (for validation)"
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
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "1.5rem",
                          }}>
                          <button
                            type="submit"
                            className="action-btn"
                            style={{
                              flex: 1,
                              borderColor: "var(--amber)",
                              color: "var(--amber)",
                              padding: "10px",
                            }}>
                            💾 Save Task
                          </button>
                          <button
                            type="button"
                            className="action-btn"
                            style={{
                              borderColor: "var(--muted)",
                              color: "var(--muted)",
                              padding: "10px 18px",
                            }}
                            onClick={() => setShowCreateTask(false)}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* ── Modal: New Quiz ── */}
                {showCreateQuiz && (
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      background: "rgba(0,0,0,0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1000,
                    }}
                    onClick={(e) => {
                      if (e.target === e.currentTarget)
                        setShowCreateQuiz(false);
                    }}>
                    <div
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--pink)",
                        borderRadius: "16px",
                        width: "100%",
                        maxWidth: "700px",
                        maxHeight: "88vh",
                        overflow: "auto",
                        padding: "2rem",
                        boxShadow: "0 24px 80px rgba(0,0,0,0.9)",
                      }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1.5rem",
                        }}>
                        <div>
                          <div
                            style={{
                              fontFamily: "JetBrains Mono",
                              fontSize: "0.65rem",
                              color: "var(--pink)",
                              letterSpacing: "1.5px",
                              textTransform: "uppercase",
                              marginBottom: "4px",
                            }}>
                            {selectedSubject?.name}
                          </div>
                          <div
                            style={{
                              fontWeight: "700",
                              fontSize: "1.1rem",
                              color: "var(--text)",
                            }}>
                            🎯 New Quiz
                          </div>
                        </div>
                        <button
                          onClick={() => setShowCreateQuiz(false)}
                          style={{
                            background: "transparent",
                            border: "1px solid var(--border)",
                            color: "var(--muted)",
                            width: "34px",
                            height: "34px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          ✕
                        </button>
                      </div>
                      <form
                        onSubmit={async (e) => {
                          await handleCreateQuiz(e);
                          setShowCreateQuiz(false);
                        }}>
                        <label
                          style={{
                            fontFamily: "JetBrains Mono",
                            fontSize: "0.72rem",
                            color: "var(--muted)",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "6px",
                          }}>
                          Quiz Title
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g., Python Fundamentals Quiz"
                          value={quizTitle}
                          onChange={(e) => setQuizTitle(e.target.value)}
                        />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            margin: "1rem 0",
                          }}>
                          <label
                            style={{
                              fontFamily: "JetBrains Mono",
                              fontSize: "0.72rem",
                              color: "var(--muted)",
                              letterSpacing: "1px",
                              textTransform: "uppercase",
                            }}>
                            Questions:
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            className="input-field"
                            style={{ margin: 0, maxWidth: "100px" }}
                            value={quizQuestionCount}
                            onChange={(e) =>
                              handleQuizQuestionCountChange(e.target.value)
                            }
                          />
                        </div>
                        {quizQuestions.map((q, qi) => (
                          <div
                            key={qi}
                            style={{
                              borderLeft: "2px solid var(--pink)",
                              paddingLeft: "1rem",
                              marginBottom: "1.5rem",
                              paddingBottom: "1rem",
                              borderBottom:
                                qi < quizQuestions.length - 1
                                  ? "1px solid var(--border)"
                                  : "none",
                            }}>
                            <div
                              style={{
                                fontFamily: "JetBrains Mono",
                                fontSize: "0.72rem",
                                color: "var(--pink)",
                                marginBottom: "0.6rem",
                                letterSpacing: "1px",
                              }}>
                              QUESTION #{qi + 1}
                            </div>
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
                                fontSize: "0.72rem",
                                fontFamily: "JetBrains Mono",
                                color: "var(--muted)",
                                display: "block",
                                margin: "0.5rem 0",
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                              }}>
                              Options — select the correct answer
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
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "0.5rem",
                          }}>
                          <button
                            type="submit"
                            className="action-btn"
                            style={{
                              flex: 1,
                              borderColor: "var(--pink)",
                              color: "var(--pink)",
                              padding: "10px",
                            }}>
                            💾 Save Quiz
                          </button>
                          <button
                            type="button"
                            className="action-btn"
                            style={{
                              borderColor: "var(--muted)",
                              color: "var(--muted)",
                              padding: "10px 18px",
                            }}
                            onClick={() => setShowCreateQuiz(false)}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
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
          activeView !== "requests" &&
          renderControlOverview()
        )}
      </div>

      <Modal modal={modal} close={closeModal} />
    </div>
  );
}
