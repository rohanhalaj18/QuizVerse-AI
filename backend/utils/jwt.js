// ============================================================
// QuizVerse AI — JWT Utility Helpers
// ============================================================
const jwt = require('jsonwebtoken');

/**
 * Sign a JWT token
 * @param {object} payload - Data to encode
 * @param {string} [expiresIn] - Override default expiry
 * @returns {string} signed token
 */
const signToken = (payload, expiresIn = process.env.JWT_EXPIRE || '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify and decode a JWT token
 * @param {string} token
 * @returns {object} decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Generate token and attach it to response as httpOnly cookie
 * @param {object} user - User object
 * @param {number} statusCode
 * @param {object} res - Express response
 * @param {string} [message]
 */
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const payload = { id: user.id, email: user.email, role: user.role };
  const token = signToken(payload);

  const cookieOptions = {
    expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  const userObj = user.toJSON ? user.toJSON() : { ...user };
  delete userObj.password;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpire;

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({ success: true, message, token, user: userObj });
};

module.exports = { signToken, verifyToken, sendTokenResponse };
