const express = require('express');
const {
  getNotifications,
  markNotificationRead,
  markAllRead,
} = require('../controller/NotificationController');

const router = express.Router();

router.get('/:userId', getNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/user/:userId/read', markAllRead);

module.exports = router;
