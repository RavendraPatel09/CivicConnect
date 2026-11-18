import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Building, ShieldCheck, Layers } from 'lucide-react';
import Button from '../../../components/ui/Button';
import CivicMap from '../../../components/maps/CivicMap';
import mockStorage from '../../../services/mock/mockStorage';

export const HeroSection: React.FC = () => {
  // Demonstration complaints for live map preview
  const demoComplaints = useMemo(() => {
    return mockStorage.getComplaints().slice(0, 6);
  }, []);

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 border-b border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#0B1320]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-6 text-left">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#183B3A]/[0.06] dark:bg-white/[0.08] text-[#183B3A] dark:text-[#96BCB9] text-xs font-bold tracking-widest uppercase mb-5 font-heading">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B8278]" />
              CIVIC SERVICES, CONNECTED.
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-[#183B3A] dark:text-white leading-[1.15] font-heading">
              Better Cities Begin With Better Reporting.
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-[#66736F] dark:text-slate-300 leading-relaxed max-w-xl">
              A transparent platform for reporting civic problems, tracking public services, and helping communities work towards safer, cleaner neighbourhoods.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <Link to="/report" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Report an Issue
                </Button>
              </Link>
              <a href="#explore" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  leftIcon={<MapPin className="w-4 h-4 text-[#2563EB]" />}
                >
                  Explore Reported Issues
                </Button>
              </a>
            </div>

            {/* Structured Verified Metrics */}
            <div className="mt-12 pt-8 border-t border-[#E5E8E4] dark:border-slate-800 grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-[#183B3A] dark:text-white tabular-nums font-heading">
                  6
                </div>
                <div className="text-xs text-[#66736F] dark:text-slate-400 mt-1 font-medium">
                  Municipal Depts
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2563EB] tabular-nums font-heading">
                  4 Stages
                </div>
                <div className="text-xs text-[#66736F] dark:text-slate-400 mt-1 font-medium">
                  Audited Workflow
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#3B8278] tabular-nums font-heading">
                  100%
                </div>
                <div className="text-xs text-[#66736F] dark:text-slate-400 mt-1 font-medium">
                  Public Ledger
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Genuine Interactive Leaflet Map Preview */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-[#E5E8E4] dark:border-[#22344D] bg-white dark:bg-[#131E30] shadow-card overflow-hidden">
              {/* Map Header Panel */}
              <div className="px-4 py-3 bg-[#FAFAF7] dark:bg-[#0E1624] border-b border-[#E5E8E4] dark:border-[#22344D] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#23845B]" />
                  <span className="text-xs font-semibold text-[#183B3A] dark:text-slate-200">
                    Live Issue Map — Central District
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#66736F] dark:text-slate-400 bg-white dark:bg-[#131E30] px-2 py-0.5 rounded border border-[#E5E8E4] dark:border-[#22344D]">
                  Demonstration Data
                </span>
              </div>

              {/* Interactive Map Component */}
              <div className="relative h-[380px] sm:h-[420px] w-full">
                <CivicMap
                  complaints={demoComplaints}
                  height="100%"
                  zoom={13}
                  center={[37.7749, -122.4194]}
                />
              </div>

              {/* Map Bottom Footer Info */}
              <div className="px-4 py-2.5 bg-[#FAFAF7] dark:bg-[#0E1624] border-t border-[#E5E8E4] dark:border-[#22344D] flex items-center justify-between text-xs text-[#66736F] dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                  Click any pin to inspect location & department dispatch
                </span>
                <span className="hidden sm:inline font-mono text-[11px]">
                  OSM CARTO / WGS-84
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
