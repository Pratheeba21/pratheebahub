// Modal.jsx
import React, { useEffect } from "react";

export function useModal() {
  const [modal, setModal] = React.useState(null);

  const showAlert = (title, message, type = "info") =>
    new Promise((resolve) => {
      setModal({ type: "alert", title, message, variant: type, resolve });
    });

  const showConfirm = (title, message, variant = "danger") =>
    new Promise((resolve) => {
      setModal({ type: "confirm", title, message, variant, resolve });
    });

  const close = (result) => {
    setModal((m) => {
      m?.resolve(result);
      return null;
    });
  };

  return { modal, showAlert, showConfirm, close };
}

export default function Modal({ modal, close }) {
  useEffect(() => {
    if (!modal) return;
    const handler = (e) => {
      if (e.key === "Escape") close(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal, close]);

  if (!modal) return null;

  const variantColor = {
    danger: { accent: "#f87171", dim: "#3b1111", border: "#7f1d1d" },
    success: { accent: "#4ade80", dim: "#052e16", border: "#166534" },
    info: { accent: "#60a5fa", dim: "#0a1628", border: "#1e3a8a" },
    warning: { accent: "#fbbf24", dim: "#1c1002", border: "#78350f" },
  }[modal.variant] || { accent: "#60a5fa", dim: "#0a1628", border: "#1e3a8a" };

  const icon =
    {
      danger: "⚠️",
      success: "✅",
      info: "ℹ️",
      warning: "🔔",
    }[modal.variant] || "ℹ️";

  return (
    <div
      onClick={() => modal.type === "alert" && close(true)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.15s ease",
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#161b27",
          border: `1px solid ${variantColor.border}`,
          borderRadius: "16px",
          padding: "2rem",
          maxWidth: "420px",
          width: "100%",
          boxShadow: `0 0 40px rgba(0,0,0,0.6), 0 0 0 1px ${variantColor.border}`,
          animation: "slideUp 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "1rem",
          }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: variantColor.dim,
              border: `1px solid ${variantColor.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}>
            {icon}
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: "0.95rem",
              fontWeight: "700",
              color: variantColor.accent,
            }}>
            {modal.title}
          </div>
        </div>

        {/* Message */}
        <p
          style={{
            color: "#b8c4d8",
            fontSize: "0.88rem",
            lineHeight: "1.6",
            marginBottom: "1.5rem",
            paddingLeft: "52px",
          }}>
          {modal.message}
        </p>

        {/* Actions */}
        <div
          style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          {modal.type === "confirm" && (
            <button
              onClick={() => close(false)}
              style={{
                background: "transparent",
                border: "1px solid #2a3347",
                color: "#8892a4",
                padding: "8px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "JetBrains Mono",
                fontSize: "0.8rem",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.borderColor = "#60a5fa")}
              onMouseOut={(e) => (e.target.style.borderColor = "#2a3347")}>
              Cancel
            </button>
          )}
          <button
            onClick={() => close(true)}
            style={{
              background: variantColor.dim,
              border: `1px solid ${variantColor.border}`,
              color: variantColor.accent,
              padding: "8px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "JetBrains Mono",
              fontSize: "0.8rem",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.background = variantColor.accent;
              e.target.style.color = "#0f1117";
            }}
            onMouseOut={(e) => {
              e.target.style.background = variantColor.dim;
              e.target.style.color = variantColor.accent;
            }}>
            {modal.type === "confirm" ? "Confirm" : "Got it"}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(0.95) } to { opacity:1; transform:translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}
