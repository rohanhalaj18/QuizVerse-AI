const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MultiplayerRoom = sequelize.define('MultiplayerRoom', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roomCode: { type: DataTypes.STRING(8), allowNull: false, unique: true },
  hostId: { type: DataTypes.INTEGER, allowNull: false },
  quizId: { type: DataTypes.INTEGER, allowNull: true },
  status: { type: DataTypes.ENUM('waiting', 'starting', 'active', 'finished'), defaultValue: 'waiting' },
  maxPlayers: { type: DataTypes.INTEGER, defaultValue: 5 },
  currentPlayers: { type: DataTypes.INTEGER, defaultValue: 1 },
  category: { type: DataTypes.STRING(100), defaultValue: '' },
  difficulty: { type: DataTypes.ENUM('easy', 'medium', 'hard'), defaultValue: 'medium' },
  topic: { type: DataTypes.STRING(255), defaultValue: '' },
  chatEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  startedAt: { type: DataTypes.DATE, defaultValue: null },
  finishedAt: { type: DataTypes.DATE, defaultValue: null },
}, { tableName: 'multiplayer_rooms', timestamps: true });

module.exports = MultiplayerRoom;
