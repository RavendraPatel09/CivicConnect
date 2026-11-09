import React, { useState, useEffect } from 'react';
import analyticsApi from '../../services/api/analytics.api';
import { AnalyticsSummary } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { CATEGORIES } from '../../constants';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    analyticsApi.getSummary().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-civic border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const categoryData = data.categoryDistribution.map((item) => ({
    name: CATEGORIES[item.category]?.name || item.category,
    Total: item.count,
    Resolved: item.resolved,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-civic" />
          Municipal Performance Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Comprehensive resolution metrics, SLA adherence, and citizen satisfaction ratings.
        </p>
      </div>

      {/* Top 4 Stat Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase text-slate-400">
              Total Recorded Incidents
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {data.totalComplaints}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase text-slate-400">
              Citizen Satisfaction
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {data.citizenSatisfactionRate}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase text-slate-400">
              Average Resolution Time
            </span>
            <div className="text-2xl font-black text-teal mt-1">
              {data.avgResolutionDays} Days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase text-slate-400">
              High Severity Rate
            </span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {((data.highPriorityComplaints / (data.totalComplaints || 1)) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Monthly Intake vs Resolution Volume"
            subtitle="6-month trailing historical trend"
          />
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="filed" name="Complaints Filed" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Category Workload Analysis"
            subtitle="Volume distribution across civic engineering sectors"
          />
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Total" fill="#142B45" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="Resolved" fill="#0F9D91" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
