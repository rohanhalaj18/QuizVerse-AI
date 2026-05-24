// ============================================================
// QuizVerse AI — Sequelize Models Index (Associations)
// ============================================================
const { sequelize } = require('../config/database');

const User = require('./User');
const OtpVerification = require('./OtpVerification');
const Category = require('./Category');
const Quiz = require('./Quiz');
const Question = require('./Question');
const QuizAttempt = require('./QuizAttempt');
const AttemptAnswer = require('./AttemptAnswer');
const MultiplayerRoom = require('./MultiplayerRoom');
const RoomPlayer = require('./RoomPlayer');
const Leaderboard = require('./Leaderboard');
const Notification = require('./Notification');

// ── User Associations ────────────────────────────────────────
User.hasMany(OtpVerification, { foreignKey: 'userId', as: 'otps', onDelete: 'CASCADE' });
User.hasMany(QuizAttempt, { foreignKey: 'userId', as: 'attempts', onDelete: 'CASCADE' });
User.hasMany(MultiplayerRoom, { foreignKey: 'hostId', as: 'hostedRooms', onDelete: 'CASCADE' });
User.hasMany(RoomPlayer, { foreignKey: 'userId', as: 'roomParticipations', onDelete: 'CASCADE' });
User.hasOne(Leaderboard, { foreignKey: 'userId', as: 'leaderboard', onDelete: 'CASCADE' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
User.hasMany(Quiz, { foreignKey: 'createdBy', as: 'createdQuizzes', onDelete: 'SET NULL' });

// ── OtpVerification Associations ─────────────────────────────
OtpVerification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ── Category Associations ────────────────────────────────────
Category.hasMany(Quiz, { foreignKey: 'categoryId', as: 'quizzes', onDelete: 'SET NULL' });

// ── Quiz Associations ────────────────────────────────────────
Quiz.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Quiz.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Quiz.hasMany(Question, { foreignKey: 'quizId', as: 'questions', onDelete: 'CASCADE' });
Quiz.hasMany(QuizAttempt, { foreignKey: 'quizId', as: 'attempts', onDelete: 'CASCADE' });
Quiz.hasMany(MultiplayerRoom, { foreignKey: 'quizId', as: 'multiplayerRooms', onDelete: 'SET NULL' });

// ── Question Associations ─────────────────────────────────────
Question.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });
Question.hasMany(AttemptAnswer, { foreignKey: 'questionId', as: 'answers', onDelete: 'CASCADE' });

// ── QuizAttempt Associations ─────────────────────────────────
QuizAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });
QuizAttempt.hasMany(AttemptAnswer, { foreignKey: 'attemptId', as: 'answers', onDelete: 'CASCADE' });

// ── AttemptAnswer Associations ────────────────────────────────
AttemptAnswer.belongsTo(QuizAttempt, { foreignKey: 'attemptId', as: 'attempt' });
AttemptAnswer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// ── MultiplayerRoom Associations ──────────────────────────────
MultiplayerRoom.belongsTo(User, { foreignKey: 'hostId', as: 'host', onDelete: 'CASCADE' });
MultiplayerRoom.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });
MultiplayerRoom.hasMany(RoomPlayer, { foreignKey: 'roomId', as: 'players', onDelete: 'CASCADE' });

// ── RoomPlayer Associations ───────────────────────────────────
RoomPlayer.belongsTo(MultiplayerRoom, { foreignKey: 'roomId', as: 'room' });
RoomPlayer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ── Leaderboard Associations ──────────────────────────────────
Leaderboard.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ── Notification Associations ─────────────────────────────────
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  OtpVerification,
  Category,
  Quiz,
  Question,
  QuizAttempt,
  AttemptAnswer,
  MultiplayerRoom,
  RoomPlayer,
  Leaderboard,
  Notification,
};
