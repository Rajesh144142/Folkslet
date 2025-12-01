<<<<<<< Updated upstream
const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      // console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    // console.log("Sending from socket to :", receiverId)
    // console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
=======
require('dotenv').config();
const { Server } = require('socket.io');

const port = Number(process.env.SOCKET_PORT || 8800);
const allowedOrigins = (process.env.SOCKET_ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

const io = new Server(port, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: Number(process.env.SOCKET_PING_TIMEOUT || 25000),
  pingInterval: Number(process.env.SOCKET_PING_INTERVAL || 20000),
});

const activeUsers = new Map();

const serializeUsers = () =>
  Array.from(activeUsers.entries()).map(([userId, socketId]) => ({ userId, socketId }));

io.on('connection', (socket) => {
  socket.on('new-user-add', (userId) => {
    if (!userId) {
      return;
    }
    activeUsers.set(userId, socket.id);
    io.emit('get-users', serializeUsers());
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
      }
    }
    io.emit('get-users', serializeUsers());
  });

  socket.on('send-message', (payload) => {
    if (!payload || typeof payload !== 'object') {
      return;
    }
    const { receiverId } = payload;
    if (!receiverId) {
      return;
    }
    const socketId = activeUsers.get(receiverId);
    if (socketId) {
      io.to(socketId).emit('recieve-message', payload);
>>>>>>> Stashed changes
    }
  });

  socket.on('typing', (payload) => {
    if (!payload || typeof payload !== 'object') {
      return;
    }
    const { receiverId, chatId, senderId, isTyping } = payload;
    if (!receiverId || !chatId || !senderId) {
      return;
    }
<<<<<<< Updated upstream
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('typing-status', {
=======
    const socketId = activeUsers.get(receiverId);
    if (socketId) {
      io.to(socketId).emit('typing-status', {
>>>>>>> Stashed changes
        chatId,
        senderId,
        isTyping: Boolean(isTyping),
      });
    }
  });

  socket.on('call-user', (payload) => {
    if (!payload || typeof payload !== 'object') {
      return;
    }
    const { receiverId, offer, senderId, senderName, callType } = payload;
    if (!receiverId || !offer || !senderId) {
      return;
    }
<<<<<<< Updated upstream
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('incoming-call', {
=======
    const socketId = activeUsers.get(receiverId);
    if (socketId) {
      io.to(socketId).emit('incoming-call', {
>>>>>>> Stashed changes
        senderId,
        senderName,
        offer,
        callType: callType || 'video',
      });
    }
  });

  socket.on('call-accepted', (payload) => {
    if (!payload || typeof payload !== 'object') {
      return;
    }
    const { receiverId, answer } = payload;
    if (!receiverId || !answer) {
      return;
    }
<<<<<<< Updated upstream
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('call-accepted', { answer });
=======
    const socketId = activeUsers.get(receiverId);
    if (socketId) {
      io.to(socketId).emit('call-accepted', { answer });
>>>>>>> Stashed changes
    }
  });

  socket.on('call-rejected', (payload) => {
    if (!payload || typeof payload !== 'object') {
      return;
    }
    const { receiverId } = payload;
    if (!receiverId) {
      return;
    }
<<<<<<< Updated upstream
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('call-rejected');
=======
    const socketId = activeUsers.get(receiverId);
    if (socketId) {
      io.to(socketId).emit('call-rejected');
>>>>>>> Stashed changes
    }
  });

  socket.on('call-ended', (payload) => {
    if (!payload || typeof payload !== 'object') {
      return;
    }
    const { receiverId } = payload;
    if (!receiverId) {
      return;
    }
<<<<<<< Updated upstream
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('call-ended');
=======
    const socketId = activeUsers.get(receiverId);
    if (socketId) {
      io.to(socketId).emit('call-ended');
>>>>>>> Stashed changes
    }
  });

  socket.on('ice-candidate', (payload) => {
    if (!payload || typeof payload !== 'object') {
      return;
    }
    const { receiverId, candidate } = payload;
    if (!receiverId || !candidate) {
      return;
    }
<<<<<<< Updated upstream
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('ice-candidate', { candidate });
=======
    const socketId = activeUsers.get(receiverId);
    if (socketId) {
      io.to(socketId).emit('ice-candidate', { candidate });
>>>>>>> Stashed changes
    }
  });

  socket.on('error', (error) => {
    console.error('Socket client error', error);
  });
});

io.on('error', (error) => {
  console.error('Socket server error', error);
});