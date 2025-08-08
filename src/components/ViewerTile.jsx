import React from 'react';
import ViewerPanel from './ViewerPanel';

export default function ViewerTile({ tile, onUpdate, onClose }) {
  const { id, file, minimized, maximized } = tile;

  const toggleMinimize = () => onUpdate(id, { minimized: !minimized });
  const toggleMaximize = () => onUpdate(id, { maximized: !maximized });
  const closeTile = () => onClose(id);

  const containerStyle = {
    width: maximized ? '100%' : '45%',
    height: minimized ? '2rem' : 'auto',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '0.5rem',
    position: 'relative',
    backgroundColor: '#f9f9f9',
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>{file.name || 'Remote File'}</strong>
        <div>
          <button onClick={toggleMinimize}>{minimized ? '🔽' : '🔼'}</button>
          <button onClick={toggleMaximize}>{maximized ? '🗖' : '🗗'}</button>
          <button onClick={closeTile}>❌</button>
        </div>
      </div>
      {!minimized && <ViewerPanel file={file} />}
    </div>
  );
}
