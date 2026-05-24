// ============================================================
// QuizVerse AI — Teacher Controller
// ============================================================
const { Quiz, Question, QuizAttempt, User, Category, AttemptAnswer } = require('../models');
const { success, error, paginated } = require('../utils/response');
const { generateInviteCode, slugify } = require('../utils/helpers');
const { sendQuizInviteEmail } = require('../services/emailService');
const { v4: uuidv4 } = require('uuid');

// ── Create Quiz Manually ──────────────────────────────────────
const createQuiz = async (req, res) => {
  try {
    const { title, description, categoryId, difficulty, questions, isPublic, scheduledAt, timePerQuestion } = req.body;

    const inviteCode = generateInviteCode();
    const quiz = await Quiz.create({
      title, description, categoryId, difficulty,
      createdBy: req.user.id, type: 'teacher',
      isPublic: isPublic ?? true,
      totalQuestions: questions?.length || 0,
      timePerQuestion: timePerQuestion || 30,
      totalTime: (questions?.length || 0) * (timePerQuestion || 30),
      scheduledAt: scheduledAt || null,
      inviteCode,
    });

    if (questions && questions.length > 0) {
      const questionRecords = questions.map((q, i) => ({
        quizId: quiz.id,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        difficulty: q.difficulty || difficulty,
        topic: q.topic || '',
        orderIndex: i,
        points: q.points || 10,
      }));
      await Question.bulkCreate(questionRecords);
    }

    const fullQuiz = await Quiz.findByPk(quiz.id, {
      include: ['questions', 'category'],
    });

    return success(res, { data: fullQuiz }, 'Quiz created successfully!', 201);
  } catch (err) {
    console.error('Create quiz error:', err);
    return error(res, 'Failed to create quiz.', 500);
  }
};

// ── Get Teacher's Quizzes ─────────────────────────────────────
const getMyQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Quiz.findAndCountAll({
      where: { createdBy: req.user.id },
      include: [{ association: 'category' }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    return paginated(res, rows, count, page, limit, 'Quizzes fetched.');
  } catch (err) {
    return error(res, 'Failed to fetch quizzes.', 500);
  }
};

// ── Get Quiz Analytics ────────────────────────────────────────
const getQuizAnalytics = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findOne({
      where: { id: quizId, createdBy: req.user.id },
      include: [{ association: 'questions' }]
    });
    if (!quiz) return error(res, 'Quiz not found.', 404);

    const attempts = await QuizAttempt.findAll({
      where: { quizId },
      include: [
        { association: 'user', attributes: ['fullname', 'profileImage'] },
        { association: 'answers' }
      ],
      order: [['completedAt', 'DESC']],
    });

    const totalAttempts = attempts.length;
    const avgScore = attempts.length ? Math.round(attempts.reduce((a, c) => a + c.score, 0) / attempts.length) : 0;
    const avgAccuracy = attempts.length ? Math.round(attempts.reduce((a, c) => a + c.accuracy, 0) / attempts.length) : 0;
    const passRate = attempts.length ? Math.round((attempts.filter(a => a.accuracy >= 60).length / attempts.length) * 100) : 0;

    // Sort questions by their order index to render in correct order
    const sortedQuestions = quiz.questions?.sort((a, b) => a.orderIndex - b.orderIndex) || [];

    // Calculate Question-by-Question breakdown
    const questionStats = sortedQuestions.map(q => {
      // Find all answers submitted for this question across all attempts
      const answersForQ = [];
      attempts.forEach(att => {
        const ans = att.answers?.find(a => a.questionId === q.id);
        if (ans) {
          answersForQ.push({
            selectedAnswer: ans.selectedAnswer,
            isCorrect: ans.isCorrect,
            studentName: att.user?.fullname || 'Student',
          });
        }
      });

      // Count option choices
      const counts = { A: 0, B: 0, C: 0, D: 0, skipped: 0 };
      answersForQ.forEach(ans => {
        if (!ans.selectedAnswer) {
          counts.skipped++;
        } else {
          const upperAns = ans.selectedAnswer.toUpperCase();
          if (counts[upperAns] !== undefined) {
            counts[upperAns]++;
          } else {
            counts.skipped++;
          }
        }
      });

      const totalResponses = answersForQ.length;
      const correctResponses = answersForQ.filter(ans => ans.isCorrect).length;
      const accuracy = totalResponses ? Math.round((correctResponses / totalResponses) * 100) : 0;

      return {
        id: q.id,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        counts,
        totalResponses,
        correctResponses,
        accuracy,
      };
    });

    return success(res, {
      data: {
        quiz,
        attempts,
        totalAttempts,
        avgScore,
        avgAccuracy,
        passRate,
        questionStats
      }
    }, 'Analytics fetched.');
  } catch (err) {
    console.error('getQuizAnalytics error:', err);
    return error(res, 'Failed to fetch analytics.', 500);
  }
};

// ── Send Quiz Invite ──────────────────────────────────────────
const sendInvite = async (req, res) => {
  try {
    const { quizId, emails } = req.body;
    const quiz = await Quiz.findOne({ where: { id: quizId, createdBy: req.user.id } });
    if (!quiz) return error(res, 'Quiz not found.', 404);

    const emailList = Array.isArray(emails) ? emails : [emails];
    for (const email of emailList) {
      await sendQuizInviteEmail(email, quiz.title, quiz.inviteCode, req.user.fullname).catch(console.error);
    }

    return success(res, {}, `Invites sent to ${emailList.length} recipient(s).`);
  } catch (err) {
    return error(res, 'Failed to send invites.', 500);
  }
};

// ── Delete Quiz ───────────────────────────────────────────────
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ where: { id: req.params.id, createdBy: req.user.id } });
    if (!quiz) return error(res, 'Quiz not found.', 404);
    await quiz.destroy();
    return success(res, {}, 'Quiz deleted.');
  } catch (err) {
    return error(res, 'Failed to delete quiz.', 500);
  }
};

// ── Teacher Dashboard Stats ───────────────────────────────────
const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const totalQuizzes = await Quiz.count({ where: { createdBy: teacherId } });
    const quizIds = (await Quiz.findAll({ where: { createdBy: teacherId }, attributes: ['id'] })).map(q => q.id);
    const totalAttempts = quizIds.length ? await QuizAttempt.count({ where: { quizId: quizIds } }) : 0;

    const recentQuizzes = await Quiz.findAll({
      where: { createdBy: teacherId },
      include: [{ association: 'category' }],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    return success(res, { data: { totalQuizzes, totalAttempts, recentQuizzes } }, 'Teacher dashboard fetched.');
  } catch (err) {
    return error(res, 'Failed to fetch teacher dashboard.', 500);
  }
};

module.exports = { createQuiz, getMyQuizzes, getQuizAnalytics, sendInvite, deleteQuiz, getTeacherDashboard };
