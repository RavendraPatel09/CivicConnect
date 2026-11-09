import { AnalyticsSummary } from '../../types';
import mockStorage from '../mock/mockStorage';

export const analyticsApi = {
  // Simulates FastAPI GET /api/v1/analytics/summary
  async getSummary(): Promise<AnalyticsSummary> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const complaints = mockStorage.getComplaints();

    // Dynamically calculate live metrics from current tickets
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
