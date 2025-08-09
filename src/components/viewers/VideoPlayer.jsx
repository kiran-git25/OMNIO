import React from "react";

export default function VideoPlayer({ file }) {
  return (
    <div style={{ textAlign: "center" }}>
      <video
        controls
        style={{ maxWidth: "100%", maxHeight: "80vh" }}
        src={file.url || file}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
