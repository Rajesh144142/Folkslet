const mongoose = require('mongoose');
const { VALIDATION_MESSAGES } = require('../validation');

const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      required: true,
      validate: {
        validator: function (v) {
          return v.length === 2;
        },
        message: VALIDATION_MESSAGES.validation.chatMembers,
      },
    },
    lastMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ChatSchema.index({ members: 1 });
ChatSchema.index({ lastActivity: -1 });

ChatSchema.pre('save', function (next) {
  if (this.members.length === 2) {
    this.lastActivity = new Date();
  }
  next();
});

const ChatModel = mongoose.model('Chat', ChatSchema);

module.exports = ChatModel;
