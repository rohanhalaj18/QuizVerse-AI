// ============================================================
// QuizVerse AI — Auth Middleware (JWT Verify)
// ============================================================
const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');
const { error } = require('../utils/response');

/**
 * Protect routes — verifies JWT from cookie or Authorization header
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check cookie first, then Authorization header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return error(res, 'Access denied. Please login to continue.', 401);
    }

    // Verify token
    const decoded = verifyToken(token);

    // Find user (exclude password by default scope)
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return error(res, 'User not found. Please login again.', 401);
    }

    if (!user.isActive) {
      return error(res, 'Your account has been banned. Contact support.', 403);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Session expired. Please login again.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Invalid token. Please login again.', 401);
    }
    return error(res, 'Authentication failed.', 401);
  }
};

/**
 * Optional auth — attaches user if token present, but doesn't block
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.cookies && req.cookies.token) token = req.cookies.token;
    else if (req.headers.authorization?.startsWith('Bearer ')) token = req.headers.authorization.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      req.user = await User.findByPk(decoded.id);
    }
  } catch (_) { /* ignore */ }
  next();
};

module.exports = { protect, optionalAuth };
