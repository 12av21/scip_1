// SCIP Public Portal - Indian Government Digital Portal Homepage
// Inspired by the information architecture, visual hierarchy and usability of MyGov.in
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/apiClient';
import { Report, Incident, Department, User } from '../../types/scip';
import {
  FileText,
  Search,
  PlusCircle,
  AlertTriangle,
  Building2,
  MapPin,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Users,
  Radio,
  FileCheck2,
  Info,
  PhoneCall,
  ExternalLink,
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onSelectReportId?: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenAuth,
  onSelectReportId
}) => {
  const { isAuthenticated, role } = useAuth();

  // Real Database Data State
  const [reports, setReports] = useState<Report[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [trends, setTrends] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Quick Tracker input state
  const [trackingInput, setTrackingInput] = useState('');

  useEffect(() => {
    loadPortalData();
  }, []);

  const loadPortalData = async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    try {
      const [repData, incData, deptData, userData, trendData] = await Promise.all([
        api.getReports().catch(() => []),
        api.getIncidents().catch(() => []),
        api.getDepartments().catch(() => []),
        api.getUsers().catch(() => []),
        api.getTrends().catch(() => null)
      ]);

      setReports(repData || []);
      setIncidents(incData || []);
      setDepartments(deptData || []);
      setUsers(userData || []);
      setTrends(trendData);
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err.message || 'Failed to connect to municipal database.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    onNavigate('track-report');
  };

  // Metrics derived strictly from real database records
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'submitted' || r.status === 'analyzed').length;
  const underReviewReports = reports.filter(r => r.status === 'under_review' || r.status === 'linked' || r.status === 'assigned').length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;
  const activeIncidents = incidents.filter(i => i.status === 'confirmed' || i.status === 'in_progress').length;
  const registeredCitizens = users.filter(u => u.role === 'citizen').length || users.length;
  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

  // Real latest community activities from database
  const latestActivities = [
    ...incidents.map(inc => ({
      id: inc.id,
      title: inc.title,
      category: inc.category,
      date: inc.createdAt,
      type: 'incident' as const,
      status: inc.status,
      location: inc.locationName,
      summary: inc.description
    })),
    ...reports.map(rep => ({
      id: rep.id,
      title: rep.title,
      category: rep.category,
      date: rep.createdAt,
      type: 'report' as const,
      status: rep.status,
      location: rep.locationName,
      summary: rep.description
    }))
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-12 py-2 text-[#253443]">
      {/* =========================================================================
          SECTION D — HERO SECTION (MyGov Style with Dual Working Actions)
          ========================================================================= */}
      <section className="bg-white rounded-xl border border-[#DCE3EA] shadow-xs relative overflow-hidden">
        {/* Tricolor top hairline accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#E89B36] via-white to-[#28834A]" />

        <div className="p-6 sm:p-10 lg:p-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EAF2F8] border border-[#DCE3EA] text-[#1F5F91] text-xs font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#E89B36]" />
              <span>National Citizen-Engagement Standard · SCIP Government Edition</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#153E63] tracking-tight leading-tight">
              Your Voice. Your Community. <br className="hidden sm:inline" />
              <span className="text-[#1F5F91]">Better Governance.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#657586] leading-relaxed max-w-2xl font-normal">
              Report local civic issues, track resolutions with verifiable audit timestamps, and contribute to an informed, responsive, and accountable community intelligence platform.
            </p>

            {/* Working Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('submit-report')}
                className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-[#1F5F91] hover:bg-[#153E63] rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#E89B36]" />
                <span>Report an Issue</span>
              </button>

              <button
                onClick={() => onNavigate('track-report')}
                className="px-6 py-3 text-xs sm:text-sm font-bold text-[#153E63] bg-[#EAF2F8] hover:bg-[#dbeafe] rounded-lg border border-[#DCE3EA] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#1F5F91]" />
                <span>Track Your Report</span>
              </button>

              <button
                onClick={() => onNavigate('incidents')}
                className="px-4 py-3 text-xs sm:text-sm font-semibold text-[#657586] hover:text-[#153E63] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Incident Queue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Hero Card: Quick Grievance Tracking Box */}
          <div className="lg:col-span-4 bg-[#F5F7FA] border border-[#DCE3EA] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#1F5F91]" />
              <h3 className="font-bold text-sm text-[#153E63]">Quick Report Tracking</h3>
            </div>
            <p className="text-xs text-[#657586] leading-relaxed">
              Enter your reference number to check department dispatch and resolution progress.
            </p>

            <form onSubmit={handleTrackSubmit} className="space-y-3">
              <input
                type="text"
                value={trackingInput}
                onChange={e => setTrackingInput(e.target.value)}
                placeholder="e.g. REP-2026-001"
                className="w-full px-3 py-2 text-xs font-mono uppercase bg-white border border-[#DCE3EA] rounded-md text-[#153E63] font-semibold focus:border-[#1F5F91] focus:outline-hidden"
              />
              <button
                type="submit"
                className="w-full py-2 text-xs font-bold text-white bg-[#153E63] hover:bg-[#1F5F91] rounded-md transition-colors"
              >
                Track Live Status
              </button>
            </form>

            <div className="pt-2 border-t border-[#DCE3EA] flex items-center justify-between text-[11px] text-[#657586]">
              <span>Toll Free Civic Line:</span>
              <strong className="text-[#E89B36]">1912 (24x7)</strong>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E — CITIZEN SERVICE SHORTCUTS (6 MyGov Style Service Cards)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#153E63]">
              Citizen Digital Services
            </h2>
            <p className="text-xs text-[#657586] mt-0.5">
              Access key community reporting, tracking, and municipal intelligence tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div
            onClick={() => onNavigate('submit-report')}
            className="p-5 bg-white rounded-xl border border-[#DCE3EA] hover:border-[#1F5F91] hover:shadow-xs transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EAF2F8] text-[#1F5F91] flex items-center justify-center font-bold">
              <PlusCircle className="w-5 h-5 text-[#153E63] group-hover:text-[#1F5F91]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#153E63] group-hover:text-[#1F5F91]">
                1. Submit Community Report
              </h3>
              <p className="text-xs text-[#657586] mt-1 leading-relaxed">
                Log road damage, water stagnation, power line hazards, or public sanitation issues with GPS coordinates.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-[#1F5F91] flex items-center gap-1">
              <span>Submit Report</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigate('track-report')}
            className="p-5 bg-white rounded-xl border border-[#DCE3EA] hover:border-[#1F5F91] hover:shadow-xs transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EAF2F8] text-[#1F5F91] flex items-center justify-center font-bold">
              <Search className="w-5 h-5 text-[#153E63] group-hover:text-[#1F5F91]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#153E63] group-hover:text-[#1F5F91]">
                2. Track a Report
              </h3>
              <p className="text-xs text-[#657586] mt-1 leading-relaxed">
                Check live stage progression, officer accountability notes, and estimated resolution timelines.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-[#1F5F91] flex items-center gap-1">
              <span>Track Grievance</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onNavigate('incidents')}
            className="p-5 bg-white rounded-xl border border-[#DCE3EA] hover:border-[#1F5F91] hover:shadow-xs transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EAF2F8] text-[#1F5F91] flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5 text-[#E89B36]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#153E63] group-hover:text-[#1F5F91]">
                3. View Community Issues & Incidents
              </h3>
              <p className="text-xs text-[#657586] mt-1 leading-relaxed">
                Inspect synthesized spatio-temporal incident clusters verified by municipal human officers.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-[#1F5F91] flex items-center gap-1">
              <span>Inspect Incidents</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onNavigate('departments')}
            className="p-5 bg-white rounded-xl border border-[#DCE3EA] hover:border-[#1F5F91] hover:shadow-xs transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EAF2F8] text-[#1F5F91] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-[#153E63] group-hover:text-[#1F5F91]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#153E63] group-hover:text-[#1F5F91]">
                4. Municipal Department Directory
              </h3>
              <p className="text-xs text-[#657586] mt-1 leading-relaxed">
                Connect with departmental heads for Water Supply, Roads (PWD), Electrical Grid, and Public Sanitation.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-[#1F5F91] flex items-center gap-1">
              <span>View Directory</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5 */}
          <div
            onClick={() => onNavigate('map')}
            className="p-5 bg-white rounded-xl border border-[#DCE3EA] hover:border-[#1F5F91] hover:shadow-xs transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EAF2F8] text-[#1F5F91] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5 text-[#28834A]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#153E63] group-hover:text-[#1F5F91]">
                5. Geospatial Intelligence Map
              </h3>
              <p className="text-xs text-[#657586] mt-1 leading-relaxed">
                Interactive district map displaying ground report coordinates, cluster radii, and hotspot density contours.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-[#1F5F91] flex items-center gap-1">
              <span>Open Map</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6 */}
          <div
            onClick={() => onNavigate('trends')}
            className="p-5 bg-white rounded-xl border border-[#DCE3EA] hover:border-[#1F5F91] hover:shadow-xs transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EAF2F8] text-[#1F5F91] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5 text-[#153E63] group-hover:text-[#1F5F91]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#153E63] group-hover:text-[#1F5F91]">
                6. Community Intelligence & Trends
              </h3>
              <p className="text-xs text-[#657586] mt-1 leading-relaxed">
                Multi-factor risk analysis, recurrence indicators, and category volumes for civic planning.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-[#1F5F91] flex items-center gap-1">
              <span>View Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F — COMMUNITY STATISTICS (Real Database Values Only)
          ========================================================================= */}
      <section className="bg-white rounded-xl border border-[#DCE3EA] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE3EA] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#28834A]" />
              <h2 className="text-lg sm:text-xl font-bold text-[#153E63]">
                Community Intelligence Metrics
              </h2>
            </div>
            <p className="text-xs text-[#657586] mt-0.5">
              Live operational statistics retrieved directly from municipal database ledger.
            </p>
          </div>

          <div className="text-[11px] font-mono text-[#657586] bg-[#F5F7FA] px-2.5 py-1 rounded border border-[#DCE3EA]">
            Calculation Basis: Active Records · Updated Live
          </div>
        </div>

        {/* Error State if database fails */}
        {isError && (
          <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] p-4 rounded-lg text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B42318]" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={loadPortalData}
              className="px-3 py-1 bg-white border border-[#FCA5A5] rounded text-[11px] font-semibold"
            >
              Retry Database Sync
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Metric 1 */}
          <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-1">
            <div className="text-[11px] text-[#657586] font-semibold uppercase tracking-wider">
              Registered Citizens
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#153E63] font-mono tabular-nums">
              {isLoading ? '...' : registeredCitizens}
            </div>
            <div className="text-[10px] text-[#657586]">Active user accounts</div>
          </div>

          {/* Metric 2 */}
          <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-1">
            <div className="text-[11px] text-[#657586] font-semibold uppercase tracking-wider">
              Total Reports
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#153E63] font-mono tabular-nums">
              {isLoading ? '...' : totalReports}
            </div>
            <div className="text-[10px] text-[#657586]">Logged ground observations</div>
          </div>

          {/* Metric 3 */}
          <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-1">
            <div className="text-[11px] text-[#657586] font-semibold uppercase tracking-wider">
              Under Review
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#E89B36] font-mono tabular-nums">
              {isLoading ? '...' : underReviewReports + pendingReports}
            </div>
            <div className="text-[10px] text-[#657586]">Under active investigation</div>
          </div>

          {/* Metric 4 */}
          <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-1">
            <div className="text-[11px] text-[#657586] font-semibold uppercase tracking-wider">
              Resolved Reports
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#28834A] font-mono tabular-nums">
              {isLoading ? '...' : resolvedReports}
            </div>
            <div className="text-[10px] text-[#28834A] font-semibold">Remediated & verified</div>
          </div>

          {/* Metric 5 */}
          <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-1">
            <div className="text-[11px] text-[#657586] font-semibold uppercase tracking-wider">
              Active Incidents
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1F5F91] font-mono tabular-nums">
              {isLoading ? '...' : activeIncidents}
            </div>
            <div className="text-[10px] text-[#657586]">Confirmed work orders</div>
          </div>

          {/* Metric 6 */}
          <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-1">
            <div className="text-[11px] text-[#657586] font-semibold uppercase tracking-wider">
              Resolution Rate
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#153E63] font-mono tabular-nums">
              {isLoading ? '...' : `${resolutionRate}%`}
            </div>
            <div className="text-[10px] text-[#657586]">Cumulative closure ratio</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION G — LATEST COMMUNITY ACTIVITIES & PUBLIC ADVISORIES
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#153E63]">
              Latest Community Activities & Advisories
            </h2>
            <p className="text-xs text-[#657586] mt-0.5">
              Verified ground observations and municipal hazard confirmations.
            </p>
          </div>

          <button
            onClick={() => onNavigate('my-reports')}
            className="text-xs font-semibold text-[#1F5F91] hover:text-[#153E63] flex items-center gap-1"
          >
            <span>View All Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {latestActivities.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#DCE3EA] p-8 text-center text-xs text-[#657586]">
            No recent community activities available in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestActivities.map(act => (
              <div
                key={act.id}
                className="bg-white rounded-xl border border-[#DCE3EA] p-5 shadow-xs space-y-3 hover:border-[#1F5F91] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#1F5F91] bg-[#EAF2F8] px-2 py-0.5 rounded border border-[#DCE3EA]">
                      {act.id}
                    </span>
                    <span className="text-[11px] text-[#657586]">
                      {new Date(act.date).toLocaleDateString()}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    act.status === 'resolved'
                      ? 'bg-[#EBF7EE] text-[#28834A] border border-[#A7E0B8]'
                      : 'bg-[#EAF2F8] text-[#1F5F91] border border-[#DCE3EA]'
                  }`}>
                    {act.status.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#153E63] leading-snug">
                  {act.title}
                </h4>

                <p className="text-xs text-[#657586] line-clamp-2 leading-relaxed">
                  {act.summary}
                </p>

                <div className="pt-2 border-t border-[#DCE3EA] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[#657586] text-[11px]">
                    <MapPin className="w-3 h-3 text-[#1F5F91]" />
                    <span className="truncate max-w-[200px]">{act.location}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectReportId && act.type === 'report') {
                        onSelectReportId(act.id);
                      } else {
                        onNavigate('track-report');
                      }
                    }}
                    className="text-[#1F5F91] hover:underline font-semibold text-[11px] flex items-center gap-1"
                  >
                    <span>View Status</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION J — REAL AI COMMUNITY INTELLIGENCE SHOWCASE
          ========================================================================= */}
      <section className="bg-white rounded-xl border border-[#DCE3EA] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-[#DCE3EA] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E89B36]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#153E63]">
              AI Community Intelligence & Decision Support
            </h2>
          </div>
          <p className="text-xs text-[#657586] mt-0.5">
            Transparent, explainable machine-learning algorithms running inside the municipal platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Feature 1 */}
          <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-2">
            <div className="font-bold text-[#153E63] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-[#EAF2F8] text-[#1F5F91] flex items-center justify-center font-bold text-[10px]">1</span>
              <span>TF-IDF Classification</span>
            </div>
            <p className="text-[#657586] leading-relaxed">
              Supervised centroid vectorizer maps vocabulary into 8 municipal categories with calibrated confidence percentages.
            </p>
            <div className="text-[10px] text-[#1F5F91] font-semibold pt-1">
              Status: Model active & deterministic
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-2">
            <div className="font-bold text-[#153E63] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-[#EAF2F8] text-[#1F5F91] flex items-center justify-center font-bold text-[10px]">2</span>
              <span>Duplicate Detection</span>
            </div>
            <p className="text-[#657586] leading-relaxed">
              Cosine vector similarity & Haversine great-circle distance evaluate observations within 500m to group duplicate complaints.
            </p>
            <div className="text-[10px] text-[#1F5F91] font-semibold pt-1">
              Status: Active without automatic deletion
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-2">
            <div className="font-bold text-[#153E63] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-[#EAF2F8] text-[#1F5F91] flex items-center justify-center font-bold text-[10px]">3</span>
              <span>DBSCAN Incident Clusters</span>
            </div>
            <p className="text-[#657586] leading-relaxed">
              Spatio-temporal clustering synthesizes isolated observations into single potential municipal incident hypotheses.
            </p>
            <div className="text-[10px] text-[#1F5F91] font-semibold pt-1">
              Status: Clustered under 48h windows
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] space-y-2">
            <div className="font-bold text-[#153E63] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-[#EAF2F8] text-[#1F5F91] flex items-center justify-center font-bold text-[10px]">4</span>
              <span>Explainable Risk (P1-P4)</span>
            </div>
            <p className="text-[#657586] leading-relaxed">
              Decomposes risk score (0-100) across physical hazards, crowd density, critical infrastructure, and historical recurrence.
            </p>
            <div className="text-[10px] text-[#1F5F91] font-semibold pt-1">
              Status: Enforces human review boundary
            </div>
          </div>
        </div>

        {/* Responsible AI Disclaimer Banner */}
        <div className="p-4 bg-[#EAF2F8] rounded-lg border border-[#DCE3EA] text-xs space-y-1">
          <div className="font-bold text-[#153E63] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#28834A]" />
            <span>Responsible AI Charter: The Three Separation Principles</span>
          </div>
          <p className="text-[#657586] leading-relaxed">
            1. <strong>Community Report = Observation</strong> (ground symptoms). 2. <strong>AI Incident = Interpretation</strong> (mathematical hypothesis). 3. <strong>Administrative Action = Human Review</strong> (accountable officer must confirm before work order dispatch).
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION K — PUBLIC INFORMATION & CITIZEN TRANSPARENCY
          ========================================================================= */}
      <section className="bg-white rounded-xl border border-[#DCE3EA] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-[#153E63]">
              Participate in Municipal Governance
            </h3>
            <p className="text-xs sm:text-sm text-[#657586] max-w-xl leading-relaxed">
              Register as a citizen to track all your community submissions, receive status SMS/notification alerts, and rate municipal remediation work.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (isAuthenticated) onNavigate('citizen-dashboard');
                else if (onOpenAuth) onOpenAuth('signup');
                else onNavigate('submit-report');
              }}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1F5F91] hover:bg-[#153E63] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {isAuthenticated ? 'Open Citizen Dashboard' : 'Citizen Registration'}
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#153E63] bg-[#EAF2F8] hover:bg-[#dbeafe] rounded-lg border border-[#DCE3EA] transition-colors cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
