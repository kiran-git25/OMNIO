import React, { useState } from "react";
import FileBrowser from "./components/FileBrowser";
import ViewerPanel from "./components/ViewerPanel";
import ChatBox from "./components/ChatBox";
import "./index.css";

export default function App() {
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", height: "100vh" }}>
      <FileBrowser onFileSelect={setSelectedFileUrl} />
      <ViewerPanel fileUrl={selectedFileUrl} />
      <ChatBox />
    </div>
  );
}
