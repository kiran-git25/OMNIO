import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";

/*
 Props:
 - rooms: array of room objects { id, name, members, messages:[], streamUrl }
 - activeRoomId
 - setActiveRoomId(roomId)
 - onSendMessage(roomId, message)
 - onShareStream(roomId, url)
 - onOpenFile(fileId)  // when clicking an attachment to open in viewer
*/
export default function ChatBox({ rooms, activeRoomId, setActiveRoomId, onSendMessage, onShareStream, onOpenFile }) {
  const [localRooms, setLocalRooms] = useState(rooms || []);
  const [input, setInput] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(activeRoomId || (rooms && rooms[0]?.id));
  const fileInputRef = useRef(null);

  useEffect(()=> setLocalRooms(rooms || []), [rooms]);
  useEffect(()=> { if (activeRoomId) setSelectedRoomId(activeRoomId); }, [activeRoomId]);

  useEffect(()=> {
    // keep external-selected room in sync up
    if (typeof setActiveRoomId === "function") setActiveRoomId(selectedRoomId);
  }, [selectedRoomId]);

  const send = () => {
    if (!input.trim()) return;
    const msg = { id: Date.now().toString(), from: "You", type: "text", text: input.trim(), ts: Date.now() };
    if (onSendMessage) onSendMessage(selectedRoomId, msg);
    setInput("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleFileAttach = (files) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const msg = { id: Date.now().toString() + Math.random().toString(36).slice(2,6), from: "You", type: "file", name: file.name, url, ts: Date.now() };
      if (onSendMessage) onSendMessage(selectedRoomId, msg);
    });
  };

  const shareStream = () => {
    const u = prompt("Paste stream/video URL to share in this room:");
    if (!u) return;
    if (onShareStream) onShareStream(selectedRoomId, u);
  };

  const activeRoom = localRooms.find(r => r.id === selectedRoomId) || localRooms[0] || { messages: [], streamUrl: "" };

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
      {/* Rooms list */}
      <div style={{display:'flex',gap:8,alignItems:'center',padding:'6px 0'}}>
        <div style={{flex:1,display:'flex',gap:6,overflow:'auto'}}>
          {localRooms.map(r => (
            <button key={r.id} className={`btn ${r.id===selectedRoomId?'active':''}`} onClick={() => setSelectedRoomId(r.id)}>{r.name}</button>
          ))}
        </div>
        <div style={{display:'flex',gap:6}}>
          <button className="btn" onClick={()=> {
            const name = prompt("New room name", "New room");
            if (!name) return;
            const id = "r_"+Date.now().toString(36).slice(2,6);
            const newRoom = { id, name, members: ["You"], messages: [], streamUrl: ""};
            setLocalRooms(prev => [...prev, newRoom]);
            setSelectedRoomId(id);
          }}>+ Room</button>
          <button className="btn" onClick={shareStream}>Share Stream</button>
        </div>
      </div>

      {/* Stream box (if present) */}
      { activeRoom && activeRoom.streamUrl ? (
        <div style={{padding:8,border:'1px solid var(--color-border)',borderRadius:8,marginBottom:8,background:'var(--color-surface)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
            <strong>Shared Stream</strong>
            <small style={{color:'var(--color-muted)'}}>{activeRoom.streamUrl}</small>
          </div>
          <div style={{height:180}}>
            <ReactPlayer url={activeRoom.streamUrl} controls width="100%" height="100%" />
          </div>
        </div>
      ) : (
        <div style={{padding:8,marginBottom:8,color:'var(--color-muted)'}}>No shared stream in this room. Click "Share Stream" to paste a URL for everyone.</div>
      )}

      {/* Messages */}
      <div style={{flex:1,overflowY:'auto',padding:8,display:'flex',flexDirection:'column',gap:8}}>
        {(activeRoom.messages || []).map(m => (
          <div key={m.id} style={{alignSelf: m.from === "You" ? "flex-end" : "flex-start", maxWidth:'85%'}}>
            <div style={{fontSize:12,color:'var(--color-muted)'}}>{m.from}</div>
            { m.type === "text" && <div style={{padding:8,background: m.from==="You" ? "var(--color-primary)" : "var(--color-surface)", color: m.from==="You" ? "#fff":"var(--color-fg)", borderRadius:8, marginTop:4}}>{m.text}</div> }
            { m.type === "file" && (
              <div style={{padding:8,background:'var(--color-surface)',borderRadius:8,marginTop:4}}>
                <div>{m.name}</div>
                <div style={{marginTop:6}}>
                  { /\.(png|jpg|jpeg|gif|svg)$/i.test(m.name) ? <img src={m.url} alt={m.name} style={{maxWidth:220,maxHeight:160}} /> : (
                    <div>
                      <a href={m.url} target="_blank" rel="noreferrer">Open attachment</a>
                      <button className="btn tiny" onClick={()=>onOpenFile && onOpenFile(m.url)}>Open in viewer</button>
                    </div>
                  )}
                </div>
              </div>
            )}
            { m.type === "stream" && <div style={{padding:8,background:'var(--color-surface)',borderRadius:8,marginTop:4}}>Stream: {m.url}</div> }
          </div>
        ))}
      </div>

      {/* Input area */}
      <div style={{display:'flex',gap:8,alignItems:'center',padding:8,borderTop:'1px solid var(--color-border)'}}>
        <input ref={fileInputRef} type="file" style={{display:'none'}} onChange={(e)=> handleFileAttach(e.target.files)} />
        <button className="btn" onClick={()=> fileInputRef.current && fileInputRef.current.click()}>Attach</button>
        <textarea
          placeholder="Message (Enter send, Shift+Enter newline)"
          value={input}
          onChange={(e)=> setInput(e.target.value)}
          onKeyDown={onKeyDown}
          style={{flex:1,minHeight:44,maxHeight:140,padding:8,borderRadius:8,resize:'none'}}
        />
        <button className="btn" onClick={send}>Send</button>
      </div>
    </div>
  );
}
