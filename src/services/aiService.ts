import { appConfig } from '../config/env';
import { apiRequest } from '../lib/api/client';
import { mockResources, moderationQueue } from '../lib/mock-data';
import type { Resource } from '../types';

export const resourceService = {
  async list(): Promise<Resource[]> {
    if (appConfig.useMockData) {
      return mockResources;
    }

    return apiRequest<Resource[]>('/resources', { method: 'GET' });
  },

  async byId(id: string): Promise<Resource | undefined> {
    if (appConfig.useMockData) {
      return mockResources.find((resource) => resource.id === id);
    }

    return apiRequest<Resource | undefined>(`/resources/${id}`, { method: 'GET' });
  },

  async create(payload: Record<string, unknown>) {
    if (appConfig.useMockData) {
      return { success: true, data: payload };
    }

    return apiRequest('/resources', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async listModeration() {
    if (appConfig.useMockData) {
      return moderationQueue;
    }

    return apiRequest('/moderation/queue', { method: 'GET' });
  },

  async reviewModeration(resourceId: string, status: 'approved' | 'rejected') {
    if (appConfig.useMockData) {
      return { success: true, data: { id: resourceId, status } };
    }

    return apiRequest(`/moderation/resources/${resourceId}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
