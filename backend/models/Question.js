const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quizId: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.TEXT, allowNull: false },
  options: { type: DataTypes.JSON, allowNull: false }, // ["A","B","C","D"]
  correctAnswer: { type: DataTypes.STRING(10), allowNull: false }, // "A","B","C","D"
  explanation: { type: DataTypes.TEXT, defaultValue: '' },
  difficulty: { type: DataTypes.ENUM('easy', 'medium', 'hard'), defaultValue: 'medium' },
  topic: { type: DataTypes.STRING(255), defaultValue: '' },
  orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
  points: { type: DataTypes.INTEGER, defaultValue: 10 },
}, { tableName: 'questions', timestamps: true });

module.exports = Question;
