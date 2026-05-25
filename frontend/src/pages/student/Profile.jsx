// ============================================================
// QuizVerse AI — Profile Page
// ============================================================
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, Lock } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef();
  const [name, setName] = useState(user?.fullname || '');
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [changingPw, setChangingPw] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('fullname', name);
    try {
      const { data } = await api.put('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.success) { updateUser(data.data); toast.success('Avatar updated!'); }
    } catch { toast.error('Failed to upload avatar'); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('fullname', name);
      const { data } = await api.put('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.success) { updateUser(data.data); toast.success('Profile saved!'); }
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) return toast.error("Passwords don't match");
    setChangingPw(true);
    try {
      const { data } = await api.put('/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      if (data.success) { toast.success('Password changed!'); setPasswords({ currentPassword: '', newPassword: '', confirm: '' }); }
      else toast.error(data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setChangingPw(false); }
  };

  const roleColors = { admin: '#ef4444', teacher: '#f59e0b', student: '#ff6b00' };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '2rem' }}>My Profile</h1>
        <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
          {/* Profile Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                {user?.profileImage
                  ? <img src={`http://localhost:5000${user.profileImage}`} alt="avatar" className="avatar-xl avatar" />
                  : <div className="avatar-placeholder" style={{ width: 90, height: 90, fontSize: 36 }}>{user?.fullname?.[0]?.toUpperCase()}</div>
                }
                <button onClick={() => fileRef.current?.click()}
                  style={{ position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: '50%', background: 'var(--gradient-primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Camera size={14} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              </div>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user?.fullname}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{user?.email}</p>
              <div className="badge" style={{ background: `${roleColors[user?.role]}20`, color: roleColors[user?.role], border: `1px solid ${roleColors[user?.role]}40` }}>
                {user?.role?.toUpperCase()}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem' }}>
                {[
                  { label: 'Streak', value: `🔥 ${user?.streak || 0}`, desc: 'days' },
                  { label: 'Points', value: `⭐ ${user?.totalPoints || 0}`, desc: 'total' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '0.875rem', background: 'var(--bg-glass)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{s.value}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🏅 Achievements</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['🏆 First Quiz', '🔥 7-Day Streak', '⚡ Speed Runner', '🎯 Accuracy King'].map(b => (
                  <div key={b} className="badge badge-primary" style={{ padding: '0.4rem 0.875rem' }}>{b}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Edit Forms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Edit Profile */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Edit Profile</h3>
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email (read-only)</label>
                  <input className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Role (read-only)</label>
                  <input className="form-input" value={user?.role || ''} disabled style={{ opacity: 0.6 }} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: 'flex-start', gap: '0.5rem' }}>
                  {saving ? <Spinner size="sm" color="white" /> : <Save size={16} />} Save Changes
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={18} /> Change Password
              </h3>
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: 'Current Password', key: 'currentPassword' },
                  { label: 'New Password', key: 'newPassword' },
                  { label: 'Confirm New Password', key: 'confirm' },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input type="password" className="form-input" value={passwords[f.key]} onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))} required minLength={f.key === 'currentPassword' ? undefined : 6} />
                  </div>
                ))}
                <button type="submit" className="btn btn-secondary" disabled={changingPw} style={{ alignSelf: 'flex-start', gap: '0.5rem' }}>
                  {changingPw ? <Spinner size="sm" /> : <Lock size={16} />} Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
