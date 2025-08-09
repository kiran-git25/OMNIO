import React, { useState, useEffect, useRef } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const detectMedia = (text) => {
    const ytMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (ytMatch) {
      return {
        type: "youtube",
        id: ytMatch[1]
      };
    }

    const imageMatch = text.match(/\.(jpeg|jpg|gif|png)$/i);
    if (imageMatch) {
      return {
        type: "image",
        url: text
      };
    }

    const audioMatch = text.match(/\.(mp3|wav|ogg)$/i);
    if (audioMatch) {
      return {
        type: "audio",
        url: text
      };
    }

    const videoMatch = text.match(/\.(mp4|webm|mkv)$/i);
    if (videoMatch) {
      return {
        type: "video",
        url: text
      };
    }

    return null;
  };

  const sendMessage = () => {
    if (input.trim() === "") return;

    const media = detectMedia(input);

    const newMessage = {
      id: Date.now(),
      text: input,
      timestamp: new Date().toLocaleTimeString(),
      sender: "You",
      media
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      borderLeft: "1px solid #ccc"
    }}>
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
              <img
                src={msg.media.url}
                alt="Shared"
                style={{ marginTop: "0.5rem", maxWidth: "100%" }}
              />
            )}

            {msg.media?.type === "audio" && (
              <audio controls style={{ marginTop: "0.5rem", width: "100%" }}>
                <source src={msg.media.url} />
                Your browser does not support the audio tag.
              </audio>
            )}

            {msg.media?.type === "video" && (
              <video controls style={{ marginTop: "0.5rem", width: "100%" }}>
                <source src={msg.media.url} />
                Your browser does not support the video tag.
              </video>
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
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
