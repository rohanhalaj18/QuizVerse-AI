// ============================================================
// QuizVerse AI — AI Controller (Gemini Integration)
// ============================================================
const { generateQuizQuestions, generateAIFeedback, generateTopicSuggestions } = require('../services/geminiService');
const { Quiz, Question, Category } = require('../models');
const { success, error } = require('../utils/response');

// ── Generate AI Quiz ──────────────────────────────────────────
/**
 * POST /api/ai/generate-quiz
 * Generates quiz questions via Gemini and saves to DB
 */
const generateAIQuiz = async (req, res) => {
  try {
    const { categoryId, difficulty, topic, count = 10 } = req.body;

    const category = await Category.findByPk(categoryId);
    if (!category) return error(res, 'Category not found.', 404);

    // Generate questions using Gemini
    const questions = await generateQuizQuestions(category.name, difficulty, topic, parseInt(count));

    // Create quiz record
    const quiz = await Quiz.create({
      title: `${category.name} - ${topic || category.name} (${difficulty})`,
      description: `AI-generated ${difficulty} level quiz on ${topic || category.name}`,
      categoryId,
      difficulty,
      createdBy: req.user.id,
      type: 'ai',
      topic: topic || '',
      isPublic: false,
      totalQuestions: questions.length,
      timePerQuestion: difficulty === 'hard' ? 45 : difficulty === 'medium' ? 35 : 25,
      totalTime: questions.length * (difficulty === 'hard' ? 45 : difficulty === 'medium' ? 35 : 25),
    });

    // Bulk insert questions
    const questionRecords = questions.map(q => ({
      ...q,
      options: q.options,
      quizId: quiz.id,
    }));
    await Question.bulkCreate(questionRecords);

    // Fetch quiz with questions
    const fullQuiz = await Quiz.findByPk(quiz.id, {
      include: [
        { association: 'questions', attributes: { exclude: ['correctAnswer', 'explanation'] } },
        { association: 'category', attributes: ['name', 'icon', 'color'] },
      ],
    });

    return success(res, { data: fullQuiz }, 'AI quiz generated successfully!', 201);
  } catch (err) {
    console.error('AI Quiz generation error:', err);
    return error(res, err.message || 'Failed to generate AI quiz.', 500);
  }
};

// ── Get AI Feedback ───────────────────────────────────────────
/**
 * POST /api/ai/feedback
 * Generates personalized AI feedback for a quiz attempt
 */
const getAIFeedback = async (req, res) => {
  try {
    const { attemptId } = req.body;
    const { QuizAttempt, Quiz, Category } = require('../models');

    const attempt = await QuizAttempt.findByPk(attemptId, {
      include: [{ association: 'quiz', include: [{ association: 'category' }] }],
    });

    if (!attempt) return error(res, 'Attempt not found.', 404);
    if (attempt.userId !== req.user.id) return error(res, 'Access denied.', 403);

    const topicPerformance = attempt.topicPerformance || {};
    const weakTopics = Object.entries(topicPerformance)
      .filter(([, data]) => data.accuracy < 50)
      .map(([topic]) => topic);
    const strongTopics = Object.entries(topicPerformance)
      .filter(([, data]) => data.accuracy >= 80)
      .map(([topic]) => topic);

    const feedback = await generateAIFeedback({
      score: attempt.score,
      accuracy: attempt.accuracy,
      correctAnswers: attempt.correctAnswers,
      totalQuestions: attempt.totalQuestions,
      weakTopics,
      strongTopics,
      category: attempt.quiz?.category?.name || 'General',
      difficulty: attempt.quiz?.difficulty || 'medium',
    });

    // Save feedback to attempt
    await attempt.update({ aiFeedback: JSON.stringify(feedback) });

    return success(res, { data: feedback }, 'AI feedback generated.');
  } catch (err) {
    console.error('AI Feedback error:', err);
    return error(res, 'Failed to generate AI feedback.', 500);
  }
};

// ── Get Topic Suggestions ─────────────────────────────────────
const getTopicSuggestions = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByPk(categoryId);
    if (!category) return error(res, 'Category not found.', 404);

    const topics = await generateTopicSuggestions(category.name);
    return success(res, { data: topics }, 'Topic suggestions fetched.');
  } catch (err) {
    return error(res, 'Failed to fetch topic suggestions.', 500);
  }
};

// ── Get All Categories ────────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
    return success(res, { data: categories }, 'Categories fetched.');
  } catch (err) {
    return error(res, 'Failed to fetch categories.', 500);
  }
};

module.exports = { generateAIQuiz, getAIFeedback, getTopicSuggestions, getCategories };
