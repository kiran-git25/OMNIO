import React from "react";

export default function TabManager({ tabs, activeId, setActiveId, onClose, onAdd }) {
  return (
    <div className="tab-bar">
      {tabs.map((t) => (
        <div
          key={t.id}
          className={`tab ${t.id === activeId ? "active" : ""}`}
          onClick={() => setActiveId(t.id)}
        >
          {t.name}
          <button onClick={(e) => { e.stopPropagation(); onClose(t.id); }} style={{ marginLeft: 4 }}>x</button>
        </div>
      ))}
      <button onClick={onAdd} style={{ marginLeft: "auto" }}>+</button>
    </div>
  );
}
