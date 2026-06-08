import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";


export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please fill in all security fields.");
      return;
    }
    try {
      // Backend authentication call
      const res = await axios.post(`${API_BASE}/auth/login`, {
        username,
        password,
      });
      onLoginSuccess(res.data); // Expecting { token, username, role }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "1.5rem",
      }}>
      <div
        className="form-panel"
        style={{
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="hero-badge">🔐 LMS GATEWAY</div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, var(--blue), var(--purple))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            Portal Sign-In
          </h1>
        </div>

        {error && (
          <div className="warn" style={{ margin: "0 0 1.5rem 0" }}>
            <p>⚠️ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontFamily: "JetBrains Mono",
                color: "var(--muted)",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
              }}>
              Username
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter your system username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontFamily: "JetBrains Mono",
                color: "var(--muted)",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
              }}>
              Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>

          <button
            type="submit"
            className="action-btn"
            style={{ width: "100%", padding: "0.85rem", fontSize: "0.9rem" }}>
            Verify & Authenticate →
          </button>
        </form>
      </div>
    </div>
  );
}
