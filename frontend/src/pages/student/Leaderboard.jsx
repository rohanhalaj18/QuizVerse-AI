// ============================================================
// QuizVerse AI — Leaderboard Page
// ============================================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const rankMedals = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const { user } = useAuth();
  const [global, setGlobal] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('global');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [g, w, m] = await Promise.all([
          api.get('/leaderboard/global'),
          api.get('/leaderboard/weekly'),
          api.get('/leaderboard/my-rank'),
        ]);
        if (g.data.success) setGlobal(g.data.data);
        if (w.data.success) setWeekly(w.data.data);
        if (m.data.success) setMyRank(m.data.data);
      } catch (err) {
        // Use mock
        setGlobal(getMockLeaderboard());
        setWeekly(getMockLeaderboard());
      } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const entries = tab === 'global' ? global : weekly;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: 56, marginBottom: '0.5rem' }}>🏆</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Global <span className="gradient-text">Leaderboard</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Compete with students worldwide</p>
        </div>

        {/* My Rank Banner */}
        {myRank && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Trophy size={28} style={{ color: 'var(--primary-light)' }} />
              <div>
                <div style={{ fontWeight: 700 }}>Your Rank</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Keep climbing!</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Rank', value: `#${myRank.globalRank || '—'}` },
                { label: 'Score', value: myRank.totalScore || 0 },
                { label: 'Accuracy', value: `${Math.round(myRank.accuracy || 0)}%` },
                { label: 'Quizzes', value: myRank.totalQuizzes || 0 },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary-light)' }}>{s.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '0.375rem', borderRadius: 12, border: '1px solid var(--border)', width: 'fit-content' }}>
          {['global', 'weekly'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '0.5rem 1.25rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'var(--font-sans)', transition: 'all 0.2s', background: tab === t ? 'var(--gradient-primary)' : 'transparent', color: tab === t ? 'white' : 'var(--text-secondary)' }}>
              {t === 'global' ? '🌍 Global' : '📅 Weekly'}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size="xl" /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {entries.map((entry, i) => {
              const isMe = entry.userId === user?.id || entry.user?.id === user?.id;
              const rank = i + 1;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className={`leaderboard-row ${rank <= 3 ? `rank-${rank}` : ''}`}
                  style={{ border: isMe ? '1px solid rgba(99,102,241,0.5)' : undefined, background: isMe ? 'rgba(99,102,241,0.08)' : undefined }}>
                  <div style={{ width: 40, textAlign: 'center', fontWeight: 800, fontSize: rank <= 3 ? '1.5rem' : '1rem', color: rank <= 3 ? undefined : 'var(--text-muted)' }}>
                    {rank <= 3 ? rankMedals[rank - 1] : rank}
                  </div>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', color: 'white', flexShrink: 0 }}>
                    {(entry.user?.fullname || 'U')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{entry.user?.fullname || 'Anonymous'} {isMe && <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)' }}>(You)</span>}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      🔥 {entry.user?.streak || 0} streak • {entry.totalQuizzes || 0} quizzes
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, color: 'var(--warning)' }}>{Math.round(entry.accuracy || 0)}%</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Accuracy</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: rank === 1 ? '#fbbf24' : rank === 2 ? '#94a3b8' : rank === 3 ? '#fb923c' : 'var(--primary-light)' }}>
                        {tab === 'global' ? entry.totalScore || 0 : entry.weeklyScore || 0}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>pts</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}

function getMockLeaderboard() {
  return Array.from({ length: 15 }, (_, i) => ({
    userId: i + 1,
    totalScore: 5000 - i * 280,
    weeklyScore: 1200 - i * 60,
    accuracy: 90 - i * 2.5,
    totalQuizzes: 40 - i,
    user: { id: i + 1, fullname: ['Alex Chen', 'Sara Kumar', 'Mike Johnson', 'Priya Patel', 'Jake Wilson', 'Emma Davis', 'Rohan Sharma', 'Lily Zhang', 'Ahmed Hassan', 'Sofia Rossi', 'Carlos Mendez', 'Yuki Tanaka', 'Anna Mueller', 'Sam Brown', 'Zara Ali'][i], streak: 10 - i },
  }));
}
