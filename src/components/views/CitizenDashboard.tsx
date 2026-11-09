// SCIP Citizen Portal - Citizen Dashboard View
// Indian Government Portal Aesthetic with verifiable records and official citizen cards
import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import { Report, Incident } from '../../types/scip';
import { ReportDetailModal } from './ReportDetailModal';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlusCircle,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';

interface CitizenDashboardProps {
  onNavigateToSubmit: () => void;
  onNavigateToMyReports: () => void;
  onOpenIncident?: (incidentId: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onNavigateToSubmit,
  onNavigateToMyReports,
  onOpenIncident
}) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const rep = await api.getReports({ myOnly: true });
      const inc = await api.getIncidents();
      setReports(rep || []);
      setIncidents(inc || []);
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const pendingCount = reports.filter(r => r.status === 'submitted' || r.status === 'analyzed').length;
  const activeReportsCount = reports.filter(r => r.status === 'under_review' || r.status === 'linked' || r.status === 'assigned').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;
  const activeCommunityIncidents = incidents.filter(i => i.status === 'confirmed' || i.status === 'in_progress');

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 text-[#253443]">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-[#DCE3EA] p-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#1F5F91] tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#E89B36]" />
            <span>Citizen Engagement Services · Municipal District</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#153E63] mt-1">
            Welcome, {user?.name || 'Citizen'}
          </h1>
          <p className="text-xs text-[#657586] mt-0.5">
            Registered Citizen Profile: <span className="font-mono text-[#253443] font-semibold">{user?.email}</span>
          </p>
        </div>

        <button
          onClick={onNavigateToSubmit}
          className="px-5 py-2.5 text-xs font-bold text-white bg-[#1F5F91] hover:bg-[#153E63] rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#E89B36]" />
          <span>Report New Grievance</span>
        </button>
      </div>

      {/* KPI Stat Cards (Strictly Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-[#DCE3EA] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#657586] font-semibold uppercase tracking-wider">
            <span>My Total Reports</span>
            <FileText className="w-4 h-4 text-[#1F5F91]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#153E63] font-mono tabular-nums">
            {isLoading ? '...' : reports.length}
          </div>
          <div className="text-[11px] text-[#657586]">Lifetime submitted observations</div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-[#DCE3EA] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#657586] font-semibold uppercase tracking-wider">
            <span>Pending Intake</span>
            <Clock className="w-4 h-4 text-[#E89B36]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#E89B36] font-mono tabular-nums">
            {isLoading ? '...' : pendingCount}
          </div>
          <div className="text-[11px] text-[#657586]">Queued for officer inspection</div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-[#DCE3EA] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#657586] font-semibold uppercase tracking-wider">
            <span>Under Review / Assigned</span>
            <AlertTriangle className="w-4 h-4 text-[#1F5F91]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1F5F91] font-mono tabular-nums">
            {isLoading ? '...' : activeReportsCount}
          </div>
          <div className="text-[11px] text-[#657586]">Dispatched to department work order</div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-[#DCE3EA] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#657586] font-semibold uppercase tracking-wider">
            <span>Resolved Observations</span>
            <CheckCircle2 className="w-4 h-4 text-[#28834A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#28834A] font-mono tabular-nums">
            {isLoading ? '...' : resolvedCount}
          </div>
          <div className="text-[11px] text-[#28834A] font-semibold">Remediated & closed</div>
        </div>
      </div>

      {/* Public Community Hazard Alert Banner (if active incidents exist) */}
      {activeCommunityIncidents.length > 0 && (
        <div className="bg-[#EAF2F8] border border-[#DCE3EA] rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[#153E63]">
            <AlertTriangle className="w-4 h-4 text-[#E89B36]" />
            <span>Active Community Advisories & Incident Work Orders in District</span>
          </div>
          <div className="divide-y divide-[#DCE3EA]">
            {activeCommunityIncidents.slice(0, 3).map(inc => (
              <div key={inc.id} className="py-2.5 text-xs text-[#253443] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-[#153E63] mr-2">{inc.title}</span>
                  <span className="text-[11px] text-[#657586]">({inc.locationName})</span>
                </div>
                {onOpenIncident && (
                  <button
                    onClick={() => onOpenIncident(inc.id)}
                    className="text-[11px] text-[#1F5F91] hover:text-[#153E63] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View advisory details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-xl border border-[#DCE3EA] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#1F5F91]" />
            <h2 className="text-sm font-bold text-[#153E63]">My Recent Submissions</h2>
          </div>
          <button
            onClick={onNavigateToMyReports}
            className="text-xs text-[#1F5F91] hover:text-[#153E63] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View all submissions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F5F7FA] border border-[#DCE3EA] flex items-center justify-center text-[#657586] mx-auto">
              <FileText className="w-5 h-5 text-[#1F5F91]" />
            </div>
            <div className="text-sm font-bold text-[#153E63]">No community reports submitted yet</div>
            <p className="text-xs text-[#657586] max-w-sm mx-auto leading-relaxed">
              Submit your first civic observation to begin generating municipal intelligence. Automatic NLP classification and clustering activate immediately upon submission.
            </p>
            <button
              onClick={onNavigateToSubmit}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1F5F91] hover:bg-[#153E63] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#E89B36]" />
              <span>Submit First Observation</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#F0F4F8]">
            {reports.slice(0, 5).map(r => (
              <div
                key={r.id}
                onClick={() => setSelectedReportId(r.id)}
                className="py-3.5 flex items-center justify-between hover:bg-[#F5F7FA] px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-[#153E63] flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#1F5F91] bg-[#EAF2F8] px-1.5 py-0.5 rounded border border-[#DCE3EA]">
                      {r.id}
                    </span>
                    <span>{r.title}</span>
                  </div>
                  <div className="text-[11px] text-[#657586] flex items-center gap-2 mt-1">
                    <span>{r.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#1F5F91]" />
                      <span>{r.locationName}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                    r.status === 'resolved'
                      ? 'bg-[#EBF7EE] text-[#28834A] border-[#A7E0B8]'
                      : 'bg-[#EAF2F8] text-[#1F5F91] border-[#DCE3EA]'
                  }`}>
                    {r.status.replace('_', ' ')}
                  </span>
                  <div className="text-[10px] text-[#657586] mt-1 font-mono tabular-nums">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
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
