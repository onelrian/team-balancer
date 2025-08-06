import { useState, useEffect } from 'react';
import { UserClass, User } from '@/types/user';

export function useUserClasses() {
  const [userClasses, setUserClasses] = useState<UserClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserClasses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user-classes');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user classes');
        }
        
        const data: UserClass[] = await response.json();
        setUserClasses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserClasses();
  }, []);

  const createUserClass = async (name: string, description?: string) => {
    try {
      const response = await fetch('/api/user-classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user class');
      }
      
      const newUserClass: UserClass = await response.json();
      
      // Update the user classes list
      setUserClasses(prev => [...prev, newUserClass]);
      
      return newUserClass;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  return { userClasses, loading, error, createUserClass };
}

export function useUserClassAssignments(userClassId: number) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersInClass = async () => {
      try {
(true);
        const response = await fetch(`/api/user-classes/${userClassId}/users`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch users in class');
        }
        
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersInClass();
  }, [userClassId]);

  const assignUserToClass = async (userId: number) => {
    try {
      const response = await fetch(`/api/user-classes/${userClassId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign user to class');
      }
      
      const assignment = await response.json();
      
      // Fetch updated users list
      const usersResponse = await fetch(`/api/user-classes/${userClassId}/users`);
      if (usersResponse.ok) {
        const updatedUsers: User[] = await usersResponse.json();
        setUsers(updatedUsers);
      }
      
      return assignment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const removeUserFromClass = async (userId: number) => {
    try {
      const response = await fetch(`/api/user-classes/${userClassId}/assign`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove user from class');
      }
      
      // Update the users list
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  return { users, loading, error
(true);
        const response = await fetch(`/api/user-classes/${userClassId}/users`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch users in class');
        }
        
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersInClass();
  }, [userClassId]);

  const assignUserToClass = async (userId: number) => {
    try {
      const response = await fetch(`/api/user-classes/${userClassId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign user to class');
      }
      
      const assignment = await response.json();
      
      // Fetch updated users list
      const usersResponse = await fetch(`/api/user-classes/${userClassId}/users`);
      if (usersResponse.ok) {
        const updatedUsers: User[] = await usersResponse.json();
        setUsers(updatedUsers);
      }
      
      return assignment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const removeUserFromClass = async (userId: number) => {
    try {
      const response = await fetch(`/api/user-classes/${userClassId}/assign`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove user from class');
      }
      
      // Update the users list
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

 
        setLoading