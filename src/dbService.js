import SignalDB from "signaldb";

let db;
let socket;
let currentClientId = null;

// Connect to WebSocket signaling server
export function connectToServer(wsUrl = "ws://localhost:3001") {
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("[WS] Connected to signaling server");
  };

  socket.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);

      if (data.type === "welcome") {
        currentClientId = data.clientId;
        console.log("[WS] Client ID:", currentClientId);
      }

      if (data.type === "signal" && data.payload) {
        handleIncomingSignal(data.from, data.payload);
      }
    } catch (e) {
      console.error("[WS] Message error", e);
    }
  };

  socket.onclose = () => {
    console.log("[WS] Disconnected from signaling server");
    setTimeout(() => connectToServer(wsUrl), 3000); // auto-reconnect
  };
}

// Send signaling data
export function sendSignal(roomId, payload) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "signal", roomId, payload }));
  }
}

// Join a room
export function joinRoom(roomId) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "join-room", roomId }));
  }
}

// Initialize local DB
export function initDB() {
  db = new SignalDB("omnio-db");
  if (!db.has("rooms")) {
    db.set("rooms", []);
  }
  return db;
}

// Get rooms
export function getRooms() {
  return db.get("rooms") || [];
}

// Add room
export function addRoom(room) {
  const rooms = getRooms();
  rooms.push(room);
  db.set("rooms", rooms);
  joinRoom(room.id); // auto-join on create
}

// Send message
export function sendMessage(roomId, message) {
  const rooms = getRooms();
  const idx = rooms.findIndex(r => r.id === roomId);
  if (idx >= 0) {
    rooms[idx].messages.push(message);
    db.set("rooms", rooms);

    // Broadcast to others
    sendSignal(roomId, { type: "message", message });
  }
}

// Handle incoming WebSocket signals
function handleIncomingSignal(fromId, payload) {
  if (payload.type === "message") {
    const { message } = payload;
    const rooms = getRooms();
    const idx = rooms.findIndex(r => r.id === message.roomId);
    if (idx >= 0) {
      rooms[idx].messages.push(message);
      db.set("rooms", rooms);
    }
  }
}
