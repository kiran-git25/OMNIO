import React, { useState } from 'react';
import FileDropZone from './components/FileDropZone';
import ViewerPanel from './components/ViewerPanel';

export default function App() {
  const [file, setFile] = useState(null);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>OmniO: File Viewer (100% Local)</h1>
      <FileDropZone onFileSelect={setFile} />
      {file && <ViewerPanel file={file} />}
    </div>
  );
}
