const UserModel = require('../models/usermodel');
const mongoose = require('mongoose');

const findUserById = async (userId) => {
  return await UserModel.findById(userId);
};

const findAllUsers = async (currentUserId = null, limit = null, offset = 0) => {
  const queryConditions = {};
  
  if (currentUserId) {
    // Convert to ObjectId to ensure proper comparison
    const userIdObjectId = mongoose.Types.ObjectId.isValid(currentUserId) 
      ? new mongoose.Types.ObjectId(currentUserId) 
      : currentUserId;
    queryConditions._id = { $ne: userIdObjectId };
  }
  
  const query = UserModel.find(queryConditions).select('-password -__v -followers -following');
  
  const totalCount = await UserModel.countDocuments(queryConditions);
  
  if (limit !== null) {
    query.skip(offset).limit(limit);
  }
  
  const users = await query.lean();
  
  if (!currentUserId) {
    return { users, total: totalCount };
  }
  
  const FollowModel = require('../models/followModel');
  const follows = await FollowModel.find({ followerId: currentUserId }).lean();
  const followingSet = new Set(follows.map(f => f.followingId.toString()));
  
  const usersWithFollowing = users.map(user => ({
    ...user,
    isFollowing: followingSet.has(user._id.toString()),
  }));
  
  return { users: usersWithFollowing, total: totalCount };
};

const updateUser = async (userId, updateData) => {
  return await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteUser = async (userId) => {
  return await UserModel.findByIdAndDelete(userId);
};

module.exports = {
  findUserById,
  findAllUsers,
  updateUser,
  deleteUser,
};

