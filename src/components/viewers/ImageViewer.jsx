import React, { useState } from "react";

export default function ImageViewer({ file }) {
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => setZoom((z) => z + 0.2);
  const zoomOut = () => setZoom((z) => Math.max(0.2, z - 0.2));
  const resetZoom = () => setZoom(1);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={zoomOut}>-</button>
        <button onClick={resetZoom}>Reset</button>
        <button onClick={zoomIn}>+</button>
      </div>
      <img
        src={file.url || file}
        alt="preview"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center",
          maxWidth: "100%",
          maxHeight: "80vh",
        }}
      />
    </div>
  );
}
