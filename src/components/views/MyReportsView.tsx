// SCIP Citizen Portal - My Submitted Reports List
// Indian Government Portal Aesthetic with verifiable records and status tracking
import React, { useState, useEffect } from 'react';
import { Report } from '../../types/scip';
import { api } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import { ReportDetailModal } from './ReportDetailModal';
import {
  ListFilter,
  Search,
  ExternalLink,
  MapPin,
  Clock,
  PlusCircle,
  FileCheck,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface MyReportsViewProps {
  onNavigateToSubmit: () => void;
  onOpenIncident?: (incidentId: string) => void;
}

export const MyReportsView: React.FC<MyReportsViewProps> = ({
  onNavigateToSubmit,
  onOpenIncident
}) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [user]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const res = await api.getReports({ myOnly: user?.role === 'citizen' });
      setReports(res || []);
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to withdraw and close report ${reportId}?`)) {
      return;
    }
    try {
      await api.withdrawReport(reportId);
      await loadReports();
    } catch (err: any) {
      alert(err.message || 'Failed to withdraw report.');
    }
  };

  const filtered = reports.filter(r => {
    if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.locationName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-[#28834A] bg-[#EBF7EE] border-[#A7E0B8] font-bold';
      case 'assigned':
      case 'linked':
      case 'under_review':
        return 'text-[#1F5F91] bg-[#EAF2F8] border-[#DCE3EA] font-bold';
      case 'closed':
        return 'text-[#657586] bg-[#F5F7FA] border-[#DCE3EA]';
      default:
        return 'text-[#E89B36] bg-[#FEF6EC] border-[#FBD38D] font-bold';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 text-[#253443]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE3EA] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#1F5F91]">
            <span className="w-2 h-2 rounded-full bg-[#E89B36]" />
            <span>Citizen Grievance Registry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#153E63] mt-1">
            My Submitted Community Observations
          </h1>
          <p className="text-xs text-[#657586] font-medium mt-0.5">
            Track submitted reports, review automated AI risk evaluations, and inspect municipal department work orders.
          </p>
        </div>

        <button
          onClick={onNavigateToSubmit}
          className="px-5 py-2.5 text-xs font-bold text-white bg-[#1F5F91] hover:bg-[#153E63] rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#E89B36]" />
          <span>Submit New Grievance</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#DCE3EA] flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px] bg-[#F5F7FA] px-3.5 py-2 rounded-lg border border-[#DCE3EA]">
          <Search className="w-4 h-4 text-[#657586] shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by title, location, or Reference ID (REP-...)..."
            className="w-full bg-transparent text-xs text-[#253443] focus:outline-hidden placeholder-[#657586]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#F5F7FA] border border-[#DCE3EA] rounded-lg text-[#253443] text-xs focus:bg-white focus:outline-hidden"
          >
            <option value="ALL">All Categories</option>
            <option value="Water & Drainage">Water & Drainage</option>
            <option value="Roads & Traffic">Roads & Traffic</option>
            <option value="Public Sanitation">Public Sanitation</option>
            <option value="Power & Lighting">Power & Lighting</option>
            <option value="Structural Safety">Structural Safety</option>
            <option value="Parks & Environment">Parks & Environment</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F5F7FA] border border-[#DCE3EA] rounded-lg text-[#253443] text-xs focus:bg-white focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="analyzed">Analyzed</option>
            <option value="under_review">Under Review</option>
            <option value="linked">Linked to Incident</option>
            <option value="assigned">Assigned</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed / Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-[#DCE3EA] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-[#657586]">
            Loading submitted reports from municipal database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#657586] space-y-3">
            <FileCheck className="w-8 h-8 text-[#1F5F91] mx-auto" />
            <div className="font-semibold text-slate-800">No matching reports found in database</div>
            <button
              onClick={onNavigateToSubmit}
              className="text-xs text-[#1F5F91] hover:underline font-bold"
            >
              Submit your first community report
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#153E63] text-white font-semibold">
                <tr>
                  <th className="p-3.5">Reference ID</th>
                  <th className="p-3.5">Title & Observation</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Date Logged</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE3EA] text-[#253443]">
                {filtered.map(report => (
                  <tr
                    key={report.id}
                    className="hover:bg-[#F5F7FA] transition-colors cursor-pointer"
                    onClick={() => setSelectedReportId(report.id)}
                  >
                    <td className="p-3.5 font-mono text-[11px] font-bold text-[#1F5F91] whitespace-nowrap">
                      {report.id}
                    </td>
                    <td className="p-3.5 font-bold text-[#153E63] max-w-xs truncate">
                      {report.title}
                    </td>
                    <td className="p-3.5 text-[#253443] whitespace-nowrap">
                      {report.category}
                    </td>
                    <td className="p-3.5 text-[#657586] max-w-xs truncate">
                      {report.locationName}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold border ${getStatusBadge(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono text-[11px] text-[#657586] whitespace-nowrap tabular-nums">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedReportId(report.id);
                          }}
                          className="p-1 text-[#1F5F91] hover:text-[#153E63] transition-colors"
                          title="View Official Dossier"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        {report.status !== 'resolved' && report.status !== 'closed' && (
                          <button
                            onClick={e => handleWithdraw(e, report.id)}
                            className="p-1 text-[#657586] hover:text-[#B42318] transition-colors"
                            title="Withdraw Grievance"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Inspector */}
      {selectedReportId && (
        <ReportDetailModal
          reportId={selectedReportId}
          onClose={() => setSelectedReportId(null)}
          onOpenIncident={onOpenIncident}
        />
      )}
    </div>
  );
};
