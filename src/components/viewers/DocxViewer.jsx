import React, { useEffect, useRef } from "react";
import * as DocxPreview from "docx-preview";

export default function DocxViewer({ fileUrl }) {
  const containerRef = useRef(null);

  useEffect(() => {
    fetch(fileUrl)
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const dp = new DocxPreview.DocxPreview();
        dp.renderAsync(buffer, containerRef.current);
      });
  }, [fileUrl]);

  return (
    <div ref={containerRef} style={{ background: "#fff", padding: "1rem" }}>
      <p>Loading DOCX...</p>
    </div>
  );
}
