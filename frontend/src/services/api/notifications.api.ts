import { NotificationItem } from '../../types';
import mockStorage from '../mock/mockStorage';
import apiClient from './client';

export const notificationsApi = {
  // FastAPI GET /api/v1/notifications
  async getNotifications(userId?: string): Promise<NotificationItem[]> {
    try {
      const res = await apiClient.get<NotificationItem[]>('/notifications');
      if (res.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (error) {
      // Fallback
    }
    return mockStorage.getNotifications(userId);
  },

  // FastAPI PATCH /api/v1/notifications/{id}/read
  async markAsRead(id: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch (error) {
      // Fallback
    }
    mockStorage.markNotificationAsRead(id);
  },

  // FastAPI POST /api/v1/notifications/mark-all-read
  async markAllAsRead(userId?: string): Promise<void> {
    try {
      await apiClient.post('/notifications/mark-all-read');
    } catch (error) {
      // Fallback
    }
    mockStorage.markAllNotificationsAsRead(userId);
  },
};

export default notificationsApi;
