import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '../types';
import { currentUser } from '../lib/mock-data';

type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem('sophia-auth');
    if (storedAuth === 'true') {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      user,
      login: (email: string, password: string) => {
        if (email && password) {
          setUser(currentUser);
          setIsAuthenticated(true);
          localStorage.setItem('sophia-auth', 'true');
        }
      },
      logout: () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('sophia-auth');
      }
    }),
    [isAuthenticated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
