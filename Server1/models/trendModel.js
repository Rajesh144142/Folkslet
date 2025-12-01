const mongoose = require('mongoose');

const trendItemSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, trim: true },
    summary: { type: String, default: '' },
    postIds: { type: [String], default: [] },
    momentum: {
      type: String,
      enum: ['rising', 'stable', 'cooling'],
      default: 'stable',
    },
    score: { type: Number, default: 0 },
  },
  { _id: false }
);

const trendSnapshotSchema = new mongoose.Schema(
  {
    windowStart: { type: Date, required: true },
    windowEnd: { type: Date, required: true },
    topics: { type: [trendItemSchema], default: [] },
  },
  { timestamps: true }
);

trendSnapshotSchema.index({ createdAt: -1 });

const TrendModel = mongoose.model('TrendSnapshot', trendSnapshotSchema);
module.exports = TrendModel;
