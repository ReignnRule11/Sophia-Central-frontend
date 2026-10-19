import { useContext, createContext, useMemo, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { currentUser } from '../lib/mock-data';

type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => void;
  register: (payload: Partial<User> & { email: string; password: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      user,
      login: (email, password) => {
        if (!email || !password) return;

        const nextUser = {
          ...currentUser,
          email,
          name: email.split('@')[0]?.replace('.', ' ') || currentUser.name,
        };

        setUser(nextUser);
        setIsAuthenticated(true);
        localStorage.setItem('sophia-auth', 'true');
        localStorage.setItem('sophia-user', JSON.stringify(nextUser));
      },
      register: (payload) => {
        const nextUser: User = {
          ...currentUser,
          ...payload,
          id: String(Date.now()),
          name: `${payload.firstName || 'Sophia'} ${payload.lastName || 'Student'}`,
          role: 'student',
          avatar: 'ST',
        };

        setUser(nextUser);
        setIsAuthenticated(true);
        localStorage.setItem('sophia-auth', 'true');
        localStorage.setItem('sophia-user', JSON.stringify(nextUser));
      },
      logout: () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('sophia-auth');
        localStorage.removeItem('sophia-user');
      },
    }),
    [isAuthenticated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
}
