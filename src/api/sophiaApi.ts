
import { appConfig } from '../config/env';
import { apiRequest } from '../lib/api/client';

export const aiService = {
  async ask(payload: { question: string; resourceId?: string }) {
    if (appConfig.useMockData) {
      return {
        answer:
          'Here is a strong revision plan: review key definitions, solve 10 focused practice questions, and revisit weak topics with lecture notes before your next study block.',
      };
    }

    return apiRequest<{ answer: string }>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export const sophiaApi = {
  ai: aiService,

  moderation: {
    async list() {
      if (appConfig.useMockData) {
        return [];
      }

      throw new Error(
        'Moderation API integration has not been configured yet.',
      );
    },

    async review(
      id: string,
      status: 'approved' | 'rejected',
    ) {
      if (appConfig.useMockData) {
        return { id, status };
      }

      throw new Error(
        'Moderation API integration has not been configured yet.',
      );
    },
  },
};
