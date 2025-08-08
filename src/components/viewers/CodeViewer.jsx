import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // Optional: or use prism-tomorrow.css
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
// Add more languages as needed

export default function CodeViewer({ file, url }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    const load = async () => {
      const text = file ? await file.text() : await fetch(url).then(r => r.text());
      setCode(text);
      Prism.highlightAll();
    };
    load();
  }, [file, url]);

  return (
    <pre className="language-js" style={{ marginTop: '1rem' }}>
      <code className="language-js">{code}</code>
    </pre>
  );
}
