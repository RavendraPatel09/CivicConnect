import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationType } from '../../types';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardContent } from '../../components/ui/Card';
import {
  Bell,
  CheckCheck,
  Cpu,
  UserCheck,
  Clock,
  CheckCircle2,
  Filter,
  FileText,
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
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'ai_triage_completed':
        return <Cpu className="w-4 h-4 text-teal" />;
      case 'staff_assigned':
        return <UserCheck className="w-4 h-4 text-blue-500" />;
      case 'complaint_status_changed':
        return <Clock className="w-4 h-4 text-purple-500" />;
      case 'complaint_resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-civic" />
            Notification Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time notifications for automated AI triage, crew dispatches, and status updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            filterType === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-white dark:bg-[#131E30] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterType('ai_triage_completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            filterType === 'ai_triage_completed'
              ? 'bg-civic text-white'
              : 'bg-white dark:bg-[#131E30] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          AI Triage
        </button>

        <button
          type="button"
          onClick={() => setFilterType('staff_assigned')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            filterType === 'staff_assigned'
              ? 'bg-civic text-white'
              : 'bg-white dark:bg-[#131E30] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Staff Assigned
        </button>

        <button
          type="button"
          onClick={() => setFilterType('complaint_status_changed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            filterType === 'complaint_status_changed'
              ? 'bg-civic text-white'
              : 'bg-white dark:bg-[#131E30] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Status Changes
        </button>

        <button
          type="button"
          onClick={() => setFilterType('complaint_resolved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            filterType === 'complaint_resolved'
              ? 'bg-civic text-white'
              : 'bg-white dark:bg-[#131E30] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Notifications List */}
      <Card>
        <div className="divide-y divide-slate-100 dark:divide-[#22344D]">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id, notif.complaintId)}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  !notif.read
                    ? 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-civic" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>{new Date(notif.createdAt).toLocaleString()}</span>
                      {notif.complaintId && (
                        <span className="font-mono text-civic font-semibold">
                          View #{notif.complaintId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400">
              <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                No notifications in this category
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NotificationsPage;
