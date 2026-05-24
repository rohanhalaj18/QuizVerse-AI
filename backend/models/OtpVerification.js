const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OtpVerification = sequelize.define('OtpVerification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  email: { type: DataTypes.STRING(150), allowNull: false },
  otp: { type: DataTypes.STRING(255), allowNull: false }, // hashed
  type: { type: DataTypes.ENUM('register', 'forgot_password'), defaultValue: 'register' },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  isUsed: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'otp_verifications', timestamps: true });

module.exports = OtpVerification;
