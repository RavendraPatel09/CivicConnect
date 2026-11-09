import React, { useState, useEffect, useMemo } from 'react';
import ticketsApi from '../../services/api/tickets.api';
import { Complaint, ComplaintCategory, ComplaintSeverity, ComplaintStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { CATEGORIES } from '../../constants';
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Calendar,
  User,
  Building,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ComplaintManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<ComplaintSeverity | 'all'>('all');
  const [sortField, setSortField] = useState<'createdAt' | 'priority' | 'title'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Drawer & Status modal states
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [statusModalTicket, setStatusModalTicket] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('in_progress');
  const [statusNotes, setStatusNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTickets = () => {
    ticketsApi.getTickets().then(setComplaints);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Filter & Sort
  const processedComplaints = useMemo(() => {
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

    list.sort((a, b) => {
      if (sortField === 'priority') {
        const diff = b.aiTriage.priorityScore - a.aiTriage.priorityScore;
        return sortOrder === 'desc' ? diff : -diff;
      }
      if (sortField === 'title') {
        const diff = a.title.localeCompare(b.title);
        return sortOrder === 'asc' ? diff : -diff;
      }
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortOrder === 'desc' ? diff : -diff;
    });

    return list;
  }, [complaints, searchQuery, categoryFilter, statusFilter, severityFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(processedComplaints.length / itemsPerPage) || 1;
  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedComplaints.slice(start, start + itemsPerPage);
  }, [processedComplaints, currentPage, itemsPerPage]);

  const toggleSort = (field: 'createdAt' | 'priority' | 'title') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

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
      fetchTickets();
      setStatusModalTicket(null);
      setStatusNotes('');
      if (selectedTicket?.id === statusModalTicket.id) {
        setSelectedTicket(null);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Municipal Complaint Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search, sort, filter, and transition public grievance work orders across all city sectors.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#131E30] rounded-xl p-4 border border-slate-200/90 dark:border-[#22344D] shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search ID, title, citizen, street..."
              className="block w-full rounded-lg border border-slate-200 dark:border-[#22344D] bg-slate-50 dark:bg-[#111A29] text-xs text-slate-900 dark:text-white pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-civic/20"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="block w-full rounded-lg border border-slate-200 dark:border-[#22344D] bg-slate-50 dark:bg-[#111A29] text-xs text-slate-900 dark:text-white px-3 py-2"
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
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="block w-full rounded-lg border border-slate-200 dark:border-[#22344D] bg-slate-50 dark:bg-[#111A29] text-xs text-slate-900 dark:text-white px-3 py-2"
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
              onChange={(e) => {
                setSeverityFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="block w-full rounded-lg border border-slate-200 dark:border-[#22344D] bg-slate-50 dark:bg-[#111A29] text-xs text-slate-900 dark:text-white px-3 py-2"
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

      {/* Main Data Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">ID</th>
                <th
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-white"
                  onClick={() => toggleSort('title')}
                >
                  <div className="flex items-center gap-1">
                    <span>Issue Title</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Category</th>
                <th
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-white"
                  onClick={() => toggleSort('priority')}
                >
                  <div className="flex items-center gap-1">
                    <span>AI Priority</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Location</th>
                <th
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-white"
                  onClick={() => toggleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    <span>Submitted</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Assigned Staff</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedComplaints.length > 0 ? (
                paginatedComplaints.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-slate-600 dark:text-slate-400">
                      {ticket.id}
                    </td>

                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {ticket.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Citizen: {ticket.citizenName}
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <CategoryBadge category={ticket.category} size="sm" />
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            ticket.aiTriage.priorityScore >= 85
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                              : ticket.aiTriage.priorityScore >= 65
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {ticket.aiTriage.priorityScore}
                        </span>
                        <SeverityBadge severity={ticket.severity} size="sm" />
                      </div>
                    </td>

                    <td className="px-4 py-3 max-w-[180px] truncate text-slate-500">
                      {ticket.location.address}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium">
                      {ticket.assignedStaffName || (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={ticket.status} size="sm" />
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedTicket(ticket)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          title="View Quick Drawer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStatusModalTicket(ticket);
                            setNewStatus(ticket.status);
                          }}
                          className="px-2 py-1 rounded text-[11px] font-semibold bg-civic/10 text-civic hover:bg-civic/20 transition-colors"
                        >
                          Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    No complaints matched your search filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, processedComplaints.length)} of{' '}
            {processedComplaints.length} records
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Details Slide-Over Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedTicket(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-[#131E30] border-l border-slate-200 dark:border-[#22344D] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {selectedTicket.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedTicket.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
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
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    Description
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedTicket.description}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-[#0E1726] p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">AI Priority:</span>
                    <span className="font-bold text-teal">
                      {selectedTicket.aiTriage.priorityScore} / 100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedTicket.assignedDepartment}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Staff:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedTicket.assignedStaffName || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Citizen Reporter:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedTicket.citizenName}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-2">
                    Evidence Photos
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTicket.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Evidence"
                        className="rounded-lg h-24 w-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <Link
                  to={`/tickets/${selectedTicket.id}`}
                  className="flex-1"
                >
                  <Button variant="civic" size="sm" className="w-full">
                    View Full Record
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
        title={`Update Status: ${statusModalTicket?.id}`}
        description="Transition grievance state and write public audit notes."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
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
              Work Order Notes / Reason
            </label>
            <textarea
              rows={3}
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              placeholder="e.g. Field crew Marcus Vance dispatched with emergency patch unit."
              className="block w-full rounded-lg border border-slate-300 dark:border-[#22344D] bg-white dark:bg-[#111A29] text-sm text-slate-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-civic/20"
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
              variant="civic"
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
