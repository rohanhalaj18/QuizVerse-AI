// ============================================================
// QuizVerse AI — Rate Limiters
// ============================================================
const rateLimit = require('express-rate-limit');

/** Global API rate limiter */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/** Strict limiter for auth routes */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/** Gemini AI rate limiter */
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, message: 'AI request limit reached. Please wait a moment.' },
});

module.exports = { globalLimiter, authLimiter, aiLimiter };
