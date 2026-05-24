// ============================================================
// QuizVerse AI — Auth Context
// ============================================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qv_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('qv_token');
        if (!token) { setLoading(false); return; }
        const { data } = await api.get('/auth/me');
        if (data.success) {
          setUser(data.data);
          localStorage.setItem('qv_user', JSON.stringify(data.data));
        }
      } catch {
        localStorage.removeItem('qv_token');
        localStorage.removeItem('qv_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    return data;
  }, []);

  const verifyOTP = useCallback(async (email, otp) => {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    if (data.success && data.token) {
      localStorage.setItem('qv_token', data.token);
      localStorage.setItem('qv_user', JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success && data.token) {
      localStorage.setItem('qv_token', data.token);
      localStorage.setItem('qv_user', JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    localStorage.removeItem('qv_token');
    localStorage.removeItem('qv_user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('qv_user', JSON.stringify(updatedUser));
  }, []);

  const value = {
    user, loading, isAuthenticated: !!user,
    register, verifyOTP, login, logout, updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
