import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

export default function ChatBox({ onOpenFile }) {
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
      connection.on("data", (data) => {
        receiveMessage(data);
      });
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
    connection.on("data", (data) => {
      receiveMessage(data);
    });
  };

  const receiveMessage = (data) => {
    setMessages((prev) => [...prev, { ...data, sender: "Peer" }]);
  };

  const sendMessage = () => {
    if (input.trim() === "") return;

    const message = {
      id: Date.now(),
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, { ...message, sender: "You" }]);
    conn?.send(message);
    setInput("");
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
            <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: "0.5rem", borderTop: "1px solid #ccc" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          style={{ width: "80%", marginRight: "0.5rem" }}
        />
        <button onClick={sendMessage} disabled={!conn}>Send</button>
      </div>
    </div>
  );
}
