
import React, { useState } from 'react';
import FileDropZone from './components/FileDropZone';
import TileWorkspace from './components/TileWorkspace';
import ChatBox from './components/ChatBox';

export default function App() {
  const [openTiles, setOpenTiles] = useState([]);

  const addTile = (file) => {
    const id = Date.now().toString();
    setOpenTiles((prev) => [...prev, { id, file, minimized: false, maximized: false }]);
  };

  const updateTile = (id, newState) => {
    setOpenTiles((prev) =>
      prev.map((tile) => (tile.id === id ? { ...tile, ...newState } : tile))
    );
  };

  const removeTile = (id) => {
    setOpenTiles((prev) => prev.filter((tile) => tile.id !== id));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <h1 style={{ textAlign: 'center' }}>OmniO — Tile Viewer + Real-Time Chat</h1>
      <FileDropZone onFileSelect={addTile} />
      <div style={{ display: 'flex', flex: 1 }}>
        <TileWorkspace
          tiles={openTiles}
          onUpdateTile={updateTile}
          onCloseTile={removeTile}
        />
        <ChatBox />
      </div>
    </div>
  );
}
