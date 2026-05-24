// ============================================================
// QuizVerse AI — Quiz Engine (Full-Featured)
// ============================================================
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, ChevronLeft, ChevronRight, Maximize2, Minimize2, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const QUESTION_TIME = 30; // seconds per question
const MAX_TAB_SWITCHES = 3;

export default function QuizEngine() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // questionId -> selectedAnswer
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [totalTimeLeft, setTotalTimeLeft] = useState(600);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const timerRef = useRef(null);
  const totalTimerRef = useRef(null);

  // Load quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quiz/${id}`);
        if (data.success) {
          setQuiz(data.data);
          setQuestions(data.data.questions || []);
          setTotalTimeLeft(data.data.totalTime || 600);
        } else {
          toast.error('Quiz not found');
          navigate('/quiz/setup');
        }
      } catch (err) {
        toast.error('Failed to load quiz');
        navigate('/quiz/setup');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  // Per-question timer
  useEffect(() => {
    if (!quiz || submitting) return;
    setTimeLeft(QUESTION_TIME);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (currentIdx < questions.length - 1) {
            setCurrentIdx(i => i + 1);
          } else {
            handleSubmit();
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIdx, quiz, submitting]);

  // Global timer
  useEffect(() => {
    if (!quiz || submitting) return;
    totalTimerRef.current = setInterval(() => {
      setTotalTimeLeft(t => {
        if (t <= 1) { handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(totalTimerRef.current);
  }, [quiz, submitting]);

  // Anti-cheat: detect tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && quiz && !submitting) {
        setTabSwitches(n => {
          const next = n + 1;
          if (next >= MAX_TAB_SWITCHES) {
            toast.error('Too many tab switches! Auto-submitting...');
            handleSubmit();
          } else {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
          }
          return next;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [quiz, submitting]);

  // Fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(f => !f);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(a => ({ ...a, [questionId]: answer }));
    clearInterval(timerRef.current);
  };

  const toggleReview = (questionId) => {
    setMarkedForReview(s => {
      const next = new Set(s);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    clearInterval(totalTimerRef.current);

    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    try {
      const { data } = await api.post('/quiz/submit', {
        quizId: parseInt(id),
        answers,
        timeTaken,
        mode: 'solo',
      });
      if (data.success) {
        toast.success('Quiz submitted! Generating report...');
        navigate(`/report/${data.data.id}`);
      } else {
        toast.error('Submission failed');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Failed to submit quiz');
      navigate('/dashboard');
    }
  }, [answers, id, submitting, startTime, navigate]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const getQuestionStatus = (q, i) => {
    if (answers[q.id]) return markedForReview.has(q.id) ? 'review-answered' : 'answered';
    if (markedForReview.has(q.id)) return 'review';
    if (i === currentIdx) return 'current';
    return 'unanswered';
  };

  const statusColors = {
    answered: '#00E676',
    'review-answered': '#FBC02D',
    review: '#FBC02D',
    current: '#7C4DFF',
    unanswered: 'var(--border)',
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', flexDirection: 'column', gap: '1rem' }}>
      <Spinner size="xl" />
      <p style={{ color: 'var(--text-secondary)' }}>Loading quiz...</p>
    </div>
  );

  const currentQuestion = questions[currentIdx];
  const timePercent = (timeLeft / QUESTION_TIME) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Anti-cheat warning */}
      <AnimatePresence>
        {showWarning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="anticheat-warning">
            <AlertTriangle size={64} color="white" />
            <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 800 }}>⚠️ WARNING</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', textAlign: 'center' }}>
              Tab switching detected!<br />
              <strong>Warning {tabSwitches}/{MAX_TAB_SWITCHES}</strong> — Quiz will auto-submit after {MAX_TAB_SWITCHES} violations.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
        padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.15rem' }}>{quiz?.title}</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Q {currentIdx + 1} of {questions.length}</span>
            <span className={`badge diff-${quiz?.difficulty}`} style={{ fontSize: '0.65rem' }}>{quiz?.difficulty}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Global timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.875rem', borderRadius: 20, background: totalTimeLeft < 60 ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.1)', border: `1px solid ${totalTimeLeft < 60 ? 'rgba(239,68,68,0.4)' : 'rgba(99,102,241,0.3)'}` }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TOTAL</span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: totalTimeLeft < 60 ? '#f87171' : 'var(--primary-light)', fontFamily: 'monospace' }}>
              {formatTime(totalTimeLeft)}
            </span>
          </div>
          <button onClick={toggleFullscreen} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem' }}>
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button onClick={() => { if (window.confirm('Submit quiz now?')) handleSubmit(); }}
            className="btn btn-danger btn-sm" disabled={submitting}>
            {submitting ? <Spinner size="sm" color="white" /> : 'Submit'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--border)' }}>
        <motion.div style={{ height: '100%', background: 'var(--gradient-primary)' }}
          animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.4 }} />
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden' }}>
        {/* Question Area */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {/* Question timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', width: 56, height: 56 }}>
              <svg width="56" height="56" className="timer-ring">
                <circle cx="28" cy="28" r="24" fill="none" stroke="var(--border)" strokeWidth="4" />
                <circle cx="28" cy="28" r="24" fill="none"
                  stroke={timeLeft <= 10 ? '#FF1744' : timeLeft <= 20 ? '#FBC02D' : '#7C4DFF'}
                  strokeWidth="4" strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - timePercent / 100)}`}
                  className="timer-ring-circle" strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', color: timeLeft <= 10 ? '#f87171' : 'var(--text-primary)' }}>
                {timeLeft}
              </div>
            </div>
            <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div style={{ height: '100%', borderRadius: 3, background: timeLeft <= 10 ? '#ef4444' : timeLeft <= 20 ? '#f59e0b' : 'var(--gradient-primary)' }}
                animate={{ width: `${timePercent}%` }} transition={{ duration: 1 }} />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>
                      {currentIdx + 1}
                    </div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.5 }}>
                      {currentQuestion.text}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {(() => {
                      let parsedOptions = currentQuestion.options;
                      
                      // Safeguard: Unwrap double-stringified JSON if it occurs
                      while (typeof parsedOptions === 'string') {
                        try {
                          parsedOptions = JSON.parse(parsedOptions);
                        } catch (e) {
                          break; // Leave as-is if it's a plain string
                        }
                      }
                      
                      const isArrayOptions = Array.isArray(parsedOptions);
                      
                      if (isArrayOptions) {
                        return parsedOptions.map((option, optIdx) => {
                          const key = String.fromCharCode(65 + optIdx);
                          const label = option;
                          const isSelected = answers[currentQuestion.id] === key;
                          return (
                            <motion.button key={key} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                              onClick={() => handleAnswer(currentQuestion.id, key)}
                              className={`quiz-option ${isSelected ? 'selected' : ''}`}
                              style={{ textAlign: 'left', cursor: 'pointer', border: 'none', background: 'none', font: 'inherit', width: '100%' }}>
                              <span style={{
                                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: '0.875rem',
                                background: isSelected ? 'var(--primary)' : 'var(--bg-glass)',
                                border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                                color: isSelected ? 'white' : 'var(--text-secondary)',
                                transition: 'all 0.2s',
                              }}>{key}</span>
                              <span style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                                {typeof label === 'string' ? label : JSON.stringify(label)}
                              </span>
                            </motion.button>
                          );
                        });
                      } else {
                        return Object.entries(parsedOptions || {}).map(([key, label]) => {
                          const isSelected = answers[currentQuestion.id] === key;
                          return (
                            <motion.button key={key} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                              onClick={() => handleAnswer(currentQuestion.id, key)}
                              className={`quiz-option ${isSelected ? 'selected' : ''}`}
                              style={{ textAlign: 'left', cursor: 'pointer', border: 'none', background: 'none', font: 'inherit', width: '100%' }}>
                              <span style={{
                                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: '0.875rem',
                                background: isSelected ? 'var(--primary)' : 'var(--bg-glass)',
                                border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                                color: isSelected ? 'white' : 'var(--text-secondary)',
                                transition: 'all 0.2s',
                              }}>{key}</span>
                              <span style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                                {typeof label === 'string' ? label : JSON.stringify(label)}
                              </span>
                            </motion.button>
                          );
                        });
                      }
                    })()}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <button onClick={() => toggleReview(currentQuestion.id)}
                    className={`btn btn-sm ${markedForReview.has(currentQuestion.id) ? 'btn-secondary' : 'btn-ghost'}`}
                    style={{ gap: '0.4rem', color: markedForReview.has(currentQuestion.id) ? '#fbbf24' : 'var(--text-muted)', borderColor: markedForReview.has(currentQuestion.id) ? '#fbbf24' : undefined }}>
                    <Flag size={14} /> {markedForReview.has(currentQuestion.id) ? 'Unmark Review' : 'Mark for Review'}
                  </button>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
                      className="btn btn-secondary btn-sm"><ChevronLeft size={16} /> Prev</button>
                    {currentIdx < questions.length - 1
                      ? <button onClick={() => setCurrentIdx(i => i + 1)} className="btn btn-primary btn-sm">Next <ChevronRight size={16} /></button>
                      : <button onClick={() => { if (window.confirm('Submit quiz?')) handleSubmit(); }} className="btn btn-primary btn-sm" disabled={submitting}>
                          {submitting ? <Spinner size="sm" color="white" /> : 'Finish ✅'}
                        </button>
                    }
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Question Palette */}
        <div style={{ width: 240, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', padding: '1.25rem', overflowY: 'auto', flexShrink: 0 }} className="quiz-palette">
          <style>{`@media(max-width:768px){.quiz-palette{display:none!important;}}`}</style>
          <h3 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>QUESTION PALETTE</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {questions.map((q, i) => {
              const status = getQuestionStatus(q, i);
              return (
                <button key={q.id} onClick={() => setCurrentIdx(i)}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: 6, border: '2px solid',
                    borderColor: i === currentIdx ? 'var(--primary)' : statusColors[status],
                    background: statusColors[status] === 'var(--border)' ? 'var(--bg-glass)' : `${statusColors[status]}25`,
                    color: i === currentIdx ? 'var(--primary)' : status === 'unanswered' ? 'var(--text-muted)' : statusColors[status],
                    fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
            {[
              { color: '#00E676', label: 'Answered' },
              { color: '#FBC02D', label: 'Marked for Review' },
              { color: '#7C4DFF', label: 'Current' },
              { color: 'var(--border)', label: 'Not visited' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color, border: `1px solid ${l.color}` }} />
                <span style={{ color: 'var(--text-muted)' }}>{l.label}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.875rem', background: 'var(--bg-glass)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Progress</div>
            <div style={{ fontWeight: 700 }}>{Object.keys(answers).length}/{questions.length} answered</div>
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginTop: '0.5rem' }}>
              <div style={{ height: '100%', borderRadius: 2, background: 'var(--gradient-primary)', width: `${(Object.keys(answers).length / Math.max(questions.length, 1)) * 100}%`, transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
