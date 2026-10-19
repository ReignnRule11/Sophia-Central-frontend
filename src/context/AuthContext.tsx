import { useContext, createContext, useMemo, useState, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { roleUsers } from '../lib/mock-data';

type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => void;
  register: (payload: Partial<User> & { email: string; password: string; firstName?: string; lastName?: string; role?: UserRole }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('sophia-user');
      const storedAuth = localStorage.getItem('sophia-auth');
      return storedAuth === 'true' && stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('sophia-auth') === 'true');

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      user,
      login: (email, password, role = 'student') => {
        if (!email || !password) return;

        const fallback = roleUsers[role] ?? roleUsers.student;
        const nextUser: User = {
          ...fallback,
          email,
          name: email.split('@')[0]?.replace('.', ' ') || fallback.name,
          role,
        };

        setUser(nextUser);
        setIsAuthenticated(true);
        localStorage.setItem('sophia-auth', 'true');
        localStorage.setItem('sophia-user', JSON.stringify(nextUser));
      },
      register: (payload) => {
        const role = payload.role ?? 'student';
        const base = roleUsers[role] ?? roleUsers.student;
        const nextUser: User = {
          ...base,
          ...payload,
          id: String(Date.now()),
          name: `${payload.firstName || base.name.split(' ')[0] || 'Sophia'} ${payload.lastName || base.name.split(' ')[1] || 'Student'}`,
          role,
          avatar: (payload.firstName || 'S').slice(0, 2).toUpperCase(),
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
