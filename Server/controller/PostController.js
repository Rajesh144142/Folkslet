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
  }
};

const likePost = async (req, res) => {
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
  }
};

module.exports = {
  createPost,
  getTimelinePosts,
  deletePost,
  likePost,
  updatePost,
  getPost,
  comments
};