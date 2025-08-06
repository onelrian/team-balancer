'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAssignments } from '@/hooks/useAssignments';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { assignmentData, loading: assignmentsLoading } = useAssignments();

  console.log('Dashboard render', { authLoading, assignmentsLoading, user, assignmentData });

  if (authLoading || assignmentsLoading) {
    console.log('Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You must be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">TeamBalancer Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome, {user.username}! {user.role === 'admin' && '(Admin)'}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This is the main dashboard where users can view their assignments and set preferences.
          </p>
        </div>
      </div>
    </div>
  );
}