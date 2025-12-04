const mongoose = require('mongoose');
const { VALIDATION_MESSAGES } = require('../validation');

const followSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    followingId: {
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

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

followSchema.pre('save', function (next) {
  if (this.followerId.toString() === this.followingId.toString()) {
    const error = new Error(VALIDATION_MESSAGES.validation.followSelf);
    return next(error);
  }
  next();
});

const FollowModel = mongoose.model('Follow', followSchema);

module.exports = FollowModel;
