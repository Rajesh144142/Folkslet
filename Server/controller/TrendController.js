const { sendSuccess, sendError } = require('../utils/responseHandler');
const { handleError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/httpStatus');
const { DEFAULT_TOPICS } = require('../config/constants');
const trendService = require('../services/trendService');

const getLatestTrends = async (_req, res) => {
  try {
    const snapshot = await trendService.findLatestTrendSnapshot();

    if (!snapshot) {
      return sendSuccess(res, HTTP_STATUS.OK, {
        windowStart: null,
        windowEnd: null,
        topics: DEFAULT_TOPICS,
      });
    }

    return sendSuccess(res, HTTP_STATUS.OK, {
      windowStart: snapshot.windowStart,
      windowEnd: snapshot.windowEnd,
      topics: snapshot.topics.length > 0 ? snapshot.topics : DEFAULT_TOPICS,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
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
  return await trendService.createTrendSnapshot(payload);
};

module.exports = {
  getLatestTrends,
  upsertDefaultTrends,
};
