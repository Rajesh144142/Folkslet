const { sendSuccess, sendError } = require('../utils/responseHandler');
const { handleError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/httpStatus');
const { VALIDATION_MESSAGES } = require('../validation');
const { DEFAULT_USER_DISPLAY_NAME } = require('../config/constants');
const logger = require('../utils/logger');
const { createNotification } = require('./NotificationController');
const messageService = require('../services/messageService');
const userService = require('../services/userService');

const addMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;

    if (!chatId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.chatId);
    }

    if (!senderId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.senderId);
    }

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.text);
    }

    const message = await messageService.createMessage({
      chatId,
      senderId,
      text: text.trim(),
    });

    try {
      const chat = await messageService.findChatById(chatId);
      if (chat?.members) {
        const recipients = chat.members.filter((member) => member.toString() !== senderId.toString());

        let actorMeta;
        try {
          const actor = await userService.findUserById(senderId);
          if (actor) {
            actorMeta = {
              id: actor._id.toString(),
              name: [actor.firstName, actor.lastName].filter(Boolean).join(' ') || actor.email?.split('@')[0] || DEFAULT_USER_DISPLAY_NAME,
              avatar: actor.profilePicture || '',
            };
          }
        } catch {
          actorMeta = undefined;
        }

        await Promise.all(
          recipients.map((memberId) =>
            createNotification({
              userId: memberId,
              type: 'message',
              actorId: senderId,
              chatId,
              messageId: message._id,
              meta: { actor: actorMeta, preview: text.trim().slice(0, 140) || '' },
            })
          )
        );
      }
    } catch (notificationError) {
      logger.error('Failed to create message notification', notificationError);
    }

    return sendSuccess(res, HTTP_STATUS.OK, message);
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.chatId);
    }

    const messages = await messageService.findMessagesByChatId(chatId);

    return sendSuccess(res, HTTP_STATUS.OK, messages);
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

module.exports = {
  addMessage,
  getMessages,
};
