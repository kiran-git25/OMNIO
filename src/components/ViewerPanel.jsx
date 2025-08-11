import React from "react";
import ReactMarkdown from "react-markdown";

export default function ViewerPanel({ file, onEdit }) {
  if (!file) return <div style={{ padding: "8px" }}>No file open</div>;

  const ext = file.name.split(".").pop().toLowerCase();

  // Render text/code
  const renderTextEditor = () => (
    <textarea
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-fg)",
        border: "none",
        fontFamily: "monospace",
        fontSize: "14px"
      }}
      value={file.content}
      onChange={(e) => onEdit(e.target.value)}
    />
  );

  // Decide what to render
  switch (ext) {
    case "txt":
    case "js":
    case "json":
    case "css":
    case "html":
    case "xml":
      return renderTextEditor();

    case "md":
      return (
        <div style={{ padding: "8px", overflowY: "auto", height: "100%" }}>
          <ReactMarkdown>{file.content}</ReactMarkdown>
        </div>
      );

    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return (
        <div style={{ textAlign: "center" }}>
          <img
            src={file.url}
            alt={file.name}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </div>
      );

    case "mp3":
    case "wav":
      return (
        <audio controls style={{ width: "100%" }}>
          <source src={file.url} type={`audio/${ext}`} />
          Your browser does not support the audio element.
        </audio>
      );

    case "mp4":
    case "webm":
      return (
        <video controls style={{ width: "100%", height: "auto" }}>
          <source src={file.url} type={`video/${ext}`} />
          Your browser does not support the video element.
        </video>
      );

    case "pdf":
      return (
        <iframe
          src={file.url}
          title={file.name}
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      );

    default:
      return (
        <div style={{ padding: "8px" }}>
          <p>Cannot preview this file type: <strong>.{ext}</strong></p>
          <a href={file.url} download>
            Download file
          </a>
        </div>
      );
  }
}
