import React from "react";

export default function AudioPlayer({ file }) {
  return (
    <div style={{ textAlign: "center" }}>
      <audio
        controls
        style={{ width: "100%" }}
        src={file.url || file}
      >
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
}
