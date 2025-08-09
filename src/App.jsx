import React, { useRef } from "react";
import FileBrowser from "./components/FileBrowser";
import TabManager from "./components/TabManager";
import ChatBox from "./components/ChatBox";

export default function App() {
  const tabManagerRef = useRef();

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* File Upload / Paste Bar */}
      <FileBrowser
        onFileOpen={(name, url) => tabManagerRef.current?.openFile(name, url)}
      />

      {/* Main split view */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Tabs + Viewers */}
        <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
          <TabManager ref={tabManagerRef} />
        </div>

        {/* Chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
