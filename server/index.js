// server/index.js
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;
const wss = new WebSocket.Server({ port: PORT });

/**
 * Keep track of connected clients and rooms
 */
const clients = {};
const rooms = {};

wss.on("connection", (ws) => {
  const clientId = uuidv4();
  clients[clientId] = ws;

  console.log(`[WebSocket] Client connected: ${clientId}`);
  ws.send(JSON.stringify({ type: "welcome", clientId }));

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      // Join a room
      if (data.type === "join-room") {
        const { roomId } = data;
        if (!rooms[roomId]) rooms[roomId] = new Set();
        rooms[roomId].add(clientId);
        console.log(`[Room] ${clientId} joined ${roomId}`);
        return;
      }

      // Relay signaling messages to other room members
      if (data.type === "signal" && data.roomId) {
        const { roomId } = data;
        const peers = rooms[roomId] || [];
        peers.forEach((peerId) => {
          if (peerId !== clientId && clients[peerId]) {
            clients[peerId].send(JSON.stringify({
              type: "signal",
              from: clientId,
              payload: data.payload
            }));
          }
        });
      }
    } catch (e) {
      console.error("[WebSocket] Message error", e);
    }
  });

  ws.on("close", () => {
    console.log(`[WebSocket] Client disconnected: ${clientId}`);
    delete clients[clientId];
    for (const roomId in rooms) {
      rooms[roomId].delete(clientId);
    }
  });
});

console.log(`[WebSocket] Signaling server running on ws://localhost:${PORT}`);
