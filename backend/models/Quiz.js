const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  categoryId: { type: DataTypes.INTEGER, allowNull: true },
  difficulty: { type: DataTypes.ENUM('easy', 'medium', 'hard'), defaultValue: 'medium' },
  createdBy: { type: DataTypes.INTEGER, allowNull: true },
  type: { type: DataTypes.ENUM('ai', 'manual', 'teacher'), defaultValue: 'ai' },
  topic: { type: DataTypes.STRING(255), defaultValue: '' },
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  scheduledAt: { type: DataTypes.DATE, defaultValue: null },
  totalQuestions: { type: DataTypes.INTEGER, defaultValue: 10 },
  timePerQuestion: { type: DataTypes.INTEGER, defaultValue: 30 }, // seconds
  totalTime: { type: DataTypes.INTEGER, defaultValue: 600 }, // seconds
  inviteCode: { type: DataTypes.STRING(20), defaultValue: null, unique: true },
  tags: { type: DataTypes.JSON, defaultValue: [] },
}, { tableName: 'quizzes', timestamps: true });

module.exports = Quiz;
