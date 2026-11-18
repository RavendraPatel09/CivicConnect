import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ticketsApi from '../../services/api/tickets.api';
import { Complaint, ComplaintStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardContent } from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import CivicMap from '../../components/maps/CivicMap';
import Logo from '../../components/common/Logo';
import ThemeToggle from '../../components/ui/ThemeToggle';
import RoleSwitcher from '../../components/ui/RoleSwitcher';
import {
  MapPin,
  Calendar,
  ThumbsUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  ArrowLeft,
  Share2,
  Wrench,
  Layers,
  FileCheck,
} from 'lucide-react';

export const ComplaintDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [statusUpdateNote, setStatusUpdateNote] = useState<string>('');
  const [selectedNewStatus, setSelectedNewStatus] = useState<ComplaintStatus>('in_progress');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    ticketsApi.getTicketById(id).then((data) => {
      setComplaint(data);
      setIsLoading(false);
    });
  }, [id]);

  const handleToggleUpvote = async () => {
    if (!complaint) return;
    const updated = await ticketsApi.toggleUpvote(complaint.id);
    if (updated) setComplaint(updated);
  };

  const handleStatusChangeSubmit = async () => {
    if (!complaint || !user) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await ticketsApi.updateTicketStatus(
        complaint.id,
        selectedNewStatus,
        user,
        statusUpdateNote || undefined
      );
      if (updated) setComplaint(updated);
      setShowStatusModal(false);
      setStatusUpdateNote('');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0B1320] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#183B3A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#66736F]">Loading case record...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0B1320] flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-[#202B2A] dark:text-white">Record Not Found</h2>
          <p className="text-xs text-[#66736F] dark:text-slate-400 mt-1 mb-4">
            No grievance was found matching the identifier "{id}".
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate('/citizen')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0B1320] text-[#202B2A] dark:text-[#F1F5F9] flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-[#E5E8E4] dark:border-[#22344D] bg-white dark:bg-[#131E30] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg text-[#66736F] hover:text-[#202B2A] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center">
            <Logo size="sm" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <RoleSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-lg text-[#66736F] hover:text-[#202B2A] dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold flex items-center gap-1.5"
            title="Copy URL"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copySuccess ? 'Copied Link!' : 'Share'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-[#131E30] rounded-lg p-6 sm:p-7 border border-[#E5E8E4] dark:border-[#22344D] shadow-subtle">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-[#183B3A] dark:text-[#3B8278] bg-[#FAFAF7] dark:bg-[#0E1624] px-2 py-0.5 rounded border border-[#E5E8E4] dark:border-[#22344D]">
                  {complaint.id}
                </span>
                <CategoryBadge category={complaint.category} />
                <SeverityBadge severity={complaint.severity} />
                <StatusBadge status={complaint.status} />
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-[#202B2A] dark:text-white tracking-tight">
                {complaint.title}
              </h1>

              <div className="flex items-center gap-5 text-xs text-[#66736F] dark:text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#66736F]" />
                  {complaint.location.address}
                </span>
                <span className="flex items-center gap-1.5 tabular-nums">
                  <Calendar className="w-3.5 h-3.5 text-[#66736F]" />
                  Filed on {new Date(complaint.createdAt).toLocaleString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#66736F]" />
                  Reporter: {complaint.citizenName}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-shrink-0 self-start lg:self-auto">
              <Button
                variant={complaint.isUpvoted ? 'primary' : 'outline'}
                size="md"
                onClick={handleToggleUpvote}
                leftIcon={<ThumbsUp className="w-3.5 h-3.5" />}
              >
                <span>{complaint.isUpvoted ? 'Supported' : 'Support Issue'}</span>
                <span className="ml-1.5 px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 text-xs tabular-nums">
                  {complaint.upvotes}
                </span>
              </Button>

              {/* Status Update Button (Visible for Staff & Admin roles) */}
              {(role === 'staff' || role === 'admin') && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowStatusModal(true)}
                  leftIcon={<Wrench className="w-3.5 h-3.5" />}
                >
                  Update Status ({role})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Description, Evidence Photos, Map */}
          <div className="lg:col-span-8 space-y-6">
            {/* Description Card */}
            <Card>
              <CardHeader title="Grievance Details & Location" />
              <CardContent className="space-y-4">
                <p className="text-xs sm:text-sm text-[#202B2A] dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {complaint.description}
                </p>

                {complaint.location.landmark && (
                  <div className="p-3 rounded-md bg-[#FAFAF7] dark:bg-[#0E1624] border border-[#E5E8E4] dark:border-[#22344D] text-xs">
                    <span className="font-semibold text-[#202B2A] dark:text-slate-200">
                      Nearby Landmark:
                    </span>{' '}
                    <span className="text-[#66736F] dark:text-slate-400">
                      {complaint.location.landmark}
                    </span>
                  </div>
                )}

                {/* Embedded Map */}
                <div className="pt-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400 mb-2">
                    Incident Geolocation ({complaint.location.lat.toFixed(4)},{' '}
                    {complaint.location.lng.toFixed(4)})
                  </h4>
                  <div className="rounded-lg overflow-hidden border border-[#E5E8E4] dark:border-[#22344D]">
                    <CivicMap
                      complaints={[complaint]}
                      selectedComplaintId={complaint.id}
                      height="280px"
                      center={[complaint.location.lat, complaint.location.lng]}
                      zoom={15}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photographic Evidence Gallery */}
            <Card>
              <CardHeader
                title={`Photo Evidence (${complaint.images.length})`}
                subtitle="Captured on site by citizen reporter"
              />
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {complaint.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg overflow-hidden border border-[#E5E8E4] dark:border-[#22344D] h-52 group relative"
                    >
                      <img
                        src={img}
                        alt={`Evidence ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Public Audit Timeline */}
            <Card>
              <CardHeader
                title="Municipal Resolution Ledger"
                subtitle="Chronological audit records verified by municipal staff & triage dispatch"
              />
              <CardContent>
                <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#E5E8E4] dark:before:bg-[#22344D]">
                  {complaint.timeline.map((event) => (
                    <div key={event.id} className="relative">
                      {/* Timeline Node Dot */}
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white dark:bg-[#131E30] border-2 border-[#183B3A] dark:border-[#2563EB] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#183B3A] dark:bg-[#2563EB]" />
                      </div>

                      <div className="bg-[#FAFAF7] dark:bg-[#0E1624] p-3.5 rounded-lg border border-[#E5E8E4] dark:border-[#22344D] space-y-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-[#202B2A] dark:text-white">
                            {event.title}
                          </h4>
                          <span className="text-[10px] text-[#66736F] dark:text-slate-400 tabular-nums">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#202B2A] dark:text-slate-300 leading-relaxed">
                          {event.description}
                        </p>
                        <div className="text-[10px] font-semibold text-[#66736F] dark:text-slate-400 pt-1">
                          Actor: {event.actorName} ({event.actorRole})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols): AI Triage, Municipal Routing, Duplicate Detection */}
          <div className="lg:col-span-4 space-y-6">
            {/* Triage Analysis Card */}
            <Card>
              <CardHeader
                title="Automated Triage Audit"
                subtitle="Semantic evaluation & priority ranking"
              />
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#FAFAF7] dark:bg-[#0E1624] border border-[#E5E8E4] dark:border-[#22344D]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#66736F] dark:text-slate-400 tracking-wider">
                      Priority Score
                    </span>
                    <div className="text-2xl font-bold tabular-nums text-[#183B3A] dark:text-[#3B8278]">
                      {complaint.aiTriage.priorityScore} / 100
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#66736F] dark:text-slate-400 tracking-wider">
                      Confidence
                    </span>
                    <div className="text-xs font-bold text-[#202B2A] dark:text-slate-300 tabular-nums">
                      {(complaint.aiTriage.confidenceScore * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-[11px] font-bold text-[#66736F] dark:text-slate-400 uppercase tracking-wider mb-1">
                    Semantic Synthesis
                  </h5>
                  <p className="text-xs text-[#202B2A] dark:text-slate-300 leading-relaxed bg-[#FAFAF7] dark:bg-[#0E1624] p-3 rounded-md border border-[#E5E8E4] dark:border-[#22344D]">
                    {complaint.aiTriage.summary}
                  </p>
                </div>

                {complaint.aiTriage.isOverridden && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Administrative Override Active
                    </div>
                    <p className="text-[11px]">{complaint.aiTriage.overrideNotes}</p>
                    <span className="text-[10px] text-amber-700 dark:text-amber-300">
                      By: {complaint.aiTriage.overriddenBy}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Department Assignment */}
            <Card>
              <CardHeader title="Municipal Routing" />
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-[#66736F] dark:text-slate-400 block mb-0.5">Assigned Department</span>
                  <span className="font-semibold text-[#202B2A] dark:text-white flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#183B3A] dark:text-[#3B8278]" />
                    {complaint.assignedDepartment}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#E5E8E4] dark:border-[#22344D]">
                  <span className="text-[#66736F] dark:text-slate-400 block mb-0.5">Assigned Field Crew</span>
                  <span className="font-semibold text-[#202B2A] dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#66736F]" />
                    {complaint.assignedStaffName || 'Queued for Dispatch Assignment'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Cluster & Duplicate Detection */}
            <Card>
              <CardHeader
                title="Duplicate & Cluster Check"
                subtitle="Nearby reports with similar characteristics"
              />
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-[#FAFAF7] dark:bg-[#0E1624] border border-[#E5E8E4] dark:border-[#22344D] text-xs">
                  <div className="flex items-center gap-1.5 text-[#202B2A] dark:text-white font-semibold mb-1">
                    <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                    1 Similar Nearby Report Detected
                  </div>
                  <p className="text-[11px] text-[#66736F] dark:text-slate-400 leading-relaxed">
                    CC-2025-0820 ("Minor Pothole 50m East") linked with this case record to prevent duplicate field dispatches.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Staff Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Grievance Status"
        description="Transition this grievance through the municipal resolution lifecycle."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-1.5">
              Select New Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['acknowledged', 'in_progress', 'resolved', 'rejected'] as ComplaintStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedNewStatus(st)}
                    className={`py-2 px-3 rounded-md border text-xs font-semibold capitalize text-center transition-all ${
                      selectedNewStatus === st
                        ? 'border-[#183B3A] bg-[#183B3A] text-white dark:border-[#2563EB] dark:bg-[#2563EB]'
                        : 'border-[#E5E8E4] dark:border-[#22344D] hover:bg-[#FAFAF7] dark:hover:bg-[#111A29] text-[#202B2A] dark:text-slate-300'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-1.5">
              Work Order Log / Notes
            </label>
            <textarea
              rows={3}
              value={statusUpdateNote}
              onChange={(e) => setStatusUpdateNote(e.target.value)}
              placeholder="e.g. Field inspection complete. Asphalt hot mix batch ordered for tomorrow morning."
              className="block w-full rounded-md border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#111A29] text-xs text-[#202B2A] dark:text-white p-3 focus:outline-none focus:ring-1 focus:ring-[#183B3A]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStatusModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isUpdatingStatus}
              onClick={handleStatusChangeSubmit}
            >
              Confirm Status Transition
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComplaintDetailsPage;
