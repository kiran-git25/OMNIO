import React, { useRef, useState } from 'react';
import { initP2P } from '../utils/p2pSignaling';

const VideoCall = () => {
  const [roomId, setRoomId] = useState('');
  const [connected, setConnected] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    peerRef.current = await initP2P(roomId, null, stream, (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
    });
    setConnected(true);
  };

  return (
    <div className="video-call">
      {!connected ? (
        <div>
          <input
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={startCall}>Join Video Call</button>
        </div>
      ) : (
        <div className="video-container">
          <video ref={localVideoRef} autoPlay muted playsInline />
          <video ref={remoteVideoRef} autoPlay playsInline />
        </div>
      )}
    </div>
  );
};

export default VideoCall;
