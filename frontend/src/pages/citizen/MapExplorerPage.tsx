import React, { useState, useMemo } from 'react';
import CivicMap from '../../components/maps/CivicMap';
import mockStorage from '../../services/mock/mockStorage';
import { Complaint, ComplaintCategory, ComplaintSeverity } from '../../types';
import { CATEGORIES } from '../../constants';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  ThumbsUp,
  ArrowRight,
  List,
  Map as MapIcon,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MapExplorerPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | 'all'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<ComplaintSeverity | 'all'>('all');
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);

  const allComplaints = useMemo(() => mockStorage.getComplaints(), []);

  const filteredComplaints = useMemo(() => {
    return allComplaints.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ? true : c.category === selectedCategory;

      const matchesSeverity =
        selectedSeverity === 'all' ? true : c.severity === selectedSeverity;

      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [allComplaints, searchQuery, selectedCategory, selectedSeverity]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#131E30] p-4 rounded-xl border border-slate-200/90 dark:border-[#22344D] shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-civic" />
            Metropolitan Grievance Map
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geographic incident discovery with live category filtering & synthetic coordinates.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-[#131E30] text-civic shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-[#131E30] text-civic shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Map Only
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-[#131E30] text-civic shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              List Only
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address or issue..."
            className="block w-full rounded-lg border border-slate-200 dark:border-[#22344D] bg-white dark:bg-[#131E30] text-xs text-slate-900 dark:text-white pl-9 pr-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-civic/20"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="block w-full rounded-lg border border-slate-200 dark:border-[#22344D] bg-white dark:bg-[#131E30] text-xs text-slate-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-civic/20"
          >
            <option value="all">All Incident Categories</option>
            {Object.keys(CATEGORIES).map((k) => (
              <option key={k} value={k}>
                {CATEGORIES[k as ComplaintCategory].name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as any)}
            className="block w-full rounded-lg border border-slate-200 dark:border-[#22344D] bg-white dark:bg-[#131E30] text-xs text-slate-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-civic/20"
          >
            <option value="all">All Severities</option>
            <option value="low">Low Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="high">High Severity</option>
            <option value="critical">Critical Severity</option>
          </select>
        </div>
      </div>

      {/* Main Map / List Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Column */}
        {viewMode !== 'list' && (
          <div className={viewMode === 'map' ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <CivicMap
              complaints={filteredComplaints}
              selectedComplaintId={selectedTicket?.id}
              onSelectComplaint={(ticket) => setSelectedTicket(ticket)}
              height="580px"
            />
          </div>
        )}

        {/* List / Detail Sidebar Column */}
        {viewMode !== 'map' && (
          <div
            className={`${
              viewMode === 'list' ? 'lg:col-span-12' : 'lg:col-span-4'
            } space-y-4`}
          >
            {/* If a ticket is selected in split mode, show detail panel; otherwise list */}
            {selectedTicket && viewMode === 'split' ? (
              <div className="bg-white dark:bg-[#131E30] rounded-xl border border-slate-200/90 dark:border-[#22344D] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {selectedTicket.id}
                  </span>
                  <StatusBadge status={selectedTicket.status} size="sm" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedTicket.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedTicket.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <CategoryBadge category={selectedTicket.category} size="sm" />
                  <SeverityBadge severity={selectedTicket.severity} size="sm" />
                </div>

                <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedTicket.location.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear Selection
                  </button>
                  <Link to={`/tickets/${selectedTicket.id}`}>
                    <Button variant="civic" size="sm">
                      Inspect Record
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#131E30] rounded-xl border border-slate-200/90 dark:border-[#22344D] overflow-hidden shadow-sm">
                <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Filtered Incidents ({filteredComplaints.length})</span>
                  <span>Click pin or card to inspect</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[520px] overflow-y-auto">
                  {filteredComplaints.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer space-y-1.5 ${
                        selectedTicket?.id === ticket.id
                          ? 'bg-blue-50/50 dark:bg-blue-950/30'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-slate-500">
                          {ticket.id}
                        </span>
                        <StatusBadge status={ticket.status} size="sm" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {ticket.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {ticket.location.address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapExplorerPage;
