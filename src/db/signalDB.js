import { SignalDB } from "signaldb";

// Create a local-first DB instance
const db = new SignalDB({
  name: "omnio-db", // local storage name
  adapters: ["local", "websocket"],
  websocket: {
    url: "wss://your-vercel-websocket-url" // We'll set this up
  }
});

// Chat collection
export const chatCollection = db.collection("chat");

// Calls collection (signaling data)
export const callCollection = db.collection("calls");

// Files metadata
export const filesCollection = db.collection("files");

export default db;
