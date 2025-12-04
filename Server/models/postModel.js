const mongoose = require('mongoose');
const { VALIDATION_MESSAGES } = require('../validation');

const sharedPostSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Posts',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    desc: {
      type: String,
      trim: true,
      maxlength: [2000, VALIDATION_MESSAGES.maxlength.description],
    },
    image: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    location: {
      lat: {
        type: Number,
        min: [-90, VALIDATION_MESSAGES.range.latitude],
        max: [90, VALIDATION_MESSAGES.range.latitude],
      },
      lng: {
        type: Number,
        min: [-180, VALIDATION_MESSAGES.range.longitude],
        max: [180, VALIDATION_MESSAGES.range.longitude],
      },
      address: {
        type: String,
        trim: true,
        maxlength: [200, VALIDATION_MESSAGES.maxlength.address],
      },
    },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    desc: {
      type: String,
      trim: true,
      maxlength: [2000, VALIDATION_MESSAGES.maxlength.description],
    },
    image: {
      type: String,
    },
    location: {
      lat: {
        type: Number,
        min: [-90, VALIDATION_MESSAGES.range.latitude],
        max: [90, VALIDATION_MESSAGES.range.latitude],
      },
      lng: {
        type: Number,
        min: [-180, VALIDATION_MESSAGES.range.longitude],
        max: [180, VALIDATION_MESSAGES.range.longitude],
      },
      address: {
        type: String,
        trim: true,
        maxlength: [200, VALIDATION_MESSAGES.maxlength.address],
      },
    },
    sharedPost: {
      type: sharedPostSchema,
      default: null,
    },
    shareCount: {
      type: Number,
      default: 0,
      min: [0, VALIDATION_MESSAGES.min.shareCount],
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

const PostModel = mongoose.model('Posts', postSchema);

module.exports = PostModel;
