import React, { useState, useEffect, useMemo } from "react";
import Topbar from "./components/Topbar";
import TabManager from "./components/TabManager";
import ViewerPanel from "./components/ViewerPanel";
import ChatBox from "./components/ChatBox";
import Split from "react-split";

export default function App() {
  const [tabs, setTabs] = useState(() => [
    { id: "t1", name: "index.js", content: "// Hello Omnio", dirty: false },
    { id: "t2", name: "styles.css", content: "/* styles */", dirty: false },
    { id: "t3", name: "README.md", content: "# Readme", dirty: false }
  ]);
  const [activeId, setActiveId] = useState(tabs[0].id);
  const activeFile = useMemo(() => tabs.find((t) => t.id === activeId) || null, [tabs, activeId]);

  const [theme, setTheme] = useState(() => {
    try {
      const v = localStorage.getItem("omnio_theme");
      return v || "dark";
    } catch (e) {
      return "dark";
    }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("omnio_theme", theme); } catch (e) {}
  }, [theme]);

  const addTab = (name = "untitled.js") => {
    const id = Date.now().toString();
    const t = { id, name, content: "// new file", dirty: false };
    setTabs((s) => [...s, t]);
    setActiveId(id);
  };

  const closeTab = (id) => {
    setTabs((s) => s.filter((t) => t.id !== id));
    if (activeId === id) {
      const remaining = tabs.filter((t) => t.id !== id);
      setActiveId(remaining.length ? remaining[0].id : null);
    }
  };

  const reorderTabs = (newTabs) => setTabs(newTabs);

  return (
    <div className="app-root">
      <Topbar theme={theme} toggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} onNewTab={() => addTab()} />
      <TabManager tabs={tabs} activeId={activeId} setActiveId={setActiveId} onClose={closeTab} onAdd={addTab} onReorder={reorderTabs} />
      <div className="main-split">
        <Split sizes={[20, 60, 20]} minSize={[120, 300, 200]} gutterSize={8} className="split" >
          <div className="panel left-panel">
            <div className="panel-inner">Files / Explorer (placeholder)</div>
          </div>
          <div className="panel center-panel">
            <ViewerPanel file={activeFile} onEdit={(content) => {
              setTabs((s) => s.map((t) => (t.id === activeId ? { ...t, content, dirty: true } : t)));
            }} />
          </div>
          <div className="panel right-panel">
            <ChatBox />
          </div>
        </Split>
      </div>
    </div>
  );
}
