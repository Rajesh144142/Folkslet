const { WebSocketServer, WebSocket } = require('ws');
const jwt = require('jsonwebtoken');

let wss;
const clients = new Map();
const originSet = new Set();

const resolveToken = (request) => {
  const header = request.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  const host = request.headers.host || 'localhost';
  try {
    const url = new URL(request.url, `http://${host}`);
    const token = url.searchParams.get('token');
    if (token) {
      return token;
    }
  } catch (_error) {
    return null;
  }
  return null;
};

const resolveUserId = (payload) => {
  if (!payload) {
    return null;
  }
  if (payload.id) {
    return payload.id.toString();
  }
  if (payload._id) {
    return payload._id.toString();
  }
  if (payload.userId) {
    return payload.userId.toString();
  }
  return null;
};

const sanitizeId = (value) => {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }
  return trimmed;
};

const send = (socket, payload) => {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }
  socket.send(JSON.stringify(payload));
};

const handleMessage = (socket, raw) => {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (_error) {
    return;
  }
  const client = clients.get(socket);
  if (!client || !parsed || typeof parsed !== 'object') {
    return;
  }
  if (parsed.type === 'subscribe') {
    const postId = sanitizeId(parsed.postId);
    if (!postId) {
      return;
    }
    client.posts.add(postId);
    send(socket, { type: 'subscribed', postId });
    return;
  }
  if (parsed.type === 'unsubscribe') {
    const postId = sanitizeId(parsed.postId);
    if (!postId) {
      return;
    }
    client.posts.delete(postId);
    send(socket, { type: 'unsubscribed', postId });
    return;
  }
  if (parsed.type === 'watchUser') {
    const userId = sanitizeId(parsed.userId);
    if (!userId) {
      return;
    }
    client.users.add(userId);
    send(socket, { type: 'userSubscribed', userId });
    return;
  }
  if (parsed.type === 'unwatchUser') {
    const userId = sanitizeId(parsed.userId);
    if (!userId) {
      return;
    }
    client.users.delete(userId);
    send(socket, { type: 'userUnsubscribed', userId });
    return;
  }
  if (parsed.type === 'ping') {
    send(socket, { type: 'pong' });
  }
};

const initSocket = (server, origins) => {
  if (wss) {
    return wss;
  }
  originSet.clear();
  origins
    .filter((origin) => origin !== '*')
    .forEach((origin) => originSet.add(origin));
  wss = new WebSocketServer({
    server,
    path: '/ws',
    maxPayload: Number(process.env.SOCKET_MAX_PAYLOAD || 1024 * 1024),
  });
  wss.on('connection', (socket, request) => {
    if (originSet.size > 0) {
      const origin = request.headers.origin;
      if (!origin || !originSet.has(origin)) {
        socket.close(4403, 'Forbidden');
        return;
      }
    }
    const token = resolveToken(request);
    if (!token) {
      socket.close(4401, 'Unauthorized');
      return;
    }
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWTKEY);
    } catch (_error) {
      socket.close(4401, 'Unauthorized');
      return;
    }
    const userId = resolveUserId(payload);
    if (!userId) {
      socket.close(4401, 'Unauthorized');
      return;
    }
    const client = { userId, posts: new Set(), users: new Set([userId]) };
    clients.set(socket, client);
    send(socket, { type: 'ready', userId });
    socket.on('message', (message) => handleMessage(socket, message.toString()));
    socket.on('close', () => {
      clients.delete(socket);
    });
    socket.on('error', () => {
      clients.delete(socket);
    });
  });
  return wss;
};

const emitPostEvent = (postId, event, payload) => {
  const sanitized = sanitizeId(postId);
  if (!sanitized) {
    return;
  }
  const message = { type: event, postId: sanitized, data: payload };
  clients.forEach((client, socket) => {
    if (client.posts.has(sanitized)) {
      send(socket, message);
    }
  });
};

const emitUserEvent = (userId, event, payload) => {
  const sanitized = sanitizeId(userId);
  if (!sanitized) {
    return;
  }
  const message = { type: event, userId: sanitized, data: payload };
  clients.forEach((client, socket) => {
    if (client.userId === sanitized || client.users.has(sanitized)) {
      send(socket, message);
    }
  });
};

module.exports = { initSocket, emitPostEvent, emitUserEvent };

