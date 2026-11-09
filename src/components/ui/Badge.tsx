import React from 'react';
import { ComplaintCategory, ComplaintSeverity, ComplaintStatus } from '../../types';
import { STATUS_META, SEVERITY_META, CATEGORIES } from '../../constants';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    neutral: 'bg-slate-50 text-slate-600 dark:bg-slate-900/60 dark:text-slate-400 border-slate-200 dark:border-slate-800',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded',
    md: 'text-xs px-2.5 py-1 font-medium rounded-md',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ComplaintStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const meta = STATUS_META[status] || STATUS_META.filed;
  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-medium ${meta.badgeClass} ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5 rounded' : 'text-xs px-2.5 py-1 rounded-md'
      }`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: ComplaintSeverity; size?: 'sm' | 'md' }> = ({
  severity,
  size = 'md',
}) => {
  const meta = SEVERITY_META[severity] || SEVERITY_META.medium;
  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-medium ${meta.badgeClass} ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5 rounded' : 'text-xs px-2.5 py-1 rounded-md'
      }`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: meta.dotColor }}
      />
      {meta.label}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: ComplaintCategory; size?: 'sm' | 'md' }> = ({
  category,
  size = 'md',
}) => {
  const meta = CATEGORIES[category] || CATEGORIES.roads_potholes;
  return (
    <span
      className={`inline-flex items-center gap-1 border font-medium ${meta.bgColor} ${meta.borderColor} ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5 rounded' : 'text-xs px-2.5 py-1 rounded-md'
      }`}
      style={{ color: meta.color }}
    >
      {meta.name}
    </span>
  );
};

export default Badge;
