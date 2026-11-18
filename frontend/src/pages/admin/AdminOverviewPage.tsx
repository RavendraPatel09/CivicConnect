import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import analyticsApi from '../../services/api/analytics.api';
import ticketsApi from '../../services/api/tickets.api';
import { AnalyticsSummary, Complaint } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { CATEGORIES } from '../../constants';
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Shield,
  Layers,
  Building,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const AdminOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsApi.getSummary(), ticketsApi.getTickets({ sortBy: 'newest' })]).then(
      ([summary, tickets]) => {
        setAnalytics(summary);
        setRecentComplaints(tickets.slice(0, 5));
        setIsLoading(false);
      }
    );
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#183B3A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const categoryChartData = analytics.categoryDistribution.map((item) => ({
    name: CATEGORIES[item.category]?.name || item.category,
    Total: item.count,
    Resolved: item.resolved,
  }));

  const priorityColors: Record<string, string> = {
    low: '#64748B',
    medium: '#2563EB',
    high: '#B7791F',
    critical: '#C34B4B',
  };

  const priorityPieData = analytics.priorityDistribution.map((item) => ({
    name: item.priority.toUpperCase(),
    value: item.count,
    color: priorityColors[item.priority] || '#64748B',
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E8E4] dark:border-[#22344D]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400 mb-0.5">
            Executive Oversight
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202B2A] dark:text-white">
            Municipal Incident Overview
          </h1>
          <p className="text-xs text-[#66736F] dark:text-slate-400 mt-0.5">
            Cross-department resolution KPIs, triage volume, and dispatch performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/triage">
            <Button
              variant="primary"
              size="sm"
            >
              Open Triage Console
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400">
              Total Logged
            </span>
            <div className="text-2xl font-bold tabular-nums text-[#202B2A] dark:text-white mt-1">
              {analytics.totalComplaints}
            </div>
            <span className="text-[10px] text-[#23845B] font-semibold">
              Active intake tracking
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400">
              Pending Intake
            </span>
            <div className="text-2xl font-bold tabular-nums text-[#B7791F] mt-1">
              {analytics.pendingComplaints}
            </div>
            <span className="text-[10px] text-[#66736F] dark:text-slate-400">Awaiting department</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400">
              High / Critical
            </span>
            <div className="text-2xl font-bold tabular-nums text-[#C34B4B] mt-1">
              {analytics.highPriorityComplaints}
            </div>
            <span className="text-[10px] text-[#C34B4B] font-medium">Under active SLA</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400">
              Resolved Cases
            </span>
            <div className="text-2xl font-bold tabular-nums text-[#23845B] mt-1">
              {analytics.resolvedComplaints}
            </div>
            <span className="text-[10px] text-[#23845B] font-medium">Verified closed</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400">
              Avg Resolution
            </span>
            <div className="text-2xl font-bold tabular-nums text-[#183B3A] dark:text-[#3B8278] mt-1">
              {analytics.avgResolutionDays} Days
            </div>
            <span className="text-[10px] text-[#66736F] dark:text-slate-400 font-medium">Target: &lt; 3.0 days</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts: Monthly Trend + Priority Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader
              title="Resolution Velocity Trend"
              subtitle="Comparison of newly filed grievances vs successfully resolved work orders"
            />
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analytics.monthlyTrends}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorFiled" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#183B3A" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#183B3A" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#23845B" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#23845B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '6px',
                        fontSize: '12px',
                        border: '1px solid #E5E8E4',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area
                      type="monotone"
                      dataKey="filed"
                      name="Complaints Filed"
                      stroke="#183B3A"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorFiled)"
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      name="Work Orders Resolved"
                      stroke="#23845B"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorResolved)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Distribution Donut */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader
              title="Severity Distribution"
              subtitle="Active grievances by assessed public risk level"
            />
            <CardContent>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {priorityPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '6px',
                        fontSize: '12px',
                        border: '1px solid #E5E8E4',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E8E4] dark:border-[#22344D] text-[11px]">
                {priorityPieData.map((p) => (
                  <div key={p.name} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-semibold text-[#202B2A] dark:text-slate-300">
                      {p.name}:
                    </span>
                    <span className="text-[#66736F] dark:text-slate-400 tabular-nums">{p.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Performance Bar Chart & Department KPI Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Distribution Bar Chart */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader
              title="Incidents by Infrastructure Category"
              subtitle="Total filed vs resolved per municipal sector"
            />
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 10 }}
                      width={110}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '6px',
                        fontSize: '11px',
                        border: '1px solid #E5E8E4',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Total" fill="#183B3A" radius={[0, 3, 3, 0]} />
                    <Bar dataKey="Resolved" fill="#23845B" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance KPI Table */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader
              title="Department SLA Compliance"
              subtitle="Turnaround times and citizen satisfaction ratings"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAF7] dark:bg-[#0E1624] border-b border-[#E5E8E4] dark:border-[#22344D] text-[11px] font-bold text-[#66736F] dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-3 py-3 text-center">Assigned</th>
                    <th className="px-3 py-3 text-center">Avg Time</th>
                    <th className="px-3 py-3 text-right">Satisfaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E8E4] dark:divide-[#22344D]">
                  {analytics.departmentPerformance.map((dept) => (
                    <tr
                      key={dept.department}
                      className="hover:bg-[#FAFAF7] dark:hover:bg-[#111A29] transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-[#202B2A] dark:text-slate-200">
                        {dept.department.replace('Department of ', '').replace('Municipal ', '')}
                      </td>
                      <td className="px-3 py-3 text-center font-bold tabular-nums text-[#202B2A] dark:text-slate-300">
                        {dept.totalAssigned}
                      </td>
                      <td className="px-3 py-3 text-center text-[#66736F] dark:text-slate-400 tabular-nums">
                        {dept.avgResolutionHours} hrs
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="font-semibold text-[#23845B] bg-[#23845B]/10 px-2 py-0.5 rounded text-[11px] tabular-nums">
                          {dept.satisfactionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Grievances Queue Preview */}
      <Card>
        <CardHeader
          title="Recent Complaints Queue"
          subtitle="Latest incoming public incidents pending intake or field verification"
          action={
            <Link
              to="/admin/queue"
              className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              Open Full Work Queue
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="divide-y divide-[#E5E8E4] dark:divide-[#22344D]">
          {recentComplaints.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="p-4 hover:bg-[#FAFAF7] dark:hover:bg-[#111A29] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#183B3A] dark:text-[#3B8278]">
                    {ticket.id}
                  </span>
                  <CategoryBadge category={ticket.category} size="sm" />
                  <SeverityBadge severity={ticket.severity} size="sm" />
                  <StatusBadge status={ticket.status} size="sm" />
                </div>
                <h4 className="text-xs font-semibold text-[#202B2A] dark:text-white">
                  {ticket.title}
                </h4>
                <p className="text-[11px] text-[#66736F] dark:text-slate-400">
                  {ticket.location.address} • Citizen: {ticket.citizenName}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-xs font-bold text-[#183B3A] dark:text-[#3B8278] bg-[#FAFAF7] dark:bg-[#0E1624] px-2 py-0.5 rounded border border-[#E5E8E4] dark:border-[#22344D] tabular-nums">
                  Priority {ticket.aiTriage.priorityScore}
                </span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminOverviewPage;
