import React from 'react';
import { Camera, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Report an Issue',
      description:
        'Snap a photograph, choose the grievance category, and pinpoint the exact street address or GPS location in seconds with accessible mobile forms.',
      icon: <Camera className="w-6 h-6 text-civic" />,
      tag: 'Citizen Input',
    },
    {
      step: '02',
      title: 'AI-Assisted Review',
      description:
        'CivicConnect AI automatically tags category, detects duplicate complaints, evaluates public safety severity, and routes the ticket to the responsible municipal department.',
      icon: <Cpu className="w-6 h-6 text-teal" />,
      tag: 'Automated Triage',
    },
    {
      step: '03',
      title: 'Track Resolution',
      description:
        'Follow progress transparently from intake to crew dispatch and final inspection. Receive real-time status updates and verified photographic proof of work.',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      tag: 'Verified Delivery',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50/60 dark:bg-[#0E1624] border-y border-slate-200/70 dark:border-[#22344D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-civic tracking-wider uppercase bg-civic/10 dark:bg-civic/20 px-3 py-1 rounded-full">
            Transparent Municipal Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142B45] dark:text-white mt-3">
            How CivicConnect AI Works
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            Bridging civic participation and municipal operations through a streamlined three-stage resolution lifecycle.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative bg-white dark:bg-[#131E30] rounded-2xl p-7 border border-slate-200/80 dark:border-[#22344D] shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-[#0B1320] border border-slate-200/60 dark:border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-black text-slate-200 dark:text-slate-800 font-mono">
                    {item.step}
                  </span>
                </div>

                <span className="inline-block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {item.tag}
                </span>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {index < 2 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-slate-300 dark:text-slate-700">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
