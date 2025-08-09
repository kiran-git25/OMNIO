import React, { useEffect, useState } from "react";
import JSZip from "jszip";

export default function ArchiveViewer({ fileUrl }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch(fileUrl)
      .then(res => res.arrayBuffer())
      .then(buffer => JSZip.loadAsync(buffer))
      .then(zip => {
        const list = [];
        zip.forEach((relativePath, file) => {
          list.push({
            name: relativePath,
            isDir: file.dir,
            size: file._data ? file._data.uncompressedSize : 0
          });
        });
        setEntries(list);
      });
  }, [fileUrl]);

  return (
    <div>
      <h4>📦 Archive Contents</h4>
      <ul>
        {entries.map((entry, idx) => (
          <li key={idx}>
            {entry.isDir ? "📁" : "📄"} {entry.name} ({entry.size} bytes)
          </li>
        ))}
      </ul>
    </div>
  );
}
