// ============================================================
// QuizVerse AI — Register Page
// ============================================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';

export default function Register() {
  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullname: '', email: '', password: '', role: 'student' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const data = await register(form);
      if (data.success) {
        toast.success('OTP sent to your email! ✉️');
        navigate('/verify-otp', { state: { email: form.email } });
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, display: 'none', background: 'linear-gradient(135deg, var(--primary), #4F46E5)', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }} className="auth-left">
        <style>{`.auth-left{display:flex!important;} @media(max-width:768px){.auth-left{display:none!important;}}`}</style>
        <div className="glow-blob" style={{ width: 500, height: 500, background: 'rgba(255,235,59,0.15)', top: -100, right: -100 }} />
        <div className="bg-grid" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem' }}>
          <div className="animate-float" style={{ fontSize: 90, marginBottom: '1.5rem', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))' }}>🚀</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: 'white', textShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            Join <span style={{ color: 'var(--secondary)' }}>QuizVerse AI</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: 440, fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto 2rem auto', fontWeight: 500 }}>
            Create your free account today and start your AI-powered learning journey!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            {[
              '✨ Unlimited AI Quiz Generation',
              '⚔️ Live Multiplayer Rooms & Battles',
              '📊 Smart Interactive Feedback Reports',
              '🏆 Climb the Global Leaderboard'
            ].map(f => (
              <div key={f} className="badge" style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Quiz<span className="gradient-text">Verse</span> AI</span>
            </Link>
            <button onClick={toggleTheme} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem' }}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Already have one? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-name" name="fullname" type="text" className="form-input" placeholder="John Doe"
                  style={{ paddingLeft: '2.75rem' }} value={form.fullname} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-email" name="email" type="email" className="form-input" placeholder="you@example.com"
                  style={{ paddingLeft: '2.75rem' }} value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-password" name="password" type={showPw ? 'text' : 'password'} className="form-input"
                  placeholder="Min 6 characters" style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  value={form.password} onChange={handleChange} required />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-role">I am a</label>
              <select id="reg-role" name="role" className="form-input" value={form.role} onChange={handleChange}>
                <option value="student">🎓 Student</option>
                <option value="teacher">👨‍🏫 Teacher</option>
              </select>
            </div>

            <button type="submit" id="register-submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? <><Spinner size="sm" color="white" /> Creating Account...</> : 'Create Account 🚀'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
