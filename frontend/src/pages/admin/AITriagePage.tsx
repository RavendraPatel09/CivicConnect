import React, { useState, useEffect } from 'react';
import ticketsApi from '../../services/api/tickets.api';
import { Complaint, ComplaintCategory, ComplaintSeverity } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { CATEGORIES, DEPARTMENTS } from '../../constants';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Building,
  ArrowRight,
  ShieldAlert,
  Bot,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AITriagePage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);

  // Override Form state
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideCategory, setOverrideCategory] = useState<ComplaintCategory>('roads_potholes');
  const [overrideSeverity, setOverrideSeverity] = useState<ComplaintSeverity>('medium');
  const [overrideDepartment, setOverrideDepartment] = useState('');
  const [overrideScore, setOverrideScore] = useState(75);
  const [overrideReason, setOverrideReason] = useState('');
  const [isSubmittingOverride, setIsSubmittingOverride] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchTickets = () => {
    ticketsApi.getTickets().then((data) => {
      setComplaints(data);
      if (data.length > 0 && !selectedTicket) {
        setSelectedTicket(data[0]);
      }
    });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const openOverrideModal = (ticket: Complaint) => {
    setOverrideCategory(ticket.category);
    setOverrideSeverity(ticket.severity);
    setOverrideDepartment(ticket.assignedDepartment);
    setOverrideScore(ticket.aiTriage.priorityScore);
    setOverrideReason('');
    setOverrideModalOpen(true);
  };

  const handleOverrideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !user) return;
    setIsSubmittingOverride(true);

    try {
      const updated = await ticketsApi.overrideAITriage(
        selectedTicket.id,
        {
          category: overrideCategory,
          severity: overrideSeverity,
          assignedDepartment: overrideDepartment,
          priorityScore: overrideScore,
          overrideNotes: overrideReason,
        },
        user
      );

      if (updated) {
        setSelectedTicket(updated);
        fetchTickets();
        setOverrideModalOpen(false);
        setSuccessToast(`Triage routing manually overridden for case ${updated.id}`);
        setTimeout(() => setSuccessToast(null), 3000);
      }
    } finally {
      setIsSubmittingOverride(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E8E4] dark:border-[#22344D]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400 mb-0.5">
            Operations & Triage
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202B2A] dark:text-white">
            Automated Triage & Routing Console
          </h1>
          <p className="text-xs text-[#66736F] dark:text-slate-400 mt-0.5">
            Audit algorithmic classification, severity evaluation, and municipal department routing.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#FAFAF7] dark:bg-[#111A29] text-[#66736F] dark:text-slate-300 border border-[#E5E8E4] dark:border-[#22344D] flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#2563EB]" />
          <span>Assisted Triage Engine Active</span>
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Grid: Left Ticket Selector, Right AI Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Triage Intake Queue */}
        <div className="lg:col-span-5 space-y-3">
          <Card>
            <CardHeader
              title="Intake Queue"
              subtitle="Select incident to review triage analysis and routing audit"
            />
            <div className="divide-y divide-[#E5E8E4] dark:divide-[#22344D] max-h-[620px] overflow-y-auto">
              {complaints.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-3.5 transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-[#183B3A]/5 dark:bg-white/5 border-l-4 border-[#183B3A] dark:border-[#2563EB]'
                        : 'hover:bg-[#FAFAF7] dark:hover:bg-[#111A29]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-[#183B3A] dark:text-[#3B8278]">
                        {ticket.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded tabular-nums ${
                          ticket.aiTriage.priorityScore >= 80
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                            : ticket.aiTriage.priorityScore >= 60
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        Priority {ticket.aiTriage.priorityScore}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-[#202B2A] dark:text-white line-clamp-1">
                      {ticket.title}
                    </h4>

                    <div className="flex items-center gap-1.5 pt-0.5">
                      <CategoryBadge category={ticket.category} size="sm" />
                      <SeverityBadge severity={ticket.severity} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column (7 cols): Deep Analysis & Override Action */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="space-y-4">
              {/* Main Analysis Card */}
              <Card>
                <CardHeader
                  title={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#202B2A] dark:text-white">
                          Triage File: {selectedTicket.id}
                        </span>
                      </div>
                      <span className="text-xs font-mono bg-[#FAFAF7] dark:bg-[#0E1624] text-[#183B3A] dark:text-[#3B8278] px-2 py-0.5 rounded border border-[#E5E8E4] dark:border-[#22344D] tabular-nums">
                        Confidence: {(selectedTicket.aiTriage.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  }
                  subtitle={selectedTicket.title}
                  action={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openOverrideModal(selectedTicket)}
                      leftIcon={<Sliders className="w-3.5 h-3.5" />}
                    >
                      Override Routing
                    </Button>
                  }
                />
                <CardContent className="space-y-4">
                  {/* Priority & Recommendations Strip */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-[#FAFAF7] dark:bg-[#0E1624] rounded-lg border border-[#E5E8E4] dark:border-[#22344D]">
                      <span className="text-[10px] uppercase font-bold text-[#66736F] dark:text-slate-400 block tracking-wider">
                        Recommended Category
                      </span>
                      <span className="text-xs font-bold text-[#183B3A] dark:text-white mt-1 block">
                        {CATEGORIES[selectedTicket.aiTriage.recommendedCategory]?.name}
                      </span>
                    </div>

                    <div className="p-3 bg-[#FAFAF7] dark:bg-[#0E1624] rounded-lg border border-[#E5E8E4] dark:border-[#22344D]">
                      <span className="text-[10px] uppercase font-bold text-[#66736F] dark:text-slate-400 block tracking-wider">
                        Assessed Severity
                      </span>
                      <span className="text-xs font-bold text-[#202B2A] dark:text-white mt-1 uppercase block">
                        {selectedTicket.aiTriage.recommendedSeverity}
                      </span>
                    </div>

                    <div className="p-3 bg-[#FAFAF7] dark:bg-[#0E1624] rounded-lg border border-[#E5E8E4] dark:border-[#22344D]">
                      <span className="text-[10px] uppercase font-bold text-[#66736F] dark:text-slate-400 block tracking-wider">
                        Priority Score
                      </span>
                      <span className="text-sm font-bold text-[#183B3A] dark:text-[#3B8278] mt-1 block tabular-nums">
                        {selectedTicket.aiTriage.priorityScore} / 100
                      </span>
                    </div>
                  </div>

                  {/* Automated Summary */}
                  <div>
                    <h5 className="text-[11px] font-bold text-[#66736F] dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Issue Synthesis & Semantic Extraction
                    </h5>
                    <p className="text-xs text-[#202B2A] dark:text-slate-300 leading-relaxed bg-[#FAFAF7] dark:bg-[#0E1624] p-3 rounded-md border border-[#E5E8E4] dark:border-[#22344D]">
                      {selectedTicket.aiTriage.summary}
                    </p>
                  </div>

                  {/* Recommended Routing */}
                  <div>
                    <h5 className="text-[11px] font-bold text-[#66736F] dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Assigned Municipal Department
                    </h5>
                    <div className="flex items-center gap-2 p-3 bg-[#FAFAF7] dark:bg-[#0E1624] rounded-md border border-[#E5E8E4] dark:border-[#22344D] text-xs text-[#202B2A] dark:text-white">
                      <Building className="w-4 h-4 text-[#183B3A] dark:text-[#3B8278] flex-shrink-0" />
                      <span className="font-semibold">
                        {selectedTicket.aiTriage.suggestedDepartment}
                      </span>
                    </div>
                  </div>

                  {/* Citizen Acknowledgment Draft */}
                  <div>
                    <h5 className="text-[11px] font-bold text-[#66736F] dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Citizen Communication Draft
                    </h5>
                    <p className="text-xs text-[#202B2A] dark:text-slate-300 leading-relaxed bg-[#FAFAF7] dark:bg-[#0E1624] p-3 rounded-md border border-[#E5E8E4] dark:border-[#22344D] italic">
                      "{selectedTicket.aiTriage.acknowledgmentDraft}"
                    </p>
                  </div>

                  {/* Override Status Banner if applicable */}
                  {selectedTicket.aiTriage.isOverridden && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Administrative Override Record
                      </div>
                      <p className="text-[11px]">{selectedTicket.aiTriage.overrideNotes}</p>
                      <div className="text-[10px] text-[#66736F] dark:text-slate-400">
                        Overridden by {selectedTicket.aiTriage.overriddenBy} on{' '}
                        {new Date(selectedTicket.aiTriage.overriddenAt || '').toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <Link to={`/tickets/${selectedTicket.id}`}>
                      <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        View Public Case Record
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="p-12 text-center text-[#66736F] bg-white dark:bg-[#131E30] rounded-lg border border-dashed border-[#E5E8E4] dark:border-[#22344D]">
              <p className="text-sm">Select an incident from the queue to inspect its triage audit.</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Override Modal */}
      <Modal
        isOpen={overrideModalOpen}
        onClose={() => setOverrideModalOpen(false)}
        title="Override Algorithmic Routing"
        description="Manually reassign grievance category, severity, department, or priority score."
      >
        <form onSubmit={handleOverrideSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-1">
              Category
            </label>
            <select
              value={overrideCategory}
              onChange={(e) => setOverrideCategory(e.target.value as any)}
              className="block w-full rounded-md border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#111A29] text-xs p-2.5 text-[#202B2A] dark:text-white"
            >
              {Object.keys(CATEGORIES).map((k) => (
                <option key={k} value={k}>
                  {CATEGORIES[k as ComplaintCategory].name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-1">
              Hazard Severity
            </label>
            <select
              value={overrideSeverity}
              onChange={(e) => setOverrideSeverity(e.target.value as any)}
              className="block w-full rounded-md border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#111A29] text-xs p-2.5 text-[#202B2A] dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-1">
              Assigned Department
            </label>
            <select
              value={overrideDepartment}
              onChange={(e) => setOverrideDepartment(e.target.value)}
              className="block w-full rounded-md border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#111A29] text-xs p-2.5 text-[#202B2A] dark:text-white"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-1">
              Adjust Priority Score: <span className="font-bold tabular-nums text-[#183B3A] dark:text-[#3B8278]">{overrideScore}/100</span>
            </label>
            <input
              type="range"
              min="1"
              max="99"
              value={overrideScore}
              onChange={(e) => setOverrideScore(Number(e.target.value))}
              className="w-full accent-[#183B3A] dark:accent-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-1">
              Override Rationale / Audit Notes
            </label>
            <textarea
              required
              rows={3}
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="e.g. Visual inspection reveals proximity to school zone, warranting escalation to high priority."
              className="block w-full rounded-md border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#111A29] text-xs p-2.5 text-[#202B2A] dark:text-white"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOverrideModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmittingOverride}
            >
              Save Override Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AITriagePage;
