import React, { useState, useMemo } from 'react';
import CivicMap from '../../../components/maps/CivicMap';
import { Complaint, ComplaintCategory } from '../../../types';
import { CATEGORIES } from '../../../constants';
import mockStorage from '../../../services/mock/mockStorage';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../../components/ui/Badge';
import { MapPin, ThumbsUp, Calendar, ArrowRight, Filter, ExternalLink } from 'lucide-react';
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
    <section id="explore" className="py-20 bg-white dark:bg-[#0B1320] border-b border-[#E5E8E4] dark:border-[#22344D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#183B3A] dark:text-[#96BCB9] tracking-widest uppercase bg-[#183B3A]/[0.06] dark:bg-white/[0.08] px-2.5 py-1 rounded mb-3 font-heading">
              Public Ledger Explorer
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#183B3A] dark:text-white font-heading">
              Explore Active Grievances
            </h2>
            <p className="mt-2 text-sm text-[#66736F] dark:text-slate-400 max-w-xl">
              Inspect citizen reports and community resolution milestones. All markers shown below represent demonstration data for platform evaluation.
            </p>
          </div>

          <div className="text-xs text-[#66736F] dark:text-slate-400 bg-[#FAFAF7] dark:bg-[#131E30] px-3 py-2 rounded-md border border-[#E5E8E4] dark:border-[#22344D] self-start md:self-auto tabular-nums">
            Showing <span className="font-bold text-[#183B3A] dark:text-white">{filteredComplaints.length}</span> demonstration incident records
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#66736F] pr-2 border-r border-[#E5E8E4] dark:border-slate-800 flex-shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </div>

          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#183B3A] text-white dark:bg-white dark:text-[#183B3A]'
                : 'bg-[#FAFAF7] dark:bg-[#131E30] text-[#66736F] dark:text-slate-300 border border-[#E5E8E4] dark:border-[#22344D] hover:bg-slate-100 dark:hover:bg-slate-800'
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
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[#FAFAF7] dark:bg-[#131E30] text-[#66736F] dark:text-slate-300 border border-[#E5E8E4] dark:border-[#22344D] hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{meta.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${isSelected ? 'bg-white/20' : 'bg-slate-200/80 dark:bg-slate-800'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Map & List Explorer Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Leaflet Map Container */}
          <div className="lg:col-span-8 rounded-lg border border-[#E5E8E4] dark:border-[#22344D] overflow-hidden bg-white dark:bg-[#131E30] shadow-subtle">
            <CivicMap
              complaints={filteredComplaints}
              selectedComplaintId={selectedTicket?.id}
              onSelectComplaint={(t) => setSelectedTicket(t)}
              height="500px"
            />
          </div>

          {/* Right: Selected Ticket Detail Preview Panel */}
          <div className="lg:col-span-4">
            {selectedTicket ? (
              <div className="bg-[#FAFAF7] dark:bg-[#131E30] rounded-lg border border-[#E5E8E4] dark:border-[#22344D] p-5 shadow-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#66736F] dark:text-slate-400">
                    {selectedTicket.id}
                  </span>
                  <StatusBadge status={selectedTicket.status} size="sm" />
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#183B3A] dark:text-white leading-snug font-heading">
                    {selectedTicket.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#66736F] dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {selectedTicket.description}
                  </p>
                </div>

                <div className="space-y-2 py-3 border-y border-[#E5E8E4] dark:border-[#22344D] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#66736F] dark:text-slate-400">Department:</span>
                    <span className="font-semibold text-[#183B3A] dark:text-slate-200 truncate max-w-[170px]">
                      {selectedTicket.assignedDepartment}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#66736F] dark:text-slate-400">Location:</span>
                    <span className="font-semibold text-[#183B3A] dark:text-slate-200 truncate max-w-[170px]">
                      {selectedTicket.location.address}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#66736F] dark:text-slate-400">Category / Severity:</span>
                    <div className="flex items-center gap-1.5">
                      <CategoryBadge category={selectedTicket.category} size="sm" />
                      <SeverityBadge severity={selectedTicket.severity} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#66736F]">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#2563EB]" />
                    {selectedTicket.upvotes} community endorsements
                  </span>
                  <Link
                    to={`/citizen/complaints/${selectedTicket.id}`}
                    className="inline-flex items-center gap-1 text-[#2563EB] hover:text-[#1D4ED8] font-semibold"
                  >
                    View audit ledger
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-[#FAFAF7] dark:bg-[#131E30] rounded-lg border border-[#E5E8E4] dark:border-[#22344D] p-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-md bg-white dark:bg-[#0E1624] border border-[#E5E8E4] dark:border-[#22344D] flex items-center justify-center mx-auto text-[#2563EB]">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#183B3A] dark:text-white font-heading">
                  Select an Incident Marker
                </h4>
                <p className="text-xs text-[#66736F] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Click any marker on the map to review the official incident details, department routing, and repair status.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(filteredComplaints[0])}
                    className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] underline cursor-pointer"
                  >
                    Inspect sample complaint ({filteredComplaints[0]?.id || 'CC-2025-1024'})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveExplorerSection;
