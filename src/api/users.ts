import { apiRequest } from '../lib/api/client';
import type { User } from '../types';

export const usersApi = {
  list: () => apiRequest<User[]>('/users'),
};
