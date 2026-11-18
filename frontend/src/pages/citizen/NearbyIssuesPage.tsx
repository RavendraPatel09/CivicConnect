import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import mockStorage from '../../services/mock/mockStorage';
import { Complaint } from '../../types';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge';
import {
  MapPin,
  Compass,
  ThumbsUp,
  ArrowRight,
} from 'lucide-react';

export const NearbyIssuesPage: React.FC = () => {
  const navigate = useNavigate();
  const [radiusKm, setRadiusKm] = useState<number>(2);
  const allComplaints = useMemo(() => mockStorage.getComplaints(), []);

  // Center coordinate represents the citizen's current residence/location
  const userLat = 37.7785;
  const userLng = -122.4125;

  // Approximate Haversine distance calculation in KM
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const nearbyComplaints = useMemo(() => {
    return allComplaints
      .map((c) => ({
        ...c,
        distanceKm: calculateDistanceKm(userLat, userLng, c.location.lat, c.location.lng),
      }))
      .filter((c) => c.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [allComplaints, radiusKm]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#131E30] rounded-lg p-6 sm:p-7 border border-[#E5E8E4] dark:border-[#22344D] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400 mb-0.5">
            Hyper-Local Discovery
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202B2A] dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#183B3A] dark:text-[#3B8278]" />
            Neighborhood Grievance Discovery
          </h1>
          <p className="text-xs text-[#66736F] dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Discover community reports in your walking perimeter. Support existing grievances to raise municipal priority rather than submitting duplicate tickets.
          </p>
        </div>

        {/* Radius Selector */}
        <div className="flex items-center gap-1.5 bg-[#FAFAF7] dark:bg-[#0E1624] p-1.5 rounded-md border border-[#E5E8E4] dark:border-[#22344D] self-start md:self-auto">
          <span className="text-xs font-semibold text-[#66736F] px-2">Radius:</span>
          {[1, 2, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRadiusKm(r)}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                radiusKm === r
                  ? 'bg-[#183B3A] text-white dark:bg-[#2563EB]'
                  : 'text-[#66736F] hover:text-[#202B2A] dark:hover:text-white'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Strip */}
      <div className="flex items-center justify-between text-xs text-[#66736F] dark:text-slate-400">
        <span>
          Found <strong className="tabular-nums text-[#202B2A] dark:text-white">{nearbyComplaints.length}</strong> civic reports within{' '}
          <strong className="tabular-nums text-[#202B2A] dark:text-white">{radiusKm} km</strong> of your location
        </span>
        <span className="hidden sm:inline">Centered around Market Street Corridor</span>
      </div>

      {/* Grid of Nearby Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearbyComplaints.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="bg-white dark:bg-[#131E30] rounded-lg p-4.5 border border-[#E5E8E4] dark:border-[#22344D] hover:border-[#183B3A]/40 dark:hover:border-slate-500 shadow-subtle hover:shadow transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-[#183B3A] dark:text-[#3B8278]">
                  {ticket.id}
                </span>
                <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.2 rounded border border-blue-200 dark:border-blue-800 tabular-nums">
                  {ticket.distanceKm < 1
                    ? `${(ticket.distanceKm * 1000).toFixed(0)}m away`
                    : `${ticket.distanceKm.toFixed(1)}km away`}
                </span>
              </div>

              <h3 className="text-xs font-bold text-[#202B2A] dark:text-white line-clamp-2">
                {ticket.title}
              </h3>

              <p className="text-xs text-[#66736F] dark:text-slate-400 line-clamp-2 leading-relaxed">
                {ticket.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <CategoryBadge category={ticket.category} size="sm" />
                <StatusBadge status={ticket.status} size="sm" />
              </div>

              <div className="text-xs text-[#66736F] space-y-1 pt-2 border-t border-[#E5E8E4] dark:border-[#22344D]">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{ticket.location.address}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-[#E5E8E4] dark:border-[#22344D] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#202B2A] dark:text-slate-300 flex items-center gap-1 tabular-nums">
                <ThumbsUp className="w-3.5 h-3.5 text-[#2563EB]" />
                {ticket.upvotes} Supporters
              </span>
              <span className="text-[#2563EB] font-semibold flex items-center gap-1 hover:underline">
                Details
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyIssuesPage;
