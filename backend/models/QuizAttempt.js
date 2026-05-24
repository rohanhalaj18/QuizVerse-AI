const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuizAttempt = sequelize.define('QuizAttempt', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  quizId: { type: DataTypes.INTEGER, allowNull: false },
  score: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalQuestions: { type: DataTypes.INTEGER, allowNull: false },
  correctAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
  wrongAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
  skippedAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
  accuracy: { type: DataTypes.FLOAT, defaultValue: 0 },
  timeTaken: { type: DataTypes.INTEGER, defaultValue: 0 }, // seconds
  mode: { type: DataTypes.ENUM('solo', 'multiplayer'), defaultValue: 'solo' },
  roomId: { type: DataTypes.INTEGER, defaultValue: null },
  rank: { type: DataTypes.INTEGER, defaultValue: null },
  aiFeedback: { type: DataTypes.TEXT, defaultValue: null },
  topicPerformance: { type: DataTypes.JSON, defaultValue: {} },
  completedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'quiz_attempts', timestamps: true });

module.exports = QuizAttempt;
