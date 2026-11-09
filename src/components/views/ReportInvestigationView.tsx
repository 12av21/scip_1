// SCIP Operations - Report Investigation & Evidence Linking (Government Digital Portal)
import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.js';
import { Report, AIAnalysis, Incident } from '../../types/scip.js';
import { ReportDetailModal } from './ReportDetailModal.js';
import {
  Search,
  Sparkles,
  Link,
  MapPin,
  ExternalLink,
  AlertCircle,
  Clock,
  Filter,
  Layers,
  FileSearch,
  CheckCircle2
} from 'lucide-react';

export const ReportInvestigationView: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectModalId, setInspectModalId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reps, incs] = await Promise.all([
        api.getReports(),
        api.getIncidents()
      ]);
      setReports(reps);
      setIncidents(incs);
      if (reps.length > 0) {
        handleSelectReport(reps[0]);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectReport = async (rep: Report) => {
    setSelectedReport(rep);
    try {
      const res = await api.getReportById(rep.id);
      setAnalysis(res.analysis);
    } catch {
      // Ignore
    }
  };

  const filteredReports = reports.filter(r => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.locationName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Title */}
      <div className="border-b border-[#DCE3EA] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#EAF2F8] text-[#153E63] border border-[#B9D5EB] mb-1.5">
          <FileSearch className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>Forensic Evidence & Similarity Analysis</span>
        </div>
        <h1 className="text-xl font-bold text-[#153E63]">Report Investigation & Evidence Linking</h1>
        <p className="text-xs text-[#657586] mt-0.5">
          Perform forensic semantic similarity searches, inspect extracted ground entities, and examine incident linkages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Report List */}
        <div className="bg-white rounded-lg border border-[#DCE3EA] overflow-hidden flex flex-col h-[700px] shadow-2xs">
          <div className="p-3 bg-[#F5F7FA] border-b border-[#DCE3EA]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#657586] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Filter reports by keyword or ID..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#DCE3EA] rounded-md focus:outline-hidden focus:border-[#1F5F91] text-[#253443]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#DCE3EA]">
            {filteredReports.map(rep => {
              const isSelected = selectedReport?.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => handleSelectReport(rep)}
                  className={`p-3 text-xs cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#EAF2F8] border-l-4 border-[#1F5F91]' : 'hover:bg-[#F5F7FA]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-bold text-[#153E63]">{rep.id}</span>
                    <span className="capitalize text-[#657586]">{rep.status}</span>
                  </div>
                  <div className="font-semibold text-[#253443] mt-1 leading-snug">{rep.title}</div>
                  <div className="text-[11px] text-[#657586] mt-1 flex items-center gap-1.5">
                    <span>{rep.category}</span>
                    <span>·</span>
                    <span>{rep.locationName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Investigation Dossier */}
        <div className="lg:col-span-2 space-y-5">
          {selectedReport ? (
            <div className="bg-white rounded-lg border border-[#DCE3EA] p-6 space-y-6 shadow-2xs">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE3EA] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#153E63] bg-[#EAF2F8] px-2 py-0.5 rounded border border-[#B9D5EB]">
                      {selectedReport.id}
                    </span>
                    <span className="text-xs text-[#657586]">·</span>
                    <span className="text-xs text-[#657586] capitalize">Status: <strong className="text-[#153E63]">{selectedReport.status}</strong></span>
                  </div>
                  <h2 className="text-lg font-bold text-[#153E63] mt-2">{selectedReport.title}</h2>
                  <div className="text-xs text-[#657586] flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#1F5F91]" />
                    <span>{selectedReport.locationName}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">[{selectedReport.latitude}, {selectedReport.longitude}]</span>
                  </div>
                </div>

                <button
                  onClick={() => setInspectModalId(selectedReport.id)}
                  className="px-3 py-1.5 text-xs text-[#153E63] hover:text-[#1F5F91] font-semibold border border-[#DCE3EA] hover:border-[#1F5F91] rounded-md hover:bg-[#EAF2F8] flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#1F5F91]" />
                  <span>Full Dossier</span>
                </button>
              </div>

              {/* Raw Observation Description */}
              <div className="space-y-1.5">
                <div className="font-bold text-[#153E63] text-xs uppercase tracking-wider">
                  Ground Truth Observation
                </div>
                <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] text-xs text-[#253443] leading-relaxed">
                  {selectedReport.description}
                </div>
              </div>

              {/* AI Semantic Features */}
              {analysis && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-bold text-[#153E63] text-xs uppercase tracking-wider border-b border-[#DCE3EA] pb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#1F5F91]" />
                    <span>NLP Extraction & Semantic Features</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA]">
                      <div className="text-[10px] text-[#657586] font-medium">Categorization</div>
                      <div className="font-bold text-[#153E63] mt-0.5">{analysis.categoryPredicted}</div>
                      <div className="text-[10px] text-[#657586] font-mono mt-0.5 tabular-nums">
                        {(analysis.categoryConfidence * 100).toFixed(0)}% confidence
                      </div>
                    </div>

                    <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA]">
                      <div className="text-[10px] text-[#657586] font-medium">Duplicate Probability</div>
                      <div className="font-bold text-[#1F5F91] font-mono mt-0.5 tabular-nums">
                        {(analysis.duplicateProbability * 100).toFixed(0)}%
                      </div>
                      <div className="text-[10px] text-[#657586] mt-0.5">
                        {analysis.duplicateProbability >= 0.70 ? 'High probability duplicate' : 'Distinct observation'}
                      </div>
                    </div>

                    <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA]">
                      <div className="text-[10px] text-[#657586] font-medium">Risk Priority</div>
                      <div className="font-bold text-[#153E63] font-mono mt-0.5 tabular-nums">
                        {analysis.riskScore}/100 ({analysis.severityIndicator.toUpperCase()})
                      </div>
                    </div>
                  </div>

                  {/* Top Similar Reports Comparison Table */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-[#153E63]">
                      Correlated Observations Across City ({analysis.topSimilarReports.length})
                    </div>
                    <div className="border border-[#DCE3EA] rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#EAF2F8]/70 border-b border-[#DCE3EA] text-[#153E63] font-semibold">
                          <tr>
                            <th className="p-2.5">Related Report</th>
                            <th className="p-2.5">Category</th>
                            <th className="p-2.5">Distance</th>
                            <th className="p-2.5">Time Delta</th>
                            <th className="p-2.5">Similarity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCE3EA] text-[#253443]">
                          {analysis.topSimilarReports.map(sim => (
                            <tr key={sim.reportId} className="hover:bg-[#F5F7FA]">
                              <td className="p-2.5 font-medium text-[#153E63]">
                                <span className="font-mono text-[#657586] mr-1.5">{sim.reportId}</span>
                                <span>{sim.reportTitle}</span>
                              </td>
                              <td className="p-2.5 text-[#657586] whitespace-nowrap">{sim.category}</td>
                              <td className="p-2.5 font-mono tabular-nums whitespace-nowrap">{sim.distanceMeters}m</td>
                              <td className="p-2.5 font-mono tabular-nums whitespace-nowrap">{sim.timeDeltaHours}h</td>
                              <td className="p-2.5 font-mono font-bold text-[#1F5F91] tabular-nums whitespace-nowrap">
                                {(sim.similarityScore * 100).toFixed(0)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-24 text-center text-xs text-[#657586] bg-white border border-[#DCE3EA] rounded-lg">
              Select a report from the list to begin investigation.
            </div>
          )}
        </div>
      </div>

      {inspectModalId && (
        <ReportDetailModal
          reportId={inspectModalId}
          onClose={() => setInspectModalId(null)}
        />
      )}
    </div>
  );
};
