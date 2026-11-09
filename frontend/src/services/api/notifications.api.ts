import { NotificationItem } from '../../types';
import mockStorage from '../mock/mockStorage';

export const notificationsApi = {
  // Simulates FastAPI GET /api/v1/notifications
  async getNotifications(userId?: string): Promise<NotificationItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockStorage.getNotifications(userId);
  },

  // Simulates FastAPI PATCH /api/v1/notifications/{id}/read
  async markAsRead(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    mockStorage.markNotificationAsRead(id);
  },

  // Simulates FastAPI POST /api/v1/notifications/mark-all-read
  async markAllAsRead(userId?: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    mockStorage.markAllNotificationsAsRead(userId);
  },
};

export default notificationsApi;
