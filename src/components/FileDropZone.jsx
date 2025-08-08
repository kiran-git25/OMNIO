import React, { useCallback } from 'react';

export default function FileDropZone({ onFileSelect }) {
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handlePaste = useCallback((event) => {
    const file = event.clipboardData.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      className="border-2 border-dashed rounded-lg p-6 text-center text-gray-600"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onPaste={handlePaste}
    >
      <p>Drag & Drop, Paste, or Upload a File</p>
      <input type="file" onChange={handleFileChange} className="mt-2" />
    </div>
  );
}
