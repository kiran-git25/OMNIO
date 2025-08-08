import React from 'react';

export default function AudioPlayer({ file }) {
  const url = URL.createObjectURL(file);
  return (
    <audio controls style={{ marginTop: '1rem' }}>
      <source src={url} />
      Your browser does not support audio.
    </audio>
  );
}
