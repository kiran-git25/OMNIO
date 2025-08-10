import Peer from 'simple-peer';

export async function initP2P(roomId, onData, stream, onStream) {
  const ws = new WebSocket('wss://openrelay.metered.ca:443'); // Public signaling example
  const peer = new Peer({ initiator: location.hash === '#host', trickle: false, stream });

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'join', room: roomId }));
  };

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.type === 'signal') {
      peer.signal(data.signal);
    }
  };

  peer.on('signal', (signal) => {
    ws.send(JSON.stringify({ type: 'signal', room: roomId, signal }));
  });

  if (onData) {
    peer.on('data', (data) => {
      onData(data);
    });
  }

  if (onStream) {
    peer.on('stream', (remoteStream) => {
      onStream(remoteStream);
    });
  }

  return peer;
}
