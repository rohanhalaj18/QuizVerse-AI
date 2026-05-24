// ============================================================
// QuizVerse AI — Dashboard Controller
// ============================================================
const { Op, fn, col, literal } = require('sequelize');
const { QuizAttempt, Quiz, Category, Leaderboard, User, Notification } = require('../models');
const { success, error } = require('../utils/response');

const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total attempts
    const totalAttempts = await QuizAttempt.count({ where: { userId } });

    // Overall stats
    const stats = await QuizAttempt.findOne({
      where: { userId },
      attributes: [
        [fn('AVG', col('accuracy')), 'avgAccuracy'],
        [fn('SUM', col('score')), 'totalScore'],
        [fn('AVG', col('score')), 'avgScore'],
        [fn('SUM', col('correctAnswers')), 'totalCorrect'],
        [fn('SUM', col('totalQuestions')), 'totalQuestions'],
      ],
      raw: true,
    });

    // Recent history (last 5)
    const recentHistory = await QuizAttempt.findAll({
      where: { userId },
      include: [{ association: 'quiz', include: [{ association: 'category' }] }],
      order: [['completedAt', 'DESC']],
      limit: 5,
    });

    // Category performance
    const categoryPerformance = await QuizAttempt.findAll({
      where: { userId },
      include: [{ association: 'quiz', include: [{ association: 'category', attributes: ['name', 'icon', 'color'] }] }],
      attributes: ['quizId', 'accuracy', 'score'],
      raw: false,
    });

    // Aggregate by category
    const catMap = {};
    for (const attempt of categoryPerformance) {
      const catName = attempt.quiz?.category?.name;
      if (!catName) continue;
      if (!catMap[catName]) catMap[catName] = { name: catName, icon: attempt.quiz.category.icon, color: attempt.quiz.category.color, total: 0, accuracy: 0 };
      catMap[catName].total++;
      catMap[catName].accuracy += attempt.accuracy;
    }
    const categoryStats = Object.values(catMap).map(c => ({
      ...c, accuracy: Math.round(c.accuracy / c.total),
    })).sort((a, b) => b.accuracy - a.accuracy);

    const strongCategories = categoryStats.slice(0, 3);
    const weakCategories = [...categoryStats].sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);

    // Weekly performance (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      const count = await QuizAttempt.count({
        where: {
          userId,
          completedAt: { [Op.between]: [new Date(dayStr), new Date(dayStr + 'T23:59:59')] },
        },
      });
      weeklyData.push({ day: date.toLocaleDateString('en', { weekday: 'short' }), quizzes: count });
    }

    // Leaderboard rank
    const lb = await Leaderboard.findOne({ where: { userId } });

    // Notifications
    const notifications = await Notification.findAll({
      where: { userId, isRead: false },
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    // User streak
    const user = await User.findByPk(userId);

    return success(res, {
      data: {
        totalAttempts,
        avgAccuracy: Math.round(parseFloat(stats?.avgAccuracy) || 0),
        totalScore: parseInt(stats?.totalScore) || 0,
        avgScore: Math.round(parseFloat(stats?.avgScore) || 0),
        totalCorrect: parseInt(stats?.totalCorrect) || 0,
        totalQuestions: parseInt(stats?.totalQuestions) || 0,
        recentHistory,
        categoryStats,
        strongCategories,
        weakCategories,
        weeklyData,
        leaderboard: lb,
        notifications,
        streak: user?.streak || 0,
      },
    }, 'Dashboard data fetched.');
  } catch (err) {
    console.error('Dashboard error:', err);
    return error(res, 'Failed to fetch dashboard data.', 500);
  }
};

module.exports = { getStudentDashboard };
