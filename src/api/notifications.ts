import { apiRequest } from './client';

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
  list: (limit = 20, unreadOnly = false) =>
    apiRequest<NotificationsResponse>(`/notifications?limit=${limit}&unreadOnly=${unreadOnly}`, { method: 'GET' }),
  markRead: (id: string) => apiRequest<NotificationItem>(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' }),
  markAllRead: () => apiRequest<{ success?: boolean }>('/notifications/mark-all-read', { method: 'PATCH' }),
};
