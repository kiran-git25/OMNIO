import React from 'react';

export default function FileSidebar({ files, activeId, onSelect }) {
  return (
    <div style={{ width: '220px', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
      <h3 style={{ padding: '10px' }}>📁 Files</h3>
      {files.map(file => (
        <div
          key={file.id}
          onClick={() => onSelect(file.id)}
          style={{
            cursor: 'pointer',
            padding: '8px 12px',
            background: file.id === activeId ? '#eef' : '',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          {file.name}
        </div>
      ))}
    </div>
  );
}
