import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

// Temporary signaling server (Open-source)
const SIGNAL_SERVER = "wss://y-webrtc-signaling.herokuapp.com"; // can use any public or self-hosted

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [peerId, setPeerId] = useState("");
  const [roomName, setRoomName] = useState("default-room");
  const [connections, setConnections] = useState([]);
  const peerRef = useRef(null);
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Setup PeerJS + WS for discovery
  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);

      // Connect to signaling server
      wsRef.current = new WebSocket(SIGNAL_SERVER);

      wsRef.current.onopen = () => {
        wsRef.current.send(JSON.stringify({ type: "join", room: roomName, peerId: id }));
      };

      wsRef.current.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type === "peers" && Array.isArray(data.peers)) {
          data.peers
            .filter((p) => p !== id)
            .forEach(connectToPeer);
        }
      };
    });

    peer.on("connection", (conn) => {
      addConnection(conn);
      conn.on("open", () => {
        conn.send({ type: "history", data: messages });
      });
    });

    return () => {
      peer.destroy();
      wsRef.current?.close();
    };
  }, [roomName]);

  const connectToPeer = (id) => {
    if (connections.some((c) => c.peer === id)) return;
    const conn = peerRef.current.connect(id);
    conn.on("open", () => addConnection(conn));
  };

  const addConnection = (conn) => {
    conn.on("data", (data) => handleIncomingData(data));
    conn.on("close", () => setConnections((prev) => prev.filter((c) => c !== conn)));
    setConnections((prev) => [...prev, conn]);
  };

  const handleIncomingData = (data) => {
    if (data.type === "history") {
      setMessages((prev) => {
        const merged = [...prev, ...data.data];
        const unique = Array.from(new Map(merged.map((m) => [m.id, m])).values());
        return unique;
      });
      return;
    }
    setMessages((prev) => [...prev, { ...data, sender: "Peer" }]);
  };

  const sendToAll = (data) => {
    connections.forEach((c) => c.send(data));
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const msgObj = {
      id: Date.now(),
      type: detectMessageType(input),
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, { ...msgObj, sender: "You" }]);
    sendToAll(msgObj);
    setInput("");
  };

  const sendFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const msgObj = {
        id: Date.now(),
        type: "file",
        fileName: file.name,
        fileType: file.type,
        fileData: reader.result,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, { ...msgObj, sender: "You" }]);
      sendToAll(msgObj);
    };
    reader.readAsDataURL(file);
  };

  const detectMessageType = (text) => {
    if (text.includes("youtube.com") || text.includes("youtu.be")) return "youtube";
    return "text";
  };

  const renderMessage = (msg) => {
    if (msg.type === "text") {
      return <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>;
    }
    if (msg.type === "youtube") {
      const videoId = msg.content.split("v=")[1]?.split("&")[0] || msg.content.split("youtu.be/")[1];
      return (
        <iframe
          width="250"
          height="140"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allowFullScreen
          title="YouTube Video"
        ></iframe>
      );
    }
    if (msg.type === "file") {
      if (msg.fileType.startsWith("image/")) {
        return <img src={msg.fileData} alt={msg.fileName} style={{ maxWidth: "200px" }} />;
      }
      return (
        <a href={msg.fileData} download={msg.fileName} style={{ color: "blue" }}>
          {msg.fileName}
        </a>
      );
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", borderLeft: "1px solid #ccc" }}>
      <div style={{ background: "#f0f0f0", padding: "0.5rem", borderBottom: "1px solid #ccc" }}>
        <div>Your Peer ID: <strong>{peerId || "Loading..."}</strong></div>
        <input
          type="text"
          placeholder="Room name..."
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{msg.sender}</strong> <small>{msg.timestamp}</small>
            <div>{renderMessage(msg)}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: "0.5rem", borderTop: "1px solid #ccc", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type message or paste YouTube link..."
          style={{ flex: 1 }}
        />
        <input
          type="file"
          onChange={(e) => e.target.files[0] && sendFile(e.target.files[0])}
        />
        <button onClick={sendMessage} disabled={connections.length === 0}>Send</button>
      </div>
    </div>
  );
}
