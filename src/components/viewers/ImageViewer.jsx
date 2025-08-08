import React from 'react';

export default function ImageViewer({ file }) {
  const url = URL.createObjectURL(file);
  return <img src={url} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '1rem' }} />;
}
