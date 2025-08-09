import React, { useState } from "react";
import ViewerPanel from "./ViewerPanel";

export default function TabManager() {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const openFile = (name, dataUrl) => {
    // Check if already open
    const existing = tabs.find(t => t.name === name && t.dataUrl === dataUrl);
    if (existing) {
      setActiveTab(existing.id);
      return;
    }
    const newTab = {
      id: Date.now(),
      name,
      dataUrl
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const closeTab = (id) => {
    const updated = tabs.filter(t => t.id !== id);
    setTabs(updated);
    if (activeTab === id && updated.length > 0) {
      setActiveTab(updated[updated.length - 1].id);
    } else if (updated.length === 0) {
      setActiveTab(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid #ccc" }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "0.5rem 1rem",
              cursor: "pointer",
              background: tab.id === activeTab ? "#eee" : "#f9f9f9",
              borderRight: "1px solid #ccc",
              position: "relative"
            }}
          >
            {tab.name}
            <span
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              style={{
                marginLeft: "0.5rem",
                color: "#900",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              ×
            </span>
          </div>
        ))}
      </div>

      {/* Active tab viewer */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {activeTab ? (
          <ViewerPanel
            fileName={tabs.find(t => t.id === activeTab).name}
            fileUrl={tabs.find(t => t.id === activeTab).dataUrl}
          />
        ) : (
          <div style={{ padding: "1rem", color: "#777" }}>
            No file open. Drag & drop, paste link, or select a file.
          </div>
        )}
      </div>
    </div>
  );
}
