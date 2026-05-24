// ============================================================
// QuizVerse AI — Student Assigned Classroom Quizzes
// ============================================================
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, Star, Play, CheckCircle2, ChevronRight, User } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';

const cardVariant = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function AssignedQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const { data } = await api.get('/quiz/assigned');
        if (data.success) {
          setQuizzes(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch assigned quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssigned();
  }, []);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="badge badge-primary" style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
            👨‍🏫 Classroom Tasks
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Teacher Assigned <span className="gradient-text">Quizzes</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Complete tasks assigned by your educators and check your performance reports!</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <Spinner size="xl" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', maxWidth: 600, margin: '2rem auto' }}>
            <div style={{ fontSize: 64, marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>All Caught Up!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>No quizzes have been assigned to you by your teachers currently.</p>
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quizzes.map((quiz, i) => {
              const categoryColor = quiz.category?.color || 'var(--primary)';
              return (
                <motion.div key={quiz.id} variants={cardVariant} initial="hidden" animate="show" transition={{ delay: i * 0.08 }}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    borderLeft: `6px solid ${categoryColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    background: 'var(--bg-card)'
                  }}>
                  {/* Left Side: Quiz details */}
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 24 }}>{quiz.category?.icon || '📚'}</span>
                      <span className="badge" style={{ background: `${categoryColor}15`, color: categoryColor, border: `1px solid ${categoryColor}30` }}>
                        {quiz.category?.name || 'General'}
                      </span>
                      <span className={`badge diff-${quiz.difficulty}`}>
                        {quiz.difficulty}
                      </span>
                      {quiz.isCompleted ? (
                        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      ) : (
                        <span className="badge badge-warning">
                          ⏳ Pending
                        </span>
                      )}
                    </div>
                    
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                      {quiz.title}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                      {quiz.description || 'No description provided.'}
                    </p>

                    <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <User size={14} /> Assigned by: <strong>{quiz.creator?.fullname || 'Teacher'}</strong>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} /> {quiz.totalQuestions} Questions (~{Math.round(quiz.totalTime / 60)} min)
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Action Trigger */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 160 }}>
                    {quiz.isCompleted ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', width: '100%' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attempt Score</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                            {quiz.attemptDetails?.score} pts ({quiz.attemptDetails?.accuracy}%)
                          </div>
                        </div>
                        <button onClick={() => navigate(`/report/${quiz.attemptDetails?.id}`)} className="btn btn-secondary btn-sm" style={{ width: '100%', gap: '0.4rem' }}>
                          View Report 📊
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => navigate(`/quiz/${quiz.id}`)} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem 1.25rem', gap: '0.5rem' }}>
                        <Play size={16} fill="white" /> Start Quiz <ChevronRight size={16} />
                      </button>
                    )}
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
