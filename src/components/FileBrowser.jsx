import React from "react";

export default function FileBrowser({ onFileSelect }) {
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) onFileSelect(file);
      } else if (item.kind === "string") {
        item.getAsString(async (url) => {
          try {
            const res = await fetch(url);
            const blob = await res.blob();
            const filename = url.split("/").pop();
            const file = new File([blob], filename, { type: blob.type });
            onFileSelect(file);
          } catch (err) {
            console.error("Invalid URL or fetch failed", err);
          }
        });
      }
    }
  };

  return (
    <div
      className="file-browser"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      <input type="file" onChange={handleFileInput} />
      <p>Drag & drop, paste, or select a file</p>
    </div>
  );
}
