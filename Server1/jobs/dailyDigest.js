const cron = require('node-cron');
const NotificationModel = require('../models/notificationModel');
const { createNotification } = require('../controller/NotificationController');

const SUMMARY_TYPES = ['follow', 'like', 'share', 'message'];

const buildCounts = (records) => {
  return records.reduce(
    (acc, record) => {
      const type = record.type;
      if (!SUMMARY_TYPES.includes(type)) {
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
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  try {
    const notifications = await NotificationModel.find({
      type: { $in: SUMMARY_TYPES },
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
          type: 'digest',
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
    }
  } catch (error) {
    console.error('Daily digest job failed', error);
  }
};

const scheduleDailyDigest = () => {
  if (process.env.DISABLE_DIGEST_JOB === 'true') {
    return;
  }
  const expression = process.env.DIGEST_CRON ;
//   const expression = process.env.DIGEST_CRON || '30 5 * * *';
  cron.schedule(expression, runDailyDigest, {
    timezone: process.env.TZ || 'UTC',
  });
};

module.exports = { scheduleDailyDigest, runDailyDigest };
