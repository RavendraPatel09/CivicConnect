export type UserRole = 'citizen' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
  joinedDate: string;
}

export type ComplaintCategory =
  | 'roads_potholes'
  | 'water_supply'
  | 'garbage_management'
  | 'streetlights'
  | 'drainage'
  | 'public_infrastructure';

export type ComplaintSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ComplaintStatus =
  | 'filed'
  | 'acknowledged'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export interface ComplaintLocation {
  address: string;
  lat: number;
  lng: number;
  city?: string;
  landmark?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  actorName: string;
  actorRole: 'System' | 'AI Assistant' | 'Municipal Staff' | 'Citizen' | 'Administrator';
}

export interface AITriageData {
  recommendedCategory: ComplaintCategory;
  recommendedSeverity: ComplaintSeverity;
  priorityScore: number; // 0 to 100
  suggestedDepartment: string;
  summary: string;
  acknowledgmentDraft: string;
  confidenceScore: number; // 0 to 1
  similarTicketIds: string[];
  isOverridden?: boolean;
  overriddenBy?: string;
  overriddenAt?: string;
  overrideNotes?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  location: ComplaintLocation;
  images: string[];
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone?: string;
  assignedDepartment: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  aiTriage: AITriageData;
  timeline: TimelineEvent[];
  upvotes: number;
  isUpvoted?: boolean;
}

export type NotificationType =
  | 'complaint_received'
  | 'ai_triage_completed'
  | 'staff_assigned'
  | 'complaint_status_changed'
  | 'complaint_resolved';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  complaintId?: string;
  read: boolean;
  createdAt: string;
  recipientId: string;
}

export interface DepartmentMetric {
  department: string;
  totalAssigned: number;
  resolved: number;
  avgResolutionHours: number;
  satisfactionRate: number;
}

export interface AnalyticsSummary {
  totalComplaints: number;
  pendingComplaints: number;
  highPriorityComplaints: number;
  resolvedComplaints: number;
  inProgressComplaints: number;
  avgResolutionDays: number;
  citizenSatisfactionRate: number;
  categoryDistribution: {
    category: ComplaintCategory;
    count: number;
    resolved: number;
  }[];
  monthlyTrends: {
    month: string;
    filed: number;
    resolved: number;
  }[];
  priorityDistribution: {
    priority: ComplaintSeverity;
    count: number;
  }[];
  departmentPerformance: DepartmentMetric[];
}

export interface FilterOptions {
  search?: string;
  category?: ComplaintCategory | 'all';
  status?: ComplaintStatus | 'all';
  severity?: ComplaintSeverity | 'all';
  dateRange?: string;
  sortBy?: 'newest' | 'oldest' | 'priority' | 'upvotes';
}
