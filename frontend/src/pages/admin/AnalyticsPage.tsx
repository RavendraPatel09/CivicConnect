import React, { useState, useEffect } from 'react';
import analyticsApi from '../../services/api/analytics.api';
import { AnalyticsSummary } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { CATEGORIES } from '../../constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    analyticsApi.getSummary().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#183B3A] border-t-transparent rounded-full animate-spin" />
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
      <div className="pb-2 border-b border-[#E5E8E4] dark:border-[#22344D]">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400 mb-0.5">
          Civic Intelligence
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#202B2A] dark:text-white">
          Municipal Performance Analytics
        </h1>
        <p className="text-xs text-[#66736F] dark:text-slate-400 mt-0.5">
          Resolution metrics, SLA adherence, and verified citizen satisfaction ratings.
        </p>
      </div>

      {/* Top 4 Stat Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400">
              Total Logged
            </span>
            <div className="text-2xl font-bold tabular-nums text-[#202B2A] dark:text-white mt-1">
              {data.totalComplaints}
            </div>
            <span className="text-[10px] text-[#66736F] dark:text-slate-400">All registered incidents</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400">
              Citizen Satisfaction
            </span>
            <div className="text-2xl font-bold tabular-nums text-[#23845B] mt-1">
              {data.citizenSatisfactionRate}%
            </div>
            <span className="text-[10px] text-[#23845B] font-medium">Post-resolution audit</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400">
              Average Resolution
            </span>
            <div className="text-2xl font-bold tabular-nums text-[#183B3A] dark:text-[#3B8278] mt-1">
              {data.avgResolutionDays} Days
            </div>
            <span className="text-[10px] text-[#66736F] dark:text-slate-400 font-medium">Across all sectors</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400">
              High Severity Rate
            </span>
            <div className="text-2xl font-bold tabular-nums text-[#B7791F] mt-1">
              {((data.highPriorityComplaints / (data.totalComplaints || 1)) * 100).toFixed(1)}%
            </div>
            <span className="text-[10px] text-[#B7791F] font-medium">Prioritized response</span>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Monthly Intake vs Resolution Volume"
            subtitle="Trailing historical work order progression"
          />
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E5E8E4' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="filed" name="Complaints Filed" fill="#183B3A" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="#23845B" radius={[3, 3, 0, 0]} />
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
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip
                    contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E5E8E4' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Total" fill="#183B3A" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="Resolved" fill="#3B8278" radius={[0, 3, 3, 0]} />
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
