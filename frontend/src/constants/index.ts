import { ComplaintCategory, ComplaintSeverity, ComplaintStatus } from '../types';

export const APP_NAME = 'CivicConnect AI';
export const TAGLINE = 'Your City. Your Voice. Real Action.';
export const APP_DESCRIPTION = 'A smart-city civic grievance platform that allows citizens to report public issues, track complaints, discover nearby problems, and receive transparent updates while municipal staff manage and resolve issues.';

export interface CategoryMeta {
  id: ComplaintCategory;
  name: string;
  iconName: string;
  description: string;
  department: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const CATEGORIES: Record<ComplaintCategory, CategoryMeta> = {
  roads_potholes: {
    id: 'roads_potholes',
    name: 'Roads & Potholes',
    iconName: 'Construction',
    description: 'Road damage, potholes, cave-ins, and uneven asphalt hazards.',
    department: 'Department of Transportation & Roads',
    color: '#D97706',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800/40',
  },
  water_supply: {
    id: 'water_supply',
    name: 'Water Supply',
    iconName: 'Droplets',
    description: 'Pipeline leakage, water shortage, low pressure, or contaminated supply.',
    department: 'Municipal Water & Sewerage Board',
    color: '#0284C7',
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
    borderColor: 'border-sky-200 dark:border-sky-800/40',
  },
  garbage_management: {
    id: 'garbage_management',
    name: 'Garbage Management',
    iconName: 'Trash2',
    description: 'Uncollected refuse, overflowing dumpsters, and illegal waste dumping.',
    department: 'Sanitation & Solid Waste Management',
    color: '#059669',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800/40',
  },
  streetlights: {
    id: 'streetlights',
    name: 'Streetlights',
    iconName: 'Lightbulb',
    description: 'Non-functioning streetlights, damaged poles, and hazardous loose wiring.',
    department: 'Municipal Electrical Department',
    color: '#EAB308',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    borderColor: 'border-yellow-200 dark:border-yellow-800/40',
  },
  drainage: {
    id: 'drainage',
    name: 'Drainage & Sewage',
    iconName: 'Waves',
    description: 'Blocked stormwater drains, sewage overflow, and urban waterlogging.',
    department: 'Stormwater & Drainage Engineering',
    color: '#0D9488',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    borderColor: 'border-teal-200 dark:border-teal-800/40',
  },
  public_infrastructure: {
    id: 'public_infrastructure',
    name: 'Public Infrastructure',
    iconName: 'Building2',
    description: 'Damaged sidewalks, broken park benches, and unsafe public structures.',
    department: 'Public Works & Civil Infrastructure',
    color: '#4F46E5',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderColor: 'border-indigo-200 dark:border-indigo-800/40',
  },
};

export const STATUS_META: Record<ComplaintStatus, { label: string; color: string; badgeClass: string; stepIndex: number }> = {
  filed: {
    label: 'Filed',
    color: '#F59E0B',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    stepIndex: 1,
  },
  acknowledged: {
    label: 'Acknowledged',
    color: '#3B82F6',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    stepIndex: 2,
  },
  in_progress: {
    label: 'In Progress',
    color: '#8B5CF6',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    stepIndex: 3,
  },
  resolved: {
    label: 'Resolved',
    color: '#10B981',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    stepIndex: 4,
  },
  rejected: {
    label: 'Rejected',
    color: '#EF4444',
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    stepIndex: 0,
  },
};

export const SEVERITY_META: Record<ComplaintSeverity, { label: string; badgeClass: string; dotColor: string }> = {
  low: {
    label: 'Low',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    dotColor: '#94A3B8',
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    dotColor: '#3B82F6',
  },
  high: {
    label: 'High',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    dotColor: '#F59E0B',
  },
  critical: {
    label: 'Critical',
    badgeClass: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-800',
    dotColor: '#EF4444',
  },
};

export const DEPARTMENTS = [
  'Department of Transportation & Roads',
  'Municipal Water & Sewerage Board',
  'Sanitation & Solid Waste Management',
  'Municipal Electrical Department',
  'Stormwater & Drainage Engineering',
  'Public Works & Civil Infrastructure',
];

export const DEMO_NOTICE = 'Demonstration Prototype Data — Not Live Municipal Records';
