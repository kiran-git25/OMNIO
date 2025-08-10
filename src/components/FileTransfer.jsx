import React, { useRef, useState } from 'react';
import { initP2P } from '../utils/p2pSignaling';

const FileTransfer = () => {
  const [roomId, setRoomId] = useState('');
  const [connected, setConnected] = useState(false);
  const [file, setFile] = useState(null);
  const peerRef = useRef(null);

  const startConnection = async () => {
    peerRef.current = await initP2P(roomId, (data) => {
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "received_file";
      a.click();
    });
    setConnected(true);
  };

  const sendFile = () => {
    if (file && peerRef.current) {
      file.arrayBuffer().then(buffer => {
        peerRef.current.send(buffer);
      });
    }
  };

  return (
    <div className="file-transfer">
      {!connected ? (
        <div>
          <input
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={startConnection}>Connect</button>
        </div>
      ) : (
        <div>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={sendFile}>Send File</button>
        </div>
      )}
    </div>
  );
};

export default FileTransfer;
