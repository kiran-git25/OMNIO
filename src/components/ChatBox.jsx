import React, { useState, useRef, useEffect } from "react";

export default function ChatBox({ onOpenFile }) {
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || `User${Math.floor(Math.random() * 1000)}`
  );
  const [privateMode, setPrivateMode] = useState(false);
  const inputRef = useRef();
  const fileInputRef = useRef();
  const bottomRef = useRef();
  const channelRef = useRef(null);

  // Broadcast channel for real-time sync
  useEffect(() => {
    channelRef.current = new BroadcastChannel("omnio-chat");
    channelRef.current.onmessage = (e) => {
      if (e.data.type === "new-message") setMessages((p) => [...p, e.data.payload]);
      if (e.data.type === "clear-chat") setMessages([]);
      if (e.data.type === "sync-nickname") setNickname(e.data.payload);
    };
    return () => channelRef.current.close();
  }, []);

  // Nickname persistence + sync
  useEffect(() => {
    localStorage.setItem("nickname", nickname);
    channelRef.current?.postMessage({ type: "sync-nickname", payload: nickname });
  }, [nickname]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto clear daily
  useEffect(() => {
    const lastClear = localStorage.getItem("lastClearDate");
    const today = new Date().toDateString();
    if (lastClear !== today) {
      setMessages([]);
      localStorage.setItem("lastClearDate", today);
    }
  }, []);

  const sendMessage = (text, file = null) => {
    if (!text && !file) return;
    const newMsg = {
      id: Date.now(),
      sender: nickname,
      private: privateMode,
      text,
      file,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((p) => [...p, newMsg]);
    channelRef.current?.postMessage({ type: "new-message", payload: newMsg });

    // Auto bot reply (group only)
    if (!privateMode && !file) {
      setTimeout(() => {
        const botMsg = {
          id: Date.now() + 1,
          sender: "FriendBot",
          text: "Got your message! 📬",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((p) => [...p, botMsg]);
        channelRef.current?.postMessage({ type: "new-message", payload: botMsg });
      }, 1000);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    channelRef.current?.postMessage({ type: "clear-chat" });
  };

  // File paste or drop
  const handleFiles = (files) => {
    [...files].forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        sendMessage("", {
          name: file.name,
          type: file.type,
          dataUrl: reader.result,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Detect YouTube, Images, Files
  const renderMessageContent = (msg) => {
    if (msg.file) {
      return (
        <div>
          📎 <strong>{msg.file.name}</strong>{" "}
          <button onClick={() => onOpenFile(msg.file)}>Open</button>
        </div>
      );
    }

    const ytMatch = msg.text.match(
      /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-]+)/
    );
    if (ytMatch) {
      return (
        <>
          <div>{msg.text}</div>
          <iframe
            width="250"
            height="140"
            src={`https://www.youtube.com/embed/${ytMatch[1]}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </>
      );
    }

    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(msg.text)) {
      return <img src={msg.text} alt="Preview" style={{ maxWidth: "250px" }} />;
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
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <h3>💬 Chat</h3>

      <div style={{ marginBottom: "0.5rem" }}>
        Nickname:{" "}
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ width: "120px" }}
        />
      </div>

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
            k
