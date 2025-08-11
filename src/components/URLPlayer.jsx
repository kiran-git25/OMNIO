import React, { useState } from "react";
import ReactPlayer from "react-player";

export default function URLPlayer() {
  const [url, setUrl] = useState("");

  return (
    <div style={{ padding: "8px", height: "100%", display: "flex", flexDirection: "column" }}>
      <input
        type="text"
        placeholder="Paste video URL (YouTube, Vimeo, etc.)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "8px",
          border: "1px solid #555",
          backgroundColor: "var(--color-bg)",
          color: "var(--color-fg)"
        }}
      />
      {url && (
        <div style={{ flex: 1 }}>
          <ReactPlayer url={url} controls width="100%" height="100%" />
        </div>
      )}
    </div>
  );
}
