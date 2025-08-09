import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import ViewerPanel from "./components/ViewerPanel";
import FileBrowser from "./components/FileBrowser";
import ChatBox from "./components/ChatBox";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./App.css";

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedLink, setPastedLink] = useState("");

  const layout = [
    { i: "filebrowser", x: 0, y: 0, w: 3, h: 8, minW: 2, minH: 6 },
    { i: "viewerpanel", x: 3, y: 0, w: 6, h: 8, minW: 3, minH: 6 },
    { i: "chatbox", x: 9, y: 0, w: 3, h: 8, minW: 2, minH: 6 },
  ];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={50}
        width={1200}
      >
        <div key="filebrowser" style={{ background: "#f5f5f5", padding: "5px" }}>
          <FileBrowser
            onFileSelect={setSelectedFile}
            onPasteLink={setPastedLink}
          />
        </div>
        <div key="viewerpanel" style={{ background: "#fff", padding: "5px" }}>
          <ViewerPanel file={selectedFile} link={pastedLink} />
        </div>
        <div key="chatbox" style={{ background: "#f5f5f5", padding: "5px" }}>
          <ChatBox onPlayLink={setPastedLink} />
        </div>
      </GridLayout>
    </div>
  );
}
