// ============================================================
// QuizVerse AI — Student Dashboard
// ============================================================
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Brain, Trophy, Target, Zap, ArrowRight, TrendingUp, Clock } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const cardVariant = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        // Use mock data for demo
        setData(getMockData());
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Spinner size="xl" />
      </div>
    </DashboardLayout>
  );

  const statCards = [
    { icon: '📝', label: 'Total Quizzes', value: data?.totalAttempts || 0, color: '#7C4DFF', suffix: '' },
    { icon: '🎯', label: 'Avg Accuracy', value: data?.avgAccuracy || 0, color: '#00E676', suffix: '%' },
    { icon: '⭐', label: 'Total Score', value: data?.totalScore || 0, color: '#FBC02D', suffix: '' },
    { icon: '🏆', label: 'Global Rank', value: data?.leaderboard?.globalRank || '—', color: '#FF4081', suffix: '' },
  ];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.fullname?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Ready to challenge yourself today?</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/multiplayer" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} /> Multiplayer
            </Link>
            <Link to="/quiz/setup" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={16} /> AI Quiz <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Streak Banner */}
        {(user?.streak || 0) > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.08))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: 32 }}>🔥</span>
            <div>
              <div style={{ fontWeight: 700, color: '#fbbf24' }}>{user.streak} Day Streak!</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Keep it up — you're on a roll!</div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {statCards.map((card, i) => (
            <motion.div key={i} variants={cardVariant} initial="hidden" animate="show" transition={{ delay: i * 0.1 }}
              className="stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: 28 }}>{card.icon}</span>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: card.color }} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: card.color, fontFamily: 'var(--font-display)' }}>
                {card.value}{card.suffix}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{card.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          {/* Weekly Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} style={{ color: 'var(--primary)' }} /> Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={data?.weeklyData || getMockData().weeklyData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C4DFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C4DFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Area type="monotone" dataKey="quizzes" stroke="#7C4DFF" fill="url(#areaGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Performance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} style={{ color: 'var(--success)' }} /> Category Performance
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={(data?.categoryStats || getMockData().categoryStats).slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Bar dataKey="accuracy" fill="#7C4DFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Strong & Weak Categories */}
        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          {/* Strong */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--success)' }}>💪 Strong Categories</h3>
            {(data?.strongCategories || getMockData().strongCategories).length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Complete more quizzes to see your strengths!</p>
              : (data?.strongCategories || getMockData().strongCategories).map((cat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: 20 }}>{cat.icon || '📚'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{cat.name}</span>
                      <span style={{ color: 'var(--success)', fontWeight: 700 }}>{cat.accuracy}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${cat.accuracy}%`, background: 'linear-gradient(90deg,#10b981,#06b6d4)' }} /></div>
                  </div>
                </div>
              ))}
          </motion.div>

          {/* Weak */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--warning)' }}>📈 Areas to Improve</h3>
            {(data?.weakCategories || getMockData().weakCategories).length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Great job! No weak areas detected yet.</p>
              : (data?.weakCategories || getMockData().weakCategories).map((cat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: 20 }}>{cat.icon || '📚'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{cat.name}</span>
                      <span style={{ color: 'var(--warning)', fontWeight: 700 }}>{cat.accuracy}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${cat.accuracy}%`, background: 'linear-gradient(90deg,#f59e0b,#ef4444)' }} /></div>
                  </div>
                </div>
              ))}
          </motion.div>
        </div>

        {/* Recent History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} style={{ color: 'var(--accent)' }} /> Recent Quizzes
            </h3>
          </div>
          {(data?.recentHistory || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: '1rem' }}>📝</div>
              <p>No quizzes taken yet. <Link to="/quiz/setup" style={{ color: 'var(--primary-light)' }}>Start your first quiz!</Link></p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(data?.recentHistory || []).map((attempt, i) => (
                <Link key={i} to={`/report/${attempt.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 12, transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-glass)'; }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                      {attempt.quiz?.category?.icon || '📚'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{attempt.quiz?.title || 'Quiz'}</div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{attempt.quiz?.category?.name}</span>
                        <span className={`badge diff-${attempt.quiz?.difficulty}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{attempt.quiz?.difficulty}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: attempt.accuracy >= 70 ? 'var(--success)' : attempt.accuracy >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                        {attempt.accuracy}%
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{attempt.correctAnswers}/{attempt.totalQuestions}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

// ── Mock Data (for demo/fallback) ─────────────────────────────
function getMockData() {
  return {
    totalAttempts: 24, avgAccuracy: 72, totalScore: 2840,
    leaderboard: { globalRank: 142 },
    weeklyData: [
      { day: 'Mon', quizzes: 3 }, { day: 'Tue', quizzes: 5 }, { day: 'Wed', quizzes: 2 },
      { day: 'Thu', quizzes: 7 }, { day: 'Fri', quizzes: 4 }, { day: 'Sat', quizzes: 6 }, { day: 'Sun', quizzes: 1 },
    ],
    categoryStats: [
      { name: 'Programming', accuracy: 82 }, { name: 'Web Dev', accuracy: 75 },
      { name: 'DBMS', accuracy: 58 }, { name: 'AI/ML', accuracy: 44 }, { name: 'Networks', accuracy: 66 },
    ],
    strongCategories: [
      { name: 'Programming', icon: '💻', accuracy: 82 },
      { name: 'Web Dev', icon: '🌐', accuracy: 75 },
    ],
    weakCategories: [
      { name: 'AI/ML', icon: '🤖', accuracy: 44 },
      { name: 'DBMS', icon: '🗄️', accuracy: 58 },
    ],
    recentHistory: [],
  };
}
