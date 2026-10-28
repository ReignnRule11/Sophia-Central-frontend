import { apiRequest } from '../lib/api/client';

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
};

type NotificationsResponse = {
  notifications: NotificationItem[];
  unreadCount: number;
};

export const notificationsApi = {
  list: (limit = 30) => apiRequest<NotificationsResponse>(`/notifications?limit=${limit}`),
  markRead: (id: string) => apiRequest<NotificationItem>(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' }),
  markAllRead: () => apiRequest<{ updated: number }>('/notifications/mark-all-read', { method: 'PATCH' }),
};
