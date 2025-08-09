import React, { useState } from "react";

export default function ImageViewer({ file }) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((z) => z + 0.2);
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.2));
  const handleReset = () => setZoom(1);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={handleZoomOut}>-</button>
        <button onClick={handleReset} style={{ margin: "0 5px" }}>
          Reset
        </button>
        <button onClick={handleZoomIn}>+</button>
      </div>
      <div
        style={{
          overflow: "auto",
          border: "1px solid #ccc",
          display: "inline-block",
          maxWidth: "100%",
          maxHeight: "80vh",
        }}
      >
        <img
          src={file.url || file}
          alt={file.name || "Image"}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
}
