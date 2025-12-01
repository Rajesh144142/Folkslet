<<<<<<< Updated upstream
const MessageModel = require("../models/messageModel");
=======
const MessageModel = require("../models/messageModel.js");
const ChatModel = require("../models/chatModel.js");
const UserModel = require("../models/usermodel.js");
const { createNotification } = require("./NotificationController.js");
>>>>>>> Stashed changes

// Add Message
const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await message.save();
<<<<<<< Updated upstream
=======
    try {
      const chat = await ChatModel.findById(chatId);
      if (chat?.members) {
        const recipients = chat.members.filter((member) => member !== senderId);
        let actorMeta;
        try {
          const actor = await UserModel.findById(senderId).select('firstname lastname username profilePicture');
          if (actor) {
            actorMeta = {
              id: actor.id.toString(),
              name: [actor.firstname, actor.lastname].filter(Boolean).join(' ') || actor.username,
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
              messageId: result.id,
              meta: { actor: actorMeta, preview: text?.slice(0, 140) || '' },
            }),
          ),
        );
      }
    } catch (notificationError) {
      console.error('Failed to create message notification', notificationError);
    }
>>>>>>> Stashed changes
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get Messages
const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);

  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  addMessage,
  getMessages,
};
