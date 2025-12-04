const PostModel = require('../models/postModel');
const LikeModel = require('../models/likeModel');
const CommentModel = require('../models/commentModel');
const FollowModel = require('../models/followModel');
const UserModel = require('../models/usermodel');

const findPostById = async (postId) => {
  return await PostModel.findById(postId);
};

const createPost = async (postData) => {
  const post = new PostModel(postData);
  return await post.save();
};

const updatePost = async (postId, updateData) => {
  return await PostModel.findByIdAndUpdate(postId, updateData, { new: true, runValidators: true });
};

const deletePost = async (postId) => {
  return await PostModel.findByIdAndDelete(postId);
};

const incrementShareCount = async (postId) => {
  return await PostModel.findByIdAndUpdate(postId, { $inc: { shareCount: 1 } }, { new: true });
};

const findLike = async (postId, userId) => {
  return await LikeModel.findOne({ postId, userId });
};

const createLike = async (postId, userId) => {
  const like = new LikeModel({ postId, userId });
  return await like.save();
};

const deleteLike = async (postId, userId) => {
  return await LikeModel.findOneAndDelete({ postId, userId });
};

const getPostLikes = async (postId) => {
  const likes = await LikeModel.find({ postId }).select('userId');
  return likes.map((like) => like.userId);
};

const getPostLikesCount = async (postId) => {
  return await LikeModel.countDocuments({ postId });
};

const createComment = async (commentData) => {
  const comment = new CommentModel(commentData);
  return await comment.save();
};

const getPostComments = async (postId, limit = 50) => {
  return await CommentModel.find({ postId, deletedAt: null })
    .populate('userId', 'firstName lastName email profilePicture')
    .sort({ createdAt: -1 })
    .limit(limit);
};

const getPostCommentsCount = async (postId) => {
  return await CommentModel.countDocuments({ postId, deletedAt: null });
};

const getUserFollowingIds = async (userId) => {
  const follows = await FollowModel.find({ followerId: userId }).select('followingId');
  return follows.map((follow) => follow.followingId);
};

const getUserPosts = async (userId, query = {}, limit = 20) => {
  return await PostModel.find({ userId, ...query })
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .lean();
};

const getFollowingPosts = async (followingIds, query = {}, limit = 20) => {
  if (!followingIds || followingIds.length === 0) {
    return [];
  }

  return await PostModel.find({
    userId: { $in: followingIds },
    ...query,
  })
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .lean();
};

const findUserById = async (userId, select = '') => {
  if (select) {
    return await UserModel.findById(userId).select(select);
  }
  return await UserModel.findById(userId);
};

module.exports = {
  findPostById,
  createPost,
  updatePost,
  deletePost,
  incrementShareCount,
  findLike,
  createLike,
  deleteLike,
  getPostLikes,
  getPostLikesCount,
  createComment,
  getPostComments,
  getPostCommentsCount,
  getUserFollowingIds,
  getUserPosts,
  getFollowingPosts,
  findUserById,
};

