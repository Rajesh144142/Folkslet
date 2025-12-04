const FollowModel = require('../models/followModel');
const UserModel = require('../models/usermodel');

const findFollow = async (followerId, followingId) => {
  return await FollowModel.findOne({ followerId, followingId });
};

const createFollow = async (followerId, followingId) => {
  const follow = new FollowModel({ followerId, followingId });
  return await follow.save();
};

const deleteFollow = async (followerId, followingId) => {
  return await FollowModel.findOneAndDelete({ followerId, followingId });
};

const getFollowers = async (userId) => {
  const follows = await FollowModel.find({ followingId: userId }).select('followerId');
  return follows.map((follow) => follow.followerId);
};

const getFollowing = async (userId) => {
  const follows = await FollowModel.find({ followerId: userId }).select('followingId');
  return follows.map((follow) => follow.followingId);
};

const getFollowCounts = async (userId) => {
  const [followersCount, followingCount] = await Promise.all([
    FollowModel.countDocuments({ followingId: userId }),
    FollowModel.countDocuments({ followerId: userId }),
  ]);
  return { followersCount, followingCount };
};

const findUserById = async (userId, select = '') => {
  if (select) {
    return await UserModel.findById(userId).select(select);
  }
  return await UserModel.findById(userId);
};

module.exports = {
  findFollow,
  createFollow,
  deleteFollow,
  getFollowers,
  getFollowing,
  getFollowCounts,
  findUserById,
};

