import { Complaint, User, NotificationItem, AnalyticsSummary } from '../../types';
import { INITIAL_COMPLAINTS, MOCK_USERS, INITIAL_NOTIFICATIONS, INITIAL_ANALYTICS } from './mockData';

const STORAGE_KEYS = {
  COMPLAINTS: 'civic_mock_complaints_v1',
  USERS: 'civic_mock_users_v1',
  CURRENT_USER: 'civic_current_user',
  TOKEN: 'civic_auth_token',
  NOTIFICATIONS: 'civic_mock_notifications_v1',
  THEME: 'civic_theme_preference',
  ANALYTICS: 'civic_mock_analytics_v1',
};

class MockStorageAdapter {
  constructor() {
    this.initializeIfEmpty();
  }

  private initializeIfEmpty() {
    if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(INITIAL_ANALYTICS));
    }
    // Default current user to Elena Rostova (Citizen) for seamless demonstration if none set
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(MOCK_USERS[0]));
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token-citizen-01');
    }
  }

  // --- Users & Session ---
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User, token: string = `mock-jwt-token-${user.id}`) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  getAllUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : MOCK_USERS;
  }

  // --- Complaints ---
  getComplaints(): Complaint[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    return raw ? JSON.parse(raw) : INITIAL_COMPLAINTS;
  }

  getComplaintById(id: string): Complaint | undefined {
    const complaints = this.getComplaints();
    return complaints.find((c) => c.id.toLowerCase() === id.toLowerCase());
  }

  addComplaint(complaint: Complaint): Complaint {
    const complaints = this.getComplaints();
    const updated = [complaint, ...complaints];
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(updated));

    // Also create notification for the user
    this.addNotification({
      id: `notif-${Date.now()}`,
      recipientId: complaint.citizenId,
      title: 'Report Registered & AI Queued',
      message: `Your report "${complaint.title}" has been registered as ${complaint.id}. Municipal teams have been alerted.`,
      type: 'complaint_received',
      complaintId: complaint.id,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return complaint;
  }

  updateComplaint(id: string, patch: Partial<Complaint>): Complaint | null {
    const complaints = this.getComplaints();
    const index = complaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    const existing = complaints[index];
    const updated = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    complaints[index] = updated;
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    return updated;
  }

  toggleUpvote(complaintId: string): Complaint | null {
    const complaint = this.getComplaintById(complaintId);
    if (!complaint) return null;

    const isCurrentlyUpvoted = !!complaint.isUpvoted;
    const newUpvotes = isCurrentlyUpvoted ? Math.max(0, complaint.upvotes - 1) : complaint.upvotes + 1;

    return this.updateComplaint(complaintId, {
      upvotes: newUpvotes,
      isUpvoted: !isCurrentlyUpvoted,
    });
  }

  // --- Notifications ---
  getNotifications(userId?: string): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all: NotificationItem[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    if (!userId) return all;
    return all.filter((n) => n.recipientId === userId);
  }

  addNotification(notification: NotificationItem): NotificationItem {
    const notifications = this.getNotifications();
    const updated = [notification, ...notifications];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return notification;
  }

  markNotificationAsRead(id: string): void {
    const notifications = this.getNotifications();
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  }

  markAllNotificationsAsRead(userId?: string): void {
    const notifications = this.getNotifications();
    const updated = notifications.map((n) => {
      if (!userId || n.recipientId === userId) {
        return { ...n, read: true };
      }
      return n;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  }

  // --- Analytics ---
  getAnalytics(): AnalyticsSummary {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    return raw ? JSON.parse(raw) : INITIAL_ANALYTICS;
  }

  // Reset demo state back to pristine sample data
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(INITIAL_ANALYTICS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(MOCK_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token-citizen-01');
  }
}

export const mockStorage = new MockStorageAdapter();
export default mockStorage;
