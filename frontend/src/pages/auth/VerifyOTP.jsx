// ============================================================
// QuizVerse AI — OTP Verification Page
// ============================================================
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';

export default function VerifyOTP() {
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const refs = useRef([]);

  useEffect(() => {
    if (!email) { navigate('/register'); return; }
    refs.current[0]?.focus();
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleOtpChange = (value, idx) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value.slice(-1);
    setOtp(newOtp);
    if (value && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      refs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter the 6-digit OTP');
    setLoading(true);
    try {
      const data = await verifyOTP(email, code);
      if (data.success) {
        toast.success('Email verified! Welcome to QuizVerse AI 🎉');
        const role = data.user?.role;
        navigate(role === 'teacher' ? '/teacher' : '/dashboard');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-otp', { email, type: 'register' });
      toast.success('New OTP sent to your email!');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '2rem' }}>
      <div className="glow-blob" style={{ width: 400, height: 400, background: 'rgba(255,235,59,0.15)', top: -100, left: -100 }} />
      <div className="glow-blob" style={{ width: 300, height: 300, background: 'rgba(255,64,129,0.15)', bottom: -100, right: -100, animationDelay: '2s' }} />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="glass-card" style={{ width: '100%', maxWidth: 440, padding: '2.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: 56, marginBottom: '1rem' }}>📧</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Verify Your Email</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            We've sent a 6-digit OTP to<br />
            <strong style={{ color: 'var(--primary-light)' }}>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' }} onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input key={idx} ref={el => refs.current[idx] = el}
                id={`otp-${idx}`}
                className="otp-input"
                type="text" inputMode="numeric" maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(e.target.value, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
              />
            ))}
          </div>

          <button type="submit" id="verify-otp-submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginBottom: '1.5rem' }} disabled={loading}>
            {loading ? <><Spinner size="sm" color="white" /> Verifying...</> : 'Verify OTP ✅'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          {countdown > 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Resend OTP in <strong style={{ color: 'var(--primary-light)' }}>{countdown}s</strong>
            </p>
          ) : (
            <button onClick={handleResend} disabled={resending} className="btn btn-ghost btn-sm" style={{ color: 'var(--primary-light)' }}>
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
          )}
          <div style={{ marginTop: '1rem' }}>
            <Link to="/register" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Back to Register</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
