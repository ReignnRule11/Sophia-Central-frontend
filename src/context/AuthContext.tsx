import { aiService } from '../services/aiService';
import { authService, resourceService } from '../services/authService';
import type { Resource, UserRole } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const sophiaApi = {
  auth: {
    login: async (payload: { email: string; password: string; role?: UserRole }) => {
      return authService.login(payload.email, payload.password, payload.role || 'student');
    },
    register: async (payload: Record<string, unknown>) => {
      return authService.register(payload as Partial<Record<string, unknown>> & { email: string; password: string; firstName?: string; lastName?: string; role?: UserRole });
    },
    logout: () => authService.logout(),
  },
  resources: {
    list: async (): Promise<Resource[]> => resourceService.list(),
    create: async (payload: Record<string, unknown>) => resourceService.create(payload),
    byId: async (id: string) => resourceService.byId(id),
  },
  moderation: {
    list: async () => resourceService.listModeration(),
    review: async (resourceId: string, status: 'approved' | 'rejected') => resourceService.reviewModeration(resourceId, status),
  },
  ai: {
    ask: async (payload: { question: string; resourceId?: string }) => aiService.ask(payload),
  },
};

export const apiBaseUrl = API_BASE_URL;
