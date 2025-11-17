const cron = require('node-cron');
const PostModel = require('../models/postModel');
const { upsertDefaultTrends, DEFAULT_TOPICS } = require('../controller/TrendController');

const pickFallbackTopics = () => {
  const shuffled = [...DEFAULT_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((topic) => ({
    ...topic,
    momentum: topic.momentum || 'stable',
    score: topic.score || Math.random(),
  }));
};

const deriveTopicsFromPosts = (posts) => {
  if (!Array.isArray(posts) || posts.length === 0) {
    return [];
  }

  const candidates = posts
    .map((post) => {
      const text = (post?.desc || '').trim();
      const likes = Array.isArray(post?.likes) ? post.likes.length : 0;
      const shares = Number(post?.shareCount) || 0;
      const comments = Array.isArray(post?.comments) ? post.comments.length : 0;
      const engagement = likes * 2 + shares * 3 + comments;
      return {
        post,
        text,
        engagement,
      };
    })
    .filter(({ text }) => text.length > 0);

  if (candidates.length === 0) {
    return [];
  }

  const sanitizeTopic = (text) =>
    text
      .split(/\s+/)
      .slice(0, 3)
      .join(' ')
      .replace(/[#"'`]/g, '')
      .trim();

  return candidates
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 3)
    .map(({ post, text, engagement }, index) => {
      const momentum = engagement >= 60 ? 'rising' : engagement <= 15 ? 'cooling' : 'stable';
      const summary = text.length > 160 ? `${text.slice(0, 157)}...` : text;
      const topic = sanitizeTopic(text) || `Post Highlight ${index + 1}`;
      return {
        topic,
        summary,
        postIds: [post?._id?.toString()].filter(Boolean),
        momentum,
        score: Number((engagement / 100).toFixed(2)),
      };
    });
};

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

    let topics = null;
    if (posts.length > 0) {
      topics = deriveTopicsFromPosts(posts);
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
