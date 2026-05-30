// ============================================================
// QuizVerse AI — Quiz Setup Page (AI Quiz Generator)
// ============================================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, Sparkles, Zap } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const difficulties = [
  { value: 'easy', label: 'Easy', desc: 'Basic concepts & fundamentals', emoji: '🟢', color: '#00E676' },
  { value: 'medium', label: 'Medium', desc: 'Application & problem solving', emoji: '🟡', color: '#FBC02D' },
  { value: 'hard', label: 'Hard', desc: 'Advanced & tricky questions', emoji: '🔴', color: '#FF1744' },
];

export default function QuizSetup() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    categoryId: '',
    difficulty: 'medium',
    topic: '',
    count: 10,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/ai/categories');
        if (data.success) setCategories(data.data);
      } catch {
        // Fallback categories
        setCategories([
          { id: 1, name: 'Programming', icon: '💻', color: '#7C4DFF' },
          { id: 2, name: 'DBMS', icon: '🗄️', color: '#FF4081' },
          { id: 3, name: 'AI/ML', icon: '🤖', color: '#FBC02D' },
          { id: 4, name: 'Web Development', icon: '🌐', color: '#00E676' },
          { id: 5, name: 'Cyber Security', icon: '🔐', color: '#FF1744' },
          { id: 6, name: 'Cloud Computing', icon: '☁️', color: '#2979FF' },
          { id: 7, name: 'Networking', icon: '🔗', color: '#14B8A6' },
          { id: 8, name: 'Operating System', icon: '⚙️', color: '#F97316' },
          { id: 9, name: 'Aptitude', icon: '🧮', color: '#06B6D4' },
          { id: 10, name: 'Mathematics', icon: '📐', color: '#A855F7' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (form.categoryId) {
      api.get(`/ai/topics/${form.categoryId}`).then(({ data }) => {
        if (data.success) setTopics(data.data);
      }).catch(() => setTopics([]));
    }
  }, [form.categoryId]);

  const handleGenerate = async () => {
    if (generating) return;
    if (!form.categoryId) return toast.error('Please select a category');
    setGenerating(true);
    try {
      const { data } = await api.post('/ai/generate-quiz', {
        categoryId: parseInt(form.categoryId),
        difficulty: form.difficulty,
        topic: form.topic,
        count: form.count,
      });
      if (data.success) {
        toast.success('AI quiz generated! Starting now... ⚡');
        navigate(`/quiz/${data.data.id}`);
      } else {
        toast.error(data.message || 'Failed to generate quiz');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed. Check your Gemini API key.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="badge badge-primary" style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
            🤖 Powered by Gemini AI
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Generate AI <span className="gradient-text">Quiz</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Choose your category, difficulty, and topic — Gemini AI does the rest!</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }} className="quiz-setup-grid">
          <style>{`@media(max-width:900px){.quiz-setup-grid{grid-template-columns:1fr!important;}}`}</style>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Step 1: Category */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>1</span>
                Select Category
              </h2>
              {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Spinner /></div> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  {categories.map(cat => (
                    <motion.button key={cat.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setForm(f => ({ ...f, categoryId: cat.id, topic: '' }))}
                      style={{
                        padding: '1rem', borderRadius: 12, border: '2px solid',
                        borderColor: form.categoryId === cat.id ? cat.color : 'var(--border)',
                        background: form.categoryId === cat.id ? `${cat.color}15` : 'var(--bg-glass)',
                        cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                      }}>
                      <div style={{ fontSize: 28, marginBottom: '0.4rem' }}>{cat.icon}</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: form.categoryId === cat.id ? cat.color : 'var(--text-secondary)' }}>{cat.name}</div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Difficulty */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>2</span>
                Select Difficulty
              </h2>
              <div className="grid-3" style={{ gap: '1rem' }}>
                {difficulties.map(d => (
                  <motion.button key={d.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setForm(f => ({ ...f, difficulty: d.value }))}
                    style={{
                      padding: '1.25rem', borderRadius: 12, border: '2px solid',
                      borderColor: form.difficulty === d.value ? d.color : 'var(--border)',
                      background: form.difficulty === d.value ? `${d.color}12` : 'var(--bg-glass)',
                      cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                    }}>
                    <div style={{ fontSize: 28, marginBottom: '0.4rem' }}>{d.emoji}</div>
                    <div style={{ fontWeight: 700, color: form.difficulty === d.value ? d.color : 'var(--text-primary)', marginBottom: '0.25rem' }}>{d.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{d.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Step 3: Topic */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>3</span>
                Specify Topic <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem' }}>(optional)</span>
              </h2>
              <input className="form-input" placeholder="e.g., Binary Trees, SQL Joins, Neural Networks..."
                value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} style={{ width: '100%', marginBottom: '1rem' }} />
              {topics.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>AI-suggested topics:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {topics.slice(0, 8).map(t => (
                      <button key={t} onClick={() => setForm(f => ({ ...f, topic: t }))}
                        style={{ padding: '0.3rem 0.75rem', borderRadius: 20, border: '1px solid', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s',
                          borderColor: form.topic === t ? 'var(--primary)' : 'var(--border)',
                          background: form.topic === t ? 'rgba(99,102,241,0.15)' : 'var(--bg-glass)',
                          color: form.topic === t ? 'var(--primary-light)' : 'var(--text-secondary)',
                        }}>{t}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary Card */}
          <motion.div className="glass-card" style={{ padding: '1.75rem', position: 'sticky', top: '1.5rem' }}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Quiz Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Category', value: categories.find(c => c.id === form.categoryId)?.name || 'Not selected', icon: categories.find(c => c.id === form.categoryId)?.icon || '📚' },
                { label: 'Difficulty', value: form.difficulty.charAt(0).toUpperCase() + form.difficulty.slice(1), icon: difficulties.find(d => d.value === form.difficulty)?.emoji || '🎯' },
                { label: 'Topic', value: form.topic || 'General', icon: '🎯' },
                { label: 'Questions', value: '10 MCQs', icon: '📝' },
                { label: 'Time Limit', value: form.difficulty === 'hard' ? '~7.5 min' : form.difficulty === 'medium' ? '~5.8 min' : '~4.2 min', icon: '⏱️' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-glass)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.icon} {item.label}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', maxWidth: '50%', textAlign: 'right', wordBreak: 'break-word' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <AnimatePresence>
              {generating && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '1.5rem', marginBottom: '1rem' }}>
                  <Spinner size="lg" />
                  <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '0.875rem' }}>
                    🤖 Gemini AI is crafting your quiz...<br />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>This may take 10-15 seconds</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button onClick={handleGenerate} disabled={!form.categoryId || generating}
              className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', gap: '0.75rem' }}>
              {generating ? <><Spinner size="sm" color="white" /> Generating...</> : (
                <><Sparkles size={18} /> Generate AI Quiz</>
              )}
            </button>
            {!form.categoryId && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
                Select a category to continue
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
