const { SOCKET_EVENTS } = require('../constants');
const { serializeUsers, getReceiverSocketId, removeUserBySocketId } = require('../utils/socketHelpers');

const handleNewUserAdd = (io, socket, activeUsers, userId) => {
  if (!userId) {
    return;
  }
  activeUsers.set(userId, socket.id);
  io.emit(SOCKET_EVENTS.GET_USERS, serializeUsers(activeUsers));
};

const handleDisconnect = (io, socket, activeUsers) => {
  removeUserBySocketId(activeUsers, socket.id);
  io.emit(SOCKET_EVENTS.GET_USERS, serializeUsers(activeUsers));
};

module.exports = {
  handleNewUserAdd,
  handleDisconnect,
};

