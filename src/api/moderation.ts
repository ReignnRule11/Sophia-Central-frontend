import { apiRequest } from './client';

export const moderationApi = {
  queue: async (token?: string | null) => {
    return apiRequest<any[]>('/moderation/queue', { method: 'GET' }, token ?? null);
  },

  review: async (resourceId: string, status: 'approved' | 'rejected', token?: string | null) => {
    return apiRequest<{ success: true; data: { id: string; status: 'approved' | 'rejected' } }>(
      `/moderation/resources/${resourceId}/review`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
      token ?? null
    );
  },
};
