import { AnalyticsSummary } from '../../types';
import mockStorage from '../mock/mockStorage';
import apiClient from './client';

export const analyticsApi = {
  // FastAPI GET /api/v1/analytics/summary
  async getSummary(): Promise<AnalyticsSummary> {
    try {
      const res = await apiClient.get<AnalyticsSummary>('/analytics/summary');
      if (res.data && res.data.totalComplaints !== undefined) {
        return res.data;
      }
    } catch (error) {
      // Fallback
    }

    const complaints = mockStorage.getComplaints();
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter((c) => c.status === 'filed').length;
    const highPriorityComplaints = complaints.filter((c) => c.severity === 'high' || c.severity === 'critical').length;
    const resolvedComplaints = complaints.filter((c) => c.status === 'resolved').length;
    const inProgressComplaints = complaints.filter((c) => c.status === 'in_progress' || c.status === 'acknowledged').length;

    const base = mockStorage.getAnalytics();
    return {
      ...base,
      totalComplaints,
      pendingComplaints,
      highPriorityComplaints,
      resolvedComplaints,
      inProgressComplaints,
    };
  },
};

export default analyticsApi;
