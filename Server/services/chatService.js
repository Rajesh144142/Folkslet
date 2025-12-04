const ChatModel = require('../models/chatModel');

const findChatByMembers = async (senderId, receiverId) => {
  return await ChatModel.findOne({
    members: {
      $all: [senderId, receiverId],
    },
  })
    .populate('members', 'firstName lastName email profilePicture')
    .lean();
};

const createChat = async (members) => {
  const chat = new ChatModel({ members });
  const savedChat = await chat.save();
  return await ChatModel.findById(savedChat._id)
    .populate('members', 'firstName lastName email profilePicture')
    .lean();
};

const findChatsByUserId = async (userId) => {
  return await ChatModel.find({
    members: { $in: [userId] },
  })
    .populate('members', 'firstName lastName email profilePicture')
    .sort({ lastActivity: -1 })
    .lean();
};

const findChatById = async (chatId) => {
  return await ChatModel.findById(chatId);
};

module.exports = {
  findChatByMembers,
  createChat,
  findChatsByUserId,
  findChatById,
};

