import React, { useState, useEffect } from "react";
import mammoth from "mammoth";

export default function DocxViewer({ file }) {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    async function loadDocx() {
      try {
        const response = await fetch(file.url || file);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(result.value);
      } catch (err) {
        console.error("Error loading DOCX:", err);
      }
    }
    loadDocx();
  }, [file]);

  return (
    <div
      style={{
        padding: "10px",
        maxHeight: "80vh",
        overflowY: "auto",
        background: "#fff",
      }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
