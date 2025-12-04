const express = require('express');
const {
  getNotifications,
  markNotificationRead,
  markAllRead,
} = require('../controller/NotificationController');

const router = express.Router();

router.get('/user/:userId', getNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/user/:userId/read-all', markAllRead);

module.exports = router;
