const SOCKET_EVENTS = {
  NEW_USER_ADD: 'new-user-add',
  GET_USERS: 'get-users',
  SEND_MESSAGE: 'send-message',
  RECEIVE_MESSAGE: 'recieve-message',
  TYPING: 'typing',
  TYPING_STATUS: 'typing-status',
  CALL_USER: 'call-user',
  INCOMING_CALL: 'incoming-call',
  CALL_ACCEPTED: 'call-accepted',
  CALL_REJECTED: 'call-rejected',
  CALL_ENDED: 'call-ended',
  ICE_CANDIDATE: 'ice-candidate',
};

const SOCKET_EVENT_NAMES = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
};

const DEFAULT_CALL_TYPE = 'video';

const LOG_MESSAGES = {
  CLIENT_CONNECTED: 'Socket client connected',
  CLIENT_DISCONNECTED: 'Socket client disconnected',
  CLIENT_ERROR: 'Socket client error',
  SERVER_ERROR: 'Socket server error',
  SERVER_INITIALIZED: 'Socket server initialized',
};

module.exports = {
  SOCKET_EVENTS,
  SOCKET_EVENT_NAMES,
  DEFAULT_CALL_TYPE,
  LOG_MESSAGES,
};

