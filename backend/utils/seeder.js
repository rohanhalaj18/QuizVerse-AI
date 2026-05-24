// ============================================================
// QuizVerse AI — Database Seeder (Default Categories & Users)
// ============================================================
const bcrypt = require('bcryptjs');
const { sequelize, Category, User, Leaderboard } = require('../models');
const { slugify } = require('./helpers');

const defaultCategories = [
  { name: 'Programming', icon: '💻', color: '#6366f1', description: 'Data structures, algorithms, coding questions' },
  { name: 'DBMS', icon: '🗄️', color: '#8b5cf6', description: 'Database management, SQL, NoSQL' },
  { name: 'Aptitude', icon: '🧮', color: '#06b6d4', description: 'Quantitative, logical, verbal reasoning' },
  { name: 'AI/ML', icon: '🤖', color: '#f59e0b', description: 'Machine learning, deep learning, neural networks' },
  { name: 'Web Development', icon: '🌐', color: '#10b981', description: 'HTML, CSS, JavaScript, React, Node.js' },
  { name: 'Cyber Security', icon: '🔐', color: '#ef4444', description: 'Network security, cryptography, ethical hacking' },
  { name: 'Operating System', icon: '⚙️', color: '#f97316', description: 'Processes, memory management, scheduling' },
  { name: 'Cloud Computing', icon: '☁️', color: '#3b82f6', description: 'AWS, Azure, GCP, DevOps, containers' },
  { name: 'Networking', icon: '🌐', color: '#14b8a6', description: 'TCP/IP, protocols, network architecture' },
  { name: 'Mathematics', icon: '📐', color: '#a855f7', description: 'Calculus, linear algebra, statistics' },
];

const defaultUsers = [
  // QuizVerse standard seeded users
  {
    fullname: 'System Admin',
    email: 'admin@quizverse.com',
    password: 'Admin@123',
    role: 'admin',
    isVerified: true
  },
  {
    fullname: 'Default Teacher',
    email: 'teacher@quizverse.com',
    password: 'Teacher@123',
    role: 'teacher',
    isVerified: true
  },
  {
    fullname: 'Default Student',
    email: 'student@quizverse.com',
    password: 'Student@123',
    role: 'student',
    isVerified: true
  },
  // Demo users from frontend
  {
    fullname: 'Demo Admin',
    email: 'admin@demo.com',
    password: 'demo123',
    role: 'admin',
    isVerified: true
  },
  {
    fullname: 'Demo Teacher',
    email: 'teacher@demo.com',
    password: 'demo123',
    role: 'teacher',
    isVerified: true
  },
  {
    fullname: 'Demo Student',
    email: 'student@demo.com',
    password: 'demo123',
    role: 'student',
    isVerified: true
  }
];

const seedCategories = async () => {
  try {
    const categories = defaultCategories.map(c => ({
      ...c,
      slug: slugify(c.name),
    }));
    await Category.bulkCreate(categories, { ignoreDuplicates: true });
    console.log('✅ Default categories seeded');
  } catch (error) {
    console.error('❌ Seeding categories error:', error.message);
  }
};

const seedUsers = async () => {
  try {
    for (const u of defaultUsers) {
      const existing = await User.findOne({ where: { email: u.email } });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(u.password, 12);
        const user = await User.create({
          fullname: u.fullname,
          email: u.email,
          password: hashedPassword,
          role: u.role,
          isVerified: u.isVerified,
          isActive: true
        });
        
        if (u.role === 'student') {
          await Leaderboard.create({ userId: user.id });
        }
        console.log(`👤 Seeded user: ${u.email} (${u.role})`);
      } else {
        console.log(`⏭️ User already exists: ${u.email}`);
      }
    }
  } catch (error) {
    console.error('❌ Seeding users error:', error.message);
  }
};

const seedAll = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await seedCategories();
    await seedUsers();
    console.log('🌱 Seeding process complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

// If run directly via node utils/seeder.js
if (require.main === module) {
  const run = async () => {
    try {
      await sequelize.authenticate();
      await seedAll();
      await sequelize.close();
      process.exit(0);
    } catch (err) {
      console.error('❌ Database connection/seeding failed:', err);
      process.exit(1);
    }
  };
  run();
}

module.exports = { seedCategories, seedUsers, seedAll };
