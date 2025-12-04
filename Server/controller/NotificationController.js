const { sendSuccess, sendError } = require('../utils/responseHandler');
const { handleError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/httpStatus');
const { VALIDATION_MESSAGES } = require('../validation');
const { MAX_NOTIFICATION_LIMIT } = require('../config/constants');
const { emitUserEvent } = require('../socket');
const notificationService = require('../services/notificationService');

const createNotification = async ({ userId, type, actorId, postId, chatId, messageId, meta }) => {
  if (!userId || !type || !actorId) {
    return null;
  }

  const notificationData = {
    userId: userId.toString(),
    type,
    actorId: actorId.toString(),
    postId: postId ? postId.toString() : undefined,
    chatId: chatId ? chatId.toString() : undefined,
    messageId: messageId ? messageId.toString() : undefined,
    meta: meta || {},
  };

  const notification = await notificationService.createNotification(notificationData);
  const payload = notificationService.sanitizeNotification(notification);
  emitUserEvent(userId, 'notificationCreated', { notification: payload });
  return payload;
};

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.userId);
    }

    const limit = req.query.limit ;
    const notifications = await notificationService.findNotificationsByUserId(userId.toString(), limit);
    const sanitizedNotifications = notifications.map(notificationService.sanitizeNotification);

    return sendSuccess(res, HTTP_STATUS.OK, { items: sanitizedNotifications });
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.postId);
    }

    const updated = await notificationService.updateNotificationReadStatus(id, true);

    if (!updated) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, VALIDATION_MESSAGES.notFound.notification);
    }

    return sendSuccess(res, HTTP_STATUS.OK, notificationService.sanitizeNotification(updated));
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const markAllRead = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.userId);
    }

    await notificationService.markAllNotificationsRead(userId.toString());

    return sendSuccess(res, HTTP_STATUS.OK, { success: true });
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationRead,
  markAllRead,
};
