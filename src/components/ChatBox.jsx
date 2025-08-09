import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [nickname, setNickname] = useState("");
  const messagesEndRef = useRef(null);

  // Generate a random nickname if not set
  useEffect(() => {
    let storedNick = localStorage.getItem("nickname");
    if (!storedNick) {
      storedNick = "User" + Math.floor(Math.random() * 1000);
      localStorage.setItem("nickname", storedNick);
    }
    setNickname(storedNick);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-clear daily at midnight
  useEffect(() => {
    const now = new Date();
    const millisTillMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;
    const timer = setTimeout(() => {
      setMessages([]);
    }, millisTillMidnight);
    return () => clea
