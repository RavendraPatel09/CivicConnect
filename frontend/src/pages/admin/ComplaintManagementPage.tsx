import React, { useState, useEffect, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import ticketsApi from '../../services/api/tickets.api';
import { Complaint, ComplaintCategory, ComplaintSeverity, ComplaintStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import DataTable from '../../components/ui/DataTable';
import { CATEGORIES } from '../../constants';
import {
  Search,
  Filter,
  Eye,
  X,
  MapPin,
  Calendar,
  User,
  Building,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ComplaintManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<ComplaintSeverity | 'all'>('all');

  // Drawer & Status modal states
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [statusModalTicket, setStatusModalTicket] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('in_progress');
  const [statusNotes, setStatusNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await ticketsApi.getTickets();
      setComplaints(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Filter & Search
  const filteredComplaints = useMemo(() => {
    let list = [...complaints];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.location.address.toLowerCase().includes(q) ||
          c.citizenName.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'all') {
      list = list.filter((c) => c.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      list = list.filter((c) => c.status === statusFilter);
    }

    if (severityFilter !== 'all') {
      list = list.filter((c) => c.severity === severityFilter);
    }

    return list;
  }, [complaints, searchQuery, categoryFilter, statusFilter, severityFilter]);

  const handleUpdateStatusSubmit = async () => {
    if (!statusModalTicket || !user) return;
    setIsUpdating(true);
    try {
      await ticketsApi.updateTicketStatus(
        statusModalTicket.id,
        newStatus,
        user,
        statusNotes || undefined
      );
      await fetchTickets();
      setStatusModalTicket(null);
      setStatusNotes('');
      if (selectedTicket?.id === statusModalTicket.id) {
        setSelectedTicket(null);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const columns = useMemo<ColumnDef<Complaint>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Case ID',
        cell: (info) => (
          <span className="font-mono text-[11px] font-bold text-[#183B3A] dark:text-[#3B8278]">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title & Citizen',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="max-w-[260px]">
              <div className="font-semibold text-xs text-[#202B2A] dark:text-white truncate">
                {row.title}
              </div>
              <div className="text-[11px] text-[#66736F] dark:text-slate-400 truncate">
                Citizen: {row.citizenName}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: (info) => (
          <CategoryBadge category={info.getValue() as ComplaintCategory} size="sm" />
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        accessorFn: (row) => row.aiTriage.priorityScore,
        cell: (info) => {
          const row = info.row.original;
          const score = row.aiTriage.priorityScore;
          return (
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded tabular-nums ${
                  score >= 80
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                    : score >= 60
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {score}
              </span>
              <SeverityBadge severity={row.severity} size="sm" />
            </div>
          );
        },
      },
      {
        accessorKey: 'location.address',
        header: 'Location',
        cell: (info) => (
          <div className="max-w-[180px] truncate text-xs text-[#66736F] dark:text-slate-400" title={info.getValue() as string}>
            {info.getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Filed',
        cell: (info) => (
          <span className="text-xs text-[#66736F] dark:text-slate-400 tabular-nums whitespace-nowrap">
            {new Date(info.getValue() as string).toLocaleDateString()}
          </span>
        ),
      },
      {
        accessorKey: 'assignedStaffName',
        header: 'Assigned Staff',
        cell: (info) => {
          const staff = info.getValue() as string | undefined;
          return (
            <span className="text-xs text-[#202B2A] dark:text-slate-300">
              {staff || <span className="text-[#66736F] italic">Unassigned</span>}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => (
          <StatusBadge status={info.getValue() as ComplaintStatus} size="sm" />
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTicket(row);
                }}
                className="p-1 rounded text-[#66736F] hover:text-[#202B2A] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Quick Overview"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setStatusModalTicket(row);
                  setNewStatus(row.status);
                }}
                className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2563EB]/10 text-[#2563EB] hover:bg-[#2563EB]/20 dark:bg-[#2563EB]/20 dark:text-blue-300 transition-colors"
              >
                Status
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E8E4] dark:border-[#22344D]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#202B2A] dark:text-white">
            Municipal Complaint Queue
          </h1>
          <p className="text-xs text-[#66736F] dark:text-slate-400 mt-0.5">
            Structured public grievance work orders across municipal districts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTickets}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Queue
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#131E30] rounded-lg p-3.5 border border-[#E5E8E4] dark:border-[#22344D] shadow-subtle space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#66736F]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, title, citizen, street..."
              className="block w-full rounded-md border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#111A29] text-xs text-[#202B2A] dark:text-white pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#183B3A]"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="block w-full rounded-md border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#111A29] text-xs text-[#202B2A] dark:text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#183B3A]"
            >
              <option value="all">All Categories</option>
              {Object.keys(CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORIES[cat as ComplaintCategory].name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="block w-full rounded-md border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#111A29] text-xs text-[#202B2A] dark:text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#183B3A]"
            >
              <option value="all">All Statuses</option>
              <option value="filed">Filed</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="sm:col-span-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="block w-full rounded-md border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#111A29] text-xs text-[#202B2A] dark:text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#183B3A]"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* TanStack Data Table */}
      <DataTable
        columns={columns}
        data={filteredComplaints}
        pageSize={8}
        isLoading={loading}
        onRowClick={(row) => setSelectedTicket(row)}
      />

      {/* Details Slide-Over Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedTicket(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-[#131E30] border-l border-[#E5E8E4] dark:border-[#22344D] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#E5E8E4] dark:border-[#22344D] pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#183B3A] dark:text-[#3B8278]">
                      {selectedTicket.id}
                    </span>
                    <h3 className="text-base font-bold text-[#202B2A] dark:text-white mt-0.5">
                      {selectedTicket.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="p-1.5 rounded-lg text-[#66736F] hover:text-[#202B2A] dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedTicket.status} />
                  <SeverityBadge severity={selectedTicket.severity} />
                  <CategoryBadge category={selectedTicket.category} />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#66736F] dark:text-slate-400 uppercase tracking-wider">
                    Grievance Description
                  </span>
                  <p className="text-xs text-[#202B2A] dark:text-slate-300 leading-relaxed">
                    {selectedTicket.description}
                  </p>
                </div>

                {/* Audit Key-Values */}
                <div className="bg-[#FAFAF7] dark:bg-[#0E1624] p-3.5 rounded-lg border border-[#E5E8E4] dark:border-[#22344D] text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#66736F] dark:text-slate-400">AI Priority Score:</span>
                    <span className="font-bold tabular-nums text-[#183B3A] dark:text-[#3B8278]">
                      {selectedTicket.aiTriage.priorityScore} / 100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#66736F] dark:text-slate-400">Jurisdiction Dept:</span>
                    <span className="font-semibold text-[#202B2A] dark:text-white">
                      {selectedTicket.assignedDepartment}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#66736F] dark:text-slate-400">Assigned Staff:</span>
                    <span className="font-semibold text-[#202B2A] dark:text-white">
                      {selectedTicket.assignedStaffName || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#66736F] dark:text-slate-400">Reporting Citizen:</span>
                    <span className="font-semibold text-[#202B2A] dark:text-white">
                      {selectedTicket.citizenName}
                    </span>
                  </div>
                </div>

                {selectedTicket.images && selectedTicket.images.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-[#66736F] dark:text-slate-400 uppercase tracking-wider block mb-2">
                      Evidence Documentation
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTicket.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Evidence"
                          className="rounded-lg h-24 w-full object-cover border border-[#E5E8E4] dark:border-[#22344D]"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-[#E5E8E4] dark:border-[#22344D] flex gap-2">
                <Link
                  to={`/tickets/${selectedTicket.id}`}
                  className="flex-1"
                >
                  <Button variant="primary" size="sm" className="w-full flex items-center justify-center gap-1.5">
                    <span>Full Case Record</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatusModalTicket(selectedTicket);
                    setNewStatus(selectedTicket.status);
                  }}
                >
                  Change Status
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      <Modal
        isOpen={!!statusModalTicket}
        onClose={() => setStatusModalTicket(null)}
        title={`Update Case Status: ${statusModalTicket?.id}`}
        description="Transition grievance state and write public audit notes."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-1.5">
              Select Destination Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['acknowledged', 'in_progress', 'resolved', 'rejected'] as ComplaintStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setNewStatus(st)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-all ${
                      newStatus === st
                        ? 'border-[#183B3A] bg-[#183B3A] text-white dark:border-[#2563EB] dark:bg-[#2563EB]'
                        : 'border-[#E5E8E4] dark:border-[#22344D] hover:bg-[#FAFAF7] dark:hover:bg-slate-800 text-[#202B2A] dark:text-slate-300'
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
              Work Order Audit Notes
            </label>
            <textarea
              rows={3}
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              placeholder="e.g. Field crew Marcus Vance dispatched with emergency patch unit."
              className="block w-full rounded-md border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#111A29] text-xs text-[#202B2A] dark:text-white p-3 focus:outline-none focus:ring-1 focus:ring-[#183B3A]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatusModalTicket(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isUpdating}
              onClick={handleUpdateStatusSubmit}
            >
              Confirm Update
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComplaintManagementPage;
