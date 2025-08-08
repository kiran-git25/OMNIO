import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';

export default function DocxViewer({ file }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    file.arrayBuffer().then(buffer => {
      mammoth.convertToHtml({ arrayBuffer: buffer }).then(result => {
        setHtml(result.value);
      });
    });
  }, [file]);

  return (
    <div
      style={{ padding: '1rem', background: '#fff' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
