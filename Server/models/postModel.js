<<<<<<< Updated upstream
const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    desc: String,
    likes: [],
    image: String,
    comments:[]
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("Posts", postSchema);
=======
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, default: '' },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const sharedPostSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    desc: { type: String },
    image: { type: String },
    createdAt: { type: Date },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
  },
  { _id: false },
);

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    desc: { type: String },
    likes: { type: [String], default: [] },
    image: { type: String },
    comments: { type: [commentSchema], default: [] },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
    sharedPost: { type: sharedPostSchema, default: null },
    shareCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PostModel = mongoose.model('Posts', postSchema);
>>>>>>> Stashed changes
module.exports = PostModel;
