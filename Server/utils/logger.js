const appConfig = require('../config/appConfig');

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const LOG_LEVEL_NAMES = {
  0: 'ERROR',
  1: 'WARN',
  2: 'INFO',
  3: 'DEBUG',
};

const getLogLevel = () => {
  const envLevel = process.env.LOG_LEVEL?.toUpperCase();
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
    return LOG_LEVELS[envLevel];
  }
  return appConfig.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;
};

const currentLogLevel = getLogLevel();

const formatTimestamp = () => {
  return new Date().toISOString();
};

const formatMessage = (level, message, metadata = null) => {
  const timestamp = formatTimestamp();
  const levelName = LOG_LEVEL_NAMES[level];
  const baseMessage = `[${timestamp}] [${levelName}] ${message}`;

  if (metadata && Object.keys(metadata).length > 0) {
    return `${baseMessage} ${JSON.stringify(metadata)}`;
  }

  return baseMessage;
};

const logger = {
  error: (message, error = null) => {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      const metadata = error
        ? {
            error: error.message || error,
            stack: error.stack,
          }
        : null;
      console.error(formatMessage(LOG_LEVELS.ERROR, message, metadata));
    }
  },

  warn: (message, metadata = null) => {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      console.warn(formatMessage(LOG_LEVELS.WARN, message, metadata));
    }
  },

  info: (message, metadata = null) => {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.info(formatMessage(LOG_LEVELS.INFO, message, metadata));
    }
  },

  debug: (message, metadata = null) => {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      console.log(formatMessage(LOG_LEVELS.DEBUG, message, metadata));
    }
  },
};

module.exports = logger;

