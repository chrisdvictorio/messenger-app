import { Server } from "socket.io";
import express from "express";
import http from "http";
import User from "../models/userModel.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", async (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;

    await User.findByIdAndUpdate(userId, { lastActive: Date.now() });
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    delete userSocketMap[userId];

    await User.findByIdAndUpdate(userId, { lastActive: Date.now() });

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
