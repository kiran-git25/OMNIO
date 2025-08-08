import React from 'react';
import ViewerPanel from './ViewerPanel';

export default function TabbedViewer({ files, activeId, onClose }) {
  const active = files.find(f => f.id === activeId);
  if (!active) return <div style={{ padding: '2rem' }}>No file selected</div>;

  return (
    <div style={{ flex: 1, padding: '1rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>{active.name}</strong>
        <button onClick={() => onClose(active.id)} style={{ float: 'right' }}>✖</button>
      </div>
      <ViewerPanel file={active.file} url={active.url} />
    </div>
  );
}
