import { appConfig } from '../config/env';
import { apiRequest } from '../lib/api/client';
import { resourcesApi } from './resources';
import { moderationApi } from './moderation';

type AiChatResponse = { sessionId?: string; assistantMessage?: string; pointsUsed?: number; balanceRemaining?: number; error?: string; required?: number; balance?: number };
type Notification = { id: string; type: string; title: string; message: string; link?: string | null; isRead: boolean; createdAt: string };

export const aiService = {
  async ask(payload: { question: string; resourceId?: string; sessionId?: string }) {
    if (appConfig.useMockData) return { answer: 'Here is a strong revision plan: review key definitions, solve 10 focused practice questions, and revisit weak topics with lecture notes before your next study block.' };
    const response = await apiRequest<AiChatResponse>('/ai/chat', { method: 'POST', body: JSON.stringify(payload) });
    if (response.error) throw new Error(response.error === 'Insufficient Wisdom Points' ? `You need ${response.required ?? 2} Wisdom Points to use Sophia AI. Your current balance is ${response.balance ?? 0}.` : response.error);
    if (!response.assistantMessage) throw new Error('Sophia AI returned an empty response.');
    return { answer: response.assistantMessage, sessionId: response.sessionId, pointsUsed: response.pointsUsed, balanceRemaining: response.balanceRemaining };
  },
};

export const notificationsApi = {
  list: async (unreadOnly = false) => apiRequest<Notification[]>(`/notifications?limit=50${unreadOnly ? '&unreadOnly=true' : ''}`),
  markRead: async (id: string) => apiRequest<Notification>(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' }),
  markAllRead: async () => apiRequest<{ updated?: number }>('/notifications/mark-all-read', { method: 'PATCH' }),
};

export const sophiaApi = { ai: aiService, resources: resourcesApi, notifications: notificationsApi, moderation: { list: moderationApi.queue, review: moderationApi.review } };
