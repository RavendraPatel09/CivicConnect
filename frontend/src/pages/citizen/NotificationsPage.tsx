import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationType } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import {
  Bell,
  CheckCheck,
  UserCheck,
  Clock,
  CheckCircle2,
  FileText,
  Bot,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');

  const filteredNotifications = useMemo(() => {
    if (filterType === 'all') return notifications;
    return notifications.filter((n) => n.type === filterType);
  }, [notifications, filterType]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'complaint_received':
        return <FileText className="w-4 h-4 text-[#66736F]" />;
      case 'ai_triage_completed':
        return <Bot className="w-4 h-4 text-[#183B3A] dark:text-[#3B8278]" />;
      case 'staff_assigned':
        return <UserCheck className="w-4 h-4 text-[#2563EB]" />;
      case 'complaint_status_changed':
        return <Clock className="w-4 h-4 text-[#B7791F]" />;
      case 'complaint_resolved':
        return <CheckCircle2 className="w-4 h-4 text-[#23845B]" />;
    }
  };

  const handleNotificationClick = async (notifId: string, complaintId?: string) => {
    await markAsRead(notifId);
    if (complaintId) {
      navigate(`/tickets/${complaintId}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E8E4] dark:border-[#22344D]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400 mb-0.5">
            Communications Desk
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202B2A] dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#183B3A] dark:text-[#3B8278]" />
            Municipal Notification Center
          </h1>
          <p className="text-xs text-[#66736F] dark:text-slate-400 mt-0.5">
            Real-time status updates, engineering team assignments, and resolution audits.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            Mark All Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
            filterType === 'all'
              ? 'bg-[#183B3A] text-white dark:bg-[#2563EB]'
              : 'bg-white dark:bg-[#131E30] text-[#66736F] dark:text-slate-300 border border-[#E5E8E4] dark:border-[#22344D] hover:bg-[#FAFAF7]'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterType('ai_triage_completed')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
            filterType === 'ai_triage_completed'
              ? 'bg-[#183B3A] text-white dark:bg-[#2563EB]'
              : 'bg-white dark:bg-[#131E30] text-[#66736F] dark:text-slate-300 border border-[#E5E8E4] dark:border-[#22344D] hover:bg-[#FAFAF7]'
          }`}
        >
          Triage Complete
        </button>

        <button
          type="button"
          onClick={() => setFilterType('staff_assigned')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
            filterType === 'staff_assigned'
              ? 'bg-[#183B3A] text-white dark:bg-[#2563EB]'
              : 'bg-white dark:bg-[#131E30] text-[#66736F] dark:text-slate-300 border border-[#E5E8E4] dark:border-[#22344D] hover:bg-[#FAFAF7]'
          }`}
        >
          Staff Assigned
        </button>

        <button
          type="button"
          onClick={() => setFilterType('complaint_status_changed')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
            filterType === 'complaint_status_changed'
              ? 'bg-[#183B3A] text-white dark:bg-[#2563EB]'
              : 'bg-white dark:bg-[#131E30] text-[#66736F] dark:text-slate-300 border border-[#E5E8E4] dark:border-[#22344D] hover:bg-[#FAFAF7]'
          }`}
        >
          Status Updates
        </button>

        <button
          type="button"
          onClick={() => setFilterType('complaint_resolved')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
            filterType === 'complaint_resolved'
              ? 'bg-[#183B3A] text-white dark:bg-[#2563EB]'
              : 'bg-white dark:bg-[#131E30] text-[#66736F] dark:text-slate-300 border border-[#E5E8E4] dark:border-[#22344D] hover:bg-[#FAFAF7]'
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Notifications List */}
      <Card>
        <div className="divide-y divide-[#E5E8E4] dark:divide-[#22344D]">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id, notif.complaintId)}
                className={`p-4 sm:p-4.5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  !notif.read
                    ? 'bg-blue-50/30 dark:bg-blue-950/20 hover:bg-blue-50/50'
                    : 'hover:bg-[#FAFAF7] dark:hover:bg-[#111A29]'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="w-8 h-8 rounded-md bg-[#FAFAF7] dark:bg-[#0E1624] border border-[#E5E8E4] dark:border-[#22344D] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#202B2A] dark:text-white">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                      )}
                    </div>

                    <p className="text-xs text-[#66736F] dark:text-slate-400 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[#66736F] dark:text-slate-400 pt-1">
                      <span className="tabular-nums">{new Date(notif.createdAt).toLocaleString()}</span>
                      {notif.complaintId && (
                        <span className="font-mono text-[#2563EB] font-semibold hover:underline">
                          Case #{notif.complaintId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-[#66736F]">
              <Bell className="w-8 h-8 mx-auto text-[#66736F]/50 mb-2" />
              <p className="text-xs font-semibold">
                No notifications in this category.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NotificationsPage;
