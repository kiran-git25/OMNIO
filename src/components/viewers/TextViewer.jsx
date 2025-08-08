import React, { useEffect, useState } from 'react';

export default function TextViewer({ file, url }) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (file && file.text) {
      file.text().then(setText);
    } else {
      fetch(url)
        .then(res => res.text())
        .then(setText);
    }
  }, [file, url]);

  return (
    <pre
      style={{
        background: '#f4f4f4',
        padding: '1rem',
        marginTop: '1rem',
        maxHeight: '400px',
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
      }}
    >
      {text}
    </pre>
  );
}
