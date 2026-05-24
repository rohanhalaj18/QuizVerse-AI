// ============================================================
// QuizVerse AI — Login Page
// ============================================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';

export default function Login() {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.success) {
        toast.success('Welcome back! 🎉');
        const role = data.user?.role;
        navigate(role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Left Panel — Decorative */}
      <div style={{
        flex: 1, display: 'none', background: 'linear-gradient(135deg, var(--primary), #4F46E5)',
        alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
      }} className="auth-panel">
        <style>{`.auth-panel { display: flex !important; } @media(max-width:768px){.auth-panel{display:none!important;}}`}</style>
        <div className="glow-blob" style={{ width: 500, height: 500, background: 'rgba(255,235,59,0.15)', top: -100, left: -100 }} />
        <div className="glow-blob" style={{ width: 400, height: 400, background: 'rgba(255,64,129,0.15)', bottom: -100, right: -100, animationDelay: '2s' }} />
        <div className="bg-grid" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem' }}>
          <div className="animate-float" style={{ fontSize: 90, marginBottom: '1.5rem', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))' }}>⚡</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: 'white', textShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            Welcome to <span style={{ color: 'var(--secondary)' }}>QuizVerse AI</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: 440, fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto 2rem auto', fontWeight: 500 }}>
            Level up your skills with AI-tailored quizzes, multiplayer game rooms, and detailed stats tracking!
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['🤖 Smart AI Questions', '⚔️ Live Multiplayer', '📊 Deep Analytics', '🏆 XP & Streaks'].map(f => (
              <div key={f} className="badge" style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 420 }}>
          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Quiz<span className="gradient-text">Verse</span> AI</span>
            </Link>
            <button onClick={toggleTheme} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem' }}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Sign In</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Register here</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="login-email" name="email" type="email" className="form-input" placeholder="you@example.com"
                  style={{ paddingLeft: '2.75rem' }} value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="login-password" name="password" type={showPw ? 'text' : 'password'} className="form-input"
                  placeholder="Enter your password" style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  value={form.password} onChange={handleChange} required />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" id="login-submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? <><Spinner size="sm" color="white" /> Signing in...</> : 'Sign In ⚡'}
            </button>
          </form>

          {/* Demo accounts */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textAlign: 'center' }}>Demo Accounts</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { label: '🎓 Student', email: 'student@demo.com' },
                { label: '👨‍🏫 Teacher', email: 'teacher@demo.com' },
                { label: '⚙️ Admin', email: 'admin@demo.com' },
              ].map(d => (
                <button key={d.email} type="button" onClick={() => setForm({ email: d.email, password: 'demo123' })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-light)', fontSize: '0.8rem', textAlign: 'left', padding: '0.2rem 0' }}>
                  {d.label}: {d.email}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
