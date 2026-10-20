import { useContext, createContext, useMemo, useState, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User, UserRole } from '../types';

type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (payload: Partial<User> & { email: string; password: string; firstName?: string; lastName?: string; role?: UserRole }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(authService.getStoredUser()));

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      user,
      login: async (email, password, role = 'student') => {
        const response = await authService.login(email, password, role);
        const nextUser = response.user;
        setUser(nextUser);
        setIsAuthenticated(true);
      },
      register: async (payload) => {
        const response = await authService.register(payload);
        const nextUser = response.user;
        setUser(nextUser);
        setIsAuthenticated(true);
      },
      logout: () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
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
