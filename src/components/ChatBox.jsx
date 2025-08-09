import React, { useState, useRef, useEffect } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();
  const bottomRef = useRef();

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = inputRef.current.value.trim();
    if (!text) return;

    const newMsg = {
      id: Date.now(),
      text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    inputRef.current.value = "";
  };

  const clearMessages = () => {
    setMessages([]);
  };

  // Detect YouTube URL and return embedded player
  const renderMessage = (msg) => {
    const ytMatch = msg.text.match(
      /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-]+)/
    );
    if (ytMatch) {
      const videoId = ytMatch[1];
      return (
        <div>
          <div>{msg.text}</div>
          <iframe
            width="250"
            height="140"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allowFullScreen
            title="YouTube video"
          ></iframe>
        </div>
      );
    }

    // Image link preview
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(msg.text)) {
      return (
        <div>
          <div>{msg.text}</div>
          <img src={msg.text} alt="Preview" style={{ maxWidth: "250px" }} />
        </div>
      );
    }

    // Default text
    return <div>{msg.text}</div>;
  };

  return (
    <div
      style={{
        borderLeft: "1px solid #ccc",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <h3>💬 Chat</h3>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "0.5rem",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "0.75rem",
              padding: "0.5rem",
              background: "#f5f5f5",
              borderRadius: "5px",
            }}
          >
            {renderMessage(msg)}
            <div style={{ fontSize: "0.75rem", color: "#666" }}>
              {msg.timestamp}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ display: "flex", marginTop: "0.5rem" }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message or paste a link..."
          style={{ flex: 1 }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* Clear chat */}
      <button
        onClick={clearMessages}
        style={{ marginTop: "0.5rem", background: "red", color: "white" }}
      >
        Clear Chat
      </button>
    </div>
  );
}
