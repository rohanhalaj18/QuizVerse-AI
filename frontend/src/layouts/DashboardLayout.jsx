// ============================================================
// QuizVerse AI — Dashboard Layout (Sidebar + Navbar)
// ============================================================
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Brain, Trophy, Users, Settings, LogOut,
  Sun, Moon, Menu, X, Zap, Bell, BookOpen, Shield, ChevronRight,
} from 'lucide-react';

const studentNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/quiz/setup', icon: Brain, label: 'AI Quiz' },
  { to: '/quiz/assigned', icon: BookOpen, label: 'Classroom' },
  { to: '/multiplayer', icon: Users, label: 'Multiplayer' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/profile', icon: Settings, label: 'Profile' },
];
const teacherNav = [
  { to: '/teacher', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/teacher/create-quiz', icon: BookOpen, label: 'Create Quiz' },
  { to: '/teacher/reports', icon: Brain, label: 'Reports' },
  { to: '/profile', icon: Settings, label: 'Profile' },
];
const adminNav = [
  { to: '/admin', icon: Shield, label: 'Admin Panel' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/profile', icon: Settings, label: 'Profile' },
];

const getRoleNav = (role) => {
  if (role === 'admin') return adminNav;
  if (role === 'teacher') return teacherNav;
  return studentNav;
};

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const navItems = getRoleNav(user?.role);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const AvatarPlaceholder = ({ size = 36 }) => (
    <div className="avatar-placeholder" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {user?.fullname?.[0]?.toUpperCase() || 'U'}
    </div>
  );

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>⚡</div>
          {sidebarOpen && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>Quiz<span className="gradient-text">Verse</span></span>}
        </Link>
        <button onClick={() => setSidebarOpen(o => !o)} className="btn btn-ghost btn-sm" style={{ padding: '0.3rem', display: 'none' }} id="sidebar-toggle">
          <ChevronRight size={16} style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(item => {
          const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          return (
            <Link key={item.to} to={item.to} className={`sidebar-link ${active ? 'active' : ''}`}
              onClick={() => setMobileSidebar(false)}
              style={{ textDecoration: 'none' }}>
              <item.icon size={20} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span style={{ fontSize: '0.9rem' }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border)' }}>
        {sidebarOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--bg-glass)', borderRadius: 12, border: '1px solid var(--border)' }}>
            {user?.profileImage ? <img src={`http://localhost:5000${user.profileImage}`} alt="avatar" className="avatar avatar-sm" /> : <AvatarPlaceholder size={32} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullname}</div>
              <div className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{user?.role}</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', border: 'none', cursor: 'pointer', color: '#f87171', background: 'none' }}>
          <LogOut size={18} />
          {sidebarOpen && <span style={{ fontSize: '0.9rem' }}>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 68 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 20,
        }}
        className="desktop-sidebar">
        <style>{`.desktop-sidebar { display: flex !important; } @media(max-width:768px){.desktop-sidebar{display:none!important;}}`}</style>
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
            onClick={() => setMobileSidebar(false)}>
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              style={{ width: 240, height: '100%', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
              onClick={e => e.stopPropagation()}>
              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Navbar */}
        <header style={{
          height: 64,
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn btn-ghost btn-sm mobile-menu" style={{ padding: '0.4rem' }}
              onClick={() => setMobileSidebar(true)}>
              <Menu size={20} />
            </button>
            <style>{`.mobile-menu{display:none!important;}@media(max-width:768px){.mobile-menu{display:flex!important;}}`}</style>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {user?.streak > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '0.25rem 0.625rem', borderRadius: 20 }}>
                  <span>🔥</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>{user.streak} day streak</span>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={toggleTheme} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem' }}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn btn-ghost btn-sm" style={{ padding: '0.4rem', position: 'relative' }}>
              <Bell size={18} />
              <div className="notification-dot" />
            </button>
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              {user?.profileImage
                ? <img src={`http://localhost:5000${user.profileImage}`} alt="avatar" className="avatar avatar-sm" />
                : <div className="avatar-placeholder avatar-sm" style={{ fontSize: 14 }}>{user?.fullname?.[0]?.toUpperCase()}</div>
              }
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
