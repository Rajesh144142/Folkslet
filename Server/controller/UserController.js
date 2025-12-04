const { sendSuccess, sendError } = require('../utils/responseHandler');
const { handleError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/httpStatus');
const { VALIDATION_MESSAGES } = require('../validation');
const { DEFAULT_USER_DISPLAY_NAME, SOCKET_EVENTS } = require('../config/constants');
const { hashPassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');
const { emitUserEvent } = require('../socket');
const { createNotification } = require('./NotificationController');
const userService = require('../services/userService');
const followService = require('../services/followService');

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user?.id || req.user?._id || req.query?.userId || req.body?._id || null;
    const user = await userService.findUserById(userId);
    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, VALIDATION_MESSAGES.notFound.user);
    }
    
    const followCounts = await followService.getFollowCounts(userId);
    const userObj = user.toObject ? user.toObject() : user;
    userObj.followersCount = followCounts.followersCount;
    userObj.followingCount = followCounts.followingCount;
    
    if (currentUserId && currentUserId !== userId) {
      const isFollowing = await followService.findFollow(currentUserId, userId);
      userObj.isFollowing = !!isFollowing;
    }
    
    return sendSuccess(res, HTTP_STATUS.OK, userObj);
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Extract user ID from token - prioritize id field, fallback to _id
    const currentUserId = req.user?.id || req.user?._id || null;
    
    // If user is authenticated but ID is missing, log warning but continue
    if (req.user && !currentUserId) {
      console.warn('User authenticated but ID not found in token:', req.user);
    }
    
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    
    const result = await userService.findAllUsers(currentUserId, limit, offset);
    return sendSuccess(res, HTTP_STATUS.OK, {
      users: result.users,
      total: result.total,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id?.toString();
    const requesterId = (req.body?._id || req.user?.id || req.user?._id)?.toString();

    if (!requesterId || requesterId !== id) {
      return sendError(res, HTTP_STATUS.FORBIDDEN, VALIDATION_MESSAGES.validation.userOwnership);
    }

    const updatePayload = { ...req.body };
    delete updatePayload._id;

    const profilePicture = updatePayload.profilePicture?.trim();
    const coverPicture = updatePayload.coverPicture?.trim();

    const filteredPayload = {};

    if (updatePayload?.firstName) filteredPayload.firstName = updatePayload.firstName;
    if (updatePayload?.firstname) filteredPayload.firstName = updatePayload.firstname;
    if (updatePayload?.lastName) filteredPayload.lastName = updatePayload.lastName;
    if (updatePayload?.lastname) filteredPayload.lastName = updatePayload.lastname;
    if (updatePayload?.worksAt) filteredPayload.worksAt = updatePayload.worksAt;
    if (updatePayload?.livesIn) filteredPayload.livesIn = updatePayload.livesIn;
    if (updatePayload?.livesin) filteredPayload.livesIn = updatePayload.livesin;
    if (updatePayload?.country) filteredPayload.country = updatePayload.country;
    if (updatePayload?.relationship) filteredPayload.relationship = updatePayload.relationship;
    if (updatePayload?.about) filteredPayload.about = updatePayload.about;

    if (profilePicture &&  profilePicture !== '') {
      filteredPayload.profilePicture = profilePicture;
    }
    if (coverPicture  && coverPicture !== '') {
      filteredPayload.coverPicture = coverPicture;
    }

    if (updatePayload.password) {
      filteredPayload.password = await hashPassword(updatePayload.password);
    }

    const user = await userService.updateUser(id, filteredPayload);

    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, VALIDATION_MESSAGES.notFound.user);
    }

    const token = generateToken({ email: user.email, id: user._id });

    return sendSuccess(res, HTTP_STATUS.OK, { user, token });
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const requesterId = req.body?._id || req.user?.id || req.user?._id;
    const isAdmin = Boolean(req.body?.currentUserAdmin || req.user?.isAdmin);

    if (!requesterId || (requesterId !== id && !isAdmin)) {
      return sendError(res, HTTP_STATUS.FORBIDDEN, VALIDATION_MESSAGES.validation.userOwnership);
    }

    await userService.deleteUser(id);

    return sendSuccess(res, HTTP_STATUS.OK, { message: VALIDATION_MESSAGES.success.userDeleted });
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const requesterId = req.body?._id;

    if (!requesterId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.userId);
    }

    if (requesterId === targetUserId) {
      return sendError(res, HTTP_STATUS.FORBIDDEN, VALIDATION_MESSAGES.validation.followSelf);
    }

    const targetUser = await userService.findUserById(targetUserId);
    const followingUser = await followService.findUserById(requesterId, 'firstName lastName email profilePicture');

    if (!targetUser || !followingUser) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, VALIDATION_MESSAGES.notFound.user);
    }

    const existingFollow = await followService.findFollow(requesterId, targetUserId);
    if (existingFollow) {
      return sendError(res, HTTP_STATUS.CONFLICT, VALIDATION_MESSAGES.validation.alreadyFollowing);
    }

    await followService.createFollow(requesterId, targetUserId);

    const [followers, following] = await Promise.all([
      followService.getFollowers(targetUserId),
      followService.getFollowing(requesterId),
    ]);

    emitUserEvent(targetUserId, SOCKET_EVENTS.FOLLOWERS_UPDATED, {
      followers: followers.map((id) => id.toString()),
      followerId: requesterId.toString(),
    });
    emitUserEvent(requesterId, SOCKET_EVENTS.FOLLOWING_UPDATED, {
      following: following.map((id) => id.toString()),
      targetId: targetUserId.toString(),
    });

    const actorName = [followingUser.firstName, followingUser.lastName].filter(Boolean).join(' ') || followingUser.email?.split('@')[0] || DEFAULT_USER_DISPLAY_NAME;

    await createNotification({
      userId: targetUserId,
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

    return sendSuccess(res, HTTP_STATUS.OK, { message: VALIDATION_MESSAGES.success.userFollowed });
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const requesterId = req.body?._id;

    if (!requesterId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.userId);
    }

    if (requesterId === targetUserId) {
      return sendError(res, HTTP_STATUS.FORBIDDEN, VALIDATION_MESSAGES.validation.followSelf);
    }

    const targetUser = await userService.findUserById(targetUserId);
    if (!targetUser) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, VALIDATION_MESSAGES.notFound.user);
    }

    const existingFollow = await followService.findFollow(requesterId, targetUserId);
    if (!existingFollow) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.validation.notFollowing);
    }

    await followService.deleteFollow(requesterId, targetUserId);

    const [followers, following] = await Promise.all([
      followService.getFollowers(targetUserId),
      followService.getFollowing(requesterId),
    ]);

    emitUserEvent(targetUserId, SOCKET_EVENTS.FOLLOWERS_UPDATED, {
      followers: followers.map((id) => id.toString()),
      followerId: requesterId.toString(),
      removed: true,
    });
    emitUserEvent(requesterId, SOCKET_EVENTS.FOLLOWING_UPDATED, {
      following: following.map((id) => id.toString()),
      targetId: targetUserId.toString(),
      removed: true,
    });

    return sendSuccess(res, HTTP_STATUS.OK, { message: VALIDATION_MESSAGES.success.userUnfollowed });
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const getFollowCounts = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.userId);
    }

    const followCounts = await followService.getFollowCounts(userId);
    
    return sendSuccess(res, HTTP_STATUS.OK, {
      followersCount: followCounts.followersCount,
      followingCount: followCounts.followingCount,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  followUser,
  getAllUsers,
  unfollowUser,
  getFollowCounts,
};
