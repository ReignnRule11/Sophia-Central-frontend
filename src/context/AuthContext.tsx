
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
import { setCsrfToken } from '../lib/api/client';
import type { User, UserRole } from '../types';

type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  [key: string]: unknown;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, _role?: UserRole) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function optionalText(value: unknown): string | undefined {
  const text = String(value ?? '').trim();
  return text || undefined;
}

function optionalSocialLinks(value: unknown) {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const links = value as Record<string, unknown>;
  const normalized = {
    linkedin: optionalText(links.linkedin),
    instagram: optionalText(links.instagram),
    twitter: optionalText(links.twitter),
  };

  return Object.values(normalized).some(Boolean)
    ? normalized
    : undefined;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeCsrf = useCallback(async () => {
    const response = await authApi.csrf();
    setCsrfToken(response.csrfToken);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setCsrfToken(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const response = await authApi.me();
    setUser(response.user);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initializeCsrf();
        await refreshSession();
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, [clearSession, initializeCsrf, refreshSession]);

  const login = useCallback(
    async (email: string, password: string, _role?: UserRole) => {
      await initializeCsrf();

      const response = await authApi.login({ email, password });
      setUser(response.user);

      const refreshed = await authApi.csrf();
      setCsrfToken(refreshed.csrfToken);
    },
    [initializeCsrf],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await initializeCsrf();

      const response = await authApi.register({
        email: String(payload.email ?? '').trim(),
        password: String(payload.password ?? ''),
        firstName: String(payload.firstName ?? '').trim(),
        lastName: String(payload.lastName ?? '').trim(),
        institution: optionalText(payload.institution),
        faculty: optionalText(payload.faculty),
        department: optionalText(payload.department),
        socialHandle: optionalText(payload.handle),
        socialLinks: optionalSocialLinks(payload.socialLinks),
      });

      setUser(response.user);

      const refreshed = await authApi.csrf();
      setCsrfToken(refreshed.csrfToken);
    },
    [initializeCsrf],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, isLoading, login, register, logout, refreshSession],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}