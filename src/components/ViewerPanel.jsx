import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import { FaWindowMaximize, FaWindowMinimize, FaTimes } from "react-icons/fa";

import PDFViewer from "./viewers/PDFViewer";
import ImageViewer from "./viewers/ImageViewer";
import VideoPlayer from "./viewers/VideoPlayer";
import AudioPlayer from "./viewers/AudioPlayer";
import TextViewer from "./viewers/TextViewer";
import DocxViewer from "./viewers/DocxViewer";
import XlsxViewer from "./viewers/XlsxViewer";
import ZipViewer from "./viewers/ZipViewer";
import CodeViewer from "./viewers/CodeViewer";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function ViewerPanel({ files }) {
  const [layouts, setLayouts] = useState(
    files.map((f, i) => ({
      i: f.id,
      x: (i % 3) * 4,
      y: Math.floor(i / 3) * 3,
      w: 4,
      h: 6,
    }))
  );

  const [closedTiles, setClosedTiles] = useState([]);

  const handleClose = (id) => {
    setClosedTiles((prev) => [...prev, id]);
  };

  const handleMaximize = (id) => {
    setLayouts((prev) =>
      prev.map((tile) =>
        tile.i === id ? { ...tile, w: 12, h: 12, x: 0, y: 0 } : tile
      )
    );
  };

  const handleMinimize = (id) => {
    setLayouts((prev) =>
      prev.map((tile) =>
        tile.i === id ? { ...tile, w: 2, h: 2 } : tile
      )
    );
  };

  const renderViewer = (file) => {
    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "pdf") return <PDFViewer file={file} />;
    if (["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(ext))
      return <ImageViewer file={file} />;
    if (["mp4", "webm", "ogg"].includes(ext))
      return <VideoPlayer file={file} />;
    if (["mp3", "wav", "aac"].includes(ext))
      return <AudioPlayer file={file} />;
    if (["txt", "md", "log"].includes(ext))
      return <TextViewer file={file} />;
    if (ext === "docx") return <DocxViewer file={file} />;
    if (["xls", "xlsx"].includes(ext)) return <XlsxViewer file={file} />;
    if (ext === "zip") return <ZipViewer file={file} />;
    if (["js", "py", "java", "html", "css", "json"].includes(ext))
      return <CodeViewer file={file} />;

    return <div>Unsupported file type: {ext}</div>;
  };

  return (
    <GridLayout
      className="layout"
      cols={12}
      rowHeight={30}
      width={1200}
      layout={layouts}
      onLayoutChange={(l) => setLayouts(l)}
    >
      {files
        .filter((f) => !closedTiles.includes(f.id))
        .map((file) => (
          <div key={file.id} className="tile">
            <div className="tile-header">
              <span>{file.name}</span>
              <div className="tile-actions">
                <FaWindowMaximize onClick={() => handleMaximize(file.id)} />
                <FaWindowMinimize onClick={() => handleMinimize(file.id)} />
                <FaTimes onClick={() => handleClose(file.id)} />
              </div>
            </div>
            <div className="tile-content">{renderViewer(file)}</div>
          </div>
        ))}
    </GridLayout>
  );
}
