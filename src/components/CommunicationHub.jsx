import React, { useState } from 'react';
import ChatRoom from './ChatRoom';
import AudioCall from './AudioCall';
import VideoCall from './VideoCall';
import FileTransfer from './FileTransfer';

const CommunicationHub = () => {
  const [activeTool, setActiveTool] = useState('');

  return (
    <div className="communication-hub">
      <div className="comm-buttons">
        <button onClick={() => setActiveTool('chat')}>💬 Chat</button>
        <button onClick={() => setActiveTool('audio')}>📞 Audio Call</button>
        <button onClick={() => setActiveTool('video')}>🎥 Video Call</button>
        <button onClick={() => setActiveTool('file')}>📂 File Share</button>
      </div>

      <div className="comm-content">
        {activeTool === 'chat' && <ChatRoom />}
        {activeTool === 'audio' && <AudioCall />}
        {activeTool === 'video' && <VideoCall />}
        {activeTool === 'file' && <FileTransfer />}
        {!activeTool && <p>Select a tool above to start communicating.</p>}
      </div>
    </div>
  );
};

export default CommunicationHub;
