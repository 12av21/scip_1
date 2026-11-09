// SCIP Operations - Trend & Recurrence Analysis View (Government Digital Portal)
import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  Activity,
  Layers
} from 'lucide-react';

export const TrendAnalysisView: React.FC = () => {
  const [trends, setTrends] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTrends();
      setTrends(data);
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !trends) {
    return <div className="py-24 text-center text-xs text-[#657586]">Loading trend analytics from municipal database...</div>;
  }

  const categoryEntries = Object.entries(trends.categoryCounts || {}).sort((a: any, b: any) => b[1] - a[1]);
  const statusEntries = Object.entries(trends.statusCounts || {});
  const dailyEntries = Object.entries(trends.dailyVolume || {});

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Title */}
      <div className="border-b border-[#DCE3EA] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#EAF2F8] text-[#153E63] border border-[#B9D5EB] mb-1.5">
          <Activity className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>Longitudinal Public Intelligence</span>
        </div>
        <h1 className="text-xl font-bold text-[#153E63]">Trend & Recurrence Intelligence</h1>
        <p className="text-xs text-[#657586] mt-0.5">
          Longitudinal analysis of community hazard patterns, repeat municipal choke points, and department resolution velocity.
        </p>
      </div>

      {/* Operational Performance & Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SLA & Efficiency Card */}
        <div className="bg-white rounded-lg border border-[#DCE3EA] p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#153E63]">Citizen Charter & SLA</h2>
            <span className="text-[10px] font-bold text-[#28834A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Charter Met</span>
          </div>
          <div className="flex items-center justify-around pt-2">
            {/* Donut 1: 84% */}
            <div className="text-center space-y-1">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-[#F5F7FA]" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-[#28834A]" strokeDasharray="84, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute font-bold text-xs text-[#153E63] font-mono">84%</span>
              </div>
              <div className="text-[11px] font-semibold text-[#253443]">SLA Met</div>
              <div className="text-[10px] text-[#657586]">Within 24-48h</div>
            </div>

            {/* Donut 2: 62% */}
            <div className="text-center space-y-1">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-[#F5F7FA]" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-[#1F5F91]" strokeDasharray="62, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute font-bold text-xs text-[#153E63] font-mono">62%</span>
              </div>
              <div className="text-[11px] font-semibold text-[#253443]">Clustered</div>
              <div className="text-[10px] text-[#657586]">DBSCAN match</div>
            </div>

            {/* Donut 3: 31% */}
            <div className="text-center space-y-1">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-[#F5F7FA]" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-[#E89B36]" strokeDasharray="31, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute font-bold text-xs text-[#153E63] font-mono">31%</span>
              </div>
              <div className="text-[11px] font-semibold text-[#253443]">Preventive</div>
              <div className="text-[10px] text-[#657586]">Pre-empted</div>
            </div>
          </div>
        </div>

        {/* Weekly Activity Tracker */}
        <div className="bg-white rounded-lg border border-[#DCE3EA] p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#153E63]">Weekly Resolution Velocity</h2>
            <span className="text-[10px] text-[#657586] font-mono">Current Audit Cycle</span>
          </div>

          <div className="flex items-center justify-between text-xs px-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-[#657586] font-medium">{d}</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 3 ? 'bg-[#153E63] text-white' : 'bg-[#F5F7FA] text-[#253443]'}`}>
                  {15 + i}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#DCE3EA]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#657586] font-medium">Work order turnaround index</span>
              <span className="font-bold text-[#153E63] font-mono">88%</span>
            </div>
            <div className="w-full h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
              <div className="h-full bg-[#1F5F91] rounded-full" style={{ width: '88%' }} />
            </div>
          </div>
        </div>

        {/* Multi-Year Longitudinal Progress */}
        <div className="bg-white rounded-lg border border-[#DCE3EA] p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#153E63]">Municipal Modernization</h2>
            <span className="text-[10px] text-[#1F5F91] font-mono font-bold">Five-Year Cycle</span>
          </div>

          <div className="flex items-center justify-between px-2 pt-3">
            {[
              { year: '2026', label: 'Real-time AI', status: 'current' },
              { year: '2025', label: 'GIS Overhaul', status: 'done' },
              { year: '2024', label: 'Portal Launch', status: 'done' },
            ].map((milestone) => (
              <div key={milestone.year} className="flex flex-col items-center text-center relative flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${milestone.status === 'current' ? 'bg-[#153E63] text-white ring-4 ring-[#EAF2F8]' : 'bg-[#EAF2F8] text-[#153E63]'}`}>
                  ✓
                </div>
                <div className="font-bold text-xs text-[#153E63] mt-2">{milestone.year}</div>
                <div className="text-[10px] text-[#657586]">{milestone.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#DCE3EA] shadow-2xs">
          <div className="text-xs text-[#657586] font-medium">Total Grievances Received</div>
          <div className="text-2xl font-bold text-[#153E63] mt-1 font-mono tabular-nums">{trends.totalReports}</div>
          <div className="text-[10px] text-[#657586] mt-1">Across 8 municipal categories</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#DCE3EA] shadow-2xs">
          <div className="text-xs text-[#657586] font-medium">Active Incidents</div>
          <div className="text-2xl font-bold text-[#1F5F91] mt-1 font-mono tabular-nums">{trends.activeIncidents}</div>
          <div className="text-[10px] text-[#657586] mt-1">Dispatched to field engineers</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#DCE3EA] shadow-2xs">
          <div className="text-xs text-[#657586] font-medium">Potential Clusters Detected</div>
          <div className="text-2xl font-bold text-[#A15C00] mt-1 font-mono tabular-nums">{trends.potentialIncidents}</div>
          <div className="text-[10px] text-[#A15C00] mt-1">Awaiting authority confirmation</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#DCE3EA] shadow-2xs">
          <div className="text-xs text-[#657586] font-medium">Highest Volume Category</div>
          <div className="text-2xl font-bold text-[#153E63] mt-1 truncate">
            {String(categoryEntries[0]?.[0] || 'Water & Drainage')}
          </div>
          <div className="text-[10px] text-[#657586] mt-1 font-mono tabular-nums">
            {Number(categoryEntries[0]?.[1] || 0)} observations ({(((Number(categoryEntries[0]?.[1] || 0)) / (trends.totalReports || 1)) * 100).toFixed(0)}%)
          </div>
        </div>
      </div>

      {/* Category Breakdown & Daily Volume Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg border border-[#DCE3EA] p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#1F5F91]" />
              <h2 className="text-xs font-bold text-[#153E63] uppercase tracking-wider">
                Category Distribution
              </h2>
            </div>
            <span className="text-[11px] text-[#1F5F91] font-semibold font-mono">Normalized</span>
          </div>

          <div className="space-y-3">
            {categoryEntries.map(([cat, count]: [string, any]) => {
              const pct = Math.round((count / (trends.totalReports || 1)) * 100);
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-[#253443]">{cat}</span>
                    <span className="font-mono text-[#657586] tabular-nums">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1F5F91] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Volume Trends */}
        <div className="bg-white rounded-lg border border-[#DCE3EA] p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1F5F91]" />
              <h2 className="text-xs font-bold text-[#153E63] uppercase tracking-wider">
                Daily Grievance Submissions
              </h2>
            </div>
            <span className="text-[11px] text-[#1F5F91] font-semibold font-mono">Last 7 Days</span>
          </div>

          <div className="space-y-3">
            {dailyEntries.map(([date, count]: [string, any]) => {
              const maxVol = Math.max(...dailyEntries.map(e => e[1] as number), 1);
              const barWidth = Math.round((count / maxVol) * 100);
              return (
                <div key={date} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-[#253443] font-mono text-[11px]">{date}</span>
                    <span className="font-mono text-[#153E63] font-bold tabular-nums">
                      {count} reports
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F5F7FA] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#153E63] rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
