import React from "react";
import PDFViewer from "./viewers/PDFViewer";
import ImageViewer from "./viewers/ImageViewer";
import VideoPlayer from "./viewers/VideoPlayer";
import AudioPlayer from "./viewers/AudioPlayer";
import TextViewer from "./viewers/TextViewer";
import CodeViewer from "./viewers/CodeViewer";
import SpreadsheetViewer from "./viewers/SpreadsheetViewer";
import MarkdownViewer from "./viewers/MarkdownViewer";
import DocxViewer from "./viewers/DocxViewer";
import PPTXViewer from "./viewers/PPTXViewer";

export default function ViewerPanel({ file }) {
  if (!file) {
    return (
      <div style={{ flex: 2, padding: "1rem", background: "#fafafa" }}>
        <h3>📂 File Viewer</h3>
        <p>No file selected. Drop or upload a file in chat and click "Open".</p>
      </div>
    );
  }

  const { name, type, dataUrl } = file;
  const lowerName = name.toLowerCase();

  let viewer;
  if (type === "application/pdf" || lowerName.endsWith(".pdf")) {
    viewer = <PDFViewer fileUrl={dataUrl} />;
  } else if (type.startsWith("image/")) {
    viewer = <ImageViewer fileUrl={dataUrl} />;
  } else if (type.startsWith("video/") || lowerName.endsWith(".mkv")) {
    viewer = <VideoPlayer fileUrl={dataUrl} />;
  } else if (type.startsWith("audio/") || lowerName.endsWith(".mp3")) {
    viewer = <AudioPlayer fileUrl={dataUrl} />;
  } else if (
    lowerName.endsWith(".txt") ||
    type === "text/plain" ||
    lowerName.endsWith(".log")
  ) {
    viewer = <TextViewer fileUrl={dataUrl} />;
  } else if (
    lowerName.endsWith(".js") ||
    lowerName.endsWith(".py") ||
    lowerName.endsWith(".java") ||
    lowerName.endsWith(".c") ||
    lowerName.endsWith(".cpp") ||
    lowerName.endsWith(".html") ||
    lowerName.endsWith(".css")
  ) {
    viewer = <CodeViewer fileUrl={dataUrl} language={lowerName.split(".").pop()} />;
  } else if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) {
    viewer = <SpreadsheetViewer fileUrl={dataUrl} />;
  } else if (lowerName.endsWith(".md")) {
    viewer = <MarkdownViewer fileUrl={dataUrl} />;
  } else if (lowerName.endsWith(".docx")) {
    viewer = <DocxViewer fileUrl={dataUrl} />;
  } else if (lowerName.endsWith(".pptx")) {
    viewer = <PPTXViewer fileUrl={dataUrl} />;
  } else if (
    lowerName.endsWith(".zip") ||
    lowerName.endsWith(".rar") ||
    lowerName.endsWith(".7z")
  ) {
    viewer = <p>📦 Archive file preview not implemented yet.</p>;
  } else {
    viewer = (
      <p>
        ❓ Unsupported file type: <strong>{name}</strong>
      </p>
    );
  }

  return (
    <div style={{ flex: 2, padding: "1rem", background: "#fff", overflow: "auto" }}>
      <h3>📄 Viewing: {name}</h3>
      <div style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{viewer}</div>
    </div>
  );
}
