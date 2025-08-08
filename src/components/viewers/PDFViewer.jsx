import React from 'react';

export default function PDFViewer({ file }) {
  const url = URL.createObjectURL(file);
  return <iframe src={url} width="100%" height="600px" title="PDF Viewer" />;
}
