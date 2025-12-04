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

const MAX_NOTIFICATION_LIMIT = 50;

const DEFAULT_USER_DISPLAY_NAME = 'User';

const SOCKET_EVENTS = {
  FOLLOWERS_UPDATED: 'followersUpdated',
  FOLLOWING_UPDATED: 'followingUpdated',
};

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

const DIGEST_SUMMARY_TYPES = ['follow', 'like', 'share', 'message'];

const DIGEST_NOTIFICATION_TYPE = 'digest';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const ONE_HOUR_IN_MS = 60 * 60 * 1000;

const TREND_CONFIG = {
  MAX_TOPICS_COUNT: 3,
  TOPIC_WORDS_COUNT: 3,
  SUMMARY_MAX_LENGTH: 160,
  SUMMARY_TRUNCATE_LENGTH: 157,
  ENGAGEMENT_WEIGHTS: {
    LIKE: 2,
    SHARE: 3,
    COMMENT: 1,
  },
  MOMENTUM_THRESHOLDS: {
    RISING: 60,
    COOLING: 15,
  },
  SCORE_DIVISOR: 100,
  FALLBACK_TOPICS_COUNT: 3,
  DEFAULT_MOMENTUM: 'stable',
};

const TREND_MOMENTUM = {
  RISING: 'rising',
  STABLE: 'stable',
  COOLING: 'cooling',
};

const TREND_FALLBACK_TOPIC_PREFIX = 'Post Highlight';

module.exports = {
  DEFAULT_TOPICS,
  MAX_NOTIFICATION_LIMIT,
  DEFAULT_USER_DISPLAY_NAME,
  SOCKET_EVENTS,
  ALLOWED_IMAGE_MIME_TYPES,
  DIGEST_SUMMARY_TYPES,
  DIGEST_NOTIFICATION_TYPE,
  ONE_DAY_IN_MS,
  ONE_HOUR_IN_MS,
  TREND_CONFIG,
  TREND_MOMENTUM,
  TREND_FALLBACK_TOPIC_PREFIX,
};

