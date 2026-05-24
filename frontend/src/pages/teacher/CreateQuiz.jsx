// ============================================================
// QuizVerse AI — Create Quiz (Teacher)
// ============================================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';

const emptyQuestion = { text: '', options: { A: '', B: '', C: '', D: '' }, correctAnswer: 'A', explanation: '', topic: '', difficulty: 'medium' };

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', categoryId: '', difficulty: 'medium', isPublic: true, timePerQuestion: 30 });
  const [questions, setQuestions] = useState([{ ...emptyQuestion }]);

  useEffect(() => {
    api.get('/ai/categories').then(({ data }) => { if (data.success) setCategories(data.data); }).catch(() => {});
  }, []);

  const addQuestion = () => setQuestions(qs => [...qs, { ...emptyQuestion }]);
  const removeQuestion = (i) => setQuestions(qs => qs.filter((_, idx) => idx !== i));
  const updateQuestion = (i, field, value) => {
    setQuestions(qs => qs.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  };
  const updateOption = (qi, key, value) => {
    setQuestions(qs => qs.map((q, idx) => idx === qi ? { ...q, options: { ...q.options, [key]: value } } : q));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (questions.some(q => !q.text || !q.options.A || !q.options.B || !q.options.C || !q.options.D)) {
      return toast.error('All questions must have text and 4 options');
    }
    setSaving(true);
    try {
      const payload = {
        ...form, categoryId: parseInt(form.categoryId),
        questions: questions.map(q => ({ ...q, options: [q.options.A, q.options.B, q.options.C, q.options.D] })),
      };
      const { data } = await api.post('/teacher/quizzes', payload);
      if (data.success) { toast.success('Quiz created! 🎉'); navigate('/teacher'); }
      else toast.error(data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create quiz'); }
    finally { setSaving(false); }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Create New Quiz</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quiz Details */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Quiz Details</h2>
            <div className="grid-2" style={{ gap: '1.25rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Quiz Title *</label>
                <input className="form-input" placeholder="e.g., Data Structures Mastery Quiz" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={2} placeholder="Brief description of the quiz" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-input" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select className="form-input" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                  <option value="easy">🟢 Easy</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="hard">🔴 Hard</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Time per Question (seconds)</label>
                <input type="number" className="form-input" min={10} max={120} value={form.timePerQuestion} onChange={e => setForm(f => ({ ...f, timePerQuestion: parseInt(e.target.value) }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Visibility</label>
                <select className="form-input" value={form.isPublic} onChange={e => setForm(f => ({ ...f, isPublic: e.target.value === 'true' }))}>
                  <option value="true">🌍 Public</option>
                  <option value="false">🔒 Private (Invite only)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 700 }}>Questions ({questions.length})</h2>
              <button type="button" onClick={addQuestion} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                <PlusCircle size={16} /> Add Question
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {questions.map((q, qi) => (
                <motion.div key={qi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ padding: '1.5rem', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>Q{qi + 1}</span>
                    {questions.length > 1 && (
                      <button type="button" onClick={() => removeQuestion(qi)} className="btn btn-danger btn-sm" style={{ padding: '0.3rem 0.5rem' }}><Trash2 size={14} /></button>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Question Text *</label>
                      <textarea className="form-input" rows={2} placeholder="Enter your question..." value={q.text} onChange={e => updateQuestion(qi, 'text', e.target.value)} required style={{ resize: 'vertical' }} />
                    </div>
                    <div className="grid-2" style={{ gap: '0.75rem' }}>
                      {['A', 'B', 'C', 'D'].map(key => (
                        <div key={key} className="form-group">
                          <label className="form-label">Option {key} {q.correctAnswer === key && <span style={{ color: 'var(--success)' }}>✓ Correct</span>}</label>
                          <input className="form-input" placeholder={`Option ${key}`} value={q.options[key]} onChange={e => updateOption(qi, key, e.target.value)} required />
                        </div>
                      ))}
                    </div>
                    <div className="grid-2" style={{ gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">Correct Answer *</label>
                        <select className="form-input" value={q.correctAnswer} onChange={e => updateQuestion(qi, 'correctAnswer', e.target.value)}>
                          {['A', 'B', 'C', 'D'].map(k => <option key={k} value={k}>Option {k}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Topic</label>
                        <input className="form-input" placeholder="e.g., Binary Trees" value={q.topic} onChange={e => updateQuestion(qi, 'topic', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Explanation</label>
                      <textarea className="form-input" rows={2} placeholder="Explain why the correct answer is right..." value={q.explanation} onChange={e => updateQuestion(qi, 'explanation', e.target.value)} style={{ resize: 'vertical' }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate('/teacher')} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ gap: '0.5rem', minWidth: 160 }}>
              {saving ? <><Spinner size="sm" color="white" /> Saving...</> : <><Save size={16} /> Save Quiz</>}
            </button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
}
