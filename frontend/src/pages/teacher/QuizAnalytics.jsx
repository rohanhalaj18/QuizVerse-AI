// ============================================================
// QuizVerse AI — Teacher Quiz Analytics Dashboard
// ============================================================
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart2, CheckCircle, HelpCircle, AlertTriangle, Play, Clock, Award, Star, TrendingUp, Users, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function QuizAnalytics() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' or 'students'

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/teacher/quizzes/${quizId}/analytics`);
        if (res.data.success) {
          setData(res.data.data);
        } else {
          toast.error(res.data.message || 'Failed to fetch analytics.');
        }
      } catch (err) {
        toast.error('Failed to load quiz analytics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [quizId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <Spinner size="xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (!data || !data.quiz) {
    return (
      <DashboardLayout>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: 500, margin: '2rem auto' }}>
          <div style={{ fontSize: 48, marginBottom: '1.5rem' }}>⚠️</div>
          <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Quiz Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>This quiz does not exist or you do not have permission to view its analytics.</p>
          <Link to="/teacher" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </DashboardLayout>
    );
  }

  const quiz = data.quiz;
  const attempts = data.attempts || [];
  const totalAttempts = data.totalAttempts || 0;
  const avgScore = data.avgScore || 0;
  const avgAccuracy = data.avgAccuracy || 0;
  const passRate = data.passRate || 0;
  const questionStats = data.questionStats || [];

  // Identify hardest and easiest questions
  const validStats = questionStats && questionStats.length > 0;
  const sortedByAccuracy = validStats ? [...questionStats].sort((a, b) => a.accuracy - b.accuracy) : [];
  const hardestQuestion = validStats && totalAttempts > 0 ? sortedByAccuracy[0] : null;
  const easiestQuestion = validStats && totalAttempts > 0 ? sortedByAccuracy[sortedByAccuracy.length - 1] : null;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => navigate('/teacher')} className="btn btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
              <span className="badge badge-primary">📊 Quiz Insights</span>
              <span className={`badge diff-${quiz.difficulty}`}>{quiz.difficulty}</span>
            </div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>{quiz.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Detailed student performance & answer breakdowns</p>
          </div>
        </div>

        {/* Overview Stats Row */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {[
            { label: 'Total Attempts', value: totalAttempts, icon: <Users size={20} />, color: '#7C4DFF', desc: 'Total students completed' },
            { label: 'Avg Accuracy', value: `${avgAccuracy}%`, icon: <Star size={20} />, color: '#00E676', desc: 'Overall correct rate' },
            { label: 'Avg Score', value: `${avgScore} pts`, icon: <Award size={20} />, color: '#FBC02D', desc: 'Points per submission' },
            { label: 'Pass Rate (>=60%)', value: `${passRate}%`, icon: <TrendingUp size={20} />, color: '#FF4081', desc: 'Passing ratio' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                  {s.icon}
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-display)' }}>
                {s.value}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Easiest vs Hardest Callouts */}
        {validStats && totalAttempts > 0 && (
          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            {/* Hardest */}
            {hardestQuestion && (
              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '6px solid var(--danger)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.5rem', borderRadius: 10 }}>
                  <AlertTriangle size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    🚨 Hardest Question (Accuracy: {hardestQuestion.accuracy}%)
                  </div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {hardestQuestion.text}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Only {hardestQuestion.correctResponses} of {hardestQuestion.totalResponses} students answered this correctly.
                  </p>
                </div>
              </div>
            )}

            {/* Easiest */}
            {easiestQuestion && (
              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '6px solid var(--success)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.5rem', borderRadius: 10 }}>
                  <CheckCircle size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    👑 Easiest Question (Accuracy: {easiestQuestion.accuracy}%)
                  </div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {easiestQuestion.text}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {easiestQuestion.correctResponses} of {easiestQuestion.totalResponses} students aced this question.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Selection */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem', gap: '2rem' }}>
          <button onClick={() => setActiveTab('questions')}
            style={{
              padding: '0.75rem 0.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'questions' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'questions' ? '3px solid var(--primary)' : '3px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
            📚 Question Breakdown
          </button>
          <button onClick={() => setActiveTab('students')}
            style={{
              padding: '0.75rem 0.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'students' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'students' ? '3px solid var(--primary)' : '3px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
            👥 Student Submissions ({totalAttempts})
          </button>
        </div>

        {/* Tab 1: Question Breakdown */}
        {activeTab === 'questions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {totalAttempts === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No students have completed this quiz yet. Keep waiting, invites have been sent! ⚡
              </div>
            ) : (
              questionStats.map((q, qIndex) => (
                <div key={q.id} className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div className="badge badge-primary" style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                        {qIndex + 1}
                      </div>
                      <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
                        {q.text}
                      </h3>
                    </div>
                    <span className={`badge ${q.accuracy >= 70 ? 'badge-success' : q.accuracy >= 40 ? 'badge-warning' : 'badge-danger'}`} style={{ fontWeight: 700 }}>
                      {q.accuracy}% Correct
                    </span>
                  </div>

                  {/* Option Choice Frequency Breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    {(() => {
                      let parsedOptions = q.options;
                      
                      // Unwrap double-stringified JSON if it occurs
                      while (typeof parsedOptions === 'string') {
                        try {
                          parsedOptions = JSON.parse(parsedOptions);
                        } catch (e) {
                          break; 
                        }
                      }

                      const isArrayOptions = Array.isArray(parsedOptions);
                      const normalizedOptions = [];

                      if (isArrayOptions) {
                        parsedOptions.forEach((option, optIdx) => {
                          const key = String.fromCharCode(65 + optIdx); // Convert 0,1,2,3 to A,B,C,D
                          normalizedOptions.push({ key, text: option });
                        });
                      } else if (parsedOptions && typeof parsedOptions === 'object') {
                        Object.entries(parsedOptions).forEach(([key, label]) => {
                          normalizedOptions.push({ key, text: label });
                        });
                      }

                      return normalizedOptions.map(({ key, text }) => {
                        const isCorrect = key === q.correctAnswer;
                        const voteCount = q.counts[key] || 0;
                        const totalVotes = q.totalResponses || 0;
                        const percentage = totalVotes ? Math.round((voteCount / totalVotes) * 100) : 0;

                        return (
                          <div key={key} style={{
                            padding: '1rem',
                            background: isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-glass)',
                            border: isCorrect ? '2px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border)',
                            borderRadius: 12,
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            {/* Inner bar percentage background */}
                            <div style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: `${percentage}%`,
                              background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(99, 102, 241, 0.04)',
                              zIndex: 1
                            }} />

                            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', minWidth: 0, flex: 1 }}>
                                <span style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 6,
                                  background: isCorrect ? 'var(--success)' : 'var(--border)',
                                  color: isCorrect ? 'white' : 'var(--text-secondary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: '0.8rem',
                                  flexShrink: 0
                                }}>
                                  {key}
                                </span>
                                <span style={{ fontSize: '0.9rem', fontWeight: isCorrect ? 600 : 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={typeof text === 'string' ? text : JSON.stringify(text)}>
                                  {typeof text === 'string' ? text : JSON.stringify(text)}
                                </span>
                              </div>
                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{voteCount} {voteCount === 1 ? 'vote' : 'votes'}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{percentage}%</div>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Skipped Answer Summary */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>💤 Skipped: <strong>{q.counts.skipped}</strong> students</span>
                    {q.explanation && (
                      <span style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                        💡 <em>Explanation provided</em>
                      </span>
                    )}
                  </div>

                  {q.explanation && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(251, 191, 36, 0.05)', borderLeft: '3px solid var(--warning)', borderRadius: '0 8px 8px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Student Submissions list */}
        {activeTab === 'students' && (
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            {attempts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No submissions yet for this quiz.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', paddingBottom: '0.75rem' }}>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Student Name</th>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Accuracy</th>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Score</th>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Time Taken</th>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Submitted At</th>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((attempt, index) => {
                      const dateStr = new Date(attempt.completedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      const AvatarPlaceholder = () => (
                        <div className="avatar-placeholder avatar-sm" style={{ flexShrink: 0 }}>
                          {attempt.user?.fullname?.[0]?.toUpperCase() || 'S'}
                        </div>
                      );

                      return (
                        <tr key={attempt.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                          <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {attempt.user?.profileImage ? (
                              <img src={`http://localhost:5000${attempt.user.profileImage}`} alt="student" className="avatar avatar-sm" style={{ flexShrink: 0 }} />
                            ) : (
                              <AvatarPlaceholder />
                            )}
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                              {attempt.user?.fullname || 'Unknown Student'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span className={`badge ${attempt.accuracy >= 70 ? 'badge-success' : attempt.accuracy >= 50 ? 'badge-warning' : 'badge-danger'}`} style={{ fontWeight: 700 }}>
                              {attempt.accuracy}%
                            </span>
                          </td>
                          <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                            {attempt.score} pts
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Clock size={12} /> {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            {dateStr}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <button onClick={() => navigate(`/report/${attempt.id}`)} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              Full Report <ChevronRight size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
