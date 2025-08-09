import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [peerId, setPeerId] = useState("");
  const [targetPeerId, setTargetPeerId] = useState("");
  const [conn, setConn] = useState(null);
  const peerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Setup PeerJS
  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("connection", (connection) => {
      setConn(connection);
      connection.on("data", handleIncomingData);
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const connectToPeer = () => {
    if (!targetPeerId.trim()) return;
    const connection = peerRef.current.connect(targetPeerId);
    connection.on("open", () => {
      setConn(connection);
    });
    connection.on("data", handleIncomingData);
  };

  const handleIncomingData = (data) => {
    setMessages((prev) => [...prev, { ...data, sender: "Peer" }]);
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
    conn?.send(msgObj);
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
      conn?.send(msgObj);
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
          placeholder="Enter peer ID to connect..."
          value={targetPeerId}
          onChange={(e) => setTargetPeerId(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={connectToPeer}>Connect</button>
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
        <button onClick={sendMessage} disabled={!conn}>Send</button>
      </div>
    </div>
  );
}
