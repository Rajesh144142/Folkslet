const express = require('express');
const { createChat, findChat, userChats } = require('../controller/ChatController');

const router = express.Router();

router.post('/', createChat);
router.get('/find/:firstId/:secondId', findChat);
router.get('/:userId', userChats);

module.exports = router;
