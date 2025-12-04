const express = require('express');
const {
  createPost,
  deletePost,
  getPost,
  getTimelinePosts,
  likePost,
  updatePost,
  comments,
} = require('../controller/PostController');

const router = express.Router();

router.post('/', createPost);
router.get('/timeline/:id', getTimelinePosts);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', likePost);
router.post('/:id/comments', comments);

module.exports = router;
