import { io } from 'socket.io-client';
import authService from './authService';

let socket;

export const connectSocket = () => {
  const token = authService.getToken();
  socket = io(import.meta.env.VITE_API_URL, {
    auth: { token },
  });

  socket.on('connect', () => console.log('Socket connected'));
  socket.on('disconnect', () => console.log('Socket disconnected'));

  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

// Join a parking room for real-time updates
export const joinParkingRoom = (parkingId) => {
  if (socket) socket.emit('join-parking', parkingId);
};

// Leave a parking room when changing parking or unmounting
export const leaveParkingRoom = (parkingId) => {
  if (socket) socket.emit('leave-parking', parkingId);
};

// Listen for slot updates
export const onSlotUpdate = (callback) => {
  if (socket) socket.on('slot-update', callback);
};
