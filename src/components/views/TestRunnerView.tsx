// SCIP Verification - 25-Point Comprehensive System Audit Suite (Government Digital Portal)
import React, { useState } from 'react';
import { api } from '../../services/apiClient.js';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCw,
  Sparkles,
  Terminal,
  ShieldCheck,
  Cpu,
  Layers,
  Check
} from 'lucide-react';

interface TestCaseResult {
  testId: number;
  name: string;
  category: string;
  passed: boolean;
  durationMs: number;
  details: string;
}

export const TestRunnerView: React.FC = () => {
  const [results, setResults] = useState<TestCaseResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<{
    totalTests: number;
    passedCount: number;
    failedCount: number;
    passRatePercent: number;
  } | null>(null);

  const handleExecuteTests = async () => {
    setIsRunning(true);
    try {
      const res = await api.runAutomatedTests();
      if (res && res.data) {
        setResults(res.data.results);
        setSummary({
          totalTests: res.data.totalTests,
          passedCount: res.data.passedCount,
          failedCount: res.data.failedCount,
          passRatePercent: res.data.passRatePercent
        });
      }
    } catch (err: any) {
      alert(err.message || 'Test runner failed.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE3EA] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#EAF2F8] text-[#153E63] border border-[#B9D5EB] mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F5F91]" />
            <span>Compliance & Quality Assurance</span>
          </div>
          <h1 className="text-xl font-bold text-[#153E63]">25-Point Comprehensive System Audit</h1>
          <p className="text-xs text-[#657586] mt-0.5">
            Automated verification verifying all 25 technical audit criteria (Auth, RBAC, NLP, DBSCAN, Geospatial, Risk Scoring, Disk Persistence, and Human Review).
          </p>
        </div>

        <button
          onClick={handleExecuteTests}
          disabled={isRunning}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#153E63] hover:bg-[#1F5F91] disabled:opacity-50 rounded-md shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          {isRunning ? <RotateCw className="w-4 h-4 animate-spin text-[#E89B36]" /> : <Play className="w-4 h-4 text-[#E89B36]" />}
          <span>{isRunning ? 'Executing 25 Tests...' : 'Execute Full Audit Suite'}</span>
        </button>
      </div>

      {/* Summary Scorecard (when executed) */}
      {summary && (
        <div className="bg-white rounded-lg border border-[#DCE3EA] p-6 shadow-2xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-[#F5F7FA] rounded-md border border-[#DCE3EA]">
              <div className="text-[10px] text-[#657586] font-bold uppercase">Total Verification Checks</div>
              <div className="text-2xl font-bold text-[#153E63] mt-1 font-mono tabular-nums">{summary.totalTests}</div>
            </div>
            <div className="p-3 bg-[#F5F7FA] rounded-md border border-[#DCE3EA]">
              <div className="text-[10px] text-[#657586] font-bold uppercase">Passed Checks</div>
              <div className="text-2xl font-bold text-[#28834A] mt-1 font-mono tabular-nums">{summary.passedCount}</div>
            </div>
            <div className="p-3 bg-[#F5F7FA] rounded-md border border-[#DCE3EA]">
              <div className="text-[10px] text-[#657586] font-bold uppercase">Failed Checks</div>
              <div className="text-2xl font-bold text-[#657586] mt-1 font-mono tabular-nums">{summary.failedCount}</div>
            </div>
            <div className="p-3 bg-[#F5F7FA] rounded-md border border-[#DCE3EA]">
              <div className="text-[10px] text-[#657586] font-bold uppercase">Audit Pass Rate</div>
              <div className="text-2xl font-bold text-[#1F5F91] mt-1 font-mono tabular-nums">{summary.passRatePercent}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Test List */}
      <div className="bg-white rounded-lg border border-[#DCE3EA] overflow-hidden shadow-2xs">
        {results.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#657586] space-y-3">
            <Terminal className="w-8 h-8 text-[#657586]/40 mx-auto" />
            <div>Click "Execute Full Audit Suite" to run all 25 live verification tests against the active server.</div>
          </div>
        ) : (
          <div className="divide-y divide-[#DCE3EA]">
            {results.map(t => (
              <div key={t.testId} className="p-4 hover:bg-[#F5F7FA] flex items-start gap-3.5 transition-colors">
                {t.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#28834A] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-[#B42318] shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#657586]">
                        #{String(t.testId).padStart(2, '0')}
                      </span>
                      <span className="font-bold text-xs text-[#153E63]">{t.name}</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#EAF2F8] text-[#1F5F91] border border-[#B9D5EB]">
                        {t.category}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-[#657586] tabular-nums">
                      {t.durationMs}ms
                    </span>
                  </div>

                  <p className="text-xs text-[#253443] mt-1 leading-relaxed">
                    {t.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
