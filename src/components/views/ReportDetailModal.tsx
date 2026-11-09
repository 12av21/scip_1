// SCIP - Report Detail & AI Transparency Modal (Government Digital Portal)
import React, { useState, useEffect } from 'react';
import { Report, AIAnalysis } from '../../types/scip.js';
import { api } from '../../services/apiClient.js';
import {
  X,
  Sparkles,
  MapPin,
  Clock,
  AlertCircle,
  Layers,
  ShieldCheck,
  RotateCw,
  FileText
} from 'lucide-react';

interface ReportDetailModalProps {
  reportId: string | null;
  onClose: () => void;
  onOpenIncident?: (incidentId: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  reportId,
  onClose,
  onOpenIncident
}) => {
  const [report, setReport] = useState<Report | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  useEffect(() => {
    if (reportId) {
      loadDetails(reportId);
    }
  }, [reportId]);

  const loadDetails = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await api.getReportById(id);
      setReport(res.report);
      setAnalysis(res.analysis);
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleReanalyze = async () => {
    if (!reportId) return;
    setIsReanalyzing(true);
    try {
      const fresh = await api.reanalyzeReport(reportId);
      setAnalysis(fresh);
    } finally {
      setIsReanalyzing(false);
    }
  };

  if (!reportId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-[#DCE3EA] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Tricolor hairline */}
        <div className="h-1 w-full bg-gradient-to-r from-[#E89B36] via-white to-[#28834A]" />

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DCE3EA] flex items-center justify-between bg-[#F5F7FA]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#153E63] bg-[#EAF2F8] px-2.5 py-0.5 rounded border border-[#B9D5EB]">
              {report?.id || reportId}
            </span>
            <span className="text-xs text-[#657586]">·</span>
            <span className="text-xs font-medium text-[#657586] capitalize">
              Grievance Status: <strong className="text-[#153E63]">{report?.status || 'Loading...'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReanalyze}
              disabled={isReanalyzing}
              className="p-1.5 text-[#657586] hover:text-[#153E63] rounded-md hover:bg-slate-200/60 transition-colors"
              title="Re-run AI Analysis pipeline"
            >
              <RotateCw className={`w-4 h-4 ${isReanalyzing ? 'animate-spin text-[#1F5F91]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#657586] hover:text-[#153E63] rounded-md hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#253443]">
          {isLoading || !report ? (
            <div className="py-12 text-center text-[#657586]">Loading observation details from municipal database...</div>
          ) : (
            <>
              {/* Report Raw Observation Details */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#153E63] leading-snug">{report.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-[#657586] text-[11px]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#1F5F91]" />
                    <span>{report.locationName}</span>
                  </span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">
                    [{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}]
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#1F5F91]" />
                    <span>{new Date(report.createdAt).toLocaleString()}</span>
                  </span>
                  <span>·</span>
                  <span>Complainant: <strong className="text-[#253443]">{report.citizenName}</strong></span>
                </div>

                <div className="p-3.5 bg-[#F5F7FA] border border-[#DCE3EA] rounded-lg text-[#253443] leading-relaxed">
                  {report.description}
                </div>

                {/* Supporting Photographs */}
                {report.images && report.images.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="font-semibold text-[#153E63] text-[11px]">Supporting Ground Photographs ({report.images.length}):</div>
                    <div className="flex flex-wrap gap-2">
                      {report.images.map((img, idx) => (
                        <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden border border-[#DCE3EA] shadow-2xs">
                          <img src={img} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Linked Incident Callout (if connected) */}
              {report.incidentId && (
                <div className="p-3 bg-[#EAF2F8] border border-[#B9D5EB] rounded-lg flex items-center justify-between text-[#153E63]">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#1F5F91] shrink-0" />
                    <span>
                      Correlated to municipal incident <strong className="font-mono text-[#153E63]">{report.incidentId}</strong>
                    </span>
                  </div>
                  {onOpenIncident && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenIncident(report.incidentId!);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-[#B9D5EB] rounded text-[#153E63] hover:bg-[#EAF2F8] transition-colors"
                    >
                      View Incident
                    </button>
                  )}
                </div>
              )}

              {/* AI Analytical Interpretation Box */}
              {analysis && (
                <div className="border border-[#DCE3EA] rounded-lg overflow-hidden shadow-2xs">
                  <div className="bg-[#EAF2F8]/70 px-4 py-2.5 border-b border-[#DCE3EA] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#1F5F91]" />
                      <span className="font-bold text-[#153E63] text-xs">
                        Algorithmic Analytical Interpretation & Transparency Findings
                      </span>
                    </div>
                    <span className="text-[11px] text-[#657586] font-mono tabular-nums">
                      Confidence: <strong>{(analysis.confidence * 100).toFixed(0)}%</strong>
                    </span>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-2.5 rounded bg-[#F5F7FA] border border-[#DCE3EA]">
                        <div className="text-[10px] text-[#657586] font-medium">Categorization</div>
                        <div className="font-bold text-[#153E63] mt-0.5">{analysis.categoryPredicted}</div>
                      </div>
                      <div className="p-2.5 rounded bg-[#F5F7FA] border border-[#DCE3EA]">
                        <div className="text-[10px] text-[#657586] font-medium">Risk Priority</div>
                        <div className="font-bold text-[#1F5F91] font-mono mt-0.5 tabular-nums">
                          {analysis.riskScore}/100
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-[#F5F7FA] border border-[#DCE3EA]">
                        <div className="text-[10px] text-[#657586] font-medium">Duplicate Risk</div>
                        <div className="font-bold text-[#253443] font-mono mt-0.5 tabular-nums">
                          {(analysis.duplicateProbability * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-[#F5F7FA] border border-[#DCE3EA]">
                        <div className="text-[10px] text-[#657586] font-medium">Cluster Status</div>
                        <div className="font-bold text-[#153E63] mt-0.5">
                          {analysis.possibleIncident ? 'Cluster Member' : 'Distinct'}
                        </div>
                      </div>
                    </div>

                    {/* Entities Breakdown */}
                    <div className="space-y-1.5">
                      <div className="font-bold text-[#153E63] text-[11px]">Extracted Municipal Entities:</div>
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        {analysis.entities.locations.map(l => (
                          <span key={l} className="px-2 py-0.5 rounded bg-[#EAF2F8] border border-[#B9D5EB] text-[#1F5F91]">
                            Location: {l}
                          </span>
                        ))}
                        {analysis.entities.infrastructure.map(inf => (
                          <span key={inf} className="px-2 py-0.5 rounded bg-[#F5F7FA] border border-[#DCE3EA] text-[#253443]">
                            Infra: {inf}
                          </span>
                        ))}
                        {analysis.entities.hazards.map(h => (
                          <span key={h} className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-[#B42318]">
                            Hazard: {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Corroborating Evidence */}
                    <div className="space-y-1.5">
                      <div className="font-bold text-[#153E63] text-[11px]">Algorithmic Evidence & Rationalization:</div>
                      <ul className="space-y-1 text-[#657586] pl-4 list-disc text-[11px]">
                        {analysis.evidence.map((ev, i) => (
                          <li key={i}>{ev}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Top Similar Reports */}
                    {analysis.topSimilarReports.length > 0 && (
                      <div className="space-y-2 border-t border-[#DCE3EA] pt-3">
                        <div className="font-bold text-[#153E63] text-[11px]">
                          Related Community Reports ({analysis.topSimilarReports.length}):
                        </div>
                        <div className="divide-y divide-[#DCE3EA]">
                          {analysis.topSimilarReports.map(sim => (
                            <div key={sim.reportId} className="py-1.5 flex items-center justify-between text-[11px]">
                              <div>
                                <span className="font-mono text-[#657586] mr-2">{sim.reportId}</span>
                                <span className="text-[#253443] font-medium">{sim.reportTitle}</span>
                              </div>
                              <div className="flex items-center gap-3 font-mono text-[#657586] tabular-nums">
                                <span>{sim.distanceMeters}m</span>
                                <span>·</span>
                                <span className="text-[#1F5F91] font-semibold">Sim: {(sim.similarityScore * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F5F7FA] border-t border-[#DCE3EA] flex items-center justify-between text-[#657586] text-[11px]">
          <span>Grievances subject to on-ground verification by municipal department engineers.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-[#DCE3EA] hover:border-[#1F5F91] rounded-md font-semibold text-[#153E63] transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
