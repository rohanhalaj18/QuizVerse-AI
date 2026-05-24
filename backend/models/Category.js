const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  icon: { type: DataTypes.STRING(100), defaultValue: '📚' },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  color: { type: DataTypes.STRING(20), defaultValue: '#6366f1' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'categories', timestamps: true });

module.exports = Category;
