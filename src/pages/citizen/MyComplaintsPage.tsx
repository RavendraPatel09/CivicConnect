import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import mockStorage from '../../services/mock/mockStorage';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../../types';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Calendar,
  ThumbsUp,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

export const MyComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState<ComplaintStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | 'all'>('all');

  const allComplaints = useMemo(() => mockStorage.getComplaints(), []);

  const userComplaints = useMemo(() => {
    return allComplaints.filter(
      (c) => c.citizenId === user?.id || c.citizenEmail === user?.email
    );
  }, [allComplaints, user?.id, user?.email]);

  const filteredComplaints = useMemo(() => {
    return userComplaints.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        activeStatusTab === 'all' ? true : c.status === activeStatusTab;

      const matchesCategory =
        selectedCategory === 'all' ? true : c.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [userComplaints, searchQuery, activeStatusTab, selectedCategory]);

  const tabs: { id: ComplaintStatus | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: userComplaints.length },
    {
      id: 'filed',
      label: 'Filed',
      count: userComplaints.filter((c) => c.status === 'filed').length,
    },
    {
      id: 'acknowledged',
      label: 'Acknowledged',
      count: userComplaints.filter((c) => c.status === 'acknowledged').length,
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      count: userComplaints.filter((c) => c.status === 'in_progress').length,
    },
    {
      id: 'resolved',
      label: 'Resolved',
      count: userComplaints.filter((c) => c.status === 'resolved').length,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Submitted Grievances
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review status updates, field staff assignments, and photographic progress of your reports.
          </p>
        </div>

        <Link to="/report">
          <Button
            variant="civic"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Report an Issue
          </Button>
        </Link>
      </div>

      {/* Tabs & Search Filter Controls */}
      <div className="bg-white dark:bg-[#131E30] rounded-xl border border-slate-200/90 dark:border-[#22344D] p-4 shadow-sm space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100 dark:border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatusTab(tab.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeStatusTab === tab.id
                  ? 'bg-civic/10 text-civic dark:bg-civic/20 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, keyword, street address..."
            className="block w-full rounded-lg border border-slate-200 dark:border-[#22344D] bg-slate-50 dark:bg-[#111A29] text-xs text-slate-900 dark:text-white pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-civic/20"
          />
        </div>
      </div>

      {/* Complaints List View */}
      <div className="space-y-3">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="bg-white dark:bg-[#131E30] rounded-xl p-5 border border-slate-200/90 dark:border-[#22344D] hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {ticket.id}
                  </span>
                  <CategoryBadge category={ticket.category} size="sm" />
                  <SeverityBadge severity={ticket.severity} size="sm" />
                  <StatusBadge status={ticket.status} size="sm" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {ticket.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {ticket.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1 truncate max-w-sm">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    {ticket.location.address}
                  </span>
                  <span className="flex items-center gap-1 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center md:flex-col items-end justify-between md:justify-center gap-2 flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-right">
                  <span className="text-[11px] font-bold text-teal bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                    AI Priority {ticket.aiTriage.priorityScore}/100
                  </span>
                </div>
                <div className="text-xs font-semibold text-civic flex items-center gap-1">
                  View Full File
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-[#131E30] rounded-xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              No Matching Complaints Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              Try adjusting your search criteria or filing a new civic grievance.
            </p>
            <Link to="/report">
              <Button variant="civic" size="sm">
                Report an Issue
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaintsPage;
