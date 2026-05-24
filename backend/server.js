// ============================================================
// QuizVerse AI — Main Server Entry Point
// ============================================================
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');
const { initializeMultiplayerSocket } = require('./sockets/multiplayerSocket');
const { globalLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const aiRoutes = require('./routes/ai');
const dashboardRoutes = require('./routes/dashboard');
const multiplayerRoutes = require('./routes/multiplayer');
const teacherRoutes = require('./routes/teacher');
const adminRoutes = require('./routes/admin');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const server = http.createServer(app);

// ── Socket.IO Setup ──────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Attach io instance to app for use in controllers
app.set('io', io);

// ── Security Middleware ──────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// ── Body Parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static Files (profile images) ───────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Rate Limiting ────────────────────────────────────────────
app.use('/api/', globalLimiter);

// ── API Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/multiplayer', multiplayerRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// ── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'QuizVerse AI API is running', timestamp: new Date() });
});

// ── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── Socket.IO Initialization ─────────────────────────────────
initializeMultiplayerSocket(io);

// ── Database Sync & Server Start ─────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models (alter: true updates existing tables without dropping)
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');

    // Seed default categories and users if none exist
    const { Category, Leaderboard, User } = require('./models');
    const categoryCount = await Category.count();
    const userCount = await User.count();
    
    if (categoryCount === 0 || userCount === 0) {
      const seeder = require('./utils/seeder');
      if (categoryCount === 0) {
        await seeder.seedCategories();
      }
      if (userCount === 0) {
        await seeder.seedUsers();
      }
    }

    // Clean up existing non-student leaderboard entries
    const nonStudents = await User.findAll({
      where: {
        role: {
          [require('sequelize').Op.ne]: 'student'
        }
      },
      attributes: ['id']
    });
    if (nonStudents.length > 0) {
      const nonStudentIds = nonStudents.map(u => u.id);
      const deletedCount = await Leaderboard.destroy({
        where: {
          userId: nonStudentIds
        }
      });
      if (deletedCount > 0) {
        console.log(`🧹 Cleaned up ${deletedCount} non-student leaderboard entries.`);
      }
    }

    server.listen(PORT, () => {
      console.log(`🚀 QuizVerse AI Server running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, io };
