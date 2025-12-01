const ChatModel = require("../models/chatModel");

// Create Chat
const createChat = async (req, res) => {
  // Check if a chat with the same members already exists
  const existingChat = await ChatModel.findOne({
    members: {
      $all: [req.body.senderId, req.body.receiverId]
    }
  });

  if (existingChat) {
    console.log("chat is already present");
    // If the chat already exists, return it instead of creating a new one
    return res.status(200).json(existingChat);
  }

  // If the chat doesn't exist, create a new chat
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};


// Get User Chats
const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }

};

// Find Chat
const findChat = async (req, res) => {
  try {
    // Add validation to ensure req.params.firstId and req.params.secondId are provided
    if (!req.params.firstId || !req.params.secondId) {
      return res.status(400).json({ message: 'Both firstId and secondId are required' });
    }

    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });

    // Check if the chat was found
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createChat,
  userChats,
  findChat,
};
