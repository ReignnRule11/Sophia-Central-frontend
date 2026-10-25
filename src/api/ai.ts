import { apiRequest } from './client';

export const aiApi = {
  ask: async (payload: { question: string; resourceId?: string }, token?: string | null) => {
    return apiRequest<{ answer: string }>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token ?? null);
  },
};
