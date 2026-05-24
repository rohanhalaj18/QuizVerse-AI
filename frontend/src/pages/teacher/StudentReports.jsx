import DashboardLayout from '../../layouts/DashboardLayout';
import { motion } from 'framer-motion';
export default function StudentReports() {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '2rem' }}>Student Reports</h1>
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 64, marginBottom: '1rem' }}>📊</div>
          <h2 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Coming Soon</h2>
          <p>View detailed analytics for all your quizzes and student performance here.</p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
