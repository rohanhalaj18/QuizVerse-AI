const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { generateAIQuiz, getAIFeedback, getTopicSuggestions, getCategories } = require('../controllers/aiController');

router.get('/categories', getCategories);
router.get('/topics/:categoryId', protect, getTopicSuggestions);
router.post('/generate-quiz', protect, aiLimiter, generateAIQuiz);
router.post('/feedback', protect, getAIFeedback);

module.exports = router;
