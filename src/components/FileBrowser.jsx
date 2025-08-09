import React, { useRef } from "react";

export default function FileBrowser({ onFileSelect }) {
  const urlInputRef = useRef();

  // Handle local file uploads
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    onFileSelect(fileUrl);
  };

  // Handle drag & drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    onFileSelect(fileUrl);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle pasted URL
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const url = urlInputRef.current.value.trim();
    if (!url) return;
    onFileSelect(url);
    urlInputRef.current.value = "";
  };

  return (
    <div
      style={{
        borderRight: "1px solid #ccc",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h3>📂 File Browser</h3>

      {/* File Picker */}
      <input type="file" onChange={handleFileChange} />

      {/* Paste URL */}
      <form onSubmit={handleUrlSubmit}>
        <input
          ref={urlInputRef}
          type="text"
          placeholder="Paste file or media URL"
          style={{ width: "100%" }}
        />
        <button type="submit">Open</button>
      </form>

      <div style={{ fontSize: "0.85rem", color: "#666" }}>
        Drag & drop files here, pick from your device, or paste a URL.
      </div>
    </div>
  );
}
