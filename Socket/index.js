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
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('typing-status', {
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
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('incoming-call', {
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
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('call-accepted', { answer });
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
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('call-rejected');
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
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('call-ended');
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
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('ice-candidate', { candidate });
    }
  });

  socket.on('error', (error) => {
    console.error('Socket client error', error);
  });
});

io.on('error', (error) => {
  console.error('Socket server error', error);
});