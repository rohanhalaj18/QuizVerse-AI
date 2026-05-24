// ============================================================
// QuizVerse AI — General Utility Helpers
// ============================================================
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/** Generate a random numeric OTP */
const generateOTP = (length = 6) => {
  let otp = '';
  for (let i = 0; i < length; i++) otp += Math.floor(Math.random() * 10);
  return otp;
};

/** Hash a string with bcrypt */
const hashValue = async (value, rounds = 10) => {
  return await bcrypt.hash(value, rounds);
};

/** Compare plain value to bcrypt hash */
const compareValue = async (value, hash) => {
  return await bcrypt.compare(value, hash);
};

/** Generate a random alphanumeric room code */
const generateRoomCode = (length = 6) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
};

/** Generate a random invite code */
const generateInviteCode = () => crypto.randomBytes(4).toString('hex').toUpperCase();

/** Calculate accuracy percentage */
const calcAccuracy = (correct, total) => {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
};

/** Get OTP expiry date (minutes from now) */
const getOtpExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

/** Slugify a string */
const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

module.exports = {
  generateOTP,
  hashValue,
  compareValue,
  generateRoomCode,
  generateInviteCode,
  calcAccuracy,
  getOtpExpiry,
  slugify,
};
