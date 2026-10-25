
import { apiRequest } from '../lib/api/client';
import type { User } from '../types';

type LoginPayload = {
  email: string;
  password: string;
};

type SocialLinksPayload = {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  institution?: string;
  faculty?: string;
  department?: string;
  socialHandle?: string;
  socialLinks?: SocialLinksPayload;
};

export const authApi = {
  csrf: () => apiRequest<{ csrfToken: string }>('/auth/csrf'),

  login: (payload: LoginPayload) =>
    apiRequest<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  register: (payload: RegisterPayload) =>
    apiRequest<{ user: User; csrfToken?: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  me: () => apiRequest<{ user: User }>('/auth/me'),

  logout: () =>
    apiRequest<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    }),
};