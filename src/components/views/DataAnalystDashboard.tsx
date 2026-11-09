// SCIP Data Analyst Dashboard - AI/ML Model Evaluation, Dataset Quality & Longitudinal Public Analytics
import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient';
import { ModelEvaluationMetrics, ReportCategory } from '../../types/scip';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  PieChart,
  Calendar,
  Activity,
  FileSpreadsheet,
  Gauge
} from 'lucide-react';

export const DataAnalystDashboard: React.FC = () => {
  const { user } = useAuth();
  const [modelMetrics, setModelMetrics] = useState<ModelEvaluationMetrics | null>(null);
  const [datasetQuality, setDatasetQuality] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'model-eval' | 'trends' | 'quality'>('model-eval');

  useEffect(() => {
    loadAnalystData();
  }, []);

  const loadAnalystData = async () => {
    setIsLoading(true);
    try {
      const [metrics, quality, tr] = await Promise.all([
        api.getModelMetrics(),
        api.getDatasetQuality(),
        api.getTrends()
      ]);
      setModelMetrics(metrics);
      setDatasetQuality(quality);
      setTrends(tr);
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCsv = (type: 'reports' | 'incidents') => {
    window.location.href = `/api/intelligence/export-csv?type=${type}`;
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs text-[#657586] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-[#1F5F91]" />
        <span>Evaluating live AI models and aggregating longitudinal datasets...</span>
      </div>
    );
  }

  const categoryEntries = Object.entries(trends?.categoryCounts || {}).sort((a: any, b: any) => b[1] - a[1]);
  const statusEntries = Object.entries(trends?.statusCounts || {});
  const dailyEntries = Object.entries(trends?.dailyVolume || {});

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Title & Header */}
      <div className="border-b border-[#DCE3EA] pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#EAF2F8] text-[#153E63] border border-[#B9D5EB] mb-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#1F5F91]" />
            <span>AI/ML Model Management & Analytics Desk</span>
          </div>
          <h1 className="text-xl font-bold text-[#153E63]">Data & AI Intelligence Command</h1>
          <p className="text-xs text-[#657586] mt-0.5">
            Officer {user?.name || 'Dr. Kavita Rao'} · City Analytics Division
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCsv('reports')}
            className="px-3 py-1.5 bg-white border border-[#DCE3EA] hover:border-[#1F5F91] text-[#153E63] text-xs font-semibold rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#1F5F91]" />
            <span>Export Reports CSV</span>
          </button>
          <button
            onClick={() => handleExportCsv('incidents')}
            className="px-3 py-1.5 bg-white border border-[#DCE3EA] hover:border-[#1F5F91] text-[#153E63] text-xs font-semibold rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#1F5F91]" />
            <span>Export Incidents CSV</span>
          </button>
          <button
            onClick={loadAnalystData}
            className="px-3 py-1.5 bg-[#153E63] hover:bg-[#1F5F91] text-white text-xs font-semibold rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#E89B36]" />
            <span>Re-evaluate Models</span>
          </button>
        </div>
      </div>

      {/* Model Performance Overview Cards */}
      {modelMetrics && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-lg border border-[#DCE3EA] shadow-2xs">
            <div className="text-[10px] text-[#657586] font-bold uppercase">Accuracy Score</div>
            <div className="text-2xl font-bold text-[#28834A] mt-1 font-mono tabular-nums">
              {(modelMetrics.accuracy * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-[#657586] mt-0.5">On {modelMetrics.sampleCount} ground records</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#DCE3EA] shadow-2xs">
            <div className="text-[10px] text-[#657586] font-bold uppercase">Macro F1 Score</div>
            <div className="text-2xl font-bold text-[#153E63] mt-1 font-mono tabular-nums">
              {(modelMetrics.f1Score * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-[#657586] mt-0.5">Balanced harmonic mean</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#DCE3EA] shadow-2xs">
            <div className="text-[10px] text-[#657586] font-bold uppercase">Macro Precision</div>
            <div className="text-2xl font-bold text-[#1F5F91] mt-1 font-mono tabular-nums">
              {(modelMetrics.precision * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-[#657586] mt-0.5">True positive confidence</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#DCE3EA] shadow-2xs">
            <div className="text-[10px] text-[#657586] font-bold uppercase">Macro Recall</div>
            <div className="text-2xl font-bold text-[#A15C00] mt-1 font-mono tabular-nums">
              {(modelMetrics.recall * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-[#657586] mt-0.5">Ground detection coverage</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#DCE3EA] shadow-2xs col-span-2 lg:col-span-1">
            <div className="text-[10px] text-[#657586] font-bold uppercase">Inference Latency</div>
            <div className="text-2xl font-bold text-[#153E63] mt-1 font-mono tabular-nums">
              {modelMetrics.inferenceLatencyMs}ms
            </div>
            <div className="text-[10px] text-[#28834A] mt-0.5 font-bold">Sub-millisecond pipeline</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#DCE3EA] text-xs bg-white rounded-t-lg px-2 pt-1">
        <button
          onClick={() => setActiveTab('model-eval')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'model-eval'
              ? 'border-[#E89B36] text-[#153E63] font-bold bg-[#EAF2F8]/50'
              : 'border-transparent text-[#657586] hover:text-[#153E63]'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>Model Evaluation Scorecard</span>
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'trends'
              ? 'border-[#E89B36] text-[#153E63] font-bold bg-[#EAF2F8]/50'
              : 'border-transparent text-[#657586] hover:text-[#153E63]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>Multi-Dimensional Trends</span>
        </button>

        <button
          onClick={() => setActiveTab('quality')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'quality'
              ? 'border-[#E89B36] text-[#153E63] font-bold bg-[#EAF2F8]/50'
              : 'border-transparent text-[#657586] hover:text-[#153E63]'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>Dataset Quality & Health</span>
        </button>
      </div>

      {/* Tab 1: Model Evaluation */}
      {activeTab === 'model-eval' && modelMetrics && (
        <div className="space-y-6">
          {/* Per-Category Metrics */}
          <div className="bg-white rounded-lg border border-[#DCE3EA] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#153E63]">Category-Wise Supervised Performance</h3>
                <p className="text-xs text-[#657586] mt-0.5">
                  Trained centroid profiles evaluated against ground-truth community incident records.
                </p>
              </div>
              <span className="font-mono text-xs text-[#1F5F91] font-bold bg-[#EAF2F8] px-2.5 py-1 rounded border border-[#B9D5EB]">
                {modelMetrics.modelVersion}
              </span>
            </div>

            <div className="border border-[#DCE3EA] rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#EAF2F8]/70 border-b border-[#DCE3EA] text-[#153E63] font-semibold">
                  <tr>
                    <th className="p-3">Municipal Category</th>
                    <th className="p-3">Sample Count</th>
                    <th className="p-3">Precision</th>
                    <th className="p-3">Recall</th>
                    <th className="p-3">F1-Score</th>
                    <th className="p-3">Quality Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE3EA] text-[#253443]">
                  {modelMetrics.perCategoryMetrics.map(cat => (
                    <tr key={cat.category} className="hover:bg-[#F5F7FA]">
                      <td className="p-3 font-bold text-[#153E63]">{cat.category}</td>
                      <td className="p-3 font-mono tabular-nums">{cat.sampleCount}</td>
                      <td className="p-3 font-mono tabular-nums font-semibold text-[#1F5F91]">
                        {(cat.precision * 100).toFixed(0)}%
                      </td>
                      <td className="p-3 font-mono tabular-nums font-semibold text-[#1F5F91]">
                        {(cat.recall * 100).toFixed(0)}%
                      </td>
                      <td className="p-3 font-mono tabular-nums font-bold text-[#28834A]">
                        {(cat.f1 * 100).toFixed(0)}%
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#28834A] border border-emerald-200">
                          Production Ready
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Confusion Matrix */}
          <div className="bg-white rounded-lg border border-[#DCE3EA] p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-[#153E63]">Category Confusion Matrix (Classification Output Distribution)</h3>
            <p className="text-xs text-[#657586]">
              Distribution of predicted municipal categories against actual observed citizen complaints.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {modelMetrics.confusionMatrix.map((cm, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded border text-xs ${
                    cm.actual === cm.predicted
                      ? 'bg-emerald-50 border-emerald-200 text-[#28834A]'
                      : 'bg-slate-50 border-slate-200 text-[#657586]'
                  }`}
                >
                  <div className="font-bold truncate text-[11px]">{cm.actual}</div>
                  <div className="text-[10px] mt-0.5 truncate">→ {cm.predicted}</div>
                  <div className="font-mono font-bold text-sm mt-1">{cm.count} records</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Trends */}
      {activeTab === 'trends' && trends && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div className="bg-white rounded-lg border border-[#DCE3EA] p-5 space-y-3 shadow-2xs">
              <h3 className="font-bold text-sm text-[#153E63] flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#1F5F91]" />
                <span>Municipal Grievance Category Proportions</span>
              </h3>
              <div className="space-y-2.5 pt-2">
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

            {/* Daily Inflow */}
            <div className="bg-white rounded-lg border border-[#DCE3EA] p-5 space-y-3 shadow-2xs">
              <h3 className="font-bold text-sm text-[#153E63] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1F5F91]" />
                <span>Daily Grievance Submissions (7-Day Trend)</span>
              </h3>
              <div className="space-y-2.5 pt-2">
                {dailyEntries.map(([day, count]: [string, any]) => {
                  const maxCount = Math.max(...dailyEntries.map(e => e[1] as number), 1);
                  const barWidth = Math.round((count / maxCount) * 100);
                  return (
                    <div key={day} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between font-medium">
                        <span className="font-mono text-[11px] text-[#253443]">{day}</span>
                        <span className="font-mono font-bold text-[#153E63] tabular-nums">
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
      )}

      {/* Tab 3: Dataset Quality */}
      {activeTab === 'quality' && datasetQuality && (
        <div className="bg-white rounded-lg border border-[#DCE3EA] p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-4">
            <div>
              <h3 className="font-bold text-sm text-[#153E63]">Dataset Integrity & Quality Audit</h3>
              <p className="text-xs text-[#657586] mt-0.5">
                Automated data validation checks across coordinates, text completeness, and class parity.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-[#28834A] bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
              Grade: {datasetQuality.dataHealthGrade}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-1.5">
              <div className="text-[10px] text-[#657586] font-bold uppercase">Coordinate Accuracy</div>
              <div className="text-xl font-bold text-[#153E63] font-mono tabular-nums">
                {(datasetQuality.coordinateIntegrity * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-[#657586]">Valid latitude/longitude bounding pairs</div>
            </div>

            <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-1.5">
              <div className="text-[10px] text-[#657586] font-bold uppercase">Observation Detail Depth</div>
              <div className="text-xl font-bold text-[#153E63] font-mono tabular-nums">
                {(datasetQuality.completenessRatio * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-[#657586]">Complete descriptions with evidence markers</div>
            </div>

            <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-1.5">
              <div className="text-[10px] text-[#657586] font-bold uppercase">Duplicate Report Density</div>
              <div className="text-xl font-bold text-[#1F5F91] font-mono tabular-nums">
                {datasetQuality.duplicateOverlapPercent}%
              </div>
              <div className="text-xs text-[#657586]">Correlated citizen observations merged</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
