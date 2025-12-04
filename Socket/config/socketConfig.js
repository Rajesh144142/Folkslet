require('dotenv').config();

const port = Number(process.env.SOCKET_PORT || 8800);
const allowedOrigins = (process.env.SOCKET_ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

const socketConfig = {
  port,
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: Number(process.env.SOCKET_PING_TIMEOUT || 25000),
  pingInterval: Number(process.env.SOCKET_PING_INTERVAL || 20000),
};

module.exports = socketConfig;

