import { renderAsync } from "docx-preview";
import { useEffect, useRef } from "react";

export default function DocxViewer({ fileUrl }) {
  const containerRef = useRef(null);

  useEffect(() => {
    fetch(fileUrl)
      .then(res => res.arrayBuffer())
      .then(buffer => {
        renderAsync(buffer, containerRef.current, null, { inWrapper: false });
      })
      .catch(err => {
        console.error("Error rendering DOCX:", err);
      });
  }, [fileUrl]);

  return (
    <div ref={containerRef} style={{ background: "#fff", padding: "1rem" }}>
      <p>Loading DOCX...</p>
    </div>
  );
}
