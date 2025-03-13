import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Change this to your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a chat room
  socket.on("joinRoom", (teamId) => {
    socket.join(teamId);
    console.log(`User ${socket.id} joined room ${teamId}`);
  });

  // Handle incoming messages
  socket.on("sendMessage", ({ teamId, userId, message }) => {
    const chatMessage = { userId, message, timestamp: new Date() };
    io.to(teamId).emit("receiveMessage", chatMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("WebSocket Server running on port 5000");
});
