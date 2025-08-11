import React, { useState } from "react";
import ReactPlayer from "react-player";

export default function URLPlayer({ onOpenUrl, onShareToRoom }) {
  const [url, setUrl] = useState("");

  const openAsFile = () => {
    if (!url) return;
    onOpenUrl && onOpenUrl(url);
  };
  const shareToRoom = () => {
    if (!url) return;
    onShareToRoom && onShareToRoom(url);
  };

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',padding:12,gap:8}}>
      <input
        type="text"
        placeholder="Paste video or media URL (YouTube, Vimeo, direct MP4...)"
        value={url}
        onChange={(e)=>setUrl(e.target.value)}
        style={{padding:8,borderRadius:6,border:'1px solid var(--color-border)',background:'var(--color-surface)',color:'var(--color-fg)'}}
      />
      <div style={{display:'flex',gap:8}}>
        <button className="btn" onClick={openAsFile}>Open in Viewer</button>
        <button className="btn" onClick={shareToRoom}>Share to Chat Stream</button>
      </div>
      { url && (
        <div style={{flex:1,marginTop:8}}>
          <ReactPlayer url={url} controls width="100%" height="100%" style={{maxHeight:'100%'}} />
        </div>
      ) }
    </div>
  );
}
