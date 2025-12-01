<<<<<<< Updated upstream
const PostModel = require("../models/postModel.js");
const mongoose = require("mongoose");
const UserModel = require("../models/usermodel.js");

// Creat new Post
const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);
  try {
    const postData = await newPost.save();
    res.status(200).json(postData);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get a post

const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};


// Update a post
const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      const Postupdate = await post.updateOne({ $set: req.body });
      res.status(200).json(Postupdate);
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
//Post comments 
const comments = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, username, message } = req.body;

    // Check if the postId exists in the database
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create a new comment object
    const comment = {
      userId,
      username,
      message,
    };
    post.comments.push(comment);
    await post.save();
    res.status(201).json( comment );
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Delete a post
const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("POst deleted successfully");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
=======
const PostModel = require('../models/postModel.js');
const mongoose = require('mongoose');
const UserModel = require('../models/usermodel.js');
const { emitPostEvent } = require('../socket.js');
const { createNotification } = require('./NotificationController.js');

const createPost = async (req, res) => {
  try {
    const { sharedPostId, userId, desc, image, location } = req.body || {};

    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }

    const payload = {
      userId,
      desc,
      image,
      location,
    };

    let original;

    if (sharedPostId) {
      original = await PostModel.findById(sharedPostId);
      if (!original) {
        return res.status(404).json({ message: 'Original post not found' });
      }
      payload.sharedPost = {
        postId: original.id,
        userId: original.userId,
        desc: original.desc,
        image: original.image,
        createdAt: original.createdAt,
        location: original.location || null,
      };
    }

    const post = await new PostModel(payload).save();

    if (original) {
      original.shareCount = (original.shareCount || 0) + 1;
      await original.save();
      if (original.userId !== userId) {
        let actorMeta;
        try {
          const actor = await UserModel.findById(userId).select('firstname lastname username profilePicture');
          if (actor) {
            actorMeta = {
              id: actor.id.toString(),
              name: [actor.firstname, actor.lastname].filter(Boolean).join(' ') || actor.username,
              avatar: actor.profilePicture || '',
            };
          }
        } catch {
          actorMeta = undefined;
        }
        await createNotification({
          userId: original.userId,
          type: 'share',
          actorId: userId,
          postId: original.id,
          meta: {
            actor: actorMeta,
            post: {
              id: original.id,
              desc: original.desc || '',
              image: original.image || '',
            },
            sharedPostId,
            comment: payload.desc || '',
          },
        });
      }
      emitPostEvent(original.id, 'shareCountUpdated', {
        postId: original.id,
        shareCount: original.shareCount,
      });
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.userId !== req.body.userId) {
      return res.status(403).json({ message: 'Action forbidden' });
    }
    Object.assign(post, req.body);
    const updated = await post.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const comments = async (req, res) => {
  try {
    const { userId, username, message } = req.body;
    const sanitizedMessage = typeof message === 'string' ? message.trim() : '';
    if (!userId || sanitizedMessage.length === 0) {
      return res.status(400).json({ message: 'Invalid payload' });
    }
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    post.comments.push({
      userId,
      username: typeof username === 'string' ? username : '',
      message: sanitizedMessage,
    });
    await post.save();
    const comment = post.comments[post.comments.length - 1];
    const payload = { postId: post.id, comment };
    emitPostEvent(post.id, 'commentCreated', payload);
    res.status(201).json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.userId !== req.body.userId) {
      return res.status(403).json({ message: 'Action forbidden' });
    }
    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
>>>>>>> Stashed changes
  }
};

const likePost = async (req, res) => {
<<<<<<< Updated upstream
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post Unliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get Timeline POsts
const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts"
        }
      }, {
        $project: {
          followingPosts: 1,
          _id: 0
        }
      }
    ]);
    const combinedPosts = currentUserPosts.concat(...followingPosts[0].followingPosts).sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    res.status(200).json(combinedPosts);
  } catch (error) {
    res.status(500).json(error);
=======
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid payload' });
    }
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      post.likes = post.likes.filter((like) => like !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    const payload = { postId: post.id, likes: post.likes, liked: !hasLiked };
    emitPostEvent(post.id, 'likesUpdated', payload);
    if (!hasLiked && post.userId !== userId) {
      let actorMeta;
      try {
        const actor = await UserModel.findById(userId).select('firstname lastname username profilePicture');
        if (actor) {
          actorMeta = {
            id: actor.id.toString(),
            name: [actor.firstname, actor.lastname].filter(Boolean).join(' ') || actor.username,
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
        postId: post.id,
        meta: {
          actor: actorMeta,
          post: { id: post.id, desc: post.desc || '', image: post.image || '' },
        },
      });
    }
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const parseLimit = (value, fallback) => {
  const limit = Number.parseInt(value, 10);
  if (Number.isNaN(limit) || limit <= 0) {
    return fallback;
  }
  return Math.min(limit, 50);
};

const buildCursorQuery = (cursor) => {
  if (!cursor) {
    return {};
  }
  const date = new Date(cursor);
  if (Number.isNaN(date.getTime())) {
    return {};
  }
  return { createdAt: { $lt: date } };
};

const getTimelinePosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const limit = parseLimit(req.query.limit, 20);
    const cursorQuery = buildCursorQuery(req.query.cursor);
    const baseMatch = { ...cursorQuery };

    const currentUserPosts = await PostModel.find({ userId, ...baseMatch })
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    const followingAggregation = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'posts',
          let: { followingIds: '$following' },
          pipeline: [
            { $match: { $expr: { $in: ['$userId', '$$followingIds'] }, ...baseMatch } },
            { $sort: { createdAt: -1 } },
            { $limit: limit + 1 },
          ],
          as: 'followingPosts',
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    const followingPosts = followingAggregation[0]?.followingPosts || [];
    const allPosts = [...currentUserPosts, ...followingPosts]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit + 1);

    const hasMore = allPosts.length > limit;
    const items = hasMore ? allPosts.slice(0, limit) : allPosts;
    const nextCursor =
      hasMore && items.length > 0 ? items[items.length - 1].createdAt.toISOString() : undefined;

    res.status(200).json({
      items,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
>>>>>>> Stashed changes
  }
};

module.exports = {
  createPost,
  getTimelinePosts,
  deletePost,
  likePost,
  updatePost,
  getPost,
<<<<<<< Updated upstream
  comments
=======
  comments,
>>>>>>> Stashed changes
};