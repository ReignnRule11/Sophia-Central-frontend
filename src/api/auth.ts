import { apiRequest } from '../lib/api/client';
import type { User } from '../types';

type LoginPayload = { email: string; password: string };
type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  institution?: string;
  department?: string;
  faculty?: string;
};

export const authApi = {
  csrf: () => apiRequest<{ csrfToken: string }>('/auth/csrf'),
  login: (payload: LoginPayload) => apiRequest<{ user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload: RegisterPayload) => apiRequest<{ user: User }>('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => apiRequest<{ user: User }>('/auth/me'),
  logout: () => apiRequest<{ success: boolean }>('/auth/logout', { method: 'POST' }),
};
