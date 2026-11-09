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
  Cpu,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  ArrowLeft,
  Share2,
  FileCheck,
  Wrench,
  Layers,
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
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1320] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-civic border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading complaint record...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1320] flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Record Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
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
    <div className="min-h-screen bg-[#F6F8FA] dark:bg-[#0B1320] text-[#172B3A] dark:text-[#F1F5F9] flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200/90 dark:border-[#22344D] bg-white dark:bg-[#131E30] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
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
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5"
            title="Copy URL"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{copySuccess ? 'Copied Link!' : 'Share'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-[#131E30] rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-[#22344D] shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {complaint.id}
                </span>
                <CategoryBadge category={complaint.category} />
                <SeverityBadge severity={complaint.severity} />
                <StatusBadge status={complaint.status} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {complaint.title}
              </h1>

              <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {complaint.location.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Filed on {new Date(complaint.createdAt).toLocaleString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  Reported by {complaint.citizenName}
                </span>
              </div>
            </div>

            {/* Quick Actions (Upvote & Staff Status Transition) */}
            <div className="flex items-center gap-3 flex-shrink-0 self-start lg:self-auto">
              <Button
                variant={complaint.isUpvoted ? 'civic' : 'outline'}
                size="md"
                onClick={handleToggleUpvote}
                leftIcon={<ThumbsUp className="w-4 h-4" />}
              >
                <span>{complaint.isUpvoted ? 'Supported' : 'Support Issue'}</span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-white/20 text-xs">
                  {complaint.upvotes}
                </span>
              </Button>

              {/* Status Update Button (Visible for Staff & Admin roles) */}
              {(role === 'staff' || role === 'admin') && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowStatusModal(true)}
                  leftIcon={<Wrench className="w-4 h-4" />}
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
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {complaint.description}
                </p>

                {complaint.location.landmark && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0E1726] border border-slate-200/80 dark:border-slate-800 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Nearby Landmark:
                    </span>{' '}
                    <span className="text-slate-500 dark:text-slate-400">
                      {complaint.location.landmark}
                    </span>
                  </div>
                )}

                {/* Embedded Map */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Geocoded Coordinates ({complaint.location.lat.toFixed(4)},{' '}
                    {complaint.location.lng.toFixed(4)})
                  </h4>
                  <CivicMap
                    complaints={[complaint]}
                    selectedComplaintId={complaint.id}
                    height="280px"
                    center={[complaint.location.lat, complaint.location.lng]}
                    zoom={15}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Photographic Evidence Gallery */}
            <Card>
              <CardHeader
                title={`Supporting Visual Proof (${complaint.images.length})`}
                subtitle="Captured on site by citizen reporter"
              />
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {complaint.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#22344D] h-56 group relative"
                    >
                      <img
                        src={img}
                        alt={`Evidence ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Public Audit Timeline */}
            <Card>
              <CardHeader
                title="Transparent Resolution Timeline"
                subtitle="Immutable activity ledger verified by municipal staff & AI triage engine"
              />
              <CardContent>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {complaint.timeline.map((event) => (
                    <div key={event.id} className="relative">
                      {/* Timeline Node Dot */}
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white dark:bg-[#131E30] border-2 border-civic flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-civic" />
                      </div>

                      <div className="bg-slate-50 dark:bg-[#0E1726] p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {event.title}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {event.description}
                        </p>
                        <div className="text-[10px] font-semibold text-slate-400 pt-1">
                          Actor: {event.actorName} ({event.actorRole})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols): AI Triage Radar, Municipal Assignment, Similar Issues */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Triage Radar Card */}
            <Card className="border-teal-200/80 dark:border-teal-900/50 bg-gradient-to-b from-teal-50/20 to-transparent">
              <CardHeader
                title={
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-teal" />
                    <span>AI Triage Analysis</span>
                  </div>
                }
                subtitle="Automated semantic intake assessment"
              />
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300">
                      Calculated Priority Score
                    </span>
                    <div className="text-2xl font-black text-teal-900 dark:text-teal-100">
                      {complaint.aiTriage.priorityScore} / 100
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Confidence
                    </span>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {(complaint.aiTriage.confidenceScore * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    AI Summary
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {complaint.aiTriage.summary}
                  </p>
                </div>

                {complaint.aiTriage.isOverridden && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Manually Overridden by Admin
                    </div>
                    <p className="text-[11px]">{complaint.aiTriage.overrideNotes}</p>
                    <span className="text-[10px] text-amber-600">
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
                  <span className="text-slate-400 block mb-0.5">Assigned Department</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-civic" />
                    {complaint.assignedDepartment}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Assigned Field Staff</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    {complaint.assignedStaffName || 'Queued for Dispatch Assignment'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Similar Reported Issues */}
            <Card>
              <CardHeader
                title="Cluster & Duplicate Detection"
                subtitle="Nearby reports with similar characteristics"
              />
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0E1726] border border-slate-200/60 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-semibold mb-1">
                    <Layers className="w-3.5 h-3.5 text-civic" />
                    1 Similar Nearby Report Detected
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    CC-2025-0820 ("Minor Pothole 50m East") consolidated into this work order to prevent duplicate crew dispatches.
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Select New Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['acknowledged', 'in_progress', 'resolved', 'rejected'] as ComplaintStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedNewStatus(st)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize text-center transition-all ${
                      selectedNewStatus === st
                        ? 'border-civic bg-civic text-white'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Work Order Log / Notes
            </label>
            <textarea
              rows={3}
              value={statusUpdateNote}
              onChange={(e) => setStatusUpdateNote(e.target.value)}
              placeholder="e.g. Field inspection complete. Asphalt hot mix batch ordered for tomorrow morning."
              className="block w-full rounded-lg border border-slate-300 dark:border-[#22344D] bg-white dark:bg-[#111A29] text-sm text-slate-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-civic/20"
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
              variant="civic"
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
