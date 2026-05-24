// ============================================================
// QuizVerse AI — Input Validation Middleware
// ============================================================
const { validationResult } = require('express-validator');
const { error } = require('../utils/response');

/**
 * Check express-validator results and return errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 'Validation failed', 422, errors.array().map(e => ({ field: e.path, message: e.msg })));
  }
  next();
};

module.exports = { validate };
