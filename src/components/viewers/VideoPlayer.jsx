import React from 'react';

export default function VideoPlayer({ url }) {
  return (
    <video controls width="100%" style={{ marginTop: '1rem' }}>
      <source src={url} />
      Your browser does not support the video tag.
    </video>
  );
}
