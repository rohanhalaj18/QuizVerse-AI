// ============================================================
// QuizVerse AI — Auth Routes
// ============================================================
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');

const {
  register, verifyOTP, resendOTP, login, logout, getMe,
  forgotPassword, verifyResetOTP, resetPassword,
  updateProfile, changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

// Multer setup for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (/image/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// ── Public Routes ─────────────────────────────────────────────
router.post('/register', authLimiter, [
  body('fullname').trim().isLength({ min: 2, max: 100 }).withMessage('Fullname must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'teacher']).withMessage('Invalid role'),
], validate, register);

router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric(),
], validate, verifyOTP);

router.post('/resend-otp', authLimiter, [
  body('email').isEmail().normalizeEmail(),
], validate, resendOTP);

router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, login);

router.post('/forgot-password', authLimiter, [
  body('email').isEmail().normalizeEmail(),
], validate, forgotPassword);

router.post('/verify-reset-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric(),
], validate, verifyResetOTP);

router.post('/reset-password', [
  body('email').isEmail().normalizeEmail(),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, resetPassword);

// ── Protected Routes ──────────────────────────────────────────
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);
router.put('/change-password', protect, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
], validate, changePassword);

module.exports = router;
