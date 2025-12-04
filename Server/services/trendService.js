const LikeModel = require('../models/likeModel');
const CommentModel = require('../models/commentModel');
const TrendModel = require('../models/trendModel');
const { TREND_CONFIG, TREND_MOMENTUM } = require('../config/constants');

const calculatePostEngagement = async (post) => {
  const [likesCount, commentsCount] = await Promise.all([
    LikeModel.countDocuments({ postId: post._id }),
    CommentModel.countDocuments({ postId: post._id, deletedAt: null }),
  ]);

  const shares = Number(post.shareCount) || 0;

  return (
    likesCount * TREND_CONFIG.ENGAGEMENT_WEIGHTS.LIKE +
    shares * TREND_CONFIG.ENGAGEMENT_WEIGHTS.SHARE +
    commentsCount * TREND_CONFIG.ENGAGEMENT_WEIGHTS.COMMENT
  );
};

const determineMomentum = (engagement) => {
  if (engagement >= TREND_CONFIG.MOMENTUM_THRESHOLDS.RISING) {
    return TREND_MOMENTUM.RISING;
  }
  if (engagement <= TREND_CONFIG.MOMENTUM_THRESHOLDS.COOLING) {
    return TREND_MOMENTUM.COOLING;
  }
  return TREND_MOMENTUM.STABLE;
};

const sanitizeTopicText = (text) => {
  return text
    .split(/\s+/)
    .slice(0, TREND_CONFIG.TOPIC_WORDS_COUNT)
    .join(' ')
    .replace(/[#"'`]/g, '')
    .trim();
};

const truncateSummary = (text) => {
  if (text.length > TREND_CONFIG.SUMMARY_MAX_LENGTH) {
    return `${text.slice(0, TREND_CONFIG.SUMMARY_TRUNCATE_LENGTH)}...`;
  }
  return text;
};

const calculateScore = (engagement) => {
  return Number((engagement / TREND_CONFIG.SCORE_DIVISOR).toFixed(2));
};

const findLatestTrendSnapshot = async () => {
  return await TrendModel.findOne().sort({ createdAt: -1 }).lean();
};

const createTrendSnapshot = async (trendData) => {
  const snapshot = new TrendModel(trendData);
  return await snapshot.save();
};

module.exports = {
  calculatePostEngagement,
  determineMomentum,
  sanitizeTopicText,
  truncateSummary,
  calculateScore,
  findLatestTrendSnapshot,
  createTrendSnapshot,
};
