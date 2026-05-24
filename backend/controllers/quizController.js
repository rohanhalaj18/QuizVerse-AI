// ============================================================
// QuizVerse AI — Quiz Controller
// ============================================================
const { Op } = require('sequelize');
const { Quiz, Question, QuizAttempt, AttemptAnswer, Category, User, Leaderboard } = require('../models');
const { success, error, paginated } = require('../utils/response');
const { calcAccuracy } = require('../utils/helpers');

// ── Get Quiz for Attempt (hide answers) ──────────────────────
const getQuizForAttempt = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [
        {
          association: 'questions',
          attributes: { exclude: ['correctAnswer', 'explanation'] },
          order: [['orderIndex', 'ASC']],
        },
        { association: 'category', attributes: ['name', 'icon', 'color'] },
        { association: 'creator', attributes: ['fullname', 'profileImage'] },
      ],
    });

    if (!quiz || !quiz.isActive) return error(res, 'Quiz not found.', 404);

    return success(res, { data: quiz }, 'Quiz fetched.');
  } catch (err) {
    return error(res, 'Failed to fetch quiz.', 500);
  }
};

// ── Submit Quiz Attempt ───────────────────────────────────────
const submitAttempt = async (req, res) => {
  try {
    const { quizId, answers, timeTaken, mode = 'solo', roomId } = req.body;

    const quiz = await Quiz.findByPk(quizId, {
      include: [{ association: 'questions' }],
    });
    if (!quiz) return error(res, 'Quiz not found.', 404);

    const questions = quiz.questions;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    let totalScore = 0;
    const topicPerformance = {};
    const answerRecords = [];

    // Grade answers
    for (const question of questions) {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      const topic = question.topic || 'General';

      if (!userAnswer) {
        skippedCount++;
      } else if (isCorrect) {
        correctCount++;
        totalScore += question.points || 10;
      } else {
        wrongCount++;
      }

      // Track topic performance
      if (!topicPerformance[topic]) topicPerformance[topic] = { correct: 0, total: 0, accuracy: 0 };
      topicPerformance[topic].total++;
      if (isCorrect) topicPerformance[topic].correct++;

      answerRecords.push({
        questionId: question.id,
        selectedAnswer: userAnswer || null,
        isCorrect,
        timeTaken: 0,
      });
    }

    // Calculate topic accuracy
    Object.keys(topicPerformance).forEach(topic => {
      const t = topicPerformance[topic];
      t.accuracy = calcAccuracy(t.correct, t.total);
    });

    const accuracy = calcAccuracy(correctCount, questions.length);

    // Create attempt
    const attempt = await QuizAttempt.create({
      userId: req.user.id,
      quizId,
      score: totalScore,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      skippedAnswers: skippedCount,
      accuracy,
      timeTaken: timeTaken || 0,
      mode,
      roomId: roomId || null,
      topicPerformance,
      completedAt: new Date(),
    });

    // Save individual answers
    const fullAnswers = answerRecords.map(a => ({ ...a, attemptId: attempt.id }));
    await AttemptAnswer.bulkCreate(fullAnswers);

    // Update leaderboard
    await updateLeaderboard(req.user.id, totalScore, correctCount, questions.length, accuracy);

    // Return attempt with correct answers (for report)
    const fullAttempt = await QuizAttempt.findByPk(attempt.id, {
      include: [
        {
          association: 'answers',
          include: [{ association: 'question' }], // includes correctAnswer now
        },
        { association: 'quiz', include: [{ association: 'category' }] },
      ],
    });

    return success(res, { data: fullAttempt }, 'Quiz submitted successfully!', 201);
  } catch (err) {
    console.error('Submit attempt error:', err);
    return error(res, 'Failed to submit quiz.', 500);
  }
};

