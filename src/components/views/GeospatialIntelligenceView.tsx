// SCIP Operations - Geospatial Intelligence View (Government Digital Portal)
import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient';
import { Report, Incident } from '../../types/scip';
import { GeospatialMap } from '../map/GeospatialMap';
import { ReportDetailModal } from './ReportDetailModal';
import {
  MapPin,
  Layers,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  RefreshCw,
  Compass
} from 'lucide-react';

export const GeospatialIntelligenceView: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reps, incs, hots] = await Promise.all([
        api.getReports(),
        api.getIncidents(),
        api.getHotspots()
      ]);
      setReports(reps);
      setIncidents(incs);
      setHotspots(hots);
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Title */}
      <div className="border-b border-[#DCE3EA] pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#EAF2F8] text-[#153E63] border border-[#B9D5EB] mb-1.5">
            <Compass className="w-3.5 h-3.5 text-[#1F5F91]" />
            <span>GIS Spatio-Temporal Operations</span>
          </div>
          <h1 className="text-xl font-bold text-[#153E63]">Geospatial Intelligence & Hotspot Mapping</h1>
          <p className="text-xs text-[#657586] mt-0.5">
            Geographic hazard distribution and cluster boundaries across Metro Municipal Corporation sectors.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="px-3 py-1.5 bg-white border border-[#DCE3EA] hover:border-[#1F5F91] text-[#153E63] text-xs font-semibold rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#1F5F91]' : ''}`} />
          <span>Refresh Coordinates</span>
        </button>
      </div>

      {/* Main Map */}
      <div className="rounded-lg overflow-hidden border border-[#DCE3EA] shadow-2xs bg-white">
        <GeospatialMap
          reports={reports}
          incidents={incidents}
          onSelectReport={rep => setSelectedReportId(rep.id)}
          onSelectIncident={inc => setSelectedIncident(inc)}
          selectedReportId={selectedReportId || undefined}
          selectedIncidentId={selectedIncident?.id || undefined}
        />
      </div>

      {/* Hotspots Analysis Table */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#A15C00]" />
            <h2 className="text-sm font-bold text-[#153E63]">Identified Municipal Hotspot Zones</h2>
          </div>
          <span className="text-xs font-mono text-[#657586] tabular-nums">
            <strong className="text-[#153E63]">{hotspots.length}</strong> Geographic Clusters Identified
          </span>
        </div>

        {hotspots.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#657586]">
            No high-density incident hotspots detected in current spatial window.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {hotspots.slice(0, 3).map((hot, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#F5F7FA] border border-[#DCE3EA] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#153E63]">{hot.location}</span>
                  <span className="text-[10px] font-mono font-bold text-[#A15C00] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {hot.reportCount} reports
                  </span>
                </div>
                <div className="text-[11px] text-[#657586] flex items-center gap-2">
                  <span>Density Index: <strong>{hot.densityIndex}/100</strong></span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">[{hot.latitude.toFixed(4)}, {hot.longitude.toFixed(4)}]</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
                  {hot.categories.map((c: string) => (
                    <span key={c} className="px-1.5 py-0.5 rounded bg-white border border-[#DCE3EA] text-[#253443] font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedReportId && (
        <ReportDetailModal
          reportId={selectedReportId}
          onClose={() => setSelectedReportId(null)}
        />
      )}
    </div>
  );
};
