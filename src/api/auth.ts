import { apiRequest } from './client';
import type { User } from '../types';

type LoginPayload = {
  email: string;
  password: string;
  role: 'student' | 'lecturer' | 'moderator' | 'admin';
};

type RegisterPayload = Partial<User> & {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'student' | 'lecturer' | 'moderator' | 'admin';
};

export const authApi = {
  login: async (payload: LoginPayload) => {
    return apiRequest<{ accessToken: string; refreshToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  register: async (payload: RegisterPayload) => {
    return apiRequest<{ accessToken: string; refreshToken: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  refresh: async (refreshToken: string) => {
    return apiRequest<{ accessToken: string; refreshToken?: string; user?: User }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
};
