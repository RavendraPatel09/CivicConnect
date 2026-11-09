import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, CheckCircle2, ShieldAlert, Cpu, Sparkles, AlertCircle, Clock } from 'lucide-react';
import Button from '../../../components/ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background Subtle Gradient & Grid */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-civic/10 via-teal/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-6 text-center lg:text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-civic/10 dark:bg-civic/20 border border-civic/20 text-civic text-xs font-semibold tracking-wide uppercase mb-6 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-civic animate-pulse" />
              SMART CITY MANAGEMENT PLATFORM
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#142B45] dark:text-white leading-[1.12]">
              Make Your City Better. <br />
              <span className="bg-gradient-to-r from-[#2563EB] to-[#0F9D91] bg-clip-text text-transparent">
                One Report at a Time.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Report civic issues, track their progress, and help build cleaner, safer,
              better-connected communities through transparent public services.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/report" className="w-full sm:w-auto">
                <Button
                  variant="civic"
                  size="lg"
                  className="w-full sm:w-auto shadow-md shadow-civic/20 hover:shadow-lg hover:shadow-civic/30"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Report an Issue
                </Button>
              </Link>
              <a href="#explore" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-[#131E30]/70 backdrop-blur-xs"
                  leftIcon={<MapPin className="w-4 h-4 text-civic" />}
                >
                  Explore Reported Issues
                </Button>
              </a>
            </div>

            {/* Key Value Proof Metrics */}
            <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-2xl font-bold text-[#142B45] dark:text-white">94.2%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Citizen Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2563EB]">2.4 Days</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Avg Resolution Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0F9D91]">100%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Audit Transparency</div>
              </div>
            </div>
          </div>

          {/* Right Column: Original Mockup Visual Composition */}
          <div className="lg:col-span-6 relative">
            {/* Visual Frame Container */}
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Backing Ambient Frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-civic/30 to-teal/30 rounded-2xl blur-xl opacity-70" />

              {/* Main Simulated Map & Card UI Window */}
              <div className="relative bg-white dark:bg-[#131E30] rounded-2xl border border-slate-200 dark:border-[#22344D] shadow-2xl overflow-hidden">
                {/* Window Chrome Header */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-[#0E1726] border-b border-slate-200 dark:border-[#22344D] flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-2">
                      Civic Incident Triage Radar
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Real-time Intake Active
                  </span>
                </div>

                {/* Simulated Stylized City Map Canvas */}
                <div className="relative h-64 sm:h-72 bg-[#EAEFF5] dark:bg-[#0D1829] overflow-hidden p-4">
                  {/* Vector Street Grid Lines */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-40 dark:opacity-20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#cityGrid)" />
                    {/* Simulated Main Avenues */}
                    <path d="M 0 60 Q 150 120 450 80" stroke="#94A3B8" strokeWidth="8" fill="none" />
                    <path d="M 120 0 L 160 300" stroke="#94A3B8" strokeWidth="6" fill="none" />
                    <path d="M 280 0 L 310 300" stroke="#CBD5E1" strokeWidth="5" fill="none" />
                    <path d="M 0 190 L 500 210" stroke="#CBD5E1" strokeWidth="5" fill="none" />
                  </svg>

                  {/* Simulated City Landmark Nodes */}
                  <div className="absolute top-8 left-14 flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded text-[10px] font-semibold text-slate-700 dark:text-slate-200 shadow-xs border border-slate-200 dark:border-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Transit Hub
                  </div>

                  <div className="absolute bottom-16 right-16 flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded text-[10px] font-semibold text-slate-700 dark:text-slate-200 shadow-xs border border-slate-200 dark:border-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    City Hall District
                  </div>

                  {/* Marker 1: High Priority Road Hazard (Interactive Look) */}
                  <div className="absolute top-16 right-28 group cursor-pointer animate-bounce">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-amber-400/50">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow">
                        Pothole • Score 88
                      </div>
                    </div>
                  </div>

                  {/* Marker 2: Water Supply Alert */}
                  <div className="absolute bottom-12 left-24 group">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md border-2 border-white">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Marker 3: Resolved Streetlight (Green check) */}
                  <div className="absolute top-28 left-40">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md border-2 border-white">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Floating Foreground Overlay: Live AI Triage Status Card */}
                <div className="p-4 bg-white dark:bg-[#131E30] border-t border-slate-100 dark:border-[#22344D]">
                  <div className="bg-slate-50 dark:bg-[#0E1726] rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-civic/10 dark:bg-civic/20 text-civic flex items-center justify-center flex-shrink-0">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              Incident #CC-2025-0841
                            </span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                              In Progress
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Roads & Potholes • Market Street Bus Corridor
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          Priority 88
                        </span>
                      </div>
                    </div>

                    {/* Progress tracker bar */}
                    <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-civic" />
                        <span>Crew Dispatched: Marcus Vance</span>
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        SLA on target
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
