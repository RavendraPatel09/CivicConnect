import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import mockStorage from '../../services/mock/mockStorage';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../../types';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
  Search,
  PlusCircle,
  MapPin,
  Calendar,
  ArrowRight,
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
    { id: 'all', label: 'All Reports', count: userComplaints.length },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E8E4] dark:border-[#22344D]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202B2A] dark:text-white">
            My Submitted Grievances
          </h1>
          <p className="text-xs text-[#66736F] dark:text-slate-400 mt-0.5">
            Track status updates, municipal department assignments, and resolution progress.
          </p>
        </div>

        <Link to="/report">
          <Button
            variant="primary"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Report an Issue
          </Button>
        </Link>
      </div>

      {/* Tabs & Search Filter Controls */}
      <div className="bg-white dark:bg-[#131E30] rounded-lg border border-[#E5E8E4] dark:border-[#22344D] p-3.5 shadow-subtle space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E5E8E4] dark:border-[#22344D]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatusTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeStatusTab === tab.id
                  ? 'bg-[#183B3A] text-white dark:bg-[#2563EB]'
                  : 'text-[#66736F] hover:text-[#202B2A] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] tabular-nums px-1.5 py-0.2 rounded ${
                  activeStatusTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-[#FAFAF7] dark:bg-[#0E1624] text-[#66736F]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#66736F]">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, keyword, street address..."
            className="block w-full rounded-md border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#111A29] text-xs text-[#202B2A] dark:text-white pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#183B3A]"
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
              className="bg-white dark:bg-[#131E30] rounded-lg p-5 border border-[#E5E8E4] dark:border-[#22344D] hover:border-[#183B3A]/40 dark:hover:border-slate-500 shadow-subtle hover:shadow transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold text-[#183B3A] dark:text-[#3B8278]">
                    {ticket.id}
                  </span>
                  <CategoryBadge category={ticket.category} size="sm" />
                  <SeverityBadge severity={ticket.severity} size="sm" />
                  <StatusBadge status={ticket.status} size="sm" />
                </div>

                <h3 className="text-sm font-bold text-[#202B2A] dark:text-white truncate">
                  {ticket.title}
                </h3>

                <p className="text-xs text-[#66736F] dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {ticket.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-[#66736F] dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1 truncate max-w-sm">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {ticket.location.address}
                  </span>
                  <span className="flex items-center gap-1 flex-shrink-0 tabular-nums">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center md:flex-col items-end justify-between md:justify-center gap-2 flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#E5E8E4] dark:border-[#22344D]">
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-[#183B3A] dark:text-[#3B8278] bg-[#FAFAF7] dark:bg-[#0E1624] px-2 py-0.5 rounded border border-[#E5E8E4] dark:border-[#22344D] tabular-nums">
                    Priority Score: {ticket.aiTriage.priorityScore}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#2563EB] flex items-center gap-1 hover:underline">
                  Case Record
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-[#131E30] rounded-lg p-10 text-center border border-dashed border-[#E5E8E4] dark:border-[#22344D]">
            <h3 className="text-sm font-bold text-[#202B2A] dark:text-white mb-1">
              No Matching Complaints Found
            </h3>
            <p className="text-xs text-[#66736F] dark:text-slate-400 max-w-sm mx-auto mb-4">
              Try adjusting your search criteria or filing a new civic grievance.
            </p>
            <Link to="/report">
              <Button variant="primary" size="sm">
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
