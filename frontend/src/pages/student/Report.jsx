// ============================================================
// QuizVerse AI — Quiz Report Page (AI-Powered Analysis)
// ============================================================
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { CheckCircle, XCircle, MinusCircle, Trophy, Clock, Target, Brain } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function Report() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await api.get(`/quiz/attempt/${attemptId}`);
        if (data.success) setAttempt(data.data);
        else { toast.error('Report not found'); navigate('/dashboard'); }
      } catch { toast.error('Failed to load report'); navigate('/dashboard'); }
      finally { setLoading(false); }
    };
    fetchReport();
  }, [attemptId, navigate]);

  const fetchAIFeedback = async () => {
    if (aiFeedback || loadingFeedback) return;
    setLoadingFeedback(true);
    try {
      const { data } = await api.post('/ai/feedback', { attemptId: parseInt(attemptId) });
      if (data.success) setAiFeedback(data.data);
    } catch { toast.error('AI feedback generation failed'); }
    finally { setLoadingFeedback(false); }
  };

  useEffect(() => {
    if (activeTab === 'ai' && !aiFeedback) fetchAIFeedback();
  }, [activeTab]);

  if (loading) return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Spinner size="xl" />
      </div>
    </DashboardLayout>
  );

  const accuracy = attempt?.accuracy || 0;
  const correct = attempt?.correctAnswers || 0;
  const wrong = attempt?.wrongAnswers || 0;
  const skipped = attempt?.skippedAnswers || 0;
  const total = attempt?.totalQuestions || 0;

  const pieData = [
    { name: 'Correct', value: correct, color: '#00E676' },
    { name: 'Wrong', value: wrong, color: '#FF1744' },
    { name: 'Skipped', value: skipped, color: '#8E87B3' },
  ];

  const topicData = Object.entries(attempt?.topicPerformance || {}).map(([topic, data]) => ({
    topic: topic.length > 12 ? topic.slice(0, 12) + '...' : topic,
    accuracy: data.accuracy || 0,
    correct: data.correct || 0,
    total: data.total || 0,
  }));

  const tabs = ['overview', 'questions', 'topics', 'ai'];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Score Hero */}
        <div style={{
          background: accuracy >= 70 ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.08))' :
            accuracy >= 50 ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.08))' :
              'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.08))',
          border: `1px solid ${accuracy >= 70 ? 'rgba(16,185,129,0.3)' : accuracy >= 50 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
          borderRadius: 24, padding: '2.5rem', marginBottom: '2rem',
          display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
              {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '🎯' : accuracy >= 40 ? '📚' : '💪'}
            </div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: accuracy >= 70 ? 'var(--success)' : accuracy >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
              {accuracy}%
            </div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Accuracy</div>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
            {[
              { icon: <CheckCircle size={22} color="#00E676" />, label: 'Correct', value: correct, color: '#00E676' },
              { icon: <XCircle size={22} color="#FF1744" />, label: 'Wrong', value: wrong, color: '#FF1744' },
              { icon: <MinusCircle size={22} color="#8E87B3" />, label: 'Skipped', value: skipped, color: '#8E87B3' },
              { icon: <Trophy size={22} color="#FBC02D" />, label: 'Score', value: attempt?.score || 0, color: '#FBC02D' },
              { icon: <Clock size={22} color="#7C4DFF" />, label: 'Time', value: `${Math.floor((attempt?.timeTaken || 0) / 60)}m ${(attempt?.timeTaken || 0) % 60}s`, color: '#7C4DFF' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <div style={{ marginBottom: '0.3rem', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '0.375rem', borderRadius: 16, border: '1px solid var(--border)', width: 'fit-content' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '0.5rem 1.25rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s', fontFamily: 'var(--font-sans)',
                background: activeTab === tab ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
              }}>
              {tab === 'ai' ? '🤖 AI Feedback' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Score Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                {pieData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{d.name}: <strong style={{ color: d.color }}>{d.value}</strong></span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Performance Summary</h3>
              {[
                { label: 'Quiz Title', value: attempt?.quiz?.title || 'N/A' },
                { label: 'Category', value: attempt?.quiz?.category?.name || 'N/A' },
                { label: 'Difficulty', value: attempt?.quiz?.difficulty || 'N/A' },
                { label: 'Score', value: `${attempt?.score || 0} points` },
                { label: 'Accuracy', value: `${accuracy}%` },
                { label: 'Time Taken', value: `${Math.floor((attempt?.timeTaken || 0) / 60)}m ${(attempt?.timeTaken || 0) % 60}s` },
                { label: 'Questions', value: `${correct} correct / ${total} total` },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: i < 6 ? '1px solid var(--border)' : 'none', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(attempt?.answers || []).map((ans, i) => {
              const q = ans.question;
              const isCorrect = ans.isCorrect;
              const skipped = !ans.selectedAnswer;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card" style={{ padding: '1.5rem', borderColor: isCorrect ? 'rgba(16,185,129,0.3)' : skipped ? 'rgba(100,116,139,0.3)' : 'rgba(239,68,68,0.3)' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      {isCorrect ? <CheckCircle size={20} color="#10b981" /> : skipped ? <MinusCircle size={20} color="#64748b" /> : <XCircle size={20} color="#ef4444" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9rem' }}>Q{i + 1}. {q?.text}</div>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {!skipped && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Your answer: <strong style={{ color: isCorrect ? '#10b981' : '#ef4444' }}>{ans.selectedAnswer}</strong></span>}
                        {!isCorrect && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Correct: <strong style={{ color: '#10b981' }}>{q?.correctAnswer}</strong></span>}
                        {skipped && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Skipped</span>}
                      </div>
                    </div>
                  </div>
                  {q?.explanation && (
                    <div style={{ padding: '0.875rem', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Topics Tab */}
        {activeTab === 'topics' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Topic-wise Performance</h3>
            {topicData.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No topic data available.</p> : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topicData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} />
                    <YAxis type="category" dataKey="topic" stroke="var(--text-muted)" fontSize={11} width={100} />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                    <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                      {topicData.map((entry, i) => <Cell key={i} fill={entry.accuracy >= 70 ? '#00E676' : entry.accuracy >= 50 ? '#FBC02D' : '#FF1744'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                  {topicData.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ width: 120, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.topic}</span>
                      <div style={{ flex: 1, height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 4, width: `${t.accuracy}%`, background: t.accuracy >= 70 ? '#00E676' : t.accuracy >= 50 ? '#FBC02D' : '#FF1744', transition: 'width 0.5s' }} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', width: 40, textAlign: 'right', color: t.accuracy >= 70 ? 'var(--success)' : t.accuracy >= 50 ? 'var(--warning)' : 'var(--danger)' }}>{t.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* AI Feedback Tab */}
        {activeTab === 'ai' && (
          <div>
            {loadingFeedback ? (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <Spinner size="xl" /><p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>🤖 Gemini AI is analyzing your performance...</p>
              </div>
            ) : aiFeedback ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Overall */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '1.5rem', borderColor: 'rgba(99,102,241,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Brain size={24} style={{ color: 'var(--primary)' }} />
                    <h3 style={{ fontWeight: 700 }}>AI Overall Assessment</h3>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>{aiFeedback.overallFeedback}</p>
                  <div style={{ padding: '0.75rem 1rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, fontWeight: 600, color: 'var(--primary-light)', fontSize: '0.875rem' }}>
                    📊 Estimated Rank: {aiFeedback.estimatedRank}
                  </div>
                </motion.div>

                {/* Strengths + Improvements */}
                <div className="grid-2">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--success)' }}>💪 Strengths</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {(aiFeedback.strengths || []).map((s, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--success)' }}>✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--warning)' }}>📈 Areas to Improve</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {(aiFeedback.areasToImprove || []).map((a, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--warning)' }}>→</span> {a}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Next Steps */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🎯 Next Steps</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(aiFeedback.nextSteps || []).map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.875rem' }}>
                        <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Motivational */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 16 }}>
                  <div style={{ fontSize: 48, marginBottom: '0.5rem' }}>🌟</div>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600, fontStyle: 'italic', color: 'var(--primary-light)' }}>{aiFeedback.motivationalMessage}</p>
                </motion.div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <div style={{ fontSize: 64, marginBottom: '1rem' }}>🤖</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>AI Performance Analysis</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Get personalized AI feedback and study recommendations based on your quiz performance.</p>
                <button onClick={fetchAIFeedback} className="btn btn-primary btn-lg">
                  <Brain size={20} /> Generate AI Feedback
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link to="/quiz/setup" className="btn btn-primary">🤖 Take Another Quiz</Link>
          <Link to="/dashboard" className="btn btn-secondary">📊 Dashboard</Link>
          <Link to="/leaderboard" className="btn btn-secondary">🏆 Leaderboard</Link>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
