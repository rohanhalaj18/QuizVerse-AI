// ============================================================
// QuizVerse AI — Multiplayer Lobby
// ============================================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Zap, Copy } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';

const categories = [
  { id: 1, name: 'Programming', icon: '💻' }, { id: 2, name: 'DBMS', icon: '🗄️' },
  { id: 3, name: 'AI/ML', icon: '🤖' }, { id: 4, name: 'Web Dev', icon: '🌐' },
  { id: 5, name: 'Networking', icon: '🔗' }, { id: 9, name: 'Aptitude', icon: '🧮' },
];

export default function MultiplayerLobby() {
  const { user } = useAuth();
  const { emit, connected } = useSocket();
  const navigate = useNavigate();
  const [mode, setMode] = useState('create'); // create | join
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [form, setForm] = useState({ categoryId: 1, difficulty: 'medium', maxPlayers: 4 });

  const handleCreate = () => {
    if (creating) return;
    if (!connected) return toast.error('Socket not connected. Please refresh.');
    setCreating(true);
    emit('room:create', {
      userId: user.id,
      category: categories.find(c => c.id === form.categoryId)?.name,
      categoryId: form.categoryId,
      difficulty: form.difficulty,
      maxPlayers: form.maxPlayers,
    }, (res) => {
      setCreating(false);
      if (res.success) {
        toast.success(`Room ${res.data.roomCode} created!`);
        navigate(`/multiplayer/room/${res.data.roomCode}`);
      } else toast.error(res.message || 'Failed to create room');
    });
  };

  const handleJoin = () => {
    if (joining) return;
    if (!joinCode.trim()) return toast.error('Enter a room code');
    if (!connected) return toast.error('Socket not connected. Please refresh.');
    setJoining(true);
    emit('room:join', { userId: user.id, roomCode: joinCode.toUpperCase() }, (res) => {
      setJoining(false);
      if (res.success) {
        navigate(`/multiplayer/room/${joinCode.toUpperCase()}`);
      } else toast.error(res.message || 'Failed to join room');
    });
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: 56, marginBottom: '0.5rem' }}>⚡</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Real-time <span className="gradient-text">Multiplayer</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Battle friends in live quiz rooms — up to 5 players</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: 20, background: connected ? 'rgba(0,230,118,0.1)' : 'rgba(255,23,68,0.1)', border: `1px solid ${connected ? 'rgba(0,230,118,0.3)' : 'rgba(255,23,68,0.3)'}` }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: connected ? '#00E676' : '#FF1744' }} />
            <span style={{ fontSize: '0.8rem', color: connected ? '#00E676' : '#FF1744' }}>{connected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>

        {/* Tab */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'var(--bg-secondary)', padding: '0.375rem', borderRadius: 16, border: '1px solid var(--border)', width: 'fit-content', margin: '0 auto 2rem' }}>
          {[{ v: 'create', l: '🏠 Create Room' }, { v: 'join', l: '🚪 Join Room' }].map(t => (
            <button key={t.v} onClick={() => setMode(t.v)} style={{ padding: '0.625rem 1.5rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-sans)', transition: 'all 0.2s', background: mode === t.v ? 'var(--gradient-primary)' : 'transparent', color: mode === t.v ? 'white' : 'var(--text-secondary)' }}>
              {t.l}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {mode === 'create' ? (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Create New Room</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {categories.map(cat => (
                      <button key={cat.id} onClick={() => setForm(f => ({ ...f, categoryId: cat.id }))}
                        style={{ padding: '0.625rem', borderRadius: 10, border: '2px solid', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-sans)',
                          borderColor: form.categoryId === cat.id ? 'var(--primary)' : 'var(--border)',
                          background: form.categoryId === cat.id ? 'rgba(99,102,241,0.15)' : 'var(--bg-glass)',
                        }}>
                        <div style={{ fontSize: 22, marginBottom: '0.25rem' }}>{cat.icon}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: form.categoryId === cat.id ? 'var(--primary-light)' : 'var(--text-secondary)' }}>{cat.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['easy', 'medium', 'hard'].map(d => (
                      <button key={d} onClick={() => setForm(f => ({ ...f, difficulty: d }))}
                        style={{ flex: 1, padding: '0.625rem', borderRadius: 10, border: '2px solid', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-sans)', fontSize: '0.875rem', transition: 'all 0.2s',
                          borderColor: form.difficulty === d ? 'var(--primary)' : 'var(--border)',
                          background: form.difficulty === d ? 'rgba(99,102,241,0.15)' : 'var(--bg-glass)',
                          color: form.difficulty === d ? 'var(--primary-light)' : 'var(--text-secondary)',
                        }}>
                        {d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'} {d.charAt(0).toUpperCase() + d.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Select Room Size (Max Players)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '0.5rem' }} className="max-players-grid">
                    <style>{`@media(max-width:540px){.max-players-grid{grid-template-columns:repeat(2, 1fr)!important;}}`}</style>
                    {[
                      { value: 2, emoji: '🥊', label: '1v1 Me Bro!', color: '#00E676' },
                      { value: 3, emoji: '🍕', label: "Three's a Party", color: '#2979FF' },
                      { value: 4, emoji: '🚗', label: 'Squad Goals!', color: '#FBC02D' },
                      { value: 5, emoji: '🔥', label: 'Pure Chaos!', color: '#FF1744' },
                    ].map(p => {
                      const isSelected = form.maxPlayers === p.value;
                      return (
                        <motion.button key={p.value} type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => setForm(f => ({ ...f, maxPlayers: p.value }))}
                          style={{
                            padding: '1rem 0.5rem', borderRadius: 16, border: '2.5px solid', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                            borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                            background: isSelected ? `${p.color}15` : 'var(--bg-glass)',
                            boxShadow: isSelected ? '0 5px 0 var(--primary-dark)' : 'none',
                            transform: isSelected ? 'translateY(-3px)' : 'none',
                          }}>
                          <span style={{ fontSize: 32, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>{p.emoji}</span>
                          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: isSelected ? 'var(--primary)' : 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                            {p.value}
                          </span>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: isSelected ? p.color : 'var(--text-muted)', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                            {p.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                <button onClick={handleCreate} disabled={creating || !connected} className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', gap: '0.5rem' }}>
                  {creating ? <><Spinner size="sm" color="white" /> Creating Room...</> : <><Zap size={18} /> Create Room</>}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: '1rem' }}>🚪</div>
              <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Join a Room</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Enter the 6-character room code from your host</p>
              <input className="form-input" placeholder="ENTER ROOM CODE" value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())} maxLength={6}
                style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.5rem', marginBottom: '1.5rem', textTransform: 'uppercase' }} />
              <button onClick={handleJoin} disabled={joining || !connected || joinCode.length < 4} className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}>
                {joining ? <><Spinner size="sm" color="white" /> Joining...</> : <><Users size={18} /> Join Room</>}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
