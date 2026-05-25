// ============================================================
// QuizVerse AI — Admin Dashboard
// ============================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Shield, Activity, PlusCircle } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [catForm, setCatForm] = useState({ name: '', icon: '📚', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/analytics').then(({ data }) => {
      if (data.success) setAnalytics(data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreateCat = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/admin/categories', catForm);
      if (data.success) { toast.success('Category created!'); setCatForm({ name: '', icon: '📚', description: '' }); }
      else toast.error(data.message);
    } catch { toast.error('Failed to create category'); }
    finally { setSaving(false); }
  };

  const roleData = (analytics?.roleDistribution || []).map(r => ({ name: r.role, count: parseInt(r.count) }));

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={20} style={{ color: '#f87171' }} />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Admin Control Panel</h1>
        </div>

        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size="xl" /></div> : (
          <>
            {/* Stats */}
            <div className="grid-3" style={{ marginBottom: '2rem' }}>
              {[
                { icon: '👥', label: 'Total Users', value: analytics?.totalUsers || 0, color: '#ff6b00' },
                { icon: '📝', label: 'Total Quizzes', value: analytics?.totalQuizzes || 0, color: '#10b981' },
                { icon: '🎯', label: 'Total Attempts', value: analytics?.totalAttempts || 0, color: '#f59e0b' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
                  <div style={{ fontSize: 32, marginBottom: '0.75rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{s.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start', marginBottom: '1.5rem' }}>
              {/* User Distribution */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>User Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={roleData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                    <Bar dataKey="count" fill="#ff6b00" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Create Category */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PlusCircle size={18} style={{ color: 'var(--primary)' }} /> Create Category</h3>
                <form onSubmit={handleCreateCat} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input className="form-input" placeholder="Category name" value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Icon (emoji)</label>
                    <input className="form-input" placeholder="📚" value={catForm.icon} onChange={e => setCatForm(f => ({ ...f, icon: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <input className="form-input" placeholder="Short description" value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ gap: '0.5rem' }}>
                    {saving ? <Spinner size="sm" color="white" /> : <PlusCircle size={16} />} Create Category
                  </button>
                </form>
              </div>
            </div>

            {/* Recent Users */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontWeight: 700 }}>Recent Users</h3>
                <Link to="/admin/users" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}><Users size={14} /> Manage All</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(analytics?.recentUsers || []).map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem 1rem', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', color: 'white' }}>
                      {u.fullname?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.fullname}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                    <div className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'teacher' ? 'badge-warning' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>{u.role}</div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.isActive ? '#10b981' : '#ef4444' }} />
                  </div>
                ))}
                {(analytics?.recentUsers || []).length === 0 && (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No users found</p>
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
