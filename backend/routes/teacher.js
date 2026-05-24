const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { createQuiz, getMyQuizzes, getQuizAnalytics, sendInvite, deleteQuiz, getTeacherDashboard } = require('../controllers/teacherController');

router.use(protect, authorize('teacher', 'admin'));
router.get('/dashboard', getTeacherDashboard);
router.get('/quizzes', getMyQuizzes);
router.post('/quizzes', createQuiz);
router.delete('/quizzes/:id', deleteQuiz);
router.get('/quizzes/:quizId/analytics', getQuizAnalytics);
router.post('/invite', sendInvite);

module.exports = router;
