import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '../api/auth';
import { academicApi } from '../api/academic';
import { setCsrfToken } from '../lib/api/client';
import type { User, UserRole } from '../types';

type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Extract<UserRole, 'student' | 'lecturer'>;
  [key: string]: unknown;
};
type OnboardingPayload = Parameters<typeof academicApi.completeOnboarding>[0];
type AuthContextValue = { user: User | null; isAuthenticated: boolean; isLoading: boolean; login: (email: string, password: string, _role?: UserRole) => Promise<void>; register: (payload: RegisterPayload) => Promise<void>; completeOnboarding: (payload: OnboardingPayload) => Promise<void>; logout: () => Promise<void>; refreshSession: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initializeCsrf = useCallback(async () => { const response = await authApi.csrf(); setCsrfToken(response.csrfToken); }, []);
  const clearSession = useCallback(() => { setUser(null); setCsrfToken(null); }, []);
  const refreshSession = useCallback(async () => { const response = await authApi.me(); setUser(response.user); }, []);
  useEffect(() => { const bootstrap = async () => { try { await initializeCsrf(); await refreshSession(); } catch { clearSession(); } finally { setIsLoading(false); } }; void bootstrap(); }, [clearSession, initializeCsrf, refreshSession]);
  const login = useCallback(async (email: string, password: string, _role?: UserRole) => { await initializeCsrf(); const response = await authApi.login({ email, password }); setUser(response.user); const refreshed = await authApi.csrf(); setCsrfToken(refreshed.csrfToken); }, [initializeCsrf]);
  const register = useCallback(async (payload: RegisterPayload) => { await initializeCsrf(); const response = await authApi.register({ email: payload.email, password: payload.password, firstName: payload.firstName, lastName: payload.lastName, role: payload.role, institution: String(payload.institution ?? ''), faculty: String(payload.faculty ?? ''), department: String(payload.department ?? ''), socialHandle: typeof payload.handle === 'string' ? payload.handle : undefined, socialLinks: payload.socialLinks as { linkedin?: string; instagram?: string; twitter?: string } | undefined }); setUser(response.user); const refreshed = await authApi.csrf(); setCsrfToken(refreshed.csrfToken); }, [initializeCsrf]);
  const completeOnboarding = useCallback(async (payload: OnboardingPayload) => { const response = await academicApi.completeOnboarding(payload); setUser(response.user); }, []);
  const logout = useCallback(async () => { try { await authApi.logout(); } finally { clearSession(); } }, [clearSession]);
  const value = useMemo<AuthContextValue>(() => ({ user, isAuthenticated: Boolean(user), isLoading, login, register, completeOnboarding, logout, refreshSession }), [user, isLoading, login, register, completeOnboarding, logout, refreshSession]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context; }
