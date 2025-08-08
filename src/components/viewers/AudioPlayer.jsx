import React from 'react';

export default function AudioPlayer({ url }) {
  return (
    <audio controls style={{ width: '100%', marginTop: '1rem' }}>
      <source src={url} />
      Your browser does not support the audio element.
    </audio>
  );
}
