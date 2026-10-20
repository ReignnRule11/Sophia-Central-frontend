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

type AuthContextValue = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (payload: Partial<User> & { email: string; password: string; firstName?: string; lastName?: string; role?: UserRole }) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => storage.get<User>('user') ?? null);
  const [token, setToken] = useState<string | null>(() => storage.get<string>('access_token') ?? null);
  const [refreshToken, setRefreshToken] = useState<string | null>(() => storage.get<string>('refresh_token') ?? null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    storage.remove('access_token');
    storage.remove('refresh_token');
    storage.remove('user');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const refreshSession = useCallback(async () => {
    if (!refreshToken) {
      throw new Error('No refresh token available.');
    }

    const response = await authApi.refresh(refreshToken);

    if (response.accessToken) {
      storage.set('access_token', response.accessToken);
      setToken(response.accessToken);
    }

    if (response.refreshToken) {
      storage.set('refresh_token', response.refreshToken);
      setRefreshToken(response.refreshToken);
    }

    if (response.user) {
      storage.set('user', response.user);
      setUser(response.user);
    }
  }, [refreshToken]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token && !refreshToken) {
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

    bootstrap();
  }, [clearSession, refreshSession, token, refreshToken]);

  const login = useCallback(
    async (email: string, password: string, role: UserRole = 'student') => {
      const response = await authApi.login({ email, password, role });
      storage.set('access_token', response.accessToken);
      storage.set('refresh_token', response.refreshToken);
      storage.set('user', response.user);
      setToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setUser(response.user);
    },
    []
  );

  const register = useCallback(
    async (payload: Partial<User> & { email: string; password: string; firstName?: string; lastName?: string; role?: UserRole }) => {
      const response = await authApi.register(payload);
      storage.set('access_token', response.accessToken);
      storage.set('refresh_token', response.refreshToken);
      storage.set('user', response.user);
      setToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setUser(response.user);
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      refreshToken,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, token, refreshToken, isLoading, login, logout, refreshSession]
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
