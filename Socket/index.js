const { Server } = require('socket.io');
const logger = require('../Server/utils/logger');
const { SOCKET_EVENTS, SOCKET_EVENT_NAMES, LOG_MESSAGES } = require('./constants');
const socketConfig = require('./config/socketConfig');
const { handleNewUserAdd, handleDisconnect } = require('./handlers/userHandlers');
const { handleSendMessage, handleTyping } = require('./handlers/messageHandlers');
const {
  handleCallUser,
  handleCallAccepted,
  handleCallRejected,
  handleCallEnded,
  handleIceCandidate,
} = require('./handlers/callHandlers');

const io = new Server(socketConfig.port, socketConfig);

const activeUsers = new Map();

io.on(SOCKET_EVENT_NAMES.CONNECTION, (socket) => {
  logger.info(LOG_MESSAGES.CLIENT_CONNECTED, { socketId: socket.id });

  socket.on(SOCKET_EVENTS.NEW_USER_ADD, (userId) => {
    handleNewUserAdd(io, socket, activeUsers, userId);
  });

  socket.on(SOCKET_EVENT_NAMES.DISCONNECT, () => {
    handleDisconnect(io, socket, activeUsers);
    logger.info(LOG_MESSAGES.CLIENT_DISCONNECTED, { socketId: socket.id });
  });

  socket.on(SOCKET_EVENTS.SEND_MESSAGE, (payload) => {
    handleSendMessage(io, activeUsers, payload);
  });

  socket.on(SOCKET_EVENTS.TYPING, (payload) => {
    handleTyping(io, activeUsers, payload);
  });

  socket.on(SOCKET_EVENTS.CALL_USER, (payload) => {
    handleCallUser(io, activeUsers, payload);
  });

  socket.on(SOCKET_EVENTS.CALL_ACCEPTED, (payload) => {
    handleCallAccepted(io, activeUsers, payload);
  });

  socket.on(SOCKET_EVENTS.CALL_REJECTED, (payload) => {
    handleCallRejected(io, activeUsers, payload);
  });

  socket.on(SOCKET_EVENTS.CALL_ENDED, (payload) => {
    handleCallEnded(io, activeUsers, payload);
  });

  socket.on(SOCKET_EVENTS.ICE_CANDIDATE, (payload) => {
    handleIceCandidate(io, activeUsers, payload);
  });

  socket.on(SOCKET_EVENT_NAMES.ERROR, (error) => {
    logger.error(LOG_MESSAGES.CLIENT_ERROR, error);
  });
});

io.on(SOCKET_EVENT_NAMES.ERROR, (error) => {
  logger.error(LOG_MESSAGES.SERVER_ERROR, error);
});

logger.info(LOG_MESSAGES.SERVER_INITIALIZED, { port: socketConfig.port });

module.exports = io;
