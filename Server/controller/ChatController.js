const { sendSuccess, sendError } = require('../utils/responseHandler');
const { handleError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/httpStatus');
const { VALIDATION_MESSAGES } = require('../validation');
const chatService = require('../services/chatService');

const createChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.senderId);
    }

    if (!receiverId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.userId);
    }

    if (senderId === receiverId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.validation.chatWithSelf);
    }

    const existingChat = await chatService.findChatByMembers(senderId, receiverId);

    if (existingChat) {
      return sendSuccess(res, HTTP_STATUS.OK, existingChat);
    }

    const newChat = await chatService.createChat([senderId, receiverId]);

    return sendSuccess(res, HTTP_STATUS.CREATED, newChat);
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const userChats = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.required.userId);
    }

    const chats = await chatService.findChatsByUserId(userId);

    return sendSuccess(res, HTTP_STATUS.OK, chats);
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

const findChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.params;

    if (!firstId || !secondId) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.validation.invalidPayload);
    }

    const chat = await chatService.findChatByMembers(firstId, secondId);

    if (!chat) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, VALIDATION_MESSAGES.notFound.chat);
    }

    return sendSuccess(res, HTTP_STATUS.OK, chat);
  } catch (error) {
    const { status, message } = handleError(error);
    return sendError(res, status, message, error);
  }
};

module.exports = {
  createChat,
  userChats,
  findChat,
};
