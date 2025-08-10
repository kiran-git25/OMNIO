import React, { useEffect, useRef } from "react";
import DocxPreviewModule from "docx-preview";
const DocxPreview = DocxPreviewModule.default || DocxPreviewModule;

export default function DocxViewer({ fileUrl }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (fileUrl && containerRef.current) {
      fetch(fileUrl)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          const dp = new DocxPreview();
          dp.renderAsync(buffer, containerRef.current);
        })
        .catch((err) => console.error("Error loading DOCX:", err));
    }
  }, [fileUrl]);

  return (
    <div ref={containerRef} style={{ background: "#fff", padding: "1rem" }}>
      <p>Loading DOCX...</p>
    </div>
  );
}
