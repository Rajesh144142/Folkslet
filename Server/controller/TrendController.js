const TrendModel = require('../models/trendModel');

const DEFAULT_TOPICS = [
  {
    topic: 'Product Launch',
    summary: 'Creators are teasing upcoming releases and gathering feedback.',
    momentum: 'rising',
    score: 0.82,
  },
  {
    topic: 'City Marathon',
    summary: 'Runners are sharing training milestones ahead of the weekend race.',
    momentum: 'stable',
    score: 0.74,
  },
  {
    topic: 'Design Tips',
    summary: 'Community swapping quick UI/UX tricks and favorite resources.',
    momentum: 'rising',
    score: 0.68,
  },
  {
    topic: 'Remote Work',
    summary: 'Discussions around async collaboration and focus routines.',
    momentum: 'cooling',
    score: 0.52,
  },
];

const getLatestTrends = async (_req, res) => {
  try {
    const snapshot = await TrendModel.findOne().sort({ createdAt: -1 }).lean();
    if (!snapshot) {
      return res.status(200).json({
        windowStart: null,
        windowEnd: null,
        topics: DEFAULT_TOPICS,
      });
    }
    return res.status(200).json({
      windowStart: snapshot.windowStart,
      windowEnd: snapshot.windowEnd,
      topics: snapshot.topics.length > 0 ? snapshot.topics : DEFAULT_TOPICS,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertDefaultTrends = async (topics, windowStart, windowEnd) => {
  const payload = {
    windowStart,
    windowEnd,
    topics: topics.map((topic) => ({
      topic: topic.topic,
      summary: topic.summary,
      postIds: topic.postIds || [],
      momentum: topic.momentum || 'stable',
      score: topic.score || 0,
    })),
  };
  return TrendModel.create(payload);
};

module.exports = {
  getLatestTrends,
  upsertDefaultTrends,
  DEFAULT_TOPICS,
};
