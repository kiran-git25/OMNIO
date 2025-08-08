import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function MarkdownViewer({ file, url }) {
  const [md, setMd] = useState('');

  useEffect(() => {
    if (file && file.text) {
      file.text().then(setMd);
    } else if (url) {
      fetch(url).then(res => res.text()).then(setMd);
    }
  }, [file, url]);

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', background: '#fafafa' }}>
      <ReactMarkdown>{md}</ReactMarkdown>
    </div>
  );
}
