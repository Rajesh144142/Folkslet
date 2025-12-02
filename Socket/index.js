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
    const socketId = activeUsers.get(receiverId);
    if (socketId) {
      io.to(socketId).emit('typing-status', {
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
    const socketId = activeUsers.get(receiverId);
    if (socketId) {
      io.to(socketId).emit('incoming-call', {
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
    const socketId = activeUsers.get(receiverId);
    if (socketId) {
      io.to(socketId).emit('call-accepted', { answer });
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
    const socketId = activeUsers.get(receiverId);
    if (socketId) {
      io.to(socketId).emit('call-rejected');
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
    const socketId = activeUsers.get(receiverId);
    if (socketId) {
      io.to(socketId).emit('call-ended');
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
    const socketId = activeUsers.get(receiverId);
    if (socketId) {
      io.to(socketId).emit('ice-candidate', { candidate });
    }
  });

  socket.on('error', (error) => {
    console.error('Socket client error', error);
  });
});

io.on('error', (error) => {
  console.error('Socket server error', error);
});
