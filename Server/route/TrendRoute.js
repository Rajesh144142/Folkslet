const express = require('express');
const { getLatestTrends } = require('../controller/TrendController');

const router = express.Router();

router.get('/latest', getLatestTrends);

module.exports = router;
