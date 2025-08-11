import React from "react";

export default function Topbar({ theme, toggleTheme, onNewTab }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "6px 10px",
      borderBottom: "1px solid var(--color-accent)",
      backgroundColor: "var(--color-bg)",
      color: "var(--color-fg)"
    }}>
      <strong>Omnio Editor</strong>
      <div>
        <button onClick={onNewTab} style={{ marginRight: "8px" }}>+ Tab</button>
        <button onClick={toggleTheme}>
          {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>
    </div>
  );
}
