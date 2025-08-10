import React, { useState, useEffect, useRef } from 'react';
import { initP2P } from '../utils/p2pSignaling';

const ChatRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const peerRef = useRef(null);

  const createConnection = async () => {
    peerRef.current = await initP2P(roomId, (data) => {
      setMessages((prev) => [...prev, { text: data, sender: 'Peer' }]);
    });
    setConnected(true);
  };

  const sendMessage = () => {
    if (peerRef.current && message.trim()) {
      peerRef.current.send(message);
      setMessages((prev) => [...prev, { text: message, sender: 'You' }]);
      setMessage('');
    }
  };

  return (
    <div className="chat-room">
      {!connected && (
        <div>
          <input
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={createConnection}>Join</button>
        </div>
      )}

      {connected && (
        <>
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={m.sender === 'You' ? 'my-message' : 'peer-message'}>
                <b>{m.sender}: </b>{m.text}
              </div>
            ))}
          </div>
          <div className="send-box">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatRoom;
