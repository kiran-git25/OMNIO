import React, { useState, useEffect } from "react";

export default function TextViewer({ file }) {
  const [content, setContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [highlighted, setHighlighted] = useState("");

  useEffect(() => {
    if (file.content) {
      setContent(file.content);
    } else if (file.url) {
      fetch(file.url)
        .then((res) => res.text())
        .then(setContent)
        .catch((err) => console.error("Error loading text:", err));
    }
  }, [file]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setHighlighted(content);
    } else {
      const regex = new RegExp(`(${searchTerm})`, "gi");
      setHighlighted(content.replace(regex, `<mark>$1</mark>`));
    }
  }, [searchTerm, content]);

  return (
    <div style={{ padding: "10px" }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "10px", width: "100%", padding: "5px" }}
      />
      <div
        style={{
          whiteSpace: "pre-wrap",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}
