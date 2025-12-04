const NotificationModel = require('../models/notificationModel');

const createNotification = async (notificationData) => {
  const notification = new NotificationModel(notificationData);
  return await notification.save();
};

const findNotificationsByUserId = async (userId, limit = 10) => {
  return await NotificationModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

const findNotificationById = async (notificationId) => {
  return await NotificationModel.findById(notificationId);
};

const updateNotificationReadStatus = async (notificationId, read = true) => {
  return await NotificationModel.findByIdAndUpdate(notificationId, { read }, { new: true });
};

const markAllNotificationsRead = async (userId) => {
  return await NotificationModel.updateMany({ userId, read: false }, { read: true });
};

const sanitizeNotification = (doc) => {
  if (!doc) {
    return null;
  }
  const json = doc.toObject({ getters: true, virtuals: false });
  json.id = json._id.toString();
  delete json.__v;
  return json;
};

module.exports = {
  createNotification,
  findNotificationsByUserId,
  findNotificationById,
  updateNotificationReadStatus,
  markAllNotificationsRead,
  sanitizeNotification,
};

