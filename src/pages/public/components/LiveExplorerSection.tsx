import React, { useState, useMemo } from 'react';
import CivicMap from '../../../components/maps/CivicMap';
import { Complaint, ComplaintCategory } from '../../../types';
import { CATEGORIES } from '../../../constants';
import mockStorage from '../../../services/mock/mockStorage';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../../components/ui/Badge';
import { MapPin, ThumbsUp, Calendar, ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiveExplorerSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | 'all'>('all');
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);

  const allComplaints = useMemo(() => mockStorage.getComplaints(), []);

  const filteredComplaints = useMemo(() => {
    if (selectedCategory === 'all') return allComplaints;
    return allComplaints.filter((c) => c.category === selectedCategory);
  }, [allComplaints, selectedCategory]);

  return (
    <section id="explore" className="py-20 bg-slate-50/70 dark:bg-[#0E1624] border-y border-slate-200/80 dark:border-[#22344D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-civic tracking-wider uppercase bg-civic/10 dark:bg-civic/20 px-3 py-1 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Demonstration Map
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142B45] dark:text-white">
              Explore Active Grievances
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Inspect citizen reports in real time. Filter by category, click pins to review triage status, and discover nearby infrastructure updates.
            </p>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-[#131E30] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 self-start md:self-auto">
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredComplaints.length}</span> demonstration markers
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 pr-2 border-r border-slate-200 dark:border-slate-800 flex-shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </div>

          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-[#131E30] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Categories ({allComplaints.length})
          </button>

          {(Object.keys(CATEGORIES) as ComplaintCategory[]).map((catKey) => {
            const count = allComplaints.filter((c) => c.category === catKey).length;
            const meta = CATEGORIES[catKey];
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-civic text-white'
                    : 'bg-white dark:bg-[#131E30] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{meta.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Map & Selected Ticket Card Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Leaflet Map Container */}
          <div className="lg:col-span-8">
            <CivicMap
              complaints={filteredComplaints}
              selectedComplaintId={selectedTicket?.id}
              onSelectComplaint={(t) => setSelectedTicket(t)}
              height="500px"
            />
          </div>

          {/* Right: Selected Ticket Detail Preview Card */}
          <div className="lg:col-span-4">
            {selectedTicket ? (
              <div className="bg-white dark:bg-[#131E30] rounded-xl border border-slate-200/90 dark:border-[#22344D] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {selectedTicket.id}
                  </span>
                  <StatusBadge status={selectedTicket.status} size="sm" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                  {selectedTicket.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                  {selectedTicket.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <CategoryBadge category={selectedTicket.category} size="sm" />
                  <SeverityBadge severity={selectedTicket.severity} size="sm" />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{selectedTicket.location.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#0E1726] p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">AI Priority Score</span>
                    <span className="text-teal font-bold">{selectedTicket.aiTriage.priorityScore}/100</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {selectedTicket.aiTriage.summary}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-civic" />
                    {selectedTicket.upvotes} Citizens Supported
                  </span>
                  <Link
                    to={`/tickets/${selectedTicket.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-civic hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#131E30] rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                  <MapPin className="w-6 h-6 text-civic" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Select Any Map Marker
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  Click any marker on the map to inspect incident details, AI triage scoring, municipal department assignments, and resolution progress.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveExplorerSection;
