import React, { useEffect, useState } from 'react';

export default function TextViewer({ file, url }) {
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      const content = file ? await file.text() : await fetch(url).then(r => r.text());
      setText(content);
    };
    load();
  }, [file, url]);

  const highlighted = text.replace(
    new RegExp(query, 'gi'),
    match => `<mark>${match}</mark>`
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search text..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ marginBottom: '1rem', padding: '6px', width: '100%' }}
      />
      <pre
        style={{
          background: '#f9f9f9',
          padding: '1rem',
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
        }}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </>
  );
}
