import React, { useRef, useState } from 'react';
import { initP2P } from '../utils/p2pSignaling';

const AudioCall = () => {
  const [roomId, setRoomId] = useState('');
  const [connected, setConnected] = useState(false);
  const peerRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    peerRef.current = await initP2P(roomId, null, stream, (remoteStream) => {
      remoteAudioRef.current.srcObject = remoteStream;
    });
    setConnected(true);
  };

  return (
    <div className="audio-call">
      {!connected ? (
        <div>
          <input
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={startCall}>Join Audio Call</button>
        </div>
      ) : (
        <audio ref={remoteAudioRef} autoPlay controls />
      )}
    </div>
  );
};

export default AudioCall;
