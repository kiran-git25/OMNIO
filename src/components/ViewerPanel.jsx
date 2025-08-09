import React from "react";
import GridLayout from "react-grid-layout";
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
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function ViewerPanel({ file }) {
  const layout = [
    { i: "viewer", x: 0, y: 0, w: 12, h: 20 }
  ];

  const renderViewer = () => {
    if (!file) return <div>Select a file to view</div>;

    const type = file.type || "";
    if (type.includes("pdf")) return <PDFViewer file={file} />;
    if (type.includes("image")) return <ImageViewer file={file} />;
    if (type.includes("video")) return <VideoPlayer file={file} />;
    if (type.includes("audio")) return <AudioPlayer file={file} />;
    if (type.includes("text/plain")) return <TextViewer file={file} />;
    if (type.includes("text/markdown")) return <MarkdownViewer file={file} />;
    if (type.includes("spreadsheet") || type.includes("excel")) return <SpreadsheetViewer file={file} />;
    if (type.includes("msword")) return <DocxViewer file={file} />;
    if (type.includes("presentation")) return <PPTXViewer file={file} />;
    if (type.includes("json") || type.includes("javascript") || type.includes("html") || type.includes("css"))
      return <CodeViewer file={file} />;
    return <div>Unsupported file type</div>;
  };

  return (
    <div className="viewer-panel">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        <div key="viewer">
          {renderViewer()}
        </div>
      </GridLayout>
    </div>
  );
}
