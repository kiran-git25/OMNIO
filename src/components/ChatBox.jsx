import React, { useState, useRef, useEffect } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || `User${Math.floor(Math.random() * 1000)}`
  );
  const [privateMode, setPrivateMode] = useState(false);
  const inputRef = useRef();
  const bottomRef = useRef();

  // Save nickname locally so it persists in this browser
  useEffect(() => {
    localStorage.setItem("nickname", nickname);
  }, [nickname]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = inputRef.current.value.trim();
    if (!text) return;

    const newMsg = {
      id: Date.now(),
      sender: nickname,
      private: privateMode,
      text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    inputRef.current.value = "";

    // Simulate another user replying in group mode
    if (!privateMode) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "FriendBot",
            private: false,
            text: "Got your message! 📬",
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }, 1200);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  // YouTube embed detection
  const renderMessageContent = (msg) => {
    const ytMatch = msg.text.match(
      /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-]+)/
    );
    if (ytMatch) {
      const videoId = ytMatch[1];
      return (
        <>
          <div>{msg.text}</div>
          <iframe
            width="250"
            height="140"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allowFullScreen
            title="YouTube video"
          ></iframe>
        </>
      );
    }

    // Image URL detection
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(msg.text)) {
      return (
        <>
          <div>{msg.text}</div>
          <img src={msg.text} alt="Preview" style={{ maxWidth: "250px" }} />
        </>
      );
    }

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

      {/* Nickname input */}
      <div style={{ marginBottom: "0.5rem" }}>
        Nickname:{" "}
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ width: "120px" }}
        />
      </div>

      {/* Private mode toggle */}
      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          <input
            type="checkbox"
            checked={privateMode}
            onChange={() => setPrivateMode(!privateMode)}
          />{" "}
          Private 1-to-1 Mode
        </label>
      </div>

      {/* Message area */}
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
              background: msg.sender === nickname ? "#d0f0ff" : "#f5f5f5",
              borderRadius: "5px",
            }}
          >
            <strong>{msg.sender}:</strong>
            {renderMessageContent(msg)}
            <div style={{ fontSize: "0.75rem", color: "#666" }}>
              {msg.timestamp} {msg.private && "🔒"}
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
