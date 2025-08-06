'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

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
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Admin Functions</h2>
        <ul>
          <li>
            <Link href="/admin/users">User Management</Link> - Manage user roles and permissions
          </li>
          <li>
            <Link href="/admin/user-classes">User Classes Management</Link> - Manage user classes and assign users
          </li>
          <li>
            <Link href="/admin/work-portions">Work Portions Management</Link> - Manage work portions and weights
          </li>
          <li>
            <Link href="/admin/assignments">Assignments Management</Link> - Generate new assignments and view history
          </li>
        </ul>
      </div>
    </div>
  );
}