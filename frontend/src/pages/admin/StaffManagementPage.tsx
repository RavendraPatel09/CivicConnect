import React, { useState } from 'react';
import mockStorage from '../../services/mock/mockStorage';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Users, HardHat, Mail, Phone, Building, CheckCircle2, PlusCircle, Search } from 'lucide-react';

export const StaffManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const allUsers = mockStorage.getAllUsers();
  const complaints = mockStorage.getComplaints();

  const staffMembers = allUsers.filter((u) => u.role === 'staff' || u.role === 'admin');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-civic" />
            Municipal Staff & Field Crew Roster
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage assigned inspectors, field crew workloads, and municipal team leads.
          </p>
        </div>

        <Button variant="civic" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
          Invite Field Inspector
        </Button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staffMembers.map((staff) => {
          const assignedTickets = complaints.filter(
            (c) => c.assignedStaffId === staff.id || c.assignedStaffName === staff.name
          );
          const activeWorkOrders = assignedTickets.filter(
            (c) => c.status === 'in_progress' || c.status === 'acknowledged'
          ).length;
          const resolvedWorkOrders = assignedTickets.filter(
            (c) => c.status === 'resolved'
          ).length;

          return (
            <Card key={staff.id} className="p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={staff.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                    alt={staff.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {staff.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-civic bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded capitalize">
                      {staff.role === 'admin' ? 'Administrator' : 'Field Lead'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{staff.department || 'Public Works'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{staff.phone || '+1 (555) 000-0000'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 dark:bg-[#0E1726] rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Active Work Orders</span>
                    <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                      {activeWorkOrders}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-[#0E1726] rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Resolved</span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {resolvedWorkOrders}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2 flex gap-2">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Inspect Schedule
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StaffManagementPage;
