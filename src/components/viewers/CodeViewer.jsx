import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';

export default function CodeViewer({ file, url }) {
  const [code, setCode] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      const content = file ? await file.text() : await fetch(url).then(r => r.text());
      setCode(content);
      setTimeout(() => Prism.highlightAll(), 0);
    };
    load();
  }, [file, url]);

  const highlighted = code.replace(
    new RegExp(query, 'gi'),
    match => `<mark>${match}</mark>`
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search code..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ marginBottom: '1rem', padding: '6px', width: '100%' }}
      />
      <pre className="language-javascript">
        <code
          className="language-javascript"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </>
  );
}
