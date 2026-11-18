import React from 'react';
import { Camera, ClipboardCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Report a civic issue',
      description:
        'Submit the incident details with clear photos, select the grievance type, and confirm the exact street location.',
      icon: <Camera className="w-5 h-5 text-[#2563EB]" />,
      detail: 'Citizen Portal / Mobile',
    },
    {
      number: '02',
      title: 'Review and assignment',
      description:
        'Triage algorithms verify duplicates, assess public hazard priority, and route work orders directly to municipal engineering units.',
      icon: <ClipboardCheck className="w-5 h-5 text-[#3B8278]" />,
      detail: 'Municipal Triage & Routing',
    },
    {
      number: '03',
      title: 'Track resolution',
      description:
        'Follow progress from acknowledgment to crew dispatch and final inspection with transparent, timestamped updates.',
      icon: <CheckCircle2 className="w-5 h-5 text-[#23845B]" />,
      detail: 'Audited Public Records',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-[#0B1320] border-b border-[#E5E8E4] dark:border-[#22344D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#183B3A]/[0.06] dark:bg-white/[0.08] text-[#183B3A] dark:text-[#96BCB9] text-xs font-bold tracking-widest uppercase mb-3 font-heading">
            Resolution Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#183B3A] dark:text-white font-heading">
            How CivicConnect Operates
          </h2>
          <p className="mt-3 text-base text-[#66736F] dark:text-slate-400">
            A three-stage public service lifecycle connecting resident submissions directly to municipal field crews.
          </p>
        </div>

        {/* 3 Step Structured Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div
              key={item.number}
              className="relative p-6 rounded-lg border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#131E30] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-md bg-white dark:bg-[#0E1624] border border-[#E5E8E4] dark:border-[#22344D] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-bold text-[#66736F]/40 dark:text-slate-700 font-mono tabular-nums">
                    {item.number}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-[#3B8278] uppercase tracking-wider mb-2">
                  {item.detail}
                </div>

                <h3 className="text-lg font-bold text-[#183B3A] dark:text-white mb-2 font-heading">
                  {item.title}
                </h3>

                <p className="text-sm text-[#66736F] dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {index < 2 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-[#66736F]/30">
                  <ArrowRight className="w-5 h-5" />
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
