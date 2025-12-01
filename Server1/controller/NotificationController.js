const NotificationModel = require('../models/notificationModel');
const { emitUserEvent } = require('../socket');

const MAX_LIMIT = 50;

const sanitizeNotification = (doc) => {
  if (!doc) {
    return null;
  }
  const json = doc.toObject({ getters: true, virtuals: false });
  json.id = json._id.toString();
  delete json.__v;
  return json;
};

const createNotification = async ({ userId, type, actorId, postId, chatId, messageId, meta }) => {
  if (!userId || !type || !actorId) {
    return null;
  }
  const notification = await NotificationModel.create({
    userId: userId.toString(),
    type,
    actorId: actorId.toString(),
    postId: postId ? postId.toString() : undefined,
    chatId: chatId ? chatId.toString() : undefined,
    messageId: messageId ? messageId.toString() : undefined,
    meta: meta || {},
  });
  const payload = sanitizeNotification(notification);
  emitUserEvent(userId, 'notificationCreated', { notification: payload });
  return payload;
};

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'User id required' });
    }
    const limit = Math.min(Number.parseInt(req.query.limit, 10) || MAX_LIMIT, MAX_LIMIT);
    const notifications = await NotificationModel.find({ userId: userId.toString() })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.status(200).json({ items: notifications.map(sanitizeNotification) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Notification id required' });
    }
    const updated = await NotificationModel.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(sanitizeNotification(updated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'User id required' });
    }
    await NotificationModel.updateMany({ userId: userId.toString(), read: false }, { read: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationRead,
  markAllRead,
};
