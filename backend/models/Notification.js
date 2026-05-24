const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM('quiz_invite', 'achievement', 'system', 'result', 'reminder'), defaultValue: 'system' },
  title: { type: DataTypes.STRING(255), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  data: { type: DataTypes.JSON, defaultValue: {} },
}, { tableName: 'notifications', timestamps: true });

module.exports = Notification;
