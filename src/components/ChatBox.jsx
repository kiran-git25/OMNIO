import React, { useState, useRef, useEffect } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || `User${Math.floor(Math.random() * 1000)}`
  );
  const [privateMode, setPrivateMode] = useState(false);
  const inputRef = useRef();
  const bottomRef = useRef();
  const channelRef = useRef(null);

  // Create channel for tab-to-tab communication
  useEffect(() => {
    channelRef.current = new BroadcastChannel("omnio-chat");
    channelRef.current.onmessage = (e) => {
      if (e.data.type === "new-message") {
        setMessages((prev) => [...prev, e.data.payload]);
      }
      if (e.data.type === "clear-chat") {
        setMessages([]);
      }
      if (e.data.type === "sync-nickname") {
        setNickname(e.data.payload);
      }
    };

    return () => {
      channelRef.current.close();
    };
  }, []);

  // Save nickname locally & broadcast to other tabs
  useEffect(() => {
    localStorage.setItem("nickname", nickname);
    channelRef.current?.postMessage({ type: "sync-nickname", payload: nickname });
  }, [nickname]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Daily auto-clear
  useEffect(() => {
    const lastClear = localStorage.getItem("lastClearDate");
    const today = new Date().toDateString();
    if (lastClear !== today) {
      setMessages([]);
      localStorage.setItem("lastClearDate", today);
    }
  }, []);

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
    channelRef.current?.postMessage({ type: "new-message", payload: newMsg });
    inputRef.current.value = "";

    // Simulate FriendBot reply only in group mode
    if (!privateMode) {
      setTimeout(() => {
        const botMsg = {
          id: Date.now() + 1,
          sender: "FriendBot",
          private: false,
          text: "Got your message! 📬",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, botMsg]);
        channelRef.current?.postMessage({ type: "new-message", payload: botMsg });
      }, 1200);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    channelRef.current?.postMessage({ type: "clear-chat" });
  };

  // Detect YouTube and images
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

      {/* Nickname */}
      <div style={{ marginBottom: "0.5rem" }}>
        Nickname:{" "}
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ width: "120px" }}
        />
      </div>

      {/* Private mode */}
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

      {/* Messages */}
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

      {/* Input */}
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

      {/* Clear */}
      <button
        onClick={clearMessages}
        style={{ marginTop: "0.5rem", background: "red", color: "white" }}
      >
        Clear Chat
      </button>
    </div>
  );
}
