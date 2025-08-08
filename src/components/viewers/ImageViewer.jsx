import React from 'react';

export default function ImageViewer({ url }) {
  return (
    <img
      src={url}
      alt="Uploaded File"
      style={{ maxWidth: '100%', marginTop: '1rem', borderRadius: '6px' }}
    />
  );
}
