import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [step, setStep] = useState(1); // 1=OTP, 2=new password
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPw, setNewPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);

  useEffect(() => { if (!email) navigate('/forgot-password'); }, [email, navigate]);

  const handleOtpChange = (value, idx) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp]; newOtp[idx] = value.slice(-1); setOtp(newOtp);
    if (value && idx < 5) refs.current[idx + 1]?.focus();
  };

  const verifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter 6-digit OTP');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-reset-otp', { email, otp: code });
      if (data.success) { toast.success('OTP verified!'); setStep(2); }
      else toast.error(data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid OTP'); }
    finally { setLoading(false); }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPw.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { email, newPassword: newPw });
      if (data.success) { toast.success('Password reset! Please login.'); navigate('/login'); }
      else toast.error(data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Reset failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ width: '100%', maxWidth: 440, padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: 48, marginBottom: '1rem' }}>{step === 1 ? '🔐' : '🔒'}</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {step === 1 ? 'Enter OTP' : 'New Password'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {step === 1 ? `6-digit OTP sent to ${email}` : 'Create your new secure password'}
          </p>
        </div>

        {step === 1 ? (
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' }}>
              {otp.map((d, idx) => (
                <input key={idx} ref={el => refs.current[idx] = el} className="otp-input"
                  type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={e => handleOtpChange(e.target.value, idx)}
                  onKeyDown={e => e.key === 'Backspace' && !d && idx > 0 && refs.current[idx - 1]?.focus()} />
              ))}
            </div>
            <button onClick={verifyOTP} className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }} disabled={loading}>
              {loading ? <Spinner size="sm" color="white" /> : 'Verify OTP'}
            </button>
          </div>
        ) : (
          <form onSubmit={resetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="Min 6 characters"
                  style={{ paddingRight: '2.75rem' }} value={newPw} onChange={e => setNewPw(e.target.value)} required />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }} disabled={loading}>
              {loading ? <Spinner size="sm" color="white" /> : 'Reset Password 🔒'}
            </button>
          </form>
        )}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>← Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
}
