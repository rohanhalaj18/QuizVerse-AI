// ============================================================
// QuizVerse AI — Database Seeder (Default Categories)
// ============================================================
const Category = require('../models/Category');
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

const seedCategories = async () => {
  try {
    const categories = defaultCategories.map(c => ({
      ...c,
      slug: slugify(c.name),
    }));
    await Category.bulkCreate(categories, { ignoreDuplicates: true });
    console.log('✅ Default categories seeded');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
};

module.exports = { seedCategories };
