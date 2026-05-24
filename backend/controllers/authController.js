// ============================================================
// QuizVerse AI — Auth Controller
// ============================================================
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, OtpVerification, Leaderboard } = require('../models');
const { sendTokenResponse } = require('../utils/jwt');
const { sendOTPEmail } = require('../services/emailService');
const { success, error } = require('../utils/response');
const {
  generateOTP, hashValue, compareValue, getOtpExpiry,
} = require('../utils/helpers');

// ── Register ──────────────────────────────────────────────────
/**
 * POST /api/auth/register
 * Creates unverified user and sends OTP
 */
const register = async (req, res) => {
  try {
    const { fullname, email, password, role = 'student' } = req.body;

    // Check duplicate email
    const existing = await User.scope('withPassword').findOne({ where: { email } });
    if (existing) {
      if (existing.isVerified) return error(res, 'Email already registered. Please login.', 409);
      // Re-send OTP if not verified
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create or update user
    let user;
    if (existing) {
      await existing.update({ fullname, password: hashedPassword });
      user = existing;
    } else {
      user = await User.create({ fullname, email, password: hashedPassword, role, isVerified: false });
      // Create leaderboard entry
      if (role === 'student') {
        await Leaderboard.create({ userId: user.id });
      }
    }

    // Generate OTP
    const otp = generateOTP(6);
    const hashedOtp = await hashValue(otp);
    const expiresAt = getOtpExpiry(10);

    // Remove old OTPs for this email
    await OtpVerification.destroy({ where: { email, type: 'register' } });

    // Save new OTP
    await OtpVerification.create({
      userId: user.id, email, otp: hashedOtp,
      type: 'register', expiresAt,
    });

    // Send email (non-blocking)
    sendOTPEmail(email, otp, 'register').catch(console.error);

    return success(res, { data: { email } },
      `OTP sent to ${email}. Please verify your email to continue.`, 201);
  } catch (err) {
    console.error('Register error:', err);
    return error(res, 'Registration failed. Please try again.', 500);
  }
};

// ── Verify OTP ────────────────────────────────────────────────
/**
 * POST /api/auth/verify-otp
 */
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OtpVerification.findOne({
      where: { email, type: 'register', isUsed: false, expiresAt: { [Op.gt]: new Date() } },
      order: [['createdAt', 'DESC']],
    });

    if (!otpRecord) return error(res, 'OTP expired or invalid. Please request a new one.', 400);

    const isMatch = await compareValue(otp, otpRecord.otp);
    if (!isMatch) return error(res, 'Incorrect OTP. Please try again.', 400);

    // Mark OTP as used
    await otpRecord.update({ isUsed: true });

    // Verify user
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) return error(res, 'User not found.', 404);

    await user.update({ isVerified: true });

    return sendTokenResponse(user, 200, res, 'Email verified successfully! Welcome to QuizVerse AI.');
  } catch (err) {
    console.error('Verify OTP error:', err);
    return error(res, 'OTP verification failed.', 500);
  }
};

// ── Resend OTP ────────────────────────────────────────────────
const resendOTP = async (req, res) => {
  try {
    const { email, type = 'register' } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return error(res, 'No account found with this email.', 404);

    const otp = generateOTP(6);
    const hashedOtp = await hashValue(otp);
    const expiresAt = getOtpExpiry(10);

    await OtpVerification.destroy({ where: { email, type } });
    await OtpVerification.create({ userId: user.id, email, otp: hashedOtp, type, expiresAt });

    sendOTPEmail(email, otp, type).catch(console.error);

    return success(res, {}, `New OTP sent to ${email}.`);
  } catch (err) {
    return error(res, 'Failed to resend OTP.', 500);
  }
};

