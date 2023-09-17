const express = require('express');
// const { authenticateToken } = require('../controller/authController');
const {
  deleteUser,
  followUser,
  getUser,getAllUsers,
  unfollowUser,
  updateUser,
} = require('../controller/UserController');

const userRouter = express.Router();

// Use the authenticateToken middleware for routes that require authentication
userRouter.get('/:id', getUser);
userRouter.get('/',getAllUsers)
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
userRouter.put('/:id/follow', followUser);
userRouter.put('/:id/unfollow', unfollowUser);

module.exports = userRouter;
