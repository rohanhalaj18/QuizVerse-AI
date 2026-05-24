// ============================================================
// QuizVerse AI — App Root with Routing
// ============================================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import Spinner from './components/ui/Spinner';

// Lazy-loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyOTP = lazy(() => import('./pages/auth/VerifyOTP'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Dashboard = lazy(() => import('./pages/student/Dashboard'));
const QuizSetup = lazy(() => import('./pages/student/QuizSetup'));
const AssignedQuizzes = lazy(() => import('./pages/student/AssignedQuizzes'));
const QuizEngine = lazy(() => import('./pages/student/QuizEngine'));
const Report = lazy(() => import('./pages/student/Report'));
const Leaderboard = lazy(() => import('./pages/student/Leaderboard'));
const Profile = lazy(() => import('./pages/student/Profile'));
const MultiplayerLobby = lazy(() => import('./pages/multiplayer/Lobby'));
const MultiplayerRoom = lazy(() => import('./pages/multiplayer/Room'));
const GameOver = lazy(() => import('./pages/multiplayer/GameOver'));
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const CreateQuiz = lazy(() => import('./pages/teacher/CreateQuiz'));
const QuizAnalytics = lazy(() => import('./pages/teacher/QuizAnalytics'));
const StudentReports = lazy(() => import('./pages/teacher/StudentReports'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));

// ── Route Guards ──────────────────────────────────────────────
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
    <Spinner size="lg" />
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />

        {/* Student */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/quiz/setup" element={<ProtectedRoute><QuizSetup /></ProtectedRoute>} />
        <Route path="/quiz/assigned" element={<ProtectedRoute><AssignedQuizzes /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute><QuizEngine /></ProtectedRoute>} />
        <Route path="/report/:attemptId" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Multiplayer */}
        <Route path="/multiplayer" element={<ProtectedRoute><MultiplayerLobby /></ProtectedRoute>} />
        <Route path="/multiplayer/room/:code" element={<ProtectedRoute><MultiplayerRoom /></ProtectedRoute>} />
        <Route path="/multiplayer/gameover" element={<ProtectedRoute><GameOver /></ProtectedRoute>} />

        {/* Teacher */}
        <Route path="/teacher" element={<ProtectedRoute roles={['teacher', 'admin']}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/create-quiz" element={<ProtectedRoute roles={['teacher', 'admin']}><CreateQuiz /></ProtectedRoute>} />
        <Route path="/teacher/quizzes/:quizId/analytics" element={<ProtectedRoute roles={['teacher', 'admin']}><QuizAnalytics /></ProtectedRoute>} />
        <Route path="/teacher/reports" element={<ProtectedRoute roles={['teacher', 'admin']}><StudentReports /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
