import React, { useState, useEffect, useRef } from "react";

export default function ChatBox({ onOpenFile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const messagesEndRef = useRef(null);

  const detectMedia = (text) => {
    const ytMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (ytMatch) return { type: "youtube", id: ytMatch[1] };
    if (text.match(/\.(jpeg|jpg|gif|png)$/i)) return { type: "image", url: text };
    if (text.match(/\.(mp3|wav|ogg)$/i)) return { type: "audio", url: text };
    if (text.match(/\.(mp4|webm|mkv)$/i)) return { type: "video", url: text };
    if (text.match(/\.(pdf|docx|txt|xlsx)$/i)) return { type: "document", url: text };
    return null;
  };

  const sendMessage = (customText) => {
    const messageText = customText || input;
    if (messageText.trim() === "") return;

    const media = detectMedia(messageText);
    const newMessage = {
      id: Date.now(),
      text: messageText,
      timestamp: new Date().toLocaleTimeString(),
      sender: "You",
      media
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    if (media?.type === "document") {
      onOpenFile({ name: messageText.split("/").pop(), url: media.url });
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const ext = file.name.split(".").pop().toLowerCase();

    let type = null;
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) type = "image";
    else if (["mp3", "wav", "ogg"].includes(ext)) type = "audio";
    else if (["mp4", "webm", "mkv"].includes(ext)) type = "video";
    else if (["pdf", "docx", "txt", "xlsx"].includes(ext)) type = "document";

    const media = type ? { type, url: fileUrl } : null;

    const newMessage = {
      id: Date.now(),
      text: file.name,
      timestamp: new Date().toLocaleTimeString(),
      sender: "You",
      media
    };

    setMessages((prev) => [...prev, newMessage]);

    if (media?.type === "document" || media?.type === "image" || media?.type === "video" || media?.type === "audio") {
      onOpenFile({ name: file.name, url: fileUrl });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderLeft: "1px solid #ccc",
        background: dragOver ? "#e0f7ff" : "white"
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleFileDrop}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{msg.sender}</strong> <small>{msg.timestamp}</small>
            <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>

            {msg.media?.type === "youtube" && (
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${msg.media.id}`}
                title="YouTube video"
                allowFullScreen
                style={{ marginTop: "0.5rem" }}
              ></iframe>
            )}

            {msg.media?.type === "image" && (
              <img src={msg.media.url} alt="Shared" style={{ marginTop: "0.5rem", maxWidth: "100%" }} />
            )}

            {msg.media?.type === "audio" && (
              <audio controls style={{ marginTop: "0.5rem", width: "100%" }}>
                <source src={msg.media.url} />
              </audio>
            )}

            {msg.media?.type === "video" && (
              <video controls style={{ marginTop: "0.5rem", width: "100%" }}>
                <source src={msg.media.url} />
              </video>
            )}

            {msg.media?.type === "document" && (
              <button
                style={{ marginTop: "0.5rem" }}
                onClick={() => onOpenFile({ name: msg.media.url.split("/").pop(), url: msg.media.url })}
              >
                Open in Viewer
              </button>
            )}
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
          placeholder="Type message or paste link..."
          style={{ width: "80%", marginRight: "0.5rem" }}
        />
        <button onClick={() => sendMessage()}>Send</button>
      </div>
    </div>
  );
}
