const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getGlobalLeaderboard, getWeeklyLeaderboard, getMyRank } = require('../controllers/leaderboardController');

router.get('/global', getGlobalLeaderboard);
router.get('/weekly', getWeeklyLeaderboard);
router.get('/my-rank', protect, getMyRank);

module.exports = router;
