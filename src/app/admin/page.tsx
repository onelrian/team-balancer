'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <h1>Access Denied</h1>
          <p>You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.username}! Manage your team and workload distribution.</p>
      </div>
    </div>
  );
}