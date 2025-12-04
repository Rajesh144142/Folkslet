const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Posts',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

likeSchema.index({ postId: 1, userId: 1 }, { unique: true });
likeSchema.index({ postId: 1 });
likeSchema.index({ userId: 1 });

const LikeModel = mongoose.model('Like', likeSchema);

module.exports = LikeModel;
