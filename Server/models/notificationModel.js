const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, required: true },
    actorId: { type: String, required: true },
    postId: { type: String },
    chatId: { type: String },
    messageId: { type: String },
    meta: { type: Object, default: {} },
    read: { type: Boolean, default: false, index: true },
    digested: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

const NotificationModel = mongoose.model('Notification', notificationSchema);
module.exports = NotificationModel;
