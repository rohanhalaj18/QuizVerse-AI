const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Leaderboard = sequelize.define('Leaderboard', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  totalScore: { type: DataTypes.INTEGER, defaultValue: 0 },
  globalRank: { type: DataTypes.INTEGER, defaultValue: null },
  totalQuizzes: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalCorrect: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalQuestions: { type: DataTypes.INTEGER, defaultValue: 0 },
  accuracy: { type: DataTypes.FLOAT, defaultValue: 0 },
  weeklyScore: { type: DataTypes.INTEGER, defaultValue: 0 },
  monthlyScore: { type: DataTypes.INTEGER, defaultValue: 0 },
  multiplayerWins: { type: DataTypes.INTEGER, defaultValue: 0 },
  streak: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'leaderboard', timestamps: true });

module.exports = Leaderboard;
