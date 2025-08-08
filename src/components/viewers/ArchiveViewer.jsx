import React, { useEffect, useState } from 'react';
import { unzipSync } from 'fflate';

export default function ArchiveViewer({ file }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      const zipData = new Uint8Array(reader.result);
      const unzipped = unzipSync(zipData);
      const entries = Object.entries(unzipped).map(([name, content]) => ({
        name,
        size: content.length,
      }));
      setFiles(entries);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return (
    <div style={{ marginTop: '1rem' }}>
      <h4>Contents:</h4>
      <ul>
        {files.map((f, i) => (
          <li key={i}>{f.name} ({f.size} bytes)</li>
        ))}
      </ul>
    </div>
  );
}
