<<<<<<< Updated upstream
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const AuthRouter = require('./route/authroute');
require('dotenv').config();

const UserRouter = require('./route/userRoute');
const PostRoute = require('./route/PostRoute');
const UploadRoute =require('./route/UploadRoute');
const ChatRoute =require('./route/ChatRoute');
const MessageRoute =require('./route/MessageRoute');

const app = express();
const port = 5000;
// app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/post', PostRoute)
app.use('/auth', AuthRouter);
app.use('/user', UserRouter);
app.use('/upload', UploadRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)
// to serve images inside public folder
app.use(express.static('public')); 
app.use('/images', express.static('images'));
mongoose
.connect('mongodb+srv://rajeshkh704435:hf7paVmgsseBrqIw@signup.dxqefmb.mongodb.net/')
.then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
=======
require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const morgan = require('morgan');
const { connectDatabase } = require('./db');
const { initSocket } = require('./socket');
const AuthRouter = require('./route/authroute');
const UserRouter = require('./route/userRoute');
const PostRoute = require('./route/PostRoute');
const UploadRoute = require('./route/UploadRoute');
const ChatRoute = require('./route/ChatRoute');
const MessageRoute = require('./route/MessageRoute');
const NotificationRoute = require('./route/NotificationRoute');
const TrendRoute = require('./route/TrendRoute');
const { scheduleDailyDigest } = require('./jobs/dailyDigest');
const { scheduleTrendSeed } = require('./jobs/trendSeed');

const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT || 5000);
const corsOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);
const corsOptions = {
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};
const rateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  max: Number(process.env.RATE_LIMIT_MAX || 1000),
  standardHeaders: true,
  legacyHeaders: false,
});

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(rateLimiter);
app.use(express.json({ limit: process.env.REQUEST_LIMIT || '30mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '30mb' }));
app.use(hpp());
app.use(compression());
app.use(process.env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev'));
app.use('/post', PostRoute);
app.use('/auth', AuthRouter);
app.use('/user', UserRouter);
app.use('/upload', UploadRoute);
app.use('/chat', ChatRoute);
app.use('/message', MessageRoute);
app.use('/notifications', NotificationRoute);
app.use('/trends', TrendRoute);
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.use('/images', express.static(path.join(publicPath, 'images')));
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});
app.use((error, req, res, _next) => {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
});
initSocket(server, corsOrigins);

const start = async () => {
  await connectDatabase();
  scheduleDailyDigest();
  scheduleTrendSeed();
  server.listen(port, () => {
    console.info(`Server listening on port ${port}`);
  });
};
start().catch((error) => {
  console.error('Application startup failed', error);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection', reason);
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception', error);
  process.exit(1);
});
>>>>>>> Stashed changes
