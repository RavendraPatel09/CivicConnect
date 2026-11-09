import React, { useMemo } from 'react';
import mockStorage from '../../services/mock/mockStorage';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { ScrollText, Shield, Clock, User, CheckCircle2 } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const complaints = mockStorage.getComplaints();

  // Aggregate all timeline events from all complaints into a unified audit trail
  const auditLogs = useMemo(() => {
    const logs: Array<{
      id: string;
      complaintId: string;
      complaintTitle: string;
      timestamp: string;
      action: string;
      description: string;
      actorName: string;
      actorRole: string;
    }> = [];

    complaints.forEach((c) => {
      c.timeline.forEach((tl) => {
        logs.push({
          id: tl.id,
          complaintId: c.id,
          complaintTitle: c.title,
          timestamp: tl.timestamp,
          action: tl.title,
          description: tl.description,
          actorName: tl.actorName,
          actorRole: tl.actorRole,
        });
      });
    });

    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return logs;
  }, [complaints]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ScrollText className="w-6 h-6 text-civic" />
          Municipal Audit Logs
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Immutable event ledger recording intake classifications, dispatch events, status transitions, and AI overrides.
        </p>
      </div>

      <Card>
        <CardHeader
          title={`Verified Activity Records (${auditLogs.length})`}
          subtitle="Cryptographically verified open municipal audit timeline"
        />
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {log.complaintId}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {log.action}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {log.description}
                </p>
                <div className="text-[11px] text-slate-400">
                  Target: {log.complaintTitle}
                </div>
              </div>

              <div className="text-left sm:text-right flex-shrink-0 text-xs text-slate-500">
                <div className="font-semibold text-slate-700 dark:text-slate-300">
                  {log.actorName} ({log.actorRole})
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AuditLogsPage;
