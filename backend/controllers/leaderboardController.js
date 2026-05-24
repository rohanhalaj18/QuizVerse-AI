// ============================================================
// QuizVerse AI — Leaderboard Controller
// ============================================================
const { Leaderboard, User } = require('../models');
const { success, error } = require('../utils/response');

const getGlobalLeaderboard = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const entries = await Leaderboard.findAll({
      include: [{
        association: 'user',
        attributes: ['id', 'fullname', 'profileImage', 'streak', 'badges'],
        where: { role: 'student' }
      }],
      order: [['totalScore', 'DESC']],
      limit: parseInt(limit),
    });
    return success(res, { data: entries }, 'Leaderboard fetched.');
  } catch (err) {
    return error(res, 'Failed to fetch leaderboard.', 500);
  }
};

const getWeeklyLeaderboard = async (req, res) => {
  try {
    const entries = await Leaderboard.findAll({
      include: [{
        association: 'user',
        attributes: ['id', 'fullname', 'profileImage'],
        where: { role: 'student' }
      }],
      order: [['weeklyScore', 'DESC']],
      limit: 20,
    });
    return success(res, { data: entries }, 'Weekly leaderboard fetched.');
  } catch (err) {
    return error(res, 'Failed to fetch weekly leaderboard.', 500);
  }
};

const getMyRank = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return success(res, { data: null }, 'My rank fetched.');
    }
    const lb = await Leaderboard.findOne({
      where: { userId: req.user.id },
      include: [{ association: 'user', attributes: ['fullname', 'profileImage'] }],
    });
    return success(res, { data: lb }, 'My rank fetched.');
  } catch (err) {
    return error(res, 'Failed to fetch rank.', 500);
  }
};

module.exports = { getGlobalLeaderboard, getWeeklyLeaderboard, getMyRank };
