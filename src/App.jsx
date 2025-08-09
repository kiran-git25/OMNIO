import React, { useState } from "react";
import ViewerPanel from "./components/ViewerPanel";
import ChatBox from "./components/ChatBox";

export default function App() {
  const [activeFile, setActiveFile] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ViewerPanel activeFile={activeFile} />
      <ChatBox onOpenFile={setActiveFile} />
    </div>
  );
}
