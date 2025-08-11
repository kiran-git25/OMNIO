import { useEffect, useState } from "react";
import { chatCollection } from "../db/signalDB";

export function useChat(roomId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsub = chatCollection.find({ roomId }).onSnapshot(setMessages);
    return () => unsub();
  }, [roomId]);

  const sendMessage = (text, sender) => {
    chatCollection.insert({
      roomId,
      sender,
      text,
      createdAt: Date.now()
    });
  };

  return { messages, sendMessage };
}
