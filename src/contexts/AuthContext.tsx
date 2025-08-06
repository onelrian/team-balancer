'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface SessionUser {
  id: number;
  discordId: string;
  username: string;
  role: 'admin' | 'user';
}

interface AuthUser {
  id: number;
  discordId: string;
  username: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext useEffect', { status, session });
    if (status === 'loading') {
      console.log('Setting loading to true');
      setLoading(true);
      return;
    }

    console.log('Session status is not loading', { status });
    if (session?.user) {
      console.log('Setting user from session', session.user);
      const sessionUser = session.user as SessionUser;
      setUser({
        id: sessionUser.id,
        discordId: sessionUser.discordId,
        username: sessionUser.username,
        role: sessionUser.role,
      });
    } else {
      console.log('No user in session, setting user to null');
      setUser(null);
    }
    
    console.log('Setting loading to false');
    setLoading(false);
  }, [session, status]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}