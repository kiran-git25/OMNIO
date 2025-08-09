import React, { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";

export default function CodeViewer({ file, language = "javascript" }) {
  const [code, setCode] = useState("");

  useEffect(() => {
    if (file.content) {
      setCode(file.content);
    } else if (file.url) {
      fetch(file.url)
        .then((res) => res.text())
        .then(setCode)
        .catch((err) => console.error("Error loading code:", err));
    }
  }, [file]);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  return (
    <pre style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}
