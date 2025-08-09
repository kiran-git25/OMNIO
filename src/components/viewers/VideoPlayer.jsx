import React, { useRef } from "react";

export default function VideoPlayer({ file }) {
  const videoRef = useRef(null);

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        src={file.url || file}
        controls
        style={{
          maxWidth: "100%",
          maxHeight: "80vh",
          backgroundColor: "#000",
        }}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleFullscreen}>Fullscreen</button>
      </div>
    </div>
  );
}
