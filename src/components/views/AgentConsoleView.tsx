// SCIP Agent - Multi-Tool Intelligence Agent Console (Government Digital Portal)
import React, { useState } from 'react';
import { api } from '../../services/apiClient';
import { AgentBriefing, AgentToolResult } from '../../types/scip';
import {
  Cpu,
  Sparkles,
  Send,
  Layers,
  MapPin,
  TrendingUp,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Terminal,
  ShieldCheck,
  Bot
} from 'lucide-react';

const PRESET_QUERIES = [
  { label: 'Sector 4 Flooding', query: 'Analyze drainage and flooding clusters around Sector 4 Market' },
  { label: 'Cluster Detection', query: 'Detect all active spatio-temporal incident clusters in the city' },
  { label: 'Risk Evaluation', query: 'Evaluate multi-factor risk scores and priority for high severity reports' },
  { label: 'Trend & Recurrence', query: 'Examine weekly trend patterns and identify repeat municipal choke points' },
  { label: 'Entity Extraction', query: 'Extract locations, infrastructure components, and physical hazards from recent observations' }
];

export const AgentConsoleView: React.FC = () => {
  const [query, setQuery] = useState(PRESET_QUERIES[0].query);
  const [briefing, setBriefing] = useState<AgentBriefing | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedToolData, setSelectedToolData] = useState<AgentToolResult | null>(null);

  const handleRunAgent = async (promptQuery?: string, specificTool?: string) => {
    const q = promptQuery || query;
    if (!q.trim()) return;

    setIsExecuting(true);
    try {
      const brief = await api.runAgentQuery(q, specificTool);
      setBriefing(brief);
      if (brief.toolResults.length > 0) {
        setSelectedToolData(brief.toolResults[0]);
      }
    } catch (err: any) {
      alert(err.message || 'Agent execution failed.');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Title */}
      <div className="border-b border-[#DCE3EA] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#EAF2F8] text-[#153E63] border border-[#B9D5EB] mb-1.5">
          <Bot className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>Decision Support System</span>
        </div>
        <h1 className="text-xl font-bold text-[#153E63]">SCIP Intelligence Analytical Agent</h1>
        <p className="text-xs text-[#657586] mt-0.5">
          Autonomous multi-tool analytical orchestration combining 10 specialized intelligence algorithms for executive decision support.
        </p>
      </div>

      {/* Query Bar */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#153E63]">Enter Public Intelligence Request</span>
          <span className="text-[#657586] font-mono text-[11px]">SCIP Multi-Tool Engine v1.0</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRunAgent()}
            placeholder="Ask SCIP Agent to analyze clusters, extract entities, evaluate risks..."
            className="flex-1 px-3.5 py-2.5 text-xs text-[#253443] bg-white border border-[#DCE3EA] rounded-md focus:outline-hidden focus:border-[#1F5F91]"
          />
          <button
            onClick={() => handleRunAgent()}
            disabled={isExecuting}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#153E63] hover:bg-[#1F5F91] disabled:opacity-50 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E89B36]" />
            <span>{isExecuting ? 'Synthesizing...' : 'Execute Agent'}</span>
          </button>
        </div>

        {/* Preset Query Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] font-medium text-[#657586] mr-1">Quick prompts:</span>
          {PRESET_QUERIES.map(p => (
            <button
              key={p.label}
              onClick={() => {
                setQuery(p.query);
                handleRunAgent(p.query);
              }}
              className="px-2.5 py-1 text-[11px] bg-[#F5F7FA] hover:bg-[#EAF2F8] hover:text-[#153E63] text-[#253443] rounded-md border border-[#DCE3EA] transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Direct Tool Invocation Bar */}
      <div className="bg-[#F5F7FA] border border-[#DCE3EA] rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-[#153E63] text-xs">Direct Analytical Algorithms:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleRunAgent('Run DBSCAN Incident Clustering', 'clustering')}
            className="px-2.5 py-1 bg-white hover:bg-[#EAF2F8] hover:text-[#153E63] border border-[#DCE3EA] rounded text-[11px] text-[#253443] flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3 h-3 text-[#1F5F91]" />
            <span>Clustering Tool</span>
          </button>
          <button
            onClick={() => handleRunAgent('Analyze municipal trends', 'trends')}
            className="px-2.5 py-1 bg-white hover:bg-[#EAF2F8] hover:text-[#153E63] border border-[#DCE3EA] rounded text-[11px] text-[#253443] flex items-center gap-1.5 transition-colors"
          >
            <TrendingUp className="w-3 h-3 text-[#1F5F91]" />
            <span>Trend Tool</span>
          </button>
          <button
            onClick={() => handleRunAgent('Inspect geospatial density', 'hotspots')}
            className="px-2.5 py-1 bg-white hover:bg-[#EAF2F8] hover:text-[#153E63] border border-[#DCE3EA] rounded text-[11px] text-[#253443] flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-3 h-3 text-[#1F5F91]" />
            <span>Geospatial Tool</span>
          </button>
        </div>
      </div>

      {/* Agent Output Dossier */}
      {briefing && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-white rounded-lg border border-[#DCE3EA] p-6 space-y-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE3EA] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#153E63] bg-[#EAF2F8] px-2 py-0.5 rounded border border-[#B9D5EB]">
                  {briefing.id}
                </span>
                <span className="text-xs text-[#657586]">·</span>
                <span className="text-xs text-[#657586] font-mono tabular-nums">
                  {new Date(briefing.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-xs font-mono text-[#657586] tabular-nums">
                Synthesis Confidence: <strong className="text-[#153E63]">{(briefing.confidence * 100).toFixed(0)}%</strong>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-xs text-[#153E63] uppercase tracking-wider">
                Executive Synthesis
              </div>
              <p className="text-xs text-[#253443] leading-relaxed bg-[#F5F7FA] p-4 rounded-lg border border-[#DCE3EA]">
                {briefing.executiveSummary}
              </p>
            </div>

            {/* Recommended Operational Actions */}
            {briefing.recommendedActions.length > 0 && (
              <div className="space-y-2">
                <div className="font-bold text-xs text-[#153E63] uppercase tracking-wider">
                  Recommended Operational Decisions
                </div>
                <ul className="space-y-1.5 text-xs text-[#253443]">
                  {briefing.recommendedActions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 bg-[#EAF2F8]/60 p-2.5 rounded border border-[#B9D5EB]">
                      <CheckCircle2 className="w-4 h-4 text-[#1F5F91] shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inviolable Responsible AI Uncertainty Disclaimer */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[#A15C00] text-[11px] leading-relaxed">
              <strong>Mandatory AI Transparency Notice:</strong> {briefing.uncertaintyDisclaimer}
            </div>
          </div>

          {/* Tool Execution Traces Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tool Execution List */}
            <div className="bg-white rounded-lg border border-[#DCE3EA] overflow-hidden shadow-2xs">
              <div className="px-4 py-3 bg-[#EAF2F8]/70 border-b border-[#DCE3EA] text-xs font-bold text-[#153E63] uppercase tracking-wider flex items-center justify-between">
                <span>Orchestrated Tools ({briefing.toolResults.length})</span>
                <Terminal className="w-3.5 h-3.5 text-[#1F5F91]" />
              </div>
              <div className="divide-y divide-[#DCE3EA] text-xs">
                {briefing.toolResults.map(tool => {
                  const isSelected = selectedToolData?.toolName === tool.toolName;
                  return (
                    <div
                      key={tool.toolName}
                      onClick={() => setSelectedToolData(tool)}
                      className={`p-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#EAF2F8] border-l-4 border-[#1F5F91]' : 'hover:bg-[#F5F7FA]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-[#153E63]">
                        <span>{tool.toolName}</span>
                        <span className="font-mono text-[10px] text-[#657586] tabular-nums">
                          {tool.executionTimeMs}ms
                        </span>
                      </div>
                      <p className="text-[#657586] text-[11px] mt-1 line-clamp-2">{tool.summary}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Tool Data Inspector */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-[#DCE3EA] p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-2">
                <div className="font-bold text-xs text-[#153E63]">
                  Algorithm Trace: {selectedToolData?.toolName || 'Select Tool'}
                </div>
                {selectedToolData && (
                  <span className="text-[11px] font-mono text-[#28834A] font-bold uppercase">
                    Status: {selectedToolData.status}
                  </span>
                )}
              </div>

              {selectedToolData ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#F5F7FA] rounded border border-[#DCE3EA] text-[#253443]">
                    {selectedToolData.summary}
                  </div>

                  <div className="font-bold text-[#153E63] text-[11px] uppercase tracking-wider">
                    Structured Pipeline Output
                  </div>
                  <pre className="p-3 bg-[#153E63] text-white rounded-lg text-[11px] font-mono overflow-x-auto max-h-96">
                    {JSON.stringify(selectedToolData.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-[#657586]">
                  Select a tool from the left panel to inspect trace output.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
