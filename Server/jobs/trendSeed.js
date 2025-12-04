const cron = require('node-cron');
const logger = require('../utils/logger');
const PostModel = require('../models/postModel');
const { upsertDefaultTrends } = require('../controller/TrendController');
const {
  DEFAULT_TOPICS,
  TREND_CONFIG,
  TREND_MOMENTUM,
  TREND_FALLBACK_TOPIC_PREFIX,
  ONE_HOUR_IN_MS,
} = require('../config/constants');
const trendService = require('../services/trendService');

const pickFallbackTopics = () => {
  const shuffled = [...DEFAULT_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, TREND_CONFIG.FALLBACK_TOPICS_COUNT).map((topic) => ({
    ...topic,
    momentum: topic.momentum || TREND_CONFIG.DEFAULT_MOMENTUM,
    score: topic.score || Math.random(),
  }));
};

const processPostCandidate = async (post) => {
  const text = (post?.desc || '').trim();
  if (!text) {
    return null;
  }

  const engagement = await trendService.calculatePostEngagement(post);

  return {
    post,
    text,
    engagement,
  };
};

const deriveTopicsFromPosts = async (posts) => {
  if (!Array.isArray(posts) || posts.length === 0) {
    return [];
  }

  const candidates = await Promise.all(posts.map(processPostCandidate));
  const validCandidates = candidates.filter((candidate) => candidate !== null);

  if (validCandidates.length === 0) {
    return [];
  }

  const sortedCandidates = validCandidates.sort((a, b) => b.engagement - a.engagement);
  const topCandidates = sortedCandidates.slice(0, TREND_CONFIG.MAX_TOPICS_COUNT);

  return topCandidates.map(({ post, text, engagement }, index) => {
    const momentum = trendService.determineMomentum(engagement);
    const summary = trendService.truncateSummary(text);
    const sanitizedTopic = trendService.sanitizeTopicText(text);
    const topic = sanitizedTopic || `${TREND_FALLBACK_TOPIC_PREFIX} ${index + 1}`;

    return {
      topic,
      summary,
      postIds: [post?._id?.toString()].filter(Boolean),
      momentum,
      score: trendService.calculateScore(engagement),
    };
  });
};

const runTrendSeed = async () => {
  const now = new Date();
  const lookbackHours = Number(process.env.TREND_LOOKBACK_HOURS || 24);
  const windowStart = new Date(now.getTime() - lookbackHours * ONE_HOUR_IN_MS);

  try {
    const sampleLimit = Number(process.env.TREND_SAMPLE_LIMIT || 200);
    const posts = await PostModel.find({
      createdAt: { $gte: windowStart, $lte: now },
    })
      .sort({ createdAt: -1 })
      .limit(sampleLimit)
      .lean();

    let topics = [];

    if (posts.length > 0) {
      topics = await deriveTopicsFromPosts(posts);
    }

    if (topics.length === 0) {
      topics = pickFallbackTopics();
      logger.debug('Using fallback topics', { fallbackCount: topics.length });
    }

    await upsertDefaultTrends(topics, windowStart, now);
    logger.debug('Trend seed job completed successfully', {
      topicsCount: topics.length,
      postsProcessed: posts.length,
    });
  } catch (error) {
    logger.error('Trend seed job failed', error);
  }
};

const scheduleTrendSeed = () => {
  if (process.env.DISABLE_TREND_JOB === 'true') {
    logger.info('Trend seed job is disabled');
    return;
  }

  const expression = process.env.TREND_CRON || '*/45 * * * * *';
  cron.schedule(expression, runTrendSeed, {
    timezone: process.env.TZ || 'UTC',
  });

  logger.info('Trend seed job scheduled', { expression });
};

module.exports = {
  scheduleTrendSeed,
  runTrendSeed,
};
