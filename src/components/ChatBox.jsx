import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [nickname, setNickname] = useState('');
  const [peerId, setPeerId] = useState('');
  const [conn, setConn] = useState(null);
  const peerRef = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('connection', (connection) => {
      connection.on('data', (data) => {
        setMessages((prev) => [...prev, data]);
      });
    });

    return () => peer.destroy();
  }, []);

  const handleConnect = () => {
    if (!input) return;
    const connection = peerRef.current.connect(input);
    connection.on('open', () => {
      setConn(connection);
    });
    connection.on('data', (data) => {
      setMessages((prev) => [...prev, data]);
    });
  };

  const handleSend = () => {
    if (!conn || !nickname || !input) return;
    const message = {
      from: nickname,
      text: input,
      time: new Date().toLocaleTimeString(),
    };
    conn.send(message);
    setMessages((prev) => [...prev, message]);
    setInput('');
  };

  return (
    <div
      style={{
        width: '25%',
        borderLeft: '2px solid #ccc',
        padding: '1rem',
        height: '100%',
        overflowY: 'auto',
        background: '#fff',
      }}
    >
      <h3>💬 Chat (P2P)</h3>
      <p>Your ID: <code>{peerId}</code></p>
      <input
        placeholder="Your nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <input
        placeholder="Connect to peer ID"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <button onClick={handleConnect}>Connect</button>
      <div style={{ marginTop: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.from}</strong> <em>({msg.time})</em>: {msg.text}
          </div>
        ))}
      </div>
      <input
        placeholder="Type message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        style={{ width: '100%', marginTop: '1rem' }}
      />
      <button onClick={handleSend} style={{ width: '100%', marginTop: '0.5rem' }}>
        Send
      </button>
    </div>
  );
}
