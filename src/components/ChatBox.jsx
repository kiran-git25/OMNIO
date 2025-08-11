import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { chatCollection } from "../db/signalDB"; // our SignalDB chat storage

export default function ChatBox({
  activeRoomId,
  setActiveRoomId,
  username = "You",
  onOpenFile
}) {
  const [rooms, setRooms] = useState([]);
  const [input, setInput] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(activeRoomId || null);
  const fileInputRef = useRef(null);

  // Sync rooms from DB
  useEffect(() => {
    const unsub = chatCollection.find().onSnapshot((allMessages) => {
      // Group by roomId
      const grouped = {};
      allMessages.forEach((m) => {
        if (!grouped[m.roomId]) {
          grouped[m.roomId] = {
            id: m.roomId,
            name: m.roomName || m.roomId,
            members: [],
            messages: [],
            streamUrl: ""
          };
        }
        if (m.type === "stream") grouped[m.roomId].streamUrl = m.url;
        else grouped[m.roomId].messages.push(m);
      });
      setRooms(Object.values(grouped));
      if (!selectedRoomId && Object.values(grouped).length > 0) {
        setSelectedRoomId(Object.values(grouped)[0].id);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (typeof setActiveRoomId === "function") setActiveRoomId(selectedRoomId);
  }, [selectedRoomId]);

  const sendMessage = (message) => {
    chatCollection.insert(message);
  };

  const send = () => {
    if (!input.trim()) return;
    sendMessage({
      id: Date.now().toString(),
      roomId: selectedRoomId,
      roomName: getRoomName(selectedRoomId),
      from: username,
      type: "text",
      text: input.trim(),
      ts: Date.now()
    });
    setInput("");
  };

  const getRoomName = (id) => {
    const r = rooms.find((r) => r.id === id);
    return r ? r.name : id;
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleFileAttach = (files) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      sendMessage({
        id:
          Date.now().toString() + Math.random().toString(36).slice(2, 6),
        roomId: selectedRoomId,
        roomName: getRoomName(selectedRoomId),
        from: username,
        type: "file",
        name: file.name,
        url,
        ts: Date.now()
      });
    });
  };

  const shareStream = () => {
    const u = prompt("Paste stream/video URL to share in this room:");
    if (!u) return;
    sendMessage({
      id: Date.now().toString(),
      roomId: selectedRoomId,
      roomName: getRoomName(selectedRoomId),
      from: username,
      type: "stream",
      url: u,
      ts: Date.now()
    });
  };

  const createRoom = () => {
    const name = prompt("New room name", "New room");
    if (!name) return;
    const id = "r_" + Date.now().toString(36).slice(2, 6);
    setRooms((prev) => [
      ...prev,
      { id, name, members: [username], messages: [], streamUrl: "" }
    ]);
    setSelectedRoomId(id);
  };

  const activeRoom =
    rooms.find((r) => r.id === selectedRoomId) || {
      messages: [],
      streamUrl: ""
    };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Rooms list */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0" }}>
        <div style={{ flex: 1, display: "flex", gap: 6, overflow: "auto" }}>
          {rooms.map((r) => (
            <button
              key={r.id}
              className={`btn ${r.id === selectedRoomId ? "active" : ""}`}
              onClick={() => setSelectedRoomId(r.id)}
            >
              {r.name}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn" onClick={createRoom}>+ Room</button>
          <button className="btn" onClick={shareStream}>Share Stream</button>
        </div>
      </div>

      {/* Stream box */}
      {activeRoom.streamUrl ? (
        <div
          style={{
            padding: 8,
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            marginBottom: 8,
            background: "var(--color-surface)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6
            }}
          >
            <strong>Shared Stream</strong>
            <small style={{ color: "var(--color-muted)" }}>
              {activeRoom.streamUrl}
            </small>
          </div>
          <div style={{ height: 180 }}>
            <ReactPlayer
              url={activeRoom.streamUrl}
              controls
              width="100%"
              height="100%"
            />
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: 8,
            marginBottom: 8,
            color: "var(--color-muted)"
          }}
        >
          No shared stream in this room. Click "Share Stream" to paste a URL for
          everyone.
        </div>
      )}

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 8,
          display: "flex",
          flexDirection: "column",
          gap: 8
        }}
      >
        {(activeRoom.messages || []).map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.from === username ? "flex-end" : "flex-start",
              maxWidth: "85%"
            }}
          >
            <div style={{ fontSize: 12, color: "var(--color-muted)" }}>
              {m.from}
            </div>
            {m.type === "text" && (
              <div
                style={{
                  padding: 8,
                  background:
                    m.from === username
                      ? "var(--color-primary)"
                      : "var(--color-surface)",
                  color:
                    m.from === username ? "#fff" : "var(--color-fg)",
                  borderRadius: 8,
                  marginTop: 4
                }}
              >
                {m.text}
              </div>
            )}
            {m.type === "file" && (
              <div
                style={{
                  padding: 8,
                  background: "var(--color-surface)",
                  borderRadius: 8,
                  marginTop: 4
                }}
              >
                <div>{m.name}</div>
                <div style={{ marginTop: 6 }}>
                  {/\.(png|jpg|jpeg|gif|svg)$/i.test(m.name) ? (
                    <img
                      src={m.url}
                      alt={m.name}
                      style={{ maxWidth: 220, maxHeight: 160 }}
                    />
                  ) : (
                    <div>
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open attachment
                      </a>
                      <button
                        className="btn tiny"
                        onClick={() =>
                          onOpenFile && onOpenFile(m.url)
                        }
                      >
                        Open in viewer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {m.type === "stream" && (
              <div
                style={{
                  padding: 8,
                  background: "var(--color-surface)",
                  borderRadius: 8,
                  marginTop: 4
                }}
              >
                Stream: {m.url}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: 8,
          borderTop: "1px solid var(--color-border)"
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => handleFileAttach(e.target.files)}
        />
        <button
          className="btn"
          onClick={() =>
            fileInputRef.current && fileInputRef.current.click()
          }
        >
          Attach
        </button>
        <textarea
          placeholder="Message (Enter send, Shift+Enter newline)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          style={{
            flex: 1,
            minHeight: 44,
            maxHeight: 140,
            padding: 8,
            borderRadius: 8,
            resize: "none"
          }}
        />
        <button className="btn" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}
