// socket/socket.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

let io;
const userSockets = new Map(); // userId -> socketId
const socketToUser = new Map(); // socketId -> userId

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select(
        "-password -refreshToken",
      );
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    userSockets.set(userId, socket.id);
    socketToUser.set(socket.id, userId);
    console.log(`User ${socket.user.email} connected (socket: ${socket.id})`);

    // Join parking room to receive updates for a specific parking
    socket.on("join-parking", (parkingId) => {
      socket.join(`parking-${parkingId}`);
      console.log(`User ${socket.user.email} joined parking room ${parkingId}`);
    });

    socket.on("leave-parking", (parkingId) => {
      socket.leave(`parking-${parkingId}`);
      console.log(`User ${socket.user.email} left parking room ${parkingId}`);
    });

    socket.on("disconnect", () => {
      userSockets.delete(userId);
      socketToUser.delete(socket.id);
      console.log(`User ${socket.user.email} disconnected`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initializeSocket first.");
  }
  return io;
};

// Utility functions to emit events

/**
 * Notify all clients in a parking room about slot updates
 */
export const notifySlotAvailability = (parkingId, slotData) => {
  if (!io) return;
  io.to(`parking-${parkingId}`).emit("slot-update", slotData);
};

/**
 * Send a notification to a specific user (in-app)
 */
export const notifyUser = (userId, event, data) => {
  if (!io) return;
  const socketId = userSockets.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

/**
 * Send a notification to multiple users
 */
export const notifyUsers = (userIds, event, data) => {
  if (!io) return;
  userIds.forEach((userId) => {
    const socketId = userSockets.get(userId.toString());
    if (socketId) {
      io.to(socketId).emit(event, data);
    }
  });
};

export default {
  initializeSocket,
  getIO,
  notifySlotAvailability,
  notifyUser,
  notifyUsers,
};
