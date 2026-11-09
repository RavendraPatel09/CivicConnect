import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import mockStorage from '../../services/mock/mockStorage';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
  Bell,
  ThumbsUp,
  AlertTriangle,
} from 'lucide-react';

export const CitizenOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const allComplaints = useMemo(() => mockStorage.getComplaints(), []);

  // Filter complaints filed by or relevant to this citizen
  const myComplaints = useMemo(() => {
    return allComplaints.filter(
      (c) => c.citizenId === user?.id || c.citizenEmail === user?.email
    );
  }, [allComplaints, user?.id, user?.email]);

  // Overall metric counts
  const totalCount = myComplaints.length;
  const pendingCount = myComplaints.filter((c) => c.status === 'filed').length;
  const inProgressCount = myComplaints.filter(
    (c) => c.status === 'in_progress' || c.status === 'acknowledged'
  ).length;
  const resolvedCount = myComplaints.filter((c) => c.status === 'resolved').length;

  const recentComplaints = myComplaints.slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#142B45] to-[#1E3A8A] rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/10 text-teal-300 border border-white/15 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            Citizen Self-Service Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name.split(' ')[0] || 'Citizen'}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-xl">
            Track your submitted municipal grievances, view automated AI priority scoring,
            and monitor field crew dispatch statuses.
          </p>
        </div>

        <Link to="/report" className="flex-shrink-0">
          <Button
            variant="civic"
            size="md"
            className="bg-white text-slate-900 hover:bg-slate-100 dark:bg-white dark:text-slate-900 font-semibold shadow-md"
            leftIcon={<PlusCircle className="w-4 h-4 text-civic" />}
          >
            Report New Issue
          </Button>
        </Link>
      </div>

      {/* Demonstration Notice Strip */}
      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>
            <strong>Demonstration Workspace:</strong> Showing sandbox records. All submissions, status transitions, and AI triage scores update your session state.
          </span>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                My Total Filed
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {totalCount}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Logged with municipal ID</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <FileText className="w-5 h-5 text-civic" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pending Triage
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {pendingCount}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Awaiting dispatch</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                In Progress
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {inProgressCount}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Crew on site</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600">
              <Wrench className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Resolved
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {resolvedCount}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Inspected & closed</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Complaints + Quick Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Complaints List */}
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader
              title="Recent Complaints"
              subtitle="Grievances reported by your account"
              action={
                <Link
                  to="/citizen/complaints"
                  className="text-xs font-semibold text-civic hover:text-blue-700 flex items-center gap-1"
                >
                  View All ({myComplaints.length})
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <div className="divide-y divide-slate-100 dark:divide-[#22344D]">
              {recentComplaints.length > 0 ? (
                recentComplaints.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-[#111A29]/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {ticket.id}
                        </span>
                        <CategoryBadge category={ticket.category} size="sm" />
                        <SeverityBadge severity={ticket.severity} size="sm" />
                        <StatusBadge status={ticket.status} size="sm" />
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {ticket.title}
                      </h4>

                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {ticket.location.address}
                        </span>
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-teal bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                          AI Priority {ticket.aiTriage.priorityScore}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-civic" />
                        {ticket.upvotes}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <p className="text-sm">You haven't filed any complaints yet.</p>
                  <Link to="/report" className="mt-3 inline-block">
                    <Button variant="civic" size="sm">
                      Submit Your First Report
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Notifications Preview & Live Activity */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader
              title="Recent Notifications"
              subtitle="Status changes & dispatch updates"
              action={
                <Link
                  to="/citizen/notifications"
                  className="text-xs font-semibold text-civic hover:text-blue-700"
                >
                  View All
                </Link>
              }
            />
            <div className="divide-y divide-slate-100 dark:divide-[#22344D]">
              {notifications.slice(0, 4).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 transition-colors ${
                    !notif.read
                      ? 'bg-blue-50/30 dark:bg-blue-950/20'
                      : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-civic mt-1.5 flex-shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Action Card */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-[#0E1B24] dark:to-[#0D1E22] p-5 rounded-xl border border-teal-200/80 dark:border-teal-900/40">
            <h4 className="text-sm font-bold text-teal-900 dark:text-teal-200 mb-1">
              Have an urgent civic hazard?
            </h4>
            <p className="text-xs text-teal-700 dark:text-teal-300 leading-relaxed mb-4">
              Mark severity as Critical for live water main ruptures, electrical exposed wires, or traffic cave-ins.
            </p>
            <Link to="/report">
              <Button variant="civic" size="sm" className="w-full">
                File Grievance Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenOverviewPage;
