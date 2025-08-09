import React from "react";

export default function FileBrowser({ onFileOpen }) {
  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileOpen(file.name, e.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file") {
        handleFiles([item.getAsFile()]);
      } else if (item.kind === "string") {
        item.getAsString(str => {
          if (str.startsWith("http")) {
            onFileOpen(str, str); // file name is same as URL for now
          }
        });
      }
    }
  };

  return (
    <div
      style={{
        border: "2px dashed #aaa",
        padding: "1rem",
        textAlign: "center",
        marginBottom: "1rem"
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onPaste={handlePaste}
    >
      <p>📂 Drag & Drop, Paste Link, or Select Files</p>
      <input type="file" multiple onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}
