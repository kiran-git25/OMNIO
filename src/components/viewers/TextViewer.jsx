import React, { useEffect, useState } from 'react';

export default function TextViewer({ file }) {
  const [text, setText] = useState('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => setText(e.target.result);
    reader.readAsText(file);
  }, [file]);

  return (
    <pre
      style={{
        background: '#f4f4f4',
        padding: '1rem',
        overflow: 'auto',
        marginTop: '1rem',
      }}
    >
      {text}
    </pre>
  );
}
