const MessageModel = require('../models/messageModel');
const ChatModel = require('../models/chatModel');

const createMessage = async (messageData) => {
  const message = new MessageModel(messageData);
  return await message.save();
};

const findMessagesByChatId = async (chatId) => {
  return await MessageModel.find({ chatId, deletedAt: null }).sort({ createdAt: 1 });
};

const findChatById = async (chatId) => {
  return await ChatModel.findById(chatId);
};

module.exports = {
  createMessage,
  findMessagesByChatId,
  findChatById,
};

