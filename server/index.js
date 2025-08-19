import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import Room from "./models/Room.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN, methods: ["GET","POST"] }
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

// --- DB ---
await mongoose.connect(process.env.MONGODB_URI);

// --- REST: load room state ---
app.get("/api/rooms/:roomId", async (req, res) => {
  const { roomId } = req.params;
  let room = await Room.findOne({ roomId });
  if (!room) {
    room = await Room.create({ roomId });
  }
  res.json(room);
});

// --- REST: save room state ---
app.post("/api/rooms/:roomId", async (req, res) => {
  const { roomId } = req.params;
  const { files } = req.body; // { html, css, js }
  const room = await Room.findOneAndUpdate(
    { roomId },
    { $set: { files } },
    { new: true, upsert: true }
  );
  res.json(room);
});

// --- Socket.IO events ---
const ACTIONS = {
  JOIN: "join",
  JOINED: "joined",
  CODE_CHANGE: "code-change",
  SYNC_CODE: "sync-code",
  DISCONNECTED: "disconnected"
};

const userSocketMap = new Map(); // socketId -> { username, roomId }

io.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
    userSocketMap.set(socket.id, { username, roomId });
    socket.join(roomId);

    // send current room state to the newly joined client
    const roomDoc = await Room.findOne({ roomId });
    socket.emit(ACTIONS.SYNC_CODE, roomDoc?.files ?? { html:"", css:"", js:"" });

    // notify all clients in room
    const clients = [...(io.sockets.adapter.rooms.get(roomId) || [])]
      .map(sid => ({ socketId: sid, username: userSocketMap.get(sid)?.username || "Guest" }));

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients, username, socketId: socket.id
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, async ({ roomId, files }) => {
    // broadcast to others in the room
    socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { files });

    // persist (lightweight)
    await Room.findOneAndUpdate(
      { roomId },
      { $set: { files } },
      { upsert: true }
    );
  });

  socket.on("disconnecting", () => {
    const info = userSocketMap.get(socket.id);
    if (info?.roomId) {
      socket.to(info.roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: info.username
      });
    }
    userSocketMap.delete(socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`));
// This code sets up an Express server with Socket.IO for real-time collaboration on code editing.
// It connects to a MongoDB database using Mongoose, defines REST endpoints for loading and saving room state,
// and handles socket events for joining rooms, code changes, and disconnections.