import React from 'react';
import ReactPlayer from 'react-player';
import { getViewerComponent } from '../utils/viewerRegistry';

export default function ViewerPanel({ file }) {
  const Viewer = getViewerComponent(file);
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold">Preview:</h2>
      <div className="border p-4 rounded bg-white shadow">
        <Viewer file={file} />
      </div>
    </div>
  );
}
