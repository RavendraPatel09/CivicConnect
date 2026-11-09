import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import mockStorage from '../../services/mock/mockStorage';
import { Complaint } from '../../types';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
  MapPin,
  Compass,
  ThumbsUp,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
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
      <div className="bg-white dark:bg-[#131E30] rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-[#22344D] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-civic/10 text-civic mb-2">
            <Compass className="w-3.5 h-3.5" />
            Hyper-Local Neighborhood Discovery
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Issues Nearby Your Location
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Discover community reports in your walking perimeter. Support existing grievances to raise municipal priority rather than submitting duplicate tickets.
          </p>
        </div>

        {/* Radius Selector */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0E1726] p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 self-start md:self-auto">
          <span className="text-xs font-semibold text-slate-500 px-2">Radius:</span>
          {[1, 2, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRadiusKm(r)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                radiusKm === r
                  ? 'bg-civic text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Strip */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Found <strong>{nearbyComplaints.length}</strong> civic reports within{' '}
          <strong>{radiusKm} km</strong> of your location
        </span>
        <span className="text-slate-400">Centered at 5th Avenue & Market Corridor</span>
      </div>

      {/* Grid of Nearby Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {nearbyComplaints.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="bg-white dark:bg-[#131E30] rounded-xl p-5 border border-slate-200/90 dark:border-[#22344D] hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  {ticket.id}
                </span>
                <span className="text-[11px] font-semibold text-civic bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                  {ticket.distanceKm < 1
                    ? `${(ticket.distanceKm * 1000).toFixed(0)}m away`
                    : `${ticket.distanceKm.toFixed(1)}km away`}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                {ticket.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {ticket.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <CategoryBadge category={ticket.category} size="sm" />
                <StatusBadge status={ticket.status} size="sm" />
              </div>

              <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{ticket.location.address}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5 text-civic" />
                {ticket.upvotes} Supporters
              </span>
              <span className="text-civic font-semibold flex items-center gap-1">
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
