const UserModel = require('../models/usermodel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { emitUserEvent } = require('../socket.js');
const { createNotification } = require('./NotificationController.js');

const selectSafeUser = (user) => {
  if (!user) {
    return null;
  }
  const { password, __v, ...rest } = user.toObject ? user.toObject() : user;
  return rest;
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json(selectSafeUser(user));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (_req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users.map(selectSafeUser));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id?.toString();
  const requesterId = (req.body?._id || req.user?.id || req.user?._id)?.toString();
  if (!requesterId || requesterId !== id) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  try {
    const updatePayload = { ...req.body };
    delete updatePayload._id;
    const profilePicture = updatePayload.profilePicture?.trim();
    const coverPicture = updatePayload.coverPicture?.trim();
    const filteredPayload = {};
    if (updatePayload.firstname !== undefined) filteredPayload.firstname = updatePayload.firstname;
    if (updatePayload.lastname !== undefined) filteredPayload.lastname = updatePayload.lastname;
    if (updatePayload.worksAt !== undefined) filteredPayload.worksAt = updatePayload.worksAt;
    if (updatePayload.livesin !== undefined) filteredPayload.livesin = updatePayload.livesin;
    if (updatePayload.country !== undefined) filteredPayload.country = updatePayload.country;
    if (updatePayload.relationship !== undefined) filteredPayload.relationship = updatePayload.relationship;
    if (updatePayload.about !== undefined) filteredPayload.about = updatePayload.about;
    if (profilePicture && profilePicture !== 'null' && profilePicture !== '') {
      filteredPayload.profilePicture = profilePicture;
    }
    if (coverPicture && coverPicture !== 'null' && coverPicture !== '') {
      filteredPayload.coverPicture = coverPicture;
    }
    if (updatePayload.password) {
      const salt = await bcrypt.genSalt(10);
      filteredPayload.password = await bcrypt.hash(updatePayload.password, salt);
    }
    const user = await UserModel.findByIdAndUpdate(id, filteredPayload, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWTKEY,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    res.status(200).json({ user: selectSafeUser(user), token, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const requesterId = req.body?._id || req.user?.id || req.user?._id;
  const isAdmin = Boolean(req.body?.currentUserAdmin || req.user?.isAdmin);
  if (!requesterId || (requesterId !== id && !isAdmin)) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  try {
    await UserModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const followUser = async (req, res) => {
  const id = req.params.id;
  const requesterId = req.body?._id;
  if (!requesterId || requesterId === id) {
    return res.status(403).json({ success: false, message: 'Action forbidden' });
  }
  try {
    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(requesterId);
    if (!followUser || !followingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (followUser.followers.includes(requesterId)) {
      return res.status(403).json({ success: false, message: 'Already following' });
    }
    await followUser.updateOne({ $push: { followers: requesterId } });
    await followingUser.updateOne({ $push: { following: id } });
    
    // Refetch to get updated arrays
    const updatedFollowUser = await UserModel.findById(id);
    const updatedFollowingUser = await UserModel.findById(requesterId);
    
    const followers = updatedFollowUser.followers.map((value) => value.toString());
    const following = updatedFollowingUser.following.map((value) => value.toString());
    
    emitUserEvent(id, 'followersUpdated', { followers, followerId: requesterId.toString() });
    emitUserEvent(requesterId, 'followingUpdated', { following, targetId: id.toString() });
        const actorName = [followingUser.firstname, followingUser.lastname].filter(Boolean).join(' ') || followingUser.email?.split('@')[0] || 'User';
        await createNotification({
          userId: id,
          type: 'follow',
          actorId: requesterId,
          meta: {
            actor: {
              id: requesterId.toString(),
              name: actorName,
              avatar: followingUser.profilePicture || '',
            },
          },
        });
    res.status(200).json({ success: true, message: 'User followed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const requesterId = req.body?._id;
  if (!requesterId || requesterId === id) {
    return res.status(403).json({ success: false, message: 'Action forbidden' });
  }
  try {
    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(requesterId);
    if (!followUser || !followingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!followUser.followers.includes(requesterId)) {
      return res.status(403).json({ success: false, message: 'Not following' });
    }
    await followUser.updateOne({ $pull: { followers: requesterId } });
    await followingUser.updateOne({ $pull: { following: id } });
    
    // Refetch to get updated arrays
    const updatedFollowUser = await UserModel.findById(id);
    const updatedFollowingUser = await UserModel.findById(requesterId);
    
    const followers = updatedFollowUser.followers.map((value) => value.toString());
    const following = updatedFollowingUser.following.map((value) => value.toString());
    
    emitUserEvent(id, 'followersUpdated', { followers, followerId: requesterId.toString(), removed: true });
    emitUserEvent(requesterId, 'followingUpdated', { following, targetId: id.toString(), removed: true });
    res.status(200).json({ success: true, message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  followUser,
  getAllUsers,
  unfollowUser,
};