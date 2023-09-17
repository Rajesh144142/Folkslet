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
