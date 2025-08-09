import React, { useRef } from "react";

export default function AudioPlayer({ file }) {
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <audio
        ref={audioRef}
        src={file.url || file}
        controls
        style={{ width: "100%" }}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause} style={{ marginLeft: "5px" }}>
          Pause
        </button>
      </div>
    </div>
  );
}
