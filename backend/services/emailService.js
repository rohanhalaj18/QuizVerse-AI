// ============================================================
// QuizVerse AI — Email Service (Nodemailer)
// ============================================================
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ── Email Templates ──────────────────────────────────────────

const otpEmailTemplate = (otp, type = 'register') => {
  const isRegister = type === 'register';
  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"><title>QuizVerse AI - OTP</title></head>
  <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',sans-serif;">
    <div style="max-width:600px;margin:40px auto;background:linear-gradient(135deg,#1e1b4b,#0f172a);border-radius:16px;overflow:hidden;border:1px solid #312e81;">
      <div style="background:linear-gradient(90deg,#6366f1,#8b5cf6);padding:30px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:28px;letter-spacing:2px;">⚡ QuizVerse AI</h1>
        <p style="color:#c7d2fe;margin:8px 0 0;font-size:14px;">AI-Powered Quiz Platform</p>
      </div>
      <div style="padding:40px;">
        <h2 style="color:#e2e8f0;margin:0 0 16px;">${isRegister ? 'Verify Your Email' : 'Reset Your Password'}</h2>
        <p style="color:#94a3b8;font-size:15px;line-height:1.6;">
          ${isRegister
            ? 'Welcome to QuizVerse AI! Use the OTP below to verify your email address.'
            : 'Use the OTP below to reset your password. It expires in 10 minutes.'}
        </p>
        <div style="background:#1e293b;border:2px dashed #6366f1;border-radius:12px;padding:30px;text-align:center;margin:28px 0;">
          <p style="color:#94a3b8;margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Your OTP Code</p>
          <h1 style="color:#a5b4fc;font-size:48px;letter-spacing:12px;margin:0;font-weight:800;">${otp}</h1>
          <p style="color:#64748b;margin:8px 0 0;font-size:12px;">Valid for 10 minutes</p>
        </div>
        <p style="color:#64748b;font-size:13px;">If you didn't request this, please ignore this email. Do not share this OTP with anyone.</p>
      </div>
      <div style="background:#0f172a;padding:20px;text-align:center;border-top:1px solid #1e293b;">
        <p style="color:#475569;margin:0;font-size:12px;">© 2024 QuizVerse AI. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;
};

// ── Send Functions ───────────────────────────────────────────

/**
 * Send OTP email for registration or password reset
 */
const sendOTPEmail = async (email, otp, type = 'register') => {
  const transporter = createTransporter();
  const subject = type === 'register'
    ? '🔐 QuizVerse AI - Email Verification OTP'
    : '🔑 QuizVerse AI - Password Reset OTP';

  const mailOptions = {
    from: process.env.EMAIL_FROM || `QuizVerse AI <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: otpEmailTemplate(otp, type),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}:`, info.messageId);
    return true;
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    // Don't throw — log and continue (dev mode fallback)
    return false;
  }
};

/**
 * Send quiz invite email
 */
const sendQuizInviteEmail = async (email, quizTitle, inviteCode, teacherName) => {
  const transporter = createTransporter();
  const html = `
  <!DOCTYPE html><html><body style="font-family:sans-serif;background:#0f172a;padding:40px;">
    <div style="max-width:600px;margin:auto;background:#1e293b;border-radius:16px;padding:30px;color:#e2e8f0;">
      <h1 style="color:#6366f1;">📝 Quiz Invitation</h1>
      <p><strong>${teacherName}</strong> has invited you to take a quiz:</p>
      <h2 style="color:#a5b4fc;">${quizTitle}</h2>
      <div style="background:#0f172a;padding:20px;border-radius:10px;text-align:center;margin:20px 0;">
        <p style="color:#94a3b8;margin:0 0 8px;">Use this invite code:</p>
        <h2 style="color:#34d399;letter-spacing:6px;margin:0;">${inviteCode}</h2>
      </div>
      <p style="color:#64748b;font-size:13px;">Visit QuizVerse AI and enter the invite code to start the quiz.</p>
    </div>
  </body></html>`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: `📝 Quiz Invitation: ${quizTitle}`,
      html,
    });
    console.log(`✅ Invite email sent to ${email}`);
    return true;
  } catch (err) {
    console.error(`❌ Invite email failed for ${email}:`, err.message);
    return false;
  }
};

module.exports = { sendOTPEmail, sendQuizInviteEmail };
