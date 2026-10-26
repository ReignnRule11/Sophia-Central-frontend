import { apiRequest } from './client';
import type { Resource } from '../types';

export const resourcesApi = {
  list: async (token?: string | null) => {
    return apiRequest<Resource[]>('/resources', { method: 'GET' }, token ?? null);
  },

  byId: async (id: string, token?: string | null) => {
    return apiRequest<Resource>(`/resources/${id}`, { method: 'GET' }, token ?? null);
  },

  create: async (payload: Record<string, unknown>, token?: string | null) => {
    return apiRequest<Record<string, unknown>>('/resources', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token ?? null);
  },
};
