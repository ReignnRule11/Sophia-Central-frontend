import { apiRequest } from './client';
import type { User } from '../types';

type LoginPayload = {
  email: string;
  password: string;
};

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
  login: async (payload: LoginPayload) => {
    return apiRequest<{ accessToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  register: async (payload: RegisterPayload) => {
    return apiRequest<{ accessToken: string; user: User }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  me: async (token: string) => {
    return apiRequest<{ user: User }>('/auth/me', {
      method: 'GET',
      token,
    });
  },
};