// ── Update Leaderboard after attempt ─────────────────────────
const updateLeaderboard = async (userId, score, correct, total, accuracy) => {
  try {
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'student') return;

    const [lb] = await Leaderboard.findOrCreate({
      where: { userId },
      defaults: { userId, totalScore: 0, totalQuizzes: 0, accuracy: 0, totalCorrect: 0, totalQuestions: 0 },
    });

    const newTotal = lb.totalQuizzes + 1;
    const newCorrect = lb.totalCorrect + correct;
    const newQuestions = lb.totalQuestions + total;
    const newAccuracy = calcAccuracy(newCorrect, newQuestions);

    await lb.update({
      totalScore: lb.totalScore + score,
      totalQuizzes: newTotal,
      totalCorrect: newCorrect,
      totalQuestions: newQuestions,
      accuracy: newAccuracy,
      weeklyScore: lb.weeklyScore + score,
      monthlyScore: lb.monthlyScore + score,
    });

    // Update global ranks
    await recalculateRanks();
  } catch (err) {
    console.error('Leaderboard update error:', err);
  }
};

const recalculateRanks = async () => {
  const entries = await Leaderboard.findAll({
    include: [{
      association: 'user',
      where: { role: 'student' }
    }],
    order: [['totalScore', 'DESC']]
  });
  for (let i = 0; i < entries.length; i++) {
    await entries[i].update({ globalRank: i + 1 });
  }
};

// ── Get Attempt Report ────────────────────────────────────────
const getAttemptReport = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findByPk(req.params.id, {
      include: [
        { association: 'answers', include: [{ association: 'question' }] },
        { association: 'quiz', include: [{ association: 'category' }] },
        { association: 'user', attributes: ['fullname', 'profileImage'] },
      ],
    });

    if (!attempt) return error(res, 'Attempt not found.', 404);
    if (attempt.userId !== req.user.id && req.user.role === 'student') {
      return error(res, 'Access denied.', 403);
    }

    return success(res, { data: attempt }, 'Report fetched.');
  } catch (err) {
    return error(res, 'Failed to fetch report.', 500);
  }
};

// ── Get My Quiz History ───────────────────────────────────────
const getMyHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await QuizAttempt.findAndCountAll({
      where: { userId: req.user.id },
      include: [{ association: 'quiz', include: [{ association: 'category' }] }],
      order: [['completedAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    return paginated(res, rows, count, page, limit, 'History fetched.');
  } catch (err) {
    return error(res, 'Failed to fetch history.', 500);
  }
};

// ── Get Quiz by Invite Code ───────────────────────────────────
const getQuizByInviteCode = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      where: { inviteCode: req.params.code, isActive: true },
      include: [
        { association: 'questions', attributes: { exclude: ['correctAnswer', 'explanation'] } },
        { association: 'category' },
        { association: 'creator', attributes: ['fullname'] },
      ],
    });
    if (!quiz) return error(res, 'Invalid invite code.', 404);
    return success(res, { data: quiz }, 'Quiz found.');
  } catch (err) {
    return error(res, 'Failed to fetch quiz by invite code.', 500);
  }
};

const getAssignedQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { type: 'teacher', isActive: true },
      include: [
        { association: 'category', attributes: ['name', 'icon', 'color'] },
        { association: 'creator', attributes: ['fullname', 'profileImage'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const attempts = await QuizAttempt.findAll({
      where: { userId: req.user.id },
      attributes: ['quizId', 'id', 'score', 'accuracy', 'completedAt'],
    });

    const attemptMap = new Map();
    attempts.forEach(a => attemptMap.set(a.quizId, a));

    const data = quizzes.map(q => {
      const attempt = attemptMap.get(q.id);
      return {
        ...q.toJSON(),
        isCompleted: !!attempt,
        attemptDetails: attempt || null,
      };
    });

    return success(res, { data }, 'Assigned quizzes fetched.');
  } catch (err) {
    console.error('getAssignedQuizzes error:', err);
    return error(res, 'Failed to fetch assigned quizzes.', 500);
  }
};

module.exports = {
  getQuizForAttempt, submitAttempt, getAttemptReport, getMyHistory, getQuizByInviteCode, getAssignedQuizzes,
};
