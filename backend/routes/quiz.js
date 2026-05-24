const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getQuizForAttempt, submitAttempt, getAttemptReport, getMyHistory, getQuizByInviteCode, getAssignedQuizzes } = require('../controllers/quizController');

router.use(protect);
router.get('/history', getMyHistory);
router.get('/assigned', getAssignedQuizzes);
router.get('/invite/:code', getQuizByInviteCode);
router.get('/:id', getQuizForAttempt);
router.post('/submit', submitAttempt);
router.get('/attempt/:id', getAttemptReport);

module.exports = router;
