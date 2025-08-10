import React from 'react';
import ViewerTile from './ViewerTile';

export default function TileWorkspace({ tiles = [], onUpdateTile, onCloseTile }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1rem',
        flex: 1,
        overflowY: 'auto',
      }}
    >
      {Array.isArray(tiles) && tiles.map((tile) => (
        <ViewerTile
          key={tile.id}
          tile={tile}
          onUpdate={onUpdateTile}
          onClose={onCloseTile}
        />
      ))}
    </div>
  );
}
