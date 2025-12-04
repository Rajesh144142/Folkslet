const { SOCKET_EVENTS, DEFAULT_CALL_TYPE } = require('../constants');
const { isValidPayload, getReceiverSocketId } = require('../utils/socketHelpers');

const handleCallUser = (io, activeUsers, payload) => {
  if (!isValidPayload(payload)) {
    return;
  }
  const { receiverId, offer, senderId, senderName, callType } = payload;
  if (!receiverId || !offer || !senderId) {
    return;
  }
  const socketId = getReceiverSocketId(activeUsers, receiverId);
  if (socketId) {
    io.to(socketId).emit(SOCKET_EVENTS.INCOMING_CALL, {
      senderId,
      senderName,
      offer,
      callType: callType || DEFAULT_CALL_TYPE,
    });
  }
};

const handleCallAccepted = (io, activeUsers, payload) => {
  if (!isValidPayload(payload)) {
    return;
  }
  const { receiverId, answer } = payload;
  if (!receiverId || !answer) {
    return;
  }
  const socketId = getReceiverSocketId(activeUsers, receiverId);
  if (socketId) {
    io.to(socketId).emit(SOCKET_EVENTS.CALL_ACCEPTED, { answer });
  }
};

const handleCallRejected = (io, activeUsers, payload) => {
  if (!isValidPayload(payload)) {
    return;
  }
  const { receiverId } = payload;
  if (!receiverId) {
    return;
  }
  const socketId = getReceiverSocketId(activeUsers, receiverId);
  if (socketId) {
    io.to(socketId).emit(SOCKET_EVENTS.CALL_REJECTED);
  }
};

const handleCallEnded = (io, activeUsers, payload) => {
  if (!isValidPayload(payload)) {
    return;
  }
  const { receiverId } = payload;
  if (!receiverId) {
    return;
  }
  const socketId = getReceiverSocketId(activeUsers, receiverId);
  if (socketId) {
    io.to(socketId).emit(SOCKET_EVENTS.CALL_ENDED);
  }
};

const handleIceCandidate = (io, activeUsers, payload) => {
  if (!isValidPayload(payload)) {
    return;
  }
  const { receiverId, candidate } = payload;
  if (!receiverId || !candidate) {
    return;
  }
  const socketId = getReceiverSocketId(activeUsers, receiverId);
  if (socketId) {
    io.to(socketId).emit(SOCKET_EVENTS.ICE_CANDIDATE, { candidate });
  }
};

module.exports = {
  handleCallUser,
  handleCallAccepted,
  handleCallRejected,
  handleCallEnded,
  handleIceCandidate,
};

