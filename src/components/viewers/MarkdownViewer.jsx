import React, { useEffect, useState } from "react";
import { marked } from "marked";

export default function MarkdownViewer({ file }) {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    async function loadMarkdown() {
      try {
        let text = "";
        if (file.content) {
          text = file.content;
        } else if (file.url) {
          const res = await fetch(file.url);
          text = await res.text();
        }
        const html = marked(text);
        setHtmlContent(html);
      } catch (err) {
        console.error("Error loading markdown:", err);
      }
    }
    loadMarkdown();
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
