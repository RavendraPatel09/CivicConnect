import React, { useState } from 'react';
import { FileText, ClipboardCheck, Wrench, CheckCircle, ShieldCheck, Clock } from 'lucide-react';

export const TransparencySection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(2);

  const stages = [
    {
      id: 0,
      title: 'Filed',
      badge: 'Stage 1 • Intake',
      icon: <FileText className="w-5 h-5" />,
      color: 'text-[#64748B] bg-slate-100 border-slate-200',
      description:
        'A resident logs an incident with geocoded coordinates and photo evidence. The system generates an immutable complaint identifier.',
      sla: 'Immediate ticket creation',
      actor: 'Resident Submission',
    },
    {
      id: 1,
      title: 'Acknowledged',
      badge: 'Stage 2 • Review & Triage',
      icon: <ClipboardCheck className="w-5 h-5" />,
      color: 'text-[#2563EB] bg-blue-50 border-blue-200',
      description:
        'Municipal intake verifies proximity duplicates, computes public safety hazard priority, and assigns the responsible engineering department.',
      sla: 'SLA target: < 2 hours',
      actor: 'Municipal Dispatch & Triage',
    },
    {
      id: 2,
      title: 'In Progress',
      badge: 'Stage 3 • Field Operation',
      icon: <Wrench className="w-5 h-5" />,
      color: 'text-[#B7791F] bg-amber-50 border-amber-200',
      description:
        'Official work order is dispatched to field crews. Material staging, crew scheduling, and site safety cordoning are logged.',
      sla: 'SLA target: 24 - 48 hours for standard hazards',
      actor: 'Municipal Field Crews & Contractors',
    },
    {
      id: 3,
      title: 'Resolved',
      badge: 'Stage 4 • Inspection & Closure',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-[#23845B] bg-emerald-50 border-emerald-200',
      description:
        'Repairs are completed and post-work inspection photos are archived. The ticket is marked resolved on the open municipal record.',
      sla: 'Permanent public audit log',
      actor: 'Quality Inspector & Resident Verification',
    },
  ];

  return (
    <section id="transparency" className="py-20 bg-[#FAFAF7] dark:bg-[#0B1320] border-b border-[#E5E8E4] dark:border-[#22344D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-left max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#183B3A]/[0.06] dark:bg-white/[0.08] text-[#183B3A] dark:text-[#96BCB9] text-xs font-bold tracking-widest uppercase mb-3 font-heading">
            Accountability & Audit Trail
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#183B3A] dark:text-white font-heading">
            End-to-End Resolution Lifecycle
          </h2>
          <p className="mt-3 text-base text-[#66736F] dark:text-slate-400">
            Every public grievance follows an auditable, four-stage workflow with verifiable timestamps.
          </p>
        </div>

        {/* Horizontal Lifecycle Stages Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stages.map((stage) => {
            const isActive = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(stage.id)}
                className={`p-4 rounded-lg text-left border transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#183B3A] bg-white dark:bg-[#131E30] dark:border-[#2563EB] shadow-subtle ring-1 ring-[#183B3A] dark:ring-[#2563EB]'
                    : 'border-[#E5E8E4] dark:border-[#22344D] bg-white/70 dark:bg-[#131E30]/60 hover:bg-white dark:hover:bg-[#131E30]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-md border ${stage.color}`}>
                    {stage.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#66736F] dark:text-slate-500 tabular-nums">
                    0{stage.id + 1}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#183B3A] dark:text-white font-heading">
                  {stage.title}
                </h4>
                <p className="text-[11px] text-[#66736F] dark:text-slate-400 mt-0.5">
                  {stage.badge}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Panel */}
        <div className="rounded-lg border border-[#E5E8E4] dark:border-[#22344D] bg-white dark:bg-[#131E30] p-6 shadow-subtle">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E8E4] dark:border-[#22344D]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3B8278]">
                {stages[activeStage].badge}
              </span>
              <h3 className="text-xl font-bold text-[#183B3A] dark:text-white mt-1 font-heading">
                Stage {activeStage + 1}: {stages[activeStage].title} Protocol
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded bg-[#FAFAF7] dark:bg-[#0E1624] border border-[#E5E8E4] dark:border-[#22344D] text-[#66736F] dark:text-slate-300 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                {stages[activeStage].sla}
              </span>
              <span className="px-3 py-1 rounded bg-[#FAFAF7] dark:bg-[#0E1624] border border-[#E5E8E4] dark:border-[#22344D] text-[#183B3A] dark:text-slate-200 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#23845B]" />
                {stages[activeStage].actor}
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm text-[#202B2A] dark:text-slate-300 leading-relaxed max-w-3xl">
            {stages[activeStage].description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TransparencySection;
