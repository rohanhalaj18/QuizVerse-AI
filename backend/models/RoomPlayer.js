const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RoomPlayer = sequelize.define('RoomPlayer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  score: { type: DataTypes.INTEGER, defaultValue: 0 },
  rank: { type: DataTypes.INTEGER, defaultValue: null },
  isReady: { type: DataTypes.BOOLEAN, defaultValue: false },
  isConnected: { type: DataTypes.BOOLEAN, defaultValue: true },
  correctAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
  answersData: { type: DataTypes.JSON, defaultValue: [] },
}, { tableName: 'room_players', timestamps: true });

module.exports = RoomPlayer;
