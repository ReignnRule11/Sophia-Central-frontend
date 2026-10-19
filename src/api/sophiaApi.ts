import type { Resource, UserRole } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function request<T>(endpoint: string, options: RequestInit = {}, fallback?: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...JSON_HEADERS,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed ${response.status}`);
    }

    const json = await response.json();
    return json?.data ?? json ?? fallback;
  } catch {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error('The backend is unreachable right now.');
  }
}

export const sophiaApi = {
  auth: {
    login: async (payload: { email: string; password: string; role?: UserRole }) => {
      return request<{ accessToken: string; user: Record<string, unknown> }>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify(payload) },
        { accessToken: 'demo-token', user: { email: payload.email, role: payload.role || 'student' } }
      );
    },
    register: async (payload: Record<string, unknown>) => {
      return request<{ accessToken: string; user: Record<string, unknown> }>(
        '/auth/register',
        { method: 'POST', body: JSON.stringify(payload) },
        { accessToken: 'demo-token', user: payload }
      );
    },
  },
  resources: {
    list: async (): Promise<Resource[]> => {
      const fallback = (await import('../lib/mock-data')).mockResources;
      return request<Resource[]>('/resources', { method: 'GET', headers: authHeaders() }, fallback);
    },
    create: async (payload: Record<string, unknown>) => {
      return request('/resources', { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) }, { success: true, data: payload });
    },
    byId: async (id: string) => {
      const fallback = (await import('../lib/mock-data')).mockResources.find((resource) => resource.id === id);
      return request(`/resources/${id}`, { method: 'GET', headers: authHeaders() }, fallback);
    },
  },
  moderation: {
    list: async () => {
      const fallback = (await import('../lib/mock-data')).moderationQueue;
      return request('/moderation/queue', { method: 'GET', headers: authHeaders() }, fallback);
    },
    review: async (resourceId: string, status: 'approved' | 'rejected') => {
      return request(`/moderation/resources/${resourceId}/review`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status }) }, { success: true, data: { id: resourceId, status } });
    },
  },
  ai: {
    ask: async (payload: { question: string; resourceId?: string }) => {
      return request<{ answer: string }>(
        '/ai/ask',
        { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) },
        { answer: 'Here is a strong revision plan: review key definitions, solve 10 focused practice questions, and revisit weak topics with lecture notes before your next study block.' }
      );
    },
  },
};

function authHeaders() {
  const token = localStorage.getItem('sophia-auth-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
