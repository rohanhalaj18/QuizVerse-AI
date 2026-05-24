// ============================================================
// QuizVerse AI — Role-Based Access Control Middleware
// ============================================================
const { error } = require('../utils/response');

/**
 * Restrict access to specific roles
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return error(res, 'Authentication required.', 401);
    if (!roles.includes(req.user.role)) {
      return error(res, `Access denied. This route requires: ${roles.join(', ')} role.`, 403);
    }
    next();
  };
};

module.exports = { authorize };
