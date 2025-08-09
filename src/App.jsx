import React from "react";
import FileBrowser from "./components/FileBrowser";
import TabManager from "./components/TabManager";

export default function App() {
  let tabManagerRef;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <FileBrowser onFileOpen={(name, url) => tabManagerRef.openFile(name, url)} />
      <TabManager ref={(ref) => (tabManagerRef = ref)} />
    </div>
  );
}
