const mongoose = require('mongoose');
const { VALIDATION_MESSAGES } = require('../validation');

const readBySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: [5000, VALIDATION_MESSAGES.maxlength.message],
    },
    media: {
      type: [
        {
          type: {
            type: String,
            enum: ['image', 'video', 'file', 'audio'],
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
          filename: String,
          size: Number,
        },
      ],
      default: [],
    },
    readBy: {
      type: [readBySchema],
      default: [],
    },
    editedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });
MessageSchema.index({ createdAt: -1 });

MessageSchema.pre('validate', function (next) {
  if (!this.text && (!this.media || this.media.length === 0)) {
    return next(new Error(VALIDATION_MESSAGES.validation.messageContent));
  }
  next();
});

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
