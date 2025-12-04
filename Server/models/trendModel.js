const mongoose = require('mongoose');
const { VALIDATION_MESSAGES } = require('../validation');

const trendItemSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, VALIDATION_MESSAGES.maxlength.topic],
    },
    summary: {
      type: String,
      default: '',
      maxlength: [500, VALIDATION_MESSAGES.maxlength.summary],
    },
    postIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Posts',
        },
      ],
      default: [],
    },
    momentum: {
      type: String,
      enum: ['rising', 'stable', 'cooling'],
      default: 'stable',
    },
    score: {
      type: Number,
      default: 0,
      min: [0, VALIDATION_MESSAGES.min.score],
    },
  },
  { _id: false }
);

const trendSnapshotSchema = new mongoose.Schema(
  {
    windowStart: {
      type: Date,
      required: true,
      index: true,
    },
    windowEnd: {
      type: Date,
      required: true,
      index: true,
    },
    topics: {
      type: [trendItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

trendSnapshotSchema.index({ createdAt: -1 });
trendSnapshotSchema.index({ windowStart: 1, windowEnd: 1 });

trendSnapshotSchema.pre('validate', function (next) {
  if (this.windowStart >= this.windowEnd) {
    return next(new Error(VALIDATION_MESSAGES.validation.trendWindow));
  }
  next();
});

const TrendModel = mongoose.model('TrendSnapshot', trendSnapshotSchema);

module.exports = TrendModel;
