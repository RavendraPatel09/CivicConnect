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
      <div className="bg-[#183B3A] rounded-lg p-6 sm:p-7 text-white shadow-subtle border border-[#234A49] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
            Citizen Resident Portal
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {user?.name.split(' ')[0] || 'Resident'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
            Track your submitted municipal grievances, view verified department dispatch statuses,
            and monitor repair progress in real time.
          </p>
        </div>

        <Link to="/report" className="flex-shrink-0">
          <Button
            variant="secondary"
            size="md"
            className="bg-white text-[#183B3A] hover:bg-white/90 font-semibold"
            leftIcon={<PlusCircle className="w-4 h-4 text-[#2563EB]" />}
          >
            Report an Issue
          </Button>
        </Link>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#66736F] dark:text-slate-400 uppercase tracking-wider">
                My Total Filed
              </p>
              <h3 className="text-2xl font-bold tabular-nums text-[#202B2A] dark:text-white mt-1">
                {totalCount}
              </h3>
              <p className="text-[10px] text-[#66736F] dark:text-slate-400 mt-0.5">Logged with municipal ID</p>
            </div>
            <div className="w-9 h-9 rounded-md bg-[#FAFAF7] dark:bg-[#111A29] border border-[#E5E8E4] dark:border-[#22344D] flex items-center justify-center text-[#183B3A] dark:text-white">
              <FileText className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#66736F] dark:text-slate-400 uppercase tracking-wider">
                Pending Triage
              </p>
              <h3 className="text-2xl font-bold tabular-nums text-[#B7791F] mt-1">
                {pendingCount}
              </h3>
              <p className="text-[10px] text-[#66736F] dark:text-slate-400 mt-0.5">Awaiting intake review</p>
            </div>
            <div className="w-9 h-9 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#66736F] dark:text-slate-400 uppercase tracking-wider">
                In Progress
              </p>
              <h3 className="text-2xl font-bold tabular-nums text-[#2563EB] mt-1">
                {inProgressCount}
              </h3>
              <p className="text-[10px] text-[#66736F] dark:text-slate-400 mt-0.5">Work order assigned</p>
            </div>
            <div className="w-9 h-9 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#2563EB]">
              <Wrench className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#66736F] dark:text-slate-400 uppercase tracking-wider">
                Resolved
              </p>
              <h3 className="text-2xl font-bold tabular-nums text-[#23845B] mt-1">
                {resolvedCount}
              </h3>
              <p className="text-[10px] text-[#66736F] dark:text-slate-400 mt-0.5">Inspected & closed</p>
            </div>
            <div className="w-9 h-9 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#23845B]">
              <CheckCircle2 className="w-4 h-4" />
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
              title="Recent Grievances"
              subtitle="Work orders reported by your verified citizen account"
              action={
                <Link
                  to="/citizen/complaints"
                  className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  View All ({myComplaints.length})
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <div className="divide-y divide-[#E5E8E4] dark:divide-[#22344D]">
              {recentComplaints.length > 0 ? (
                recentComplaints.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="p-4 sm:p-4.5 hover:bg-[#FAFAF7] dark:hover:bg-[#111A29] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono font-bold text-[#183B3A] dark:text-[#3B8278]">
                          {ticket.id}
                        </span>
                        <CategoryBadge category={ticket.category} size="sm" />
                        <SeverityBadge severity={ticket.severity} size="sm" />
                        <StatusBadge status={ticket.status} size="sm" />
                      </div>

                      <h4 className="text-xs font-semibold text-[#202B2A] dark:text-white truncate">
                        {ticket.title}
                      </h4>

                      <div className="flex items-center gap-4 text-xs text-[#66736F] dark:text-slate-400">
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          {ticket.location.address}
                        </span>
                        <span className="flex items-center gap-1 flex-shrink-0 tabular-nums">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-[#183B3A] dark:text-[#3B8278] bg-[#FAFAF7] dark:bg-[#0E1624] px-2 py-0.5 rounded border border-[#E5E8E4] dark:border-[#22344D] tabular-nums">
                          Priority {ticket.aiTriage.priorityScore}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#66736F] dark:text-slate-300 flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-[#2563EB]" />
                        <span className="tabular-nums">{ticket.upvotes}</span>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[#66736F]">
                  <p className="text-xs">You have not submitted any complaints yet.</p>
                  <Link to="/report" className="mt-3 inline-block">
                    <Button variant="primary" size="sm">
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
              subtitle="Status updates & dispatch notices"
              action={
                <Link
                  to="/citizen/notifications"
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  View All
                </Link>
              }
            />
            <div className="divide-y divide-[#E5E8E4] dark:divide-[#22344D]">
              {notifications.slice(0, 4).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 transition-colors ${
                    !notif.read
                      ? 'bg-blue-50/40 dark:bg-blue-950/20'
                      : 'hover:bg-[#FAFAF7] dark:hover:bg-[#111A29]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#2563EB] mt-1.5 flex-shrink-0" />
                    <div>
                      <h5 className="text-xs font-semibold text-[#202B2A] dark:text-white">
                        {notif.title}
                      </h5>
                      <p className="text-[11px] text-[#66736F] dark:text-slate-400 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-[#66736F] dark:text-slate-400 mt-1 block tabular-nums">
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
          <div className="bg-[#FAFAF7] dark:bg-[#131E30] p-4.5 rounded-lg border border-[#E5E8E4] dark:border-[#22344D]">
            <h4 className="text-xs font-bold text-[#202B2A] dark:text-white mb-1 uppercase tracking-wider">
              Emergency Public Hazard?
            </h4>
            <p className="text-xs text-[#66736F] dark:text-slate-400 leading-relaxed mb-3">
              Mark severity as Critical for live water main breaks, downed power cables, or roadway cave-ins.
            </p>
            <Link to="/report">
              <Button variant="outline" size="sm" className="w-full">
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
