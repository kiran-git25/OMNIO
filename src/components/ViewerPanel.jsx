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

export default function ViewerPanel({ fileUrl }) {
  if (!fileUrl) {
    return <div style={{ padding: "1rem" }}>No file selected</div>;
  }

  const extension = fileUrl.split(".").pop().toLowerCase();

  // Decide which viewer to use
  if (["pdf"].includes(extension)) return <PDFViewer fileUrl={fileUrl} />;
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(extension))
    return <ImageViewer fileUrl={fileUrl} />;
  if (["mp4", "mkv", "webm"].includes(extension))
    return <VideoPlayer fileUrl={fileUrl} />;
  if (["mp3", "wav", "ogg"].includes(extension))
    return <AudioPlayer fileUrl={fileUrl} />;
  if (["txt", "log"].includes(extension))
    return <TextViewer fileUrl={fileUrl} />;
  if (["js", "jsx", "ts", "tsx", "html", "css", "json", "py", "java", "c", "cpp"].includes(extension))
    return <CodeViewer fileUrl={fileUrl} />;
  if (["xls", "xlsx"].includes(extension))
    return <SpreadsheetViewer fileUrl={fileUrl} />;
  if (["md"].includes(extension))
    return <MarkdownViewer fileUrl={fileUrl} />;
  if (["docx"].includes(extension))
    return <DocxViewer fileUrl={fileUrl} />;
  if (["pptx"].includes(extension))
    return <PPTXViewer fileUrl={fileUrl} />;

  return (
    <div style={{ padding: "1rem" }}>
      Unsupported file type: <b>{extension}</b>
    </div>
  );
}
