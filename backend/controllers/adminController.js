// ============================================================
// QuizVerse AI — Admin Controller
// ============================================================
const { User, Quiz, QuizAttempt, Category, Leaderboard } = require('../models');
const { success, error, paginated } = require('../utils/response');
const { slugify } = require('../utils/helpers');
const bcrypt = require('bcryptjs');

// ── Get All Users ─────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (role) where.role = role;
    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { fullname: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where, order: [['createdAt', 'DESC']], limit: parseInt(limit), offset,
    });
    return paginated(res, rows, count, page, limit, 'Users fetched.');
  } catch (err) {
    return error(res, 'Failed to fetch users.', 500);
  }
};

// ── Ban / Unban User ──────────────────────────────────────────
const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'User not found.', 404);
    if (user.role === 'admin') return error(res, 'Cannot ban an admin.', 403);

    await user.update({ isActive: !user.isActive });
    return success(res, { data: { isActive: user.isActive } },
      `User ${user.isActive ? 'unbanned' : 'banned'} successfully.`);
  } catch (err) {
    return error(res, 'Failed to toggle ban.', 500);
  }
};

// ── Get Platform Analytics ────────────────────────────────────
const getPlatformAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalQuizzes, totalAttempts] = await Promise.all([
      User.count(),
      Quiz.count(),
      QuizAttempt.count(),
    ]);

    const roleDistribution = await User.findAll({
      attributes: ['role', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
      group: ['role'],
      raw: true,
    });

    const recentUsers = await User.findAll({ order: [['createdAt', 'DESC']], limit: 5 });

    return success(res, {
      data: { totalUsers, totalQuizzes, totalAttempts, roleDistribution, recentUsers },
    }, 'Platform analytics fetched.');
  } catch (err) {
    return error(res, 'Failed to fetch analytics.', 500);
  }
};

// ── Manage Categories ─────────────────────────────────────────
const createCategory = async (req, res) => {
  try {
    const { name, icon, description, color } = req.body;
    const cat = await Category.create({ name, slug: slugify(name), icon, description, color });
    return success(res, { data: cat }, 'Category created.', 201);
  } catch (err) {
    return error(res, 'Failed to create category.', 500);
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    return success(res, {}, 'Category deleted.');
  } catch (err) {
    return error(res, 'Failed to delete category.', 500);
  }
};

// ── Change User Role ──────────────────────────────────────────
const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return error(res, 'User not found.', 404);
    await user.update({ role });
    return success(res, { data: user }, 'User role updated.');
  } catch (err) {
    return error(res, 'Failed to update role.', 500);
  }
};

module.exports = { getAllUsers, toggleBanUser, getPlatformAnalytics, createCategory, deleteCategory, changeUserRole };
