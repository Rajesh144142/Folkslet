const isValidPayload = (payload) => {
  return payload && typeof payload === 'object';
};

const serializeUsers = (activeUsers) => {
  return Array.from(activeUsers.entries()).map(([userId, socketId]) => ({
    userId,
    socketId,
  }));
};

const getReceiverSocketId = (activeUsers, receiverId) => {
  return activeUsers.get(receiverId);
};

const removeUserBySocketId = (activeUsers, socketId) => {
  for (const [userId, userSocketId] of activeUsers.entries()) {
    if (userSocketId === socketId) {
      activeUsers.delete(userId);
      return;
    }
  }
};

module.exports = {
  isValidPayload,
  serializeUsers,
  getReceiverSocketId,
  removeUserBySocketId,
};

