const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AttemptAnswer = sequelize.define('AttemptAnswer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  attemptId: { type: DataTypes.INTEGER, allowNull: false },
  questionId: { type: DataTypes.INTEGER, allowNull: false },
  selectedAnswer: { type: DataTypes.STRING(10), defaultValue: null }, // null = skipped
  isCorrect: { type: DataTypes.BOOLEAN, defaultValue: false },
  timeTaken: { type: DataTypes.INTEGER, defaultValue: 0 }, // seconds per question
  markedForReview: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'attempt_answers', timestamps: true });

module.exports = AttemptAnswer;
