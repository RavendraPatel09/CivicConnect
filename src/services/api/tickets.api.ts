import {
  Complaint,
  ComplaintStatus,
  FilterOptions,
  User,
  TimelineEvent,
  AITriageData,
} from '../../types';
import mockStorage from '../mock/mockStorage';
import { ComplaintFormData, TriageOverrideFormData } from '../../schemas';
import { CATEGORIES } from '../../constants';

export const ticketsApi = {
  // Simulates FastAPI GET /api/v1/tickets?category=...&status=...&search=...
  async getTickets(filters?: FilterOptions): Promise<Complaint[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let list = mockStorage.getComplaints();

    if (!filters) return list;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.location.address.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== 'all') {
      list = list.filter((c) => c.category === filters.category);
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter((c) => c.status === filters.status);
    }

    if (filters.severity && filters.severity !== 'all') {
      list = list.filter((c) => c.severity === filters.severity);
    }

    if (filters.sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filters.sortBy === 'priority') {
      list.sort((a, b) => b.aiTriage.priorityScore - a.aiTriage.priorityScore);
    } else if (filters.sortBy === 'upvotes') {
      list.sort((a, b) => b.upvotes - a.upvotes);
    }

    return list;
  },

  // Simulates FastAPI GET /api/v1/tickets/{id}
  async getTicketById(id: string): Promise<Complaint | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const ticket = mockStorage.getComplaintById(id);
    return ticket || null;
  },

  // Simulates FastAPI POST /api/v1/tickets
  async createTicket(formData: ComplaintFormData, citizen: User): Promise<Complaint> {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const categoryMeta = CATEGORIES[formData.category];
    const newId = `CC-2025-${Math.floor(1000 + Math.random() * 9000)}`;

    // Simulated deterministic AI Triage score calculation based on severity & category
    const severityScoreMap: Record<string, number> = {
      low: 45,
      medium: 65,
      high: 85,
      critical: 95,
    };
    const baseScore = severityScoreMap[formData.severity] || 50;
    const priorityScore = Math.min(99, Math.max(30, baseScore + Math.floor(Math.random() * 8) - 4));

    const aiTriage: AITriageData = {
      recommendedCategory: formData.category,
      recommendedSeverity: formData.severity,
      priorityScore,
      suggestedDepartment: categoryMeta.department,
      summary: `Automated assessment: ${formData.category.replace('_', ' ').toUpperCase()} issue in ${formData.address}. Evaluated risk index ${priorityScore}/100.`,
      acknowledgmentDraft: `Your grievance has been logged and assigned to ${categoryMeta.department}. Initial triage confirmed Priority ${priorityScore}.`,
      confidenceScore: 0.93,
      similarTicketIds: [],
    };

    const initialTimeline: TimelineEvent[] = [
      {
        id: `tl-${Date.now()}-1`,
        timestamp: new Date().toISOString(),
        status: 'filed',
        title: 'Report Filed',
        description: 'Citizen report submitted with digital evidence and location coordinates.',
        actorName: citizen.name,
        actorRole: 'Citizen',
      },
      {
        id: `tl-${Date.now()}-2`,
        timestamp: new Date(Date.now() + 2000).toISOString(),
        status: 'acknowledged',
        title: 'AI Classification & Priority Calculation',
        description: `Automated triage matched issue to ${categoryMeta.department}. Priority assigned: ${priorityScore}/100.`,
        actorName: 'Civic Triage Engine v2.4',
        actorRole: 'AI Assistant',
      },
    ];

    const newComplaint: Complaint = {
      id: newId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      severity: formData.severity,
      status: 'acknowledged',
      location: {
        address: formData.address,
        landmark: formData.landmark,
        lat: formData.lat,
        lng: formData.lng,
        city: 'Metro City',
      },
      images: formData.images.length > 0 ? formData.images : [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
      ],
      citizenId: citizen.id,
      citizenName: citizen.name,
      citizenEmail: citizen.email,
      citizenPhone: citizen.phone,
      assignedDepartment: categoryMeta.department,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiTriage,
      timeline: initialTimeline,
      upvotes: 1,
      isUpvoted: true,
    };

    mockStorage.addComplaint(newComplaint);
    return newComplaint;
  },

  // Simulates FastAPI PATCH /api/v1/tickets/{id}/status
  async updateTicketStatus(
    id: string,
    newStatus: ComplaintStatus,
    actor: User,
    notes?: string
  ): Promise<Complaint | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const ticket = mockStorage.getComplaintById(id);
    if (!ticket) return null;

    const statusTitleMap: Record<ComplaintStatus, string> = {
      filed: 'Status Reset to Filed',
      acknowledged: 'Complaint Acknowledged',
      in_progress: 'Field Crew Dispatched & Work Commenced',
      resolved: 'Work Completed & Inspected',
      rejected: 'Grievance Closed Without Action',
    };

    const newEvent: TimelineEvent = {
      id: `tl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: newStatus,
      title: statusTitleMap[newStatus],
      description:
        notes ||
        `Status transitioned to ${newStatus.replace('_', ' ').toUpperCase()} by ${actor.name} (${actor.role}).`,
      actorName: actor.name,
      actorRole:
        actor.role === 'admin'
          ? 'Administrator'
          : actor.role === 'staff'
          ? 'Municipal Staff'
          : 'Citizen',
    };

    const updatedTimeline = [...ticket.timeline, newEvent];

    const patch: Partial<Complaint> = {
      status: newStatus,
      timeline: updatedTimeline,
      ...(newStatus === 'resolved' ? { resolvedAt: new Date().toISOString() } : {}),
      ...(actor.role === 'staff' && !ticket.assignedStaffId
        ? { assignedStaffId: actor.id, assignedStaffName: actor.name }
        : {}),
    };

    const updated = mockStorage.updateComplaint(id, patch);

    // Trigger notification to citizen
    if (updated) {
      mockStorage.addNotification({
        id: `notif-${Date.now()}`,
        recipientId: updated.citizenId,
        title: `Ticket ${updated.id} Updated`,
        message: `Status has changed to "${newStatus.replace('_', ' ')}": ${notes || statusTitleMap[newStatus]}`,
        type: newStatus === 'resolved' ? 'complaint_resolved' : 'complaint_status_changed',
        complaintId: updated.id,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    return updated;
  },

  // Simulates FastAPI POST /api/v1/tickets/{id}/triage-override
  async overrideAITriage(
    id: string,
    data: TriageOverrideFormData,
    admin: User
  ): Promise<Complaint | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const ticket = mockStorage.getComplaintById(id);
    if (!ticket) return null;

    const updatedTriage: AITriageData = {
      ...ticket.aiTriage,
      recommendedCategory: data.category,
      recommendedSeverity: data.severity,
      priorityScore: data.priorityScore,
      suggestedDepartment: data.assignedDepartment,
      isOverridden: true,
      overriddenBy: admin.name,
      overriddenAt: new Date().toISOString(),
      overrideNotes: data.overrideNotes,
    };

    const overrideEvent: TimelineEvent = {
      id: `tl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: ticket.status,
      title: 'AI Triage Overridden by Administrator',
      description: `Manual adjustment by ${admin.name}: Category set to ${data.category}, Severity to ${data.severity}, Score ${data.priorityScore}. Reason: ${data.overrideNotes}`,
      actorName: admin.name,
      actorRole: 'Administrator',
    };

    const patch: Partial<Complaint> = {
      category: data.category,
      severity: data.severity,
      assignedDepartment: data.assignedDepartment,
      assignedStaffName: data.assignedStaffName || ticket.assignedStaffName,
      aiTriage: updatedTriage,
      timeline: [...ticket.timeline, overrideEvent],
    };

    return mockStorage.updateComplaint(id, patch);
  },

  // Simulates FastAPI POST /api/v1/tickets/{id}/upvote
  async toggleUpvote(id: string): Promise<Complaint | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockStorage.toggleUpvote(id);
  },
};

export default ticketsApi;
