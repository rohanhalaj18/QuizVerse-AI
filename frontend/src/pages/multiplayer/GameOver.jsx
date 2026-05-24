import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
export default function GameOver() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 80, marginBottom: '1rem' }}>🏆</div>
        <h1 style={{ fontWeight: 900, fontSize: '3rem', marginBottom: '1rem' }} className="gradient-text">Game Over!</h1>
        <button onClick={() => navigate('/multiplayer')} className="btn btn-primary btn-xl">Play Again</button>
      </motion.div>
    </div>
  );
}
