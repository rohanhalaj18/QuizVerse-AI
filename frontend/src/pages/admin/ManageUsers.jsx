// ============================================================
// QuizVerse AI — Manage Users (Admin)
// ============================================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserX, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit, ...(search && { search }), ...(roleFilter && { role: roleFilter }) });
      const { data } = await api.get(`/admin/users?${params}`);
      if (data.success) { setUsers(data.data || []); setTotal(data.total || 0); }
    } catch { toast.error('Failed to fetch users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(); };

  const handleBan = async (userId, isBanned) => {
    try {
      await api.patch(`/admin/users/${userId}/ban`);
      setUsers(us => us.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
      toast.success(isBanned ? 'User unbanned' : 'User banned');
    } catch { toast.error('Failed to toggle ban'); }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      setUsers(us => us.map(u => u.id === userId ? { ...u, role } : u));
      toast.success('Role updated');
    } catch { toast.error('Failed to update role'); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '2rem' }}>Manage Users</h1>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: 240 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-input" placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
          <select className="form-input" style={{ width: 160 }} value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Table */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size="xl" /></div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 0.875rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '0.875rem', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>
                              {u.fullname?.[0]?.toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.fullname}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.875rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                        <td style={{ padding: '0.875rem' }}>
                          <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.3rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }} disabled={u.role === 'admin'}>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td style={{ padding: '0.875rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.isActive ? '#10b981' : '#ef4444' }} />
                            <span style={{ fontSize: '0.8rem', color: u.isActive ? '#34d399' : '#f87171' }}>{u.isActive ? 'Active' : 'Banned'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.875rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '0.875rem' }}>
                          {u.role !== 'admin' && (
                            <button onClick={() => handleBan(u.id, !u.isActive)}
                              className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-secondary'}`}
                              style={{ gap: '0.3rem' }}>
                              {u.isActive ? <><UserX size={14} /> Ban</> : <><UserCheck size={14} /> Unban</>}
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} users
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-secondary btn-sm"><ChevronLeft size={16} /></button>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-secondary btn-sm"><ChevronRight size={16} /></button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
