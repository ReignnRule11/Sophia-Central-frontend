import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '../api/auth';
import { storage } from '../lib/storage';
import type { User, UserRole } from '../types';

type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  institution?: string;
  department?: string;
  faculty?: string;
  [key: string]: unknown;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, _role?: UserRole) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => storage.get<User>('user') ?? null);
  const [token, setToken] = useState<string | null>(() => storage.get<string>('access_token') ?? null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    storage.remove('access_token');
    storage.remove('user');
    setToken(null);
    setUser(null);
  }, []);

  const logout = useCallback(() => clearSession(), [clearSession]);

  const refreshSession = useCallback(async () => {
    if (!token) throw new Error('No access token available.');
    const response = await authApi.me(token);
    storage.set('user', response.user);
    setUser(response.user);
  }, [token]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        await refreshSession();
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };
    void bootstrap();
  }, [clearSession, refreshSession, token]);

  const login = useCallback(async (email: string, password: string, _role?: UserRole) => {
    const response = await authApi.login({ email, password });
    storage.set('access_token', response.accessToken);
    storage.set('user', response.user);
    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await authApi.register({
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
      institution: typeof payload.institution === 'string' ? payload.institution : undefined,
      department: typeof payload.department === 'string' ? payload.department : undefined,
      faculty: typeof payload.faculty === 'string' ? payload.faculty : undefined,
    });
    storage.set('access_token', response.accessToken);
    storage.set('user', response.user);
    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isAuthenticated: Boolean(token && user), isLoading, login, register, logout, refreshSession }),
    [user, token, isLoading, login, register, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
