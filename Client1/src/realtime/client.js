let socket;
let currentToken = null;
let reconnectTimeout = null;
let reconnectAttempts = 0;
const eventListeners = new Map();
const postSubscriptions = new Map();
const userSubscriptions = new Map();

const createUrl = (token) => {
  const explicit = import.meta.env.VITE_WS_BASE_URL;
  if (explicit) {
    const normalized = explicit.endsWith('/') ? explicit.slice(0, -1) : explicit;
    return `${normalized}/ws?token=${encodeURIComponent(token)}`;
  }
  const base = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  const target = new URL(base, window.location.origin);
  target.protocol = target.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${target.origin}/ws?token=${encodeURIComponent(token)}`;
};

const notify = (type, payload) => {
  const handlers = eventListeners.get(type);
  if (handlers) {
    handlers.forEach((handler) => handler(payload));
  }
};

const send = (data) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return false;
  }
  socket.send(JSON.stringify(data));
  return true;
};

const flushActiveFlags = () => {
  postSubscriptions.forEach((entry) => {
    entry.active = false;
  });
  userSubscriptions.forEach((entry) => {
    entry.active = false;
  });
};

const flushSubscriptions = () => {
  postSubscriptions.forEach((entry, postId) => {
    if (entry.count > 0 && socket && socket.readyState === WebSocket.OPEN) {
      send({ type: 'subscribe', postId });
      entry.active = true;
    }
  });
  userSubscriptions.forEach((entry, userId) => {
    if (entry.count > 0 && socket && socket.readyState === WebSocket.OPEN) {
      send({ type: 'watchUser', userId });
      entry.active = true;
    }
  });
};

const scheduleReconnect = () => {
  if (!currentToken) {
    return;
  }
  if (reconnectTimeout) {
    return;
  }
  const delay = Math.min(30000, 1000 * 2 ** reconnectAttempts);
  reconnectAttempts += 1;
  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    connect(currentToken);
  }, delay);
};

const handleClose = () => {
  socket = null;
  flushActiveFlags();
  scheduleReconnect();
};

const handleError = () => {
  if (socket) {
    socket.close();
  }
};

const handleOpen = () => {
  reconnectAttempts = 0;
  flushSubscriptions();
};

const handleMessage = (event) => {
  try {
    const payload = JSON.parse(event.data);
    if (payload?.type) {
      notify(payload.type, payload);
    }
  } catch {
    return;
  }
};

const connect = (token) => {
  if (!token) {
    return;
  }
  if (socket) {
    if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
      return;
    }
  }
  currentToken = token;
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  const url = createUrl(token);
  socket = new WebSocket(url);
  socket.addEventListener('open', handleOpen);
  socket.addEventListener('message', handleMessage);
  socket.addEventListener('close', handleClose);
  socket.addEventListener('error', handleError);
};

export const initRealtime = (token) => {
  if (!token) {
    disconnectRealtime();
    return;
  }
  if (token !== currentToken || !socket) {
    disconnectRealtime();
    connect(token);
  }
};

export const disconnectRealtime = () => {
  currentToken = null;
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  if (socket) {
    socket.removeEventListener('open', handleOpen);
    socket.removeEventListener('message', handleMessage);
    socket.removeEventListener('close', handleClose);
    socket.removeEventListener('error', handleError);
    socket.close();
    socket = null;
  }
  flushActiveFlags();
};

export const subscribeToPost = (postId) => {
  if (!postId) {
    return;
  }
  const key = postId.toString();
  const entry = postSubscriptions.get(key) || { count: 0, active: false };
  entry.count += 1;
  postSubscriptions.set(key, entry);
  if (socket && socket.readyState === WebSocket.OPEN && !entry.active) {
    send({ type: 'subscribe', postId: key });
    entry.active = true;
  }
};

export const unsubscribeFromPost = (postId) => {
  if (!postId) {
    return;
  }
  const key = postId.toString();
  const entry = postSubscriptions.get(key);
  if (!entry) {
    return;
  }
  entry.count = Math.max(0, entry.count - 1);
  if (entry.count === 0) {
    postSubscriptions.delete(key);
    if (socket && socket.readyState === WebSocket.OPEN) {
      send({ type: 'unsubscribe', postId: key });
    }
  } else {
    postSubscriptions.set(key, entry);
  }
};

export const subscribeToUser = (userId) => {
  if (!userId) {
    return;
  }
  const key = userId.toString();
  const entry = userSubscriptions.get(key) || { count: 0, active: false };
  entry.count += 1;
  userSubscriptions.set(key, entry);
  if (socket && socket.readyState === WebSocket.OPEN && !entry.active) {
    send({ type: 'watchUser', userId: key });
    entry.active = true;
  }
};

export const unsubscribeFromUser = (userId) => {
  if (!userId) {
    return;
  }
  const key = userId.toString();
  const entry = userSubscriptions.get(key);
  if (!entry) {
    return;
  }
  entry.count = Math.max(0, entry.count - 1);
  if (entry.count === 0) {
    userSubscriptions.delete(key);
    if (socket && socket.readyState === WebSocket.OPEN) {
      send({ type: 'unwatchUser', userId: key });
    }
  } else {
    userSubscriptions.set(key, entry);
  }
};

export const addRealtimeListener = (type, handler) => {
  if (!type || typeof handler !== 'function') {
    return () => {};
  }
  const handlers = eventListeners.get(type) || new Set();
  handlers.add(handler);
  eventListeners.set(type, handlers);
  return () => removeRealtimeListener(type, handler);
};

export const removeRealtimeListener = (type, handler) => {
  const handlers = eventListeners.get(type);
  if (!handlers) {
    return;
  }
  handlers.delete(handler);
  if (handlers.size === 0) {
    eventListeners.delete(type);
  }
};

