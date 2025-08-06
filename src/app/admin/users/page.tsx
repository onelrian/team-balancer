'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';

export default function UserManagement() {
  const { users, loading, error, updateUserRole } = useUsers();
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const handleRoleChange = async (userId: number, newRole: 'admin' | 'user') => {
    try {
      setUpdatingUserId(userId);
      await updateUserRole(userId, newRole);
    } catch (err) {
      console.error('Failed to update user role:', err);
      alert('Failed to update user role. Please try again.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return (
      <div>
        <h1>User Management</h1>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>User Management</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>User Management</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.role}
            <select 
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'user')}
              disabled={updatingUserId === user.id}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {updatingUserId === user.id && <span> Updating...</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}