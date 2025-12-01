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
  const id = req.params.id;
  const requesterId = req.body?._id || req.user?.id || req.user?._id;
  if (!requesterId || requesterId !== id) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  try {
    const updatePayload = { ...req.body };
    const profilePicture = updatePayload.profilePicture?.trim();
    const coverPicture = updatePayload.coverPicture?.trim();
    const filteredPayload = {
      firstname: updatePayload.firstname,
      lastname: updatePayload.lastname,
      worksAt: updatePayload.worksAt,
      livesin: updatePayload.livesin,
      country: updatePayload.country,
      relationship: updatePayload.relationship,
      about: updatePayload.about,
      profilePicture: profilePicture && profilePicture !== 'null' ? profilePicture : undefined,
      coverPicture: coverPicture && coverPicture !== 'null' ? coverPicture : undefined,
    };
    if (updatePayload.password) {
      const salt = await bcrypt.genSalt(10);
      filteredPayload.password = await bcrypt.hash(updatePayload.password, salt);
    }
    const sanitizedPayload = Object.fromEntries(
      Object.entries(filteredPayload).filter(([, value]) => value !== undefined),
    );
    const user = await UserModel.findByIdAndUpdate(id, sanitizedPayload, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const token = jwt.sign(
      { username: user.username, id: user._id },
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
    const followers = [...followUser.followers.map((value) => value.toString()), requesterId.toString()];
    const following = [...followingUser.following.map((value) => value.toString()), id.toString()];
        emitUserEvent(id, 'followersUpdated', { followers, followerId: requesterId.toString() });
    emitUserEvent(requesterId, 'followingUpdated', { following, targetId: id.toString() });
        const actorName = [followingUser.firstname, followingUser.lastname].filter(Boolean).join(' ') || followingUser.username;
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
    const followers = followUser.followers
      .map((value) => value.toString())
      .filter((value) => value !== requesterId.toString());
    const following = followingUser.following
      .map((value) => value.toString())
      .filter((value) => value !== id.toString());
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
