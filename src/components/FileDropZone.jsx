import React, { useRef } from 'react';

export default function FileDropZone({ onFileSelect }) {
  const dropRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.kind === 'file') {
        onFileSelect(item.getAsFile());
        break;
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      ref={dropRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onPaste={handlePaste}
      style={{
        marginTop: '1rem',
        padding: '2rem',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        textAlign: 'center',
      }}
    >
      <p>📁 Drag & Drop a file, paste media, or</p>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}
