
import { storage } from '../lib/storage';
import { authApi } from '../api/auth';
import type { User, UserRole } from '../types';

export const authService = {
  getStoredUser(): User | null {
    return storage.get<User>('user') ?? null;
  },

  async login(
    email: string,
    password: string,
    role: UserRole = 'student',
  ) {
    const response = await authApi.login({ email, password, role });

    storage.set('access_token', response.accessToken);
    storage.set('refresh_token', response.refreshToken);
    storage.set('user', response.user);

    return response;
  },

  async register(
    payload: Partial<User> & {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      role?: UserRole;
    },
  ) {
    const response = await authApi.register(payload);

    storage.set('access_token', response.accessToken);
    storage.set('refresh_token', response.refreshToken);
    storage.set('user', response.user);

    return response;
  },

  logout() {
    storage.remove('access_token');
    storage.remove('refresh_token');
    storage.remove('user');
  },
};
