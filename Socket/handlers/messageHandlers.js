const { SOCKET_EVENTS } = require('../constants');
const { isValidPayload, getReceiverSocketId } = require('../utils/socketHelpers');

const handleSendMessage = (io, activeUsers, payload) => {
  if (!isValidPayload(payload)) {
    return;
  }
  const { receiverId } = payload;
  if (!receiverId) {
    return;
  }
  const socketId = getReceiverSocketId(activeUsers, receiverId);
  if (socketId) {
    io.to(socketId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, payload);
  }
};

const handleTyping = (io, activeUsers, payload) => {
  if (!isValidPayload(payload)) {
    return;
  }
  const { receiverId, chatId, senderId, isTyping } = payload;
  if (!receiverId || !chatId || !senderId) {
    return;
  }
  const socketId = getReceiverSocketId(activeUsers, receiverId);
  if (socketId) {
    io.to(socketId).emit(SOCKET_EVENTS.TYPING_STATUS, {
      chatId,
      senderId,
      isTyping: Boolean(isTyping),
    });
  }
};

module.exports = {
  handleSendMessage,
  handleTyping,
};

