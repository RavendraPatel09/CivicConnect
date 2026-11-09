import React, { useState } from 'react';
import { FileText, Cpu, Wrench, CheckCircle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const TransparencySection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(2);

  const stages = [
    {
      id: 0,
      title: 'Filed',
      badge: 'Step 1 • Intake',
      icon: <FileText className="w-5 h-5" />,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      description:
        'A citizen submits an incident with geotagged coordinates, photo evidence, and context. The report is assigned a permanent immutable audit ID.',
      sla: '< 15 mins to triage',
      actors: 'Citizen Portal / PWA',
    },
    {
      id: 1,
      title: 'Acknowledged',
      badge: 'Step 2 • Semantic Triage',
      icon: <Cpu className="w-5 h-5" />,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
      description:
        'CivicConnect AI evaluates duplicate clustering, determines public safety priority (0-100), and issues automated notification with expected resolution window.',
      sla: '< 1 hour to route',
      actors: 'Civic AI Engine & Department Leads',
    },
    {
      id: 2,
      title: 'In Progress',
      badge: 'Step 3 • Field Operation',
      icon: <Wrench className="w-5 h-5" />,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
      description:
        'Municipal field crew is assigned with digital work order. Materials, equipment, and inspector location are logged in real time.',
      sla: '24 - 48 hours for standard hazards',
      actors: 'City Field Crews & Contractors',
    },
    {
      id: 3,
      title: 'Resolved',
      badge: 'Step 4 • Citizen Verification',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      description:
        'Repairs completed with photographic post-work verification. Citizen is prompted to rate resolution quality or request reinspection.',
      sla: 'Permanent public ledger log',
      actors: 'Quality Assurance & Citizen',
    },
  ];

  return (
    <section id="transparency" className="py-20 bg-white dark:bg-[#0B1320]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-teal tracking-wider uppercase bg-teal/10 dark:bg-teal/20 px-3 py-1 rounded-full">
            Accountability & Auditability
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142B45] dark:text-white mt-3">
            End-to-End Civic Transparency
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            No complaints disappear into bureaucratic black holes. Every incident moves through four strictly audited stages with open timestamps.
          </p>
        </div>

        {/* Interactive Lifecycle Stages Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stages.map((stage) => {
            const isActive = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(stage.id)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  isActive
                    ? 'border-civic bg-blue-50/50 dark:bg-blue-950/20 shadow-xs ring-1 ring-civic'
                    : 'border-slate-200 dark:border-[#22344D] bg-white dark:bg-[#131E30] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg border ${stage.color}`}>
                    {stage.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    0{stage.id + 1}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {stage.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {stage.badge}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Focus Card */}
        <div className="bg-slate-50 dark:bg-[#131E30] rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-[#22344D] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-civic" />
                Audited Protocol Standard
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Stage {activeStage + 1}: {stages[activeStage].title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {stages[activeStage].description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium block">
                    Target SLA:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-civic" />
                    {stages[activeStage].sla}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium block">
                    Responsible Stakeholder:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {stages[activeStage].actors}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white dark:bg-[#0B1320] p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-12 h-12 rounded-xl bg-civic/10 text-civic mx-auto flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Zero Bureaucracy Loss
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Citizens receive automated alerts at every stage change with public timestamp verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransparencySection;
