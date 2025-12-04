const { sendSuccess, sendError } = require('../utils/responseHandler');
const { handleError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/httpStatus');
const { VALIDATION_MESSAGES } = require('../validation');
const { emitPostEvent } = require('../socket');
const { createNotification } = require('./NotificationController');
const postService = require('../services/postService');

const createPost = async (req, res) => {
  try {
    const { sharedPostId, userId, desc, image, location } = req.body || {};

    if (!userId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.userId);
    }

    const payload = {
      userId,
      desc: desc || null,
      image: image || null,
      location: location || null,
    };

    let originalPost = null;

    if (sharedPostId) {
      originalPost = await postService.findPostById(sharedPostId);
      if (!originalPost) {
        return sendError(res, HTTP_STATUS.NOT_FOUND, VALIDATION_MESSAGES.notFound.post);
      }

      payload.sharedPost = {
        postId: originalPost._id,
        userId: originalPost.userId,
        desc: originalPost.desc || null,
        image: originalPost.image || null,
        createdAt: originalPost.createdAt,
        location: originalPost.location || null,
      };
    }

    const post = await postService.createPost(payload);

    emitPostEvent(post._id.toString(), 'postCreated', {
      postId: post._id.toString(),
      post: post,
    });

    if (originalPost) {
      await postService.incrementShareCount(originalPost._id);
      const updatedOriginal = await postService.findPostById(originalPost._id);

      if (updatedOriginal.userId.toString() !== userId.toString()) {
        let actorMeta;
        try {
          const actor = await postService.findUserById(userId, 'firstName lastName email profilePicture');
          if (actor) {
            actorMeta = {
              id: actor._id.toString(),
              name: [actor.firstName, actor.lastName].filter(Boolean).join(' ') || actor.email.split('@')[0],
              avatar: actor.profilePicture || '',
            };
          }
        } catch {
          actorMeta = undefined;
        }

        await createNotification({
          userId: updatedOriginal.userId,
          type: 'share',
          actorId: userId,
          postId: updatedOriginal._id,
          meta: {
            actor: actorMeta,
            post: {
              id: updatedOriginal._id.toString(),
              desc: updatedOriginal.desc || '',
              image: updatedOriginal.image || '',
            },
            sharedPostId: sharedPostId.toString(),
            comment: payload.desc || '',
          },
        });
      }

      emitPostEvent(originalPost._id.toString(), 'shareCountUpdated', {
        postId: originalPost._id.toString(),
        shareCount: updatedOriginal.shareCount,
      });
    }

    return sendSuccess(res, HTTP_STATUS.CREATED, post);
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await postService.findPostById(req.params.id);
    if (!post) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, VALIDATION_MESSAGES.notFound.post);
    }
    return sendSuccess(res, HTTP_STATUS.OK, post);
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await postService.findPostById(req.params.id);
    if (!post) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, VALIDATION_MESSAGES.notFound.post);
    }

    if (post.userId.toString() !== req.body.userId?.toString()) {
      return sendError(res, HTTP_STATUS.FORBIDDEN, VALIDATION_MESSAGES.validation.postOwnership);
    }

    const updated = await postService.updatePost(req.params.id, req.body);
    
    emitPostEvent(req.params.id, 'postUpdated', {
      postId: req.params.id,
      post: updated,
    });
    
    return sendSuccess(res, HTTP_STATUS.OK, updated);
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const comments = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const postId = req.params.id;

    if (!userId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.userId);
    }

    const sanitizedMessage = typeof message === 'string' ? message.trim() : '';
    if (sanitizedMessage.length === 0) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.comment);
    }

    const post = await postService.findPostById(postId);
    if (!post) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, VALIDATION_MESSAGES.notFound.post);
    }

    const user = await postService.findUserById(userId, 'firstName lastName email');
    const displayName = user
      ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email.split('@')[0]
      : 'Anonymous';

    const comment = await postService.createComment({
      postId,
      userId,
      text: sanitizedMessage,
    });

    const payload = {
      postId: post._id.toString(),
      comment: {
        _id: comment._id,
        userId: comment.userId,
        username: displayName,
        text: comment.text,
        createdAt: comment.createdAt,
      },
    };

    emitPostEvent(post._id.toString(), 'commentCreated', payload);
    return sendSuccess(res, HTTP_STATUS.CREATED, payload);
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await postService.findPostById(req.params.id);
    if (!post) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, VALIDATION_MESSAGES.notFound.post);
    }

    if (post.userId.toString() !== req.body.userId?.toString()) {
      return sendError(res, HTTP_STATUS.FORBIDDEN, VALIDATION_MESSAGES.validation.postOwnership);
    }

    const postId = post._id.toString();
    await postService.deletePost(req.params.id);
    emitPostEvent(postId, 'postDeleted', { postId });
    return sendSuccess(res, HTTP_STATUS.OK, { message: 'Post deleted successfully' });
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const likePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.id;

    if (!userId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.userId);
    }

    const post = await postService.findPostById(postId);
    if (!post) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, VALIDATION_MESSAGES.notFound.post);
    }

    const existingLike = await postService.findLike(postId, userId);
    const hasLiked = !!existingLike;

    if (hasLiked) {
      await postService.deleteLike(postId, userId);
    } else {
      await postService.createLike(postId, userId);
    }

    const likes = await postService.getPostLikes(postId);
    const payload = {
      postId: post._id.toString(),
      likes: likes.map((id) => id.toString()),
      liked: !hasLiked,
    };

    emitPostEvent(post._id.toString(), 'likesUpdated', payload);

    if (!hasLiked && post.userId.toString() !== userId.toString()) {
      let actorMeta;
      try {
        const actor = await postService.findUserById(userId, 'firstName lastName email profilePicture');
        if (actor) {
          actorMeta = {
            id: actor._id.toString(),
            name: [actor.firstName, actor.lastName].filter(Boolean).join(' ') || actor.email.split('@')[0],
            avatar: actor.profilePicture || '',
          };
        }
      } catch {
        actorMeta = undefined;
      }

      await createNotification({
        userId: post.userId,
        type: 'like',
        actorId: userId,
        postId: post._id,
        meta: {
          actor: actorMeta,
          post: {
            id: post._id.toString(),
            desc: post.desc || '',
            image: post.image || '',
          },
        },
      });
    }

    return sendSuccess(res, HTTP_STATUS.OK, payload);
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const parseLimit = (value, fallback) => {
  const limit = Number.parseInt(value, 10);
  if (Number.isNaN(limit) || limit <= 0) {
    return fallback;
  }
  return Math.min(limit, 50);
};

const getTimelinePosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const limit = parseLimit(req.query.limit, 20);

    const currentUserPosts = await postService.getUserPosts(userId, {}, limit);
    const followingIds = await postService.getUserFollowingIds(userId);
    const followingPosts = await postService.getFollowingPosts(followingIds, {}, limit);

    const allPosts = [...currentUserPosts, ...followingPosts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    return sendSuccess(res, HTTP_STATUS.OK, {
      items: allPosts,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

module.exports = {
  createPost,
  getTimelinePosts,
  deletePost,
  likePost,
  updatePost,
  getPost,
  comments,
};
