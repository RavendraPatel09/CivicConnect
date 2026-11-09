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
  Cpu,
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
        <div className="w-8 h-8 border-2 border-civic border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const categoryChartData = analytics.categoryDistribution.map((item) => ({
    name: CATEGORIES[item.category]?.name || item.category,
    Total: item.count,
    Resolved: item.resolved,
  }));

  const priorityColors: Record<string, string> = {
    low: '#94A3B8',
    medium: '#3B82F6',
    high: '#F59E0B',
    critical: '#EF4444',
  };

  const priorityPieData = analytics.priorityDistribution.map((item) => ({
    name: item.priority.toUpperCase(),
    value: item.count,
    color: priorityColors[item.priority] || '#94A3B8',
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-civic mb-2">
            <Shield className="w-3.5 h-3.5" />
            Executive Oversight Dashboard
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Municipal Incident Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-department resolution KPIs, AI triage accuracy, and dispatch efficiency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/triage">
            <Button
              variant="civic"
              size="sm"
              leftIcon={<Cpu className="w-4 h-4" />}
            >
              Open AI Triage Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Logged
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {analytics.totalComplaints}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              +14% vs last month
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pending Intake
            </span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {analytics.pendingComplaints}
            </div>
            <span className="text-[10px] text-slate-500">Awaiting department</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              High / Critical
            </span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {analytics.highPriorityComplaints}
            </div>
            <span className="text-[10px] text-rose-500 font-medium">Under active SLA</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Resolved Cases
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {analytics.resolvedComplaints}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Verified closed</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Avg Resolution
            </span>
            <div className="text-2xl font-black text-teal mt-1">
              {analytics.avgResolutionDays} Days
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Target: &lt; 3.0 days</span>
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
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        fontSize: '12px',
                        border: '1px solid #E2E8F0',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area
                      type="monotone"
                      dataKey="filed"
                      name="Complaints Filed"
                      stroke="#2563EB"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorFiled)"
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      name="Work Orders Resolved"
                      stroke="#10B981"
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
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {priorityPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                {priorityPieData.map((p) => (
                  <div key={p.name} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {p.name}:
                    </span>
                    <span className="text-slate-500">{p.value}</span>
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
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 10 }}
                      width={110}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Total" fill="#2563EB" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="Resolved" fill="#10B981" radius={[0, 4, 4, 0]} />
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
                <thead className="bg-slate-50 dark:bg-[#0E1726] border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-3 py-3 text-center">Assigned</th>
                    <th className="px-3 py-3 text-center">Avg Time</th>
                    <th className="px-3 py-3 text-right">Satisfaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {analytics.departmentPerformance.map((dept) => (
                    <tr
                      key={dept.department}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                        {dept.department.replace('Department of ', '').replace('Municipal ', '')}
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-slate-700 dark:text-slate-300">
                        {dept.totalAssigned}
                      </td>
                      <td className="px-3 py-3 text-center text-slate-500">
                        {dept.avgResolutionHours} hrs
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
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
              className="text-xs font-semibold text-civic hover:text-blue-700 flex items-center gap-1"
            >
              Open Full Work Queue
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentComplaints.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {ticket.id}
                  </span>
                  <CategoryBadge category={ticket.category} size="sm" />
                  <SeverityBadge severity={ticket.severity} size="sm" />
                  <StatusBadge status={ticket.status} size="sm" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {ticket.title}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {ticket.location.address} • Citizen: {ticket.citizenName}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-xs font-bold text-teal bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
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
