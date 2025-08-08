import React from 'react';

export default function VideoPlayer({ file }) {
  const url = URL.createObjectURL(file);
  return (
    <video controls width="100%" style={{ marginTop: '1rem' }}>
      <source src={url} />
      Your browser does not support video.
    </video>
  );
}
