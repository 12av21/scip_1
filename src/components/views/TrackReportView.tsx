// SCIP Citizen Portal - Track Report & Grievance Status View
// Indian Government Portal Aesthetic with verifiable timeline and audit provenance
import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient';
import { Report, AIAnalysis } from '../../types/scip';
import {
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Building2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';

interface TrackReportViewProps {
  initialReportId?: string;
  onNavigateToSubmit?: () => void;
  onOpenReportModal?: (reportId: string) => void;
}

export const TrackReportView: React.FC<TrackReportViewProps> = ({
  initialReportId = '',
  onNavigateToSubmit,
  onOpenReportModal
}) => {
  const [reportIdInput, setReportIdInput] = useState(initialReportId || 'REP-2026-001');
  const [reportData, setReportData] = useState<{ report: Report; analysis: AIAnalysis | null } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recentReports, setRecentReports] = useState<Report[]>([]);

  useEffect(() => {
    loadRecentList();
    if (initialReportId) {
      handleLookup(initialReportId);
    } else {
      handleLookup('REP-2026-001');
    }
  }, []);

  const loadRecentList = async () => {
    try {
      const reps = await api.getReports();
      setRecentReports(reps.slice(0, 5));
    } catch {
      // Ignore
    }
  };

  const handleLookup = async (idToSearch: string) => {
    const cleanId = idToSearch.trim();
    if (!cleanId) return;

    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await api.getReportById(cleanId);
      if (!data || !data.report) {
        setErrorMessage(`No record found for Reference ID "${cleanId}". Please verify the number from your acknowledgement receipt.`);
        setReportData(null);
      } else {
        setReportData(data);
      }
    } catch (err: any) {
      setErrorMessage(err.message || `No record found for Reference ID "${cleanId}".`);
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(reportIdInput);
  };

  const getStepStatus = (step: number, currentStatus: string) => {
    const statusMap: Record<string, number> = {
      submitted: 1,
      analyzed: 2,
      under_review: 3,
      linked: 3,
      assigned: 4,
      in_progress: 4,
      resolved: 5,
      closed: 5
    };
    const currentStep = statusMap[currentStatus] || 1;
    if (currentStep > step) return 'completed';
    if (currentStep === step) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8 text-[#253443]">
      {/* Title Header */}
      <div className="border-b border-[#DCE3EA] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E89B36]" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#153E63]">
            Track Community Observation & Grievance
          </h1>
        </div>
        <p className="text-xs text-[#657586] font-medium mt-1">
          Enter your official acknowledgement reference number to track live status, AI analysis, and municipal resolution details.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-xl border border-[#DCE3EA] p-6 shadow-xs space-y-4">
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#657586] absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={reportIdInput}
              onChange={e => setReportIdInput(e.target.value)}
              placeholder="Enter Reference Number (e.g. REP-2026-001)"
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F5F7FA] border border-[#DCE3EA] rounded-lg font-mono text-[#153E63] font-semibold focus:bg-white focus:border-[#1F5F91] focus:outline-hidden uppercase tracking-wider"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1F5F91] hover:bg-[#153E63] disabled:opacity-50 rounded-lg shadow-xs transition-colors shrink-0"
          >
            {isLoading ? 'Retrieving...' : 'Track Status'}
          </button>
        </form>

        {/* Quick select chips from recent records */}
        {recentReports.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[11px] text-[#657586] font-medium">Quick references:</span>
            {recentReports.map(r => (
              <button
                type="button"
                key={r.id}
                onClick={() => {
                  setReportIdInput(r.id);
                  handleLookup(r.id);
                }}
                className={`px-2.5 py-1 font-mono text-[11px] rounded border transition-colors ${
                  reportIdInput === r.id
                    ? 'bg-[#EAF2F8] border-[#1F5F91] text-[#1F5F91] font-bold'
                    : 'bg-[#F5F7FA] border-[#DCE3EA] text-[#657586] hover:bg-[#EAF2F8]'
                }`}
              >
                {r.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] p-4 rounded-xl text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#B42318]" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => handleLookup(reportIdInput)}
            className="px-3 py-1 bg-white border border-[#FCA5A5] rounded text-[11px] font-semibold hover:bg-slate-50 shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Lookup Result Content */}
      {reportData && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Main Status Dossier Header */}
          <div className="bg-white rounded-xl border border-[#DCE3EA] p-6 shadow-xs space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#DCE3EA] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1F5F91] bg-[#EAF2F8] px-2.5 py-1 rounded border border-[#DCE3EA]">
                    {reportData.report.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                    reportData.report.status === 'resolved'
                      ? 'bg-[#EBF7EE] text-[#28834A] border border-[#A7E0B8]'
                      : 'bg-[#EAF2F8] text-[#1F5F91] border border-[#DCE3EA]'
                  }`}>
                    {reportData.report.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#153E63] mt-2">
                  {reportData.report.title}
                </h2>
                <div className="text-xs text-[#657586] flex flex-wrap items-center gap-2 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#1F5F91]" />
                    <span>{reportData.report.locationName}</span>
                  </span>
                  <span>·</span>
                  <span>Category: <strong className="text-[#253443]">{reportData.report.category}</strong></span>
                  <span>·</span>
                  <span>Submitted on: {new Date(reportData.report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {onOpenReportModal && (
                <button
                  onClick={() => onOpenReportModal(reportData.report.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#1F5F91] bg-[#EAF2F8] hover:bg-[#dbeafe] rounded border border-[#DCE3EA] flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full Official Dossier</span>
                </button>
              )}
            </div>

            {/* Visual Step-by-Step Progress Bar */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#153E63]">
                Grievance Resolution Lifecycle
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {[
                  { step: 1, label: '1. Submitted', desc: 'Observation Logged' },
                  { step: 2, label: '2. Analyzed', desc: 'NLP & Risk Scored' },
                  { step: 3, label: '3. Cluster Review', desc: 'Incident Synthesis' },
                  { step: 4, label: '4. Dispatched', desc: 'Dept Assigned' },
                  { step: 5, label: '5. Resolved', desc: 'Field Rectification' }
                ].map(s => {
                  const status = getStepStatus(s.step, reportData.report.status);
                  return (
                    <div
                      key={s.step}
                      className={`p-3 rounded-lg border text-xs space-y-1 ${
                        status === 'completed'
                          ? 'bg-[#EBF7EE] border-[#A7E0B8] text-[#28834A]'
                          : status === 'active'
                          ? 'bg-[#EAF2F8] border-[#1F5F91] text-[#1F5F91] font-semibold'
                          : 'bg-[#F5F7FA] border-[#DCE3EA] text-[#657586]'
                      }`}
                    >
                      <div className="font-bold text-[11px] flex items-center justify-between">
                        <span>{s.label}</span>
                        {status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-[#28834A]" />}
                      </div>
                      <div className="text-[10px] text-[#657586]">{s.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description Details */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-[#657586] uppercase tracking-wider">
                Ground Description Logged
              </div>
              <p className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] text-xs text-[#253443] leading-relaxed">
                {reportData.report.description}
              </p>
            </div>

            {/* AI Analysis Findings from Real Database */}
            {reportData.analysis && (
              <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-3">
                <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#153E63]">
                    <Sparkles className="w-4 h-4 text-[#E89B36]" />
                    <span>Automated AI Intelligence Verification</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#1F5F91] font-semibold">
                    Confidence: {(reportData.analysis.categoryConfidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#657586] text-[11px]">Identified Category:</span>
                    <div className="font-bold text-[#253443] mt-0.5">{reportData.analysis.categoryPredicted}</div>
                  </div>
                  <div>
                    <span className="text-[#657586] text-[11px]">Assessed Risk Severity:</span>
                    <div className="font-mono font-bold text-[#1F5F91] mt-0.5">
                      {reportData.analysis.riskScore}/100 ({reportData.analysis.severityIndicator.toUpperCase()})
                    </div>
                  </div>
                  <div>
                    <span className="text-[#657586] text-[11px]">Cluster Relationship:</span>
                    <div className="font-semibold text-[#253443] mt-0.5">
                      {reportData.analysis.possibleIncident ? 'Linked to Incident Cluster' : 'Standalone Observation'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Info Box */}
      <div className="p-4 bg-[#EAF2F8] rounded-xl border border-[#DCE3EA] text-xs text-[#253443] flex items-start gap-3">
        <Info className="w-5 h-5 text-[#1F5F91] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-[#153E63]">Need assistance with your report?</div>
          <p className="text-[#657586] leading-relaxed">
            If your community hazard involves acute physical danger or open high-voltage power lines, contact municipal emergency dispatch directly on <strong>1912</strong> (Toll Free).
          </p>
        </div>
      </div>
    </div>
  );
};
