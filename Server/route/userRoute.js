const express = require('express');
const {
  deleteUser,
  followUser,
  getUser,
  getAllUsers,
  unfollowUser,
  updateUser,
  getFollowCounts,
} = require('../controller/UserController');
const router = express.Router();

// Authentication is handled globally in server.js, so routes don't need individual middleware
router.get('/', getAllUsers);
router.get('/:id/follow-counts', getFollowCounts);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/follow', followUser);
router.delete('/:id/follow', unfollowUser);

module.exports = router;
