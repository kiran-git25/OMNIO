import React from 'react';

export default function PDFViewer({ url }) {
  return (
    <iframe
      src={url}
      width="100%"
      height="600px"
      style={{ border: 'none', marginTop: '1rem' }}
      title="PDF Viewer"
    />
  );
}