// ── Login ─────────────────────────────────────────────────────
/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) return error(res, 'Invalid email or password.', 401);

    if (!user.isActive) return error(res, 'Your account has been banned. Contact support.', 403);

    if (!user.isVerified) {
      // Resend OTP
      const otp = generateOTP(6);
      const hashedOtp = await hashValue(otp);
      await OtpVerification.destroy({ where: { email, type: 'register' } });
      await OtpVerification.create({ userId: user.id, email, otp: hashedOtp, type: 'register', expiresAt: getOtpExpiry(10) });
      sendOTPEmail(email, otp, 'register').catch(console.error);
      return error(res, 'Email not verified. A new OTP has been sent to your email.', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return error(res, 'Invalid email or password.', 401);

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = user.lastLoginDate;
    let newStreak = user.streak;
    if (lastLogin) {
      const diff = Math.floor((new Date(today) - new Date(lastLogin)) / (1000 * 60 * 60 * 24));
      if (diff === 1) newStreak += 1;
      else if (diff > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }

    await user.update({ lastLoginDate: today, streak: newStreak });

    return sendTokenResponse(user, 200, res, 'Login successful!');
  } catch (err) {
    console.error('Login error:', err);
    return error(res, 'Login failed.', 500);
  }
};

// ── Logout ────────────────────────────────────────────────────
const logout = async (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  return success(res, {}, 'Logged out successfully.');
};

// ── Get Current User ──────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    return success(res, { data: user }, 'User data fetched.');
  } catch (err) {
    return error(res, 'Failed to fetch user.', 500);
  }
};

// ── Forgot Password ───────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return error(res, 'No account found with this email.', 404);

    const otp = generateOTP(6);
    const hashedOtp = await hashValue(otp);

    await OtpVerification.destroy({ where: { email, type: 'forgot_password' } });
    await OtpVerification.create({
      userId: user.id, email, otp: hashedOtp,
      type: 'forgot_password', expiresAt: getOtpExpiry(10),
    });

    sendOTPEmail(email, otp, 'forgot_password').catch(console.error);

    return success(res, { data: { email } }, `Password reset OTP sent to ${email}.`);
  } catch (err) {
    return error(res, 'Failed to send reset OTP.', 500);
  }
};

// ── Verify Reset OTP ──────────────────────────────────────────
const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OtpVerification.findOne({
      where: { email, type: 'forgot_password', isUsed: false, expiresAt: { [Op.gt]: new Date() } },
      order: [['createdAt', 'DESC']],
    });

    if (!otpRecord) return error(res, 'OTP expired or invalid.', 400);

    const isMatch = await compareValue(otp, otpRecord.otp);
    if (!isMatch) return error(res, 'Incorrect OTP.', 400);

    // Mark as used
    await otpRecord.update({ isUsed: true });

    return success(res, { data: { email, verified: true } }, 'OTP verified. You can now reset your password.');
  } catch (err) {
    return error(res, 'OTP verification failed.', 500);
  }
};

// ── Reset Password ────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) return error(res, 'User not found.', 404);

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await user.update({ password: hashedPassword });

    return success(res, {}, 'Password reset successfully. Please login with your new password.');
  } catch (err) {
    return error(res, 'Password reset failed.', 500);
  }
};

// ── Update Profile ────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { fullname } = req.body;
    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (req.file) updateData.profileImage = `/uploads/${req.file.filename}`;

    const user = await User.findByPk(req.user.id);
    await user.update(updateData);

    return success(res, { data: user }, 'Profile updated successfully.');
  } catch (err) {
    return error(res, 'Profile update failed.', 500);
  }
};

// ── Change Password ───────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.scope('withPassword').findByPk(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return error(res, 'Current password is incorrect.', 400);

    await user.update({ password: await bcrypt.hash(newPassword, 12) });
    return success(res, {}, 'Password changed successfully.');
  } catch (err) {
    return error(res, 'Password change failed.', 500);
  }
};

module.exports = {
  register, verifyOTP, resendOTP, login, logout, getMe,
  forgotPassword, verifyResetOTP, resetPassword,
  updateProfile, changePassword,
};
