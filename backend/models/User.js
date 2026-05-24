// ============================================================
// QuizVerse AI — User Model
// ============================================================
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullname: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { len: [2, 100] },
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    defaultValue: 'student',
    allowNull: false,
  },
  profileImage: {
    type: DataTypes.STRING(255),
    defaultValue: null,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  // Gamification
  totalPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastLoginDate: {
    type: DataTypes.DATEONLY,
    defaultValue: null,
  },
  badges: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  // Password Reset
  resetPasswordToken: {
    type: DataTypes.STRING(255),
    defaultValue: null,
  },
  resetPasswordExpire: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
}, {
  tableName: 'users',
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] },
  },
  scopes: {
    withPassword: { attributes: {} },
  },
});

module.exports = User;
