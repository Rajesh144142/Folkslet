const cron = require('node-cron');
const PostModel = require('../models/postModel');
const { upsertDefaultTrends, DEFAULT_TOPICS } = require('../controller/TrendController');
const { generateTrends } = require('../services/trendGenerator');

const pickFallbackTopics = () => {
  const shuffled = [...DEFAULT_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((topic) => ({
    ...topic,
    momentum: topic.momentum || 'stable',
    score: topic.score || Math.random(),
  }));
};

const buildDocuments = (posts) =>
  posts.map((post) => ({
    id: post._id?.toString() || post.id || '',
    text: post.desc || '',
    likes: Array.isArray(post.likes) ? post.likes.length : 0,
    shares: Number(post.shareCount) || 0,
    comments: Array.isArray(post.comments) ? post.comments.map((comment) => comment.message).filter(Boolean) : [],
  }));

const runTrendSeed = async () => {
  const now = new Date();
  const lookbackHours = Number(process.env.TREND_LOOKBACK_HOURS || 24);
  const windowStart = new Date(now.getTime() - lookbackHours * 60 * 60 * 1000);

  try {
    const posts = await PostModel.find({
      createdAt: { $gte: windowStart, $lte: now },
    })
      .sort({ createdAt: -1 })
      .limit(Number(process.env.TREND_SAMPLE_LIMIT || 200))
      .lean();

    const documents = buildDocuments(posts);

    let topics = null;
    if (documents.length > 0) {
      topics = await generateTrends({ documents, windowStart, windowEnd: now });
    }

    if (!topics || topics.length === 0) {
      topics = pickFallbackTopics();
    }

    await upsertDefaultTrends(topics, windowStart, now);
  } catch (error) {
    console.error('Trend seed job failed', error.message || error);
  }
};

const scheduleTrendSeed = () => {
  if (process.env.DISABLE_TREND_JOB === 'true') {
    return;
  }
  const expression = process.env.TREND_CRON || '*/45 * * * * *';
  cron.schedule(expression, runTrendSeed, {
    timezone: process.env.TZ || 'UTC',
  });
};

module.exports = { scheduleTrendSeed, runTrendSeed };
