const cron = require('node-cron');
const logger = require('../utils/logger');
const NotificationModel = require('../models/notificationModel');
const { createNotification } = require('../controller/NotificationController');
const { DIGEST_SUMMARY_TYPES, DIGEST_NOTIFICATION_TYPE, ONE_DAY_IN_MS } = require('../config/constants');

const buildCounts = (records) => {
  return records.reduce(
    (acc, record) => {
      const type = record.type;
      if (!DIGEST_SUMMARY_TYPES.includes(type)) {
        return acc;
      }
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {},
  );
};

const runDailyDigest = async () => {
  const now = new Date();
  const since = new Date(now.getTime() - ONE_DAY_IN_MS);
  try {
    const notifications = await NotificationModel.find({
      type: { $in: DIGEST_SUMMARY_TYPES },
      createdAt: { $gte: since, $lt: now },
      digested: { $ne: true },
    }).lean();

    if (!notifications.length) {
      return;
    }

    const grouped = notifications.reduce((acc, notification) => {
      const key = notification.userId;
      if (!acc.has(key)) {
        acc.set(key, []);
      }
      acc.get(key).push(notification);
      return acc;
    }, new Map());

    const processedIds = [];

    await Promise.all(
      Array.from(grouped.entries()).map(async ([userId, records]) => {
        const counts = buildCounts(records);
        const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
        if (!total) {
          return;
        }
        await createNotification({
          userId,
          type: DIGEST_NOTIFICATION_TYPE,
          actorId: userId,
          meta: {
            counts,
            window: { start: since.toISOString(), end: now.toISOString() },
          },
        });
        records.forEach((record) => processedIds.push(record._id));
      }),
    );

    if (processedIds.length > 0) {
      await NotificationModel.updateMany({ _id: { $in: processedIds } }, { $set: { digested: true } });
      logger.debug('Daily digest job completed successfully', { processedCount: processedIds.length });
    }
  } catch (error) {
    logger.error('Daily digest job failed', error);
  }
};

const scheduleDailyDigest = () => {
  if (process.env.DISABLE_DIGEST_JOB === 'true') {
    logger.info('Daily digest job is disabled');
    return;
  }
  const expression = process.env.DIGEST_CRON || '30 5 * * *';
  cron.schedule(expression, runDailyDigest, {
    timezone: process.env.TZ || 'UTC',
  });
  logger.info('Daily digest job scheduled', { expression });
};

module.exports = { scheduleDailyDigest, runDailyDigest };
