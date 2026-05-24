// ============================================================
// QuizVerse AI — Teacher Dashboard
// ============================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, BookOpen, BarChart2, Send, Trash2, Copy } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function TeacherDashboard() {
  const [dashData, setDashData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteQuiz, setInviteQuiz] = useState(null);
  const [inviteEmails, setInviteEmails] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [d, q] = await Promise.all([api.get('/teacher/dashboard'), api.get('/teacher/quizzes')]);
        if (d.data.success) setDashData(d.data.data);
        if (q.data.success) setQuizzes(q.data.data || []);
      } catch { setDashData({ totalQuizzes: 0, totalAttempts: 0, recentQuizzes: [] }); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await api.delete(`/teacher/quizzes/${id}`);
      setQuizzes(qs => qs.filter(q => q.id !== id));
      toast.success('Quiz deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const copyInviteCode = (code) => { navigator.clipboard.writeText(code); toast.success('Invite code copied!'); };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmails.trim()) return toast.error('Please enter at least one email address.');
    setSendingInvite(true);
    try {
      const emails = inviteEmails.split(',').map(em => em.trim()).filter(Boolean);
      const { data } = await api.post('/teacher/invite', { quizId: inviteQuiz.id, emails });
      if (data.success) {
        toast.success('Invites sent successfully! ✉️');
        setInviteQuiz(null);
        setInviteEmails('');
      } else {
        toast.error(data.message || 'Failed to send invites.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send invites.');
    } finally {
      setSendingInvite(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.25rem' }}>Teacher Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Create quizzes and monitor student performance</p>
          </div>
          <Link to="/teacher/create-quiz" className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <PlusCircle size={18} /> Create Quiz
          </Link>
        </div>

        {/* Stats */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          {[
            { icon: '📝', label: 'Total Quizzes', value: dashData?.totalQuizzes || 0, color: '#6366f1' },
            { icon: '🎯', label: 'Total Attempts', value: dashData?.totalAttempts || 0, color: '#10b981' },
            { icon: '👥', label: 'Active Students', value: '—', color: '#f59e0b' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="stat-card">
              <div style={{ fontSize: 32, marginBottom: '0.75rem' }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quiz List */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>My Quizzes</h2>
          {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner size="lg" /></div> : quizzes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: '1rem' }}>📝</div>
              <p>No quizzes yet. <Link to="/teacher/create-quiz" style={{ color: 'var(--primary-light)' }}>Create your first quiz!</Link></p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {quizzes.map((quiz, i) => (
                <motion.div key={quiz.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{quiz.title}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className={`badge diff-${quiz.difficulty}`} style={{ fontSize: '0.7rem' }}>{quiz.difficulty}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{quiz.totalQuestions} questions</span>
                      {quiz.inviteCode && <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--primary-light)', letterSpacing: '0.1em' }}>{quiz.inviteCode}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {quiz.inviteCode && (
                      <button onClick={() => copyInviteCode(quiz.inviteCode)} className="btn btn-ghost btn-sm" title="Copy invite code"><Copy size={14} /></button>
                    )}
                    <button onClick={() => setInviteQuiz(quiz)} className="btn btn-primary btn-sm" style={{ gap: '0.3rem' }}><Send size={14} /> Invite</button>
                    <Link to={`/teacher/quizzes/${quiz.id}/analytics`} className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}><BarChart2 size={14} /> Analytics</Link>
                    <button onClick={() => handleDelete(quiz.id)} className="btn btn-danger btn-sm" style={{ padding: '0.4rem 0.625rem' }}><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Invite Modal */}
        {inviteQuiz && (
          <div className="modal-backdrop" style={{ zIndex: 100 }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="glass-card" style={{ width: '100%', maxWidth: 440, padding: '2.5rem', background: 'var(--bg-card)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ✉️ Invite Students
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Invite students to take <strong style={{ color: 'var(--primary-light)' }}>{inviteQuiz.title}</strong> by entering their email addresses.
              </p>
              <form onSubmit={handleSendInvite}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Email Addresses</label>
                  <textarea className="form-input" rows={3} placeholder="student1@demo.com, student2@demo.com"
                    value={inviteEmails} onChange={e => setInviteEmails(e.target.value)} required
                    style={{ resize: 'none', lineHeight: 1.5 }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Separate multiple email addresses with a comma.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => { setInviteQuiz(null); setInviteEmails(''); }} className="btn btn-secondary btn-sm" disabled={sendingInvite}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={sendingInvite || !inviteEmails.trim()}>
                    {sendingInvite ? 'Sending...' : 'Send Invites ⚡'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
