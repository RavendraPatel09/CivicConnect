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
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Send,
  Building,
  Layers,
  ArrowRight,
  ShieldAlert,
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
        setSuccessToast(`AI Triage overridden for ${updated.id}`);
        setTimeout(() => setSuccessToast(null), 3000);
      }
    } finally {
      setIsSubmittingOverride(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal mb-2">
            <Cpu className="w-3.5 h-3.5" />
            Semantic Intake Engine v2.4
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            AI Triage & Classification Workbench
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review automated severity scoring, semantic routing recommendations, and municipal department matches.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Interactive Prototype Demonstration Mode</span>
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
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
              subtitle="Select incident to review semantic triage analysis"
            />
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[620px] overflow-y-auto">
              {complaints.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-civic'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        {ticket.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ticket.aiTriage.priorityScore >= 85
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                            : 'bg-teal-50 text-teal dark:bg-teal-950/40'
                        }`}
                      >
                        Priority {ticket.aiTriage.priorityScore}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {ticket.title}
                    </h4>

                    <div className="flex items-center gap-2 pt-0.5">
                      <CategoryBadge category={ticket.category} size="sm" />
                      <SeverityBadge severity={ticket.severity} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column (7 cols): AI Triage Deep Analysis & Override Action */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="space-y-5">
              {/* Main Analysis Card */}
              <Card className="border-teal-200/80 dark:border-teal-900/40">
                <CardHeader
                  title={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-teal" />
                        <span className="font-bold">
                          AI Triage File: {selectedTicket.id}
                        </span>
                      </div>
                      <span className="text-xs font-mono bg-teal-50 dark:bg-teal-950/40 text-teal px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
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
                      Override AI
                    </Button>
                  }
                />
                <CardContent className="space-y-4">
                  {/* Priority & Recommendations Strip */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-slate-50 dark:bg-[#0E1726] rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Category Rec
                      </span>
                      <span className="text-xs font-bold text-civic mt-1 block">
                        {CATEGORIES[selectedTicket.aiTriage.recommendedCategory]?.name}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-[#0E1726] rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Severity Rec
                      </span>
                      <span className="text-xs font-bold text-amber-600 mt-1 uppercase block">
                        {selectedTicket.aiTriage.recommendedSeverity}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-[#0E1726] rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Priority Score
                      </span>
                      <span className="text-base font-black text-teal mt-0.5 block">
                        {selectedTicket.aiTriage.priorityScore} / 100
                      </span>
                    </div>
                  </div>

                  {/* Automated Summary */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Semantic Issue Synthesis
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-[#0E1726] p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
                      {selectedTicket.aiTriage.summary}
                    </p>
                  </div>

                  {/* Recommended Routing */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Target Municipal Engineering Department
                    </h5>
                    <div className="flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 text-xs text-slate-800 dark:text-slate-200">
                      <Building className="w-4 h-4 text-civic flex-shrink-0" />
                      <span className="font-semibold">
                        {selectedTicket.aiTriage.suggestedDepartment}
                      </span>
                    </div>
                  </div>

                  {/* AI Generated Citizen Acknowledgment Draft */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Auto-Generated Citizen Response Draft
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-[#0E1726] p-3 rounded-lg border border-slate-200/60 dark:border-slate-800 italic">
                      "{selectedTicket.aiTriage.acknowledgmentDraft}"
                    </p>
                  </div>

                  {/* Override Status Banner if applicable */}
                  {selectedTicket.aiTriage.isOverridden && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Admin Override Active
                      </div>
                      <p className="text-[11px]">{selectedTicket.aiTriage.overrideNotes}</p>
                      <div className="text-[10px] text-slate-500">
                        Overridden by {selectedTicket.aiTriage.overriddenBy} on{' '}
                        {new Date(selectedTicket.aiTriage.overriddenAt || '').toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <Link to={`/tickets/${selectedTicket.id}`}>
                      <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Inspect Public Ledger
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-[#131E30] rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-sm">Select any incident from the left to inspect its AI triage file.</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Override Modal */}
      <Modal
        isOpen={overrideModalOpen}
        onClose={() => setOverrideModalOpen(false)}
        title="Override AI Triage Recommendation"
        description="Manually adjust category, hazard severity, department routing, or priority score."
      >
        <form onSubmit={handleOverrideSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Override Category
            </label>
            <select
              value={overrideCategory}
              onChange={(e) => setOverrideCategory(e.target.value as any)}
              className="block w-full rounded-lg border border-slate-300 dark:border-[#22344D] bg-white dark:bg-[#111A29] text-xs p-2.5"
            >
              {Object.keys(CATEGORIES).map((k) => (
                <option key={k} value={k}>
                  {CATEGORIES[k as ComplaintCategory].name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Override Severity
            </label>
            <select
              value={overrideSeverity}
              onChange={(e) => setOverrideSeverity(e.target.value as any)}
              className="block w-full rounded-lg border border-slate-300 dark:border-[#22344D] bg-white dark:bg-[#111A29] text-xs p-2.5"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Assigned Department
            </label>
            <select
              value={overrideDepartment}
              onChange={(e) => setOverrideDepartment(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 dark:border-[#22344D] bg-white dark:bg-[#111A29] text-xs p-2.5"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Adjust Priority Score: <span className="font-bold text-civic">{overrideScore}/100</span>
            </label>
            <input
              type="range"
              min="1"
              max="99"
              value={overrideScore}
              onChange={(e) => setOverrideScore(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Override Rationale / Audit Notes
            </label>
            <textarea
              required
              rows={3}
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="e.g. Visual inspection reveals proximity to elementary school zone, warranting escalation to high priority."
              className="block w-full rounded-lg border border-slate-300 dark:border-[#22344D] bg-white dark:bg-[#111A29] text-xs p-2.5"
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
              variant="civic"
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
