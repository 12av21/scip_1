// SCIP Field Officer Dashboard - Work Order Inspections & On-Ground Verification
import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient';
import { Incident, InspectionRecord, User } from '../../types/scip';
import { useAuth } from '../../context/AuthContext';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  Camera,
  FileText,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Send,
  Eye,
  Check,
  X
} from 'lucide-react';

export const FieldOfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Inspection modal state
  const [inspectingIncident, setInspectingIncident] = useState<Incident | null>(null);
  const [verifiedStatus, setVerifiedStatus] = useState<'verified_match' | 'disputed' | 'partial'>('verified_match');
  const [observations, setObservations] = useState('');
  const [recommendedAction, setRecommendedAction] = useState('');
  const [checklist, setChecklist] = useState({
    physicalVerification: true,
    safetyHazardAssessed: true,
    structuralDamageChecked: false,
    utilityImpactVerified: false
  });
  const [evidencePhotos, setEvidencePhotos] = useState<string[]>([]);
  const [photoInputUrl, setPhotoInputUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'work-orders' | 'inspections-history'>('work-orders');

  useEffect(() => {
    loadOfficerData();
  }, [user]);

  const loadOfficerData = async () => {
    setIsLoading(true);
    try {
      const allIncidents = await api.getIncidents();
      // Filter incidents assigned to this officer or department
      const myIncidents = allIncidents.filter(
        i => (user && i.assignedOfficerId === user.id) || i.status !== 'closed'
      );
      setIncidents(myIncidents);

      // Load all inspections for this officer
      if (myIncidents.length > 0) {
        const inspPromises = myIncidents.map(inc => api.getInspections(inc.id).catch(() => []));
        const inspResults = await Promise.all(inspPromises);
        setInspections(inspResults.flat());
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenInspectionModal = (inc: Incident) => {
    setInspectingIncident(inc);
    setObservations('');
    setRecommendedAction('');
    setVerifiedStatus('verified_match');
    setEvidencePhotos(inc.evidence || []);
    setChecklist({
      physicalVerification: true,
      safetyHazardAssessed: inc.severity === 'critical' || inc.severity === 'high',
      structuralDamageChecked: inc.category === 'Structural Safety' || inc.category === 'Roads & Traffic',
      utilityImpactVerified: inc.category === 'Water & Drainage' || inc.category === 'Power & Lighting'
    });
  };

  const handleAddPhoto = () => {
    if (photoInputUrl.trim()) {
      setEvidencePhotos(prev => [...prev, photoInputUrl.trim()]);
      setPhotoInputUrl('');
    }
  };

  const handleSubmitInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectingIncident) return;
    if (!observations.trim()) {
      alert('Physical inspection observations are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await api.submitInspection(inspectingIncident.id, {
        verifiedStatus,
        observations,
        checklist,
        evidencePhotos,
        recommendedAction
      });

      alert(`Inspection report ${record.id} successfully filed and dispatched to Department Desk Officer.`);
      setInspectingIncident(null);
      await loadOfficerData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit inspection report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredIncidents = incidents.filter(i => {
    if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.locationName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = incidents.filter(i => i.status === 'confirmed' || i.status === 'in_progress').length;
  const criticalCount = incidents.filter(i => i.priority === 'P1_CRITICAL' || i.priority === 'P1').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Title & Role Banner */}
      <div className="border-b border-[#DCE3EA] pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#EAF2F8] text-[#153E63] border border-[#B9D5EB] mb-1.5">
            <ClipboardCheck className="w-3.5 h-3.5 text-[#1F5F91]" />
            <span>Field Officer Operations Center</span>
          </div>
          <h1 className="text-xl font-bold text-[#153E63]">Field Inspections & On-Ground Verification</h1>
          <p className="text-xs text-[#657586] mt-0.5">
            Officer {user?.name || 'Er. Vikram Sharma'} · {user?.departmentName || 'Public Works & Roads Infrastructure'}
          </p>
        </div>

        <button
          onClick={loadOfficerData}
          disabled={isLoading}
          className="px-3 py-1.5 bg-white border border-[#DCE3EA] hover:border-[#1F5F91] text-[#153E63] text-xs font-semibold rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#1F5F91]' : ''}`} />
          <span>Sync Work Orders</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#DCE3EA] shadow-2xs">
          <div className="text-xs text-[#657586] font-medium">Assigned Work Orders</div>
          <div className="text-2xl font-bold text-[#153E63] mt-1 font-mono tabular-nums">{incidents.length}</div>
          <div className="text-[10px] text-[#657586] mt-1">Direct sector assignments</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#DCE3EA] shadow-2xs">
          <div className="text-xs text-[#657586] font-medium">Pending Site Visits</div>
          <div className="text-2xl font-bold text-[#A15C00] mt-1 font-mono tabular-nums">{pendingCount}</div>
          <div className="text-[10px] text-[#A15C00] mt-1">Awaiting physical verification</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#DCE3EA] shadow-2xs">
          <div className="text-xs text-[#657586] font-medium">Critical Priority (P1)</div>
          <div className="text-2xl font-bold text-[#B42318] mt-1 font-mono tabular-nums">{criticalCount}</div>
          <div className="text-[10px] text-[#B42318] mt-1">Immediate response required</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#DCE3EA] shadow-2xs">
          <div className="text-xs text-[#657586] font-medium">Inspections Completed</div>
          <div className="text-2xl font-bold text-[#28834A] mt-1 font-mono tabular-nums">{inspections.length}</div>
          <div className="text-[10px] text-[#28834A] mt-1">Audit logs filed & signed</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#DCE3EA] text-xs bg-white rounded-t-lg px-2 pt-1">
        <button
          onClick={() => setActiveTab('work-orders')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'work-orders'
              ? 'border-[#E89B36] text-[#153E63] font-bold bg-[#EAF2F8]/50'
              : 'border-transparent text-[#657586] hover:text-[#153E63]'
          }`}
        >
          <ClipboardCheck className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>Active Assigned Incidents ({incidents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inspections-history')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'inspections-history'
              ? 'border-[#E89B36] text-[#153E63] font-bold bg-[#EAF2F8]/50'
              : 'border-transparent text-[#657586] hover:text-[#153E63]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>Inspection Reports Filed ({inspections.length})</span>
        </button>
      </div>

      {/* Tab 1: Active Work Orders */}
      {activeTab === 'work-orders' && (
        <div className="bg-white rounded-lg border border-[#DCE3EA] overflow-hidden shadow-2xs space-y-3 p-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#657586] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search assigned incidents by title, location or ID..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F5F7FA] border border-[#DCE3EA] rounded-md focus:outline-hidden focus:border-[#1F5F91]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F5F7FA] border border-[#DCE3EA] rounded-md text-xs text-[#253443] focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="border border-[#DCE3EA] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#EAF2F8]/70 border-b border-[#DCE3EA] text-[#153E63] font-semibold">
                <tr>
                  <th className="p-3">Incident ID</th>
                  <th className="p-3">Title & Category</th>
                  <th className="p-3">Location Coordinates</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE3EA] text-[#253443]">
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#657586]">
                      No assigned incidents found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map(inc => (
                    <tr key={inc.id} className="hover:bg-[#F5F7FA]">
                      <td className="p-3 font-mono font-bold text-[#153E63] whitespace-nowrap">
                        {inc.id}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-[#153E63]">{inc.title}</div>
                        <div className="text-[11px] text-[#657586] mt-0.5">{inc.category}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-[#253443]">
                          <MapPin className="w-3 h-3 text-[#1F5F91] shrink-0" />
                          <span>{inc.locationName}</span>
                        </div>
                        <div className="text-[10px] font-mono text-[#657586] tabular-nums mt-0.5">
                          [{inc.latitude.toFixed(4)}, {inc.longitude.toFixed(4)}]
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            inc.priority === 'P1_CRITICAL' || inc.priority === 'P1'
                              ? 'bg-rose-50 text-[#B42318] border-rose-200'
                              : inc.priority === 'P2_HIGH' || inc.priority === 'P2'
                              ? 'bg-amber-50 text-[#A15C00] border-amber-200'
                              : 'bg-[#EAF2F8] text-[#1F5F91] border-[#B9D5EB]'
                          }`}
                        >
                          {inc.priority}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="capitalize px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                          {inc.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenInspectionModal(inc)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#153E63] hover:bg-[#1F5F91] rounded-md shadow-2xs flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5 text-[#E89B36]" />
                          <span>File Inspection</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Inspections History */}
      {activeTab === 'inspections-history' && (
        <div className="bg-white rounded-lg border border-[#DCE3EA] overflow-hidden shadow-2xs p-4">
          <div className="border border-[#DCE3EA] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#EAF2F8]/70 border-b border-[#DCE3EA] text-[#153E63] font-semibold">
                <tr>
                  <th className="p-3">Inspection ID</th>
                  <th className="p-3">Incident Reference</th>
                  <th className="p-3">On-Site Finding</th>
                  <th className="p-3">Observations</th>
                  <th className="p-3">Department Review</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE3EA] text-[#253443]">
                {inspections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#657586]">
                      No inspection reports recorded yet.
                    </td>
                  </tr>
                ) : (
                  inspections.map(insp => (
                    <tr key={insp.id} className="hover:bg-[#F5F7FA]">
                      <td className="p-3 font-mono font-bold text-[#153E63] whitespace-nowrap">
                        {insp.id}
                      </td>
                      <td className="p-3 font-mono text-[#1F5F91] whitespace-nowrap">
                        {insp.incidentId}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            insp.verifiedStatus === 'verified_match'
                              ? 'bg-emerald-50 text-[#28834A] border-emerald-200'
                              : insp.verifiedStatus === 'disputed'
                              ? 'bg-rose-50 text-[#B42318] border-rose-200'
                              : 'bg-amber-50 text-[#A15C00] border-amber-200'
                          }`}
                        >
                          {insp.verifiedStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 max-w-sm truncate text-[#253443]">
                        {insp.observations}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {insp.departmentVerified ? (
                          <span className="text-[10px] font-bold text-[#28834A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Verified by Dept
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#657586] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-[#657586] whitespace-nowrap tabular-nums">
                        {new Date(insp.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspection Modal */}
      {inspectingIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#DCE3EA] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#DCE3EA] bg-[#F5F7FA] flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#153E63] bg-[#EAF2F8] px-2 py-0.5 rounded border border-[#B9D5EB]">
                  {inspectingIncident.id}
                </span>
                <h3 className="font-bold text-sm text-[#153E63] mt-1">
                  File Physical Site Inspection Report
                </h3>
              </div>
              <button
                onClick={() => setInspectingIncident(null)}
                className="text-[#657586] hover:text-[#153E63] p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitInspection} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="p-3 bg-[#EAF2F8] border border-[#B9D5EB] rounded-lg text-[#153E63]">
                <div className="font-bold">{inspectingIncident.title}</div>
                <div className="text-[11px] text-[#657586] mt-0.5">
                  Location: {inspectingIncident.locationName} · Category: {inspectingIncident.category}
                </div>
              </div>

              {/* Verified Status */}
              <div>
                <label className="block font-bold text-[#153E63] mb-1">
                  On-Site Ground Verification Finding:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setVerifiedStatus('verified_match')}
                    className={`p-2.5 rounded-md border text-center font-semibold transition-all cursor-pointer ${
                      verifiedStatus === 'verified_match'
                        ? 'bg-emerald-50 text-[#28834A] border-emerald-400 font-bold'
                        : 'bg-white border-[#DCE3EA] text-[#657586]'
                    }`}
                  >
                    ✓ Verified Match
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerifiedStatus('partial')}
                    className={`p-2.5 rounded-md border text-center font-semibold transition-all cursor-pointer ${
                      verifiedStatus === 'partial'
                        ? 'bg-amber-50 text-[#A15C00] border-amber-400 font-bold'
                        : 'bg-white border-[#DCE3EA] text-[#657586]'
                    }`}
                  >
                    ⚠ Partial Severity
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerifiedStatus('disputed')}
                    className={`p-2.5 rounded-md border text-center font-semibold transition-all cursor-pointer ${
                      verifiedStatus === 'disputed'
                        ? 'bg-rose-50 text-[#B42318] border-rose-400 font-bold'
                        : 'bg-white border-[#DCE3EA] text-[#657586]'
                    }`}
                  >
                    ✕ Disputed / False
                  </button>
                </div>
              </div>

              {/* Checklist */}
              <div>
                <label className="block font-bold text-[#153E63] mb-1">
                  Standard Municipal Inspection Checklist:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#F5F7FA] p-3 rounded-lg border border-[#DCE3EA]">
                  <label className="flex items-center gap-2 cursor-pointer text-[#253443]">
                    <input
                      type="checkbox"
                      checked={checklist.physicalVerification}
                      onChange={e => setChecklist(prev => ({ ...prev, physicalVerification: e.target.checked }))}
                      className="rounded text-[#1F5F91]"
                    />
                    <span>Physical site inspected in person</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-[#253443]">
                    <input
                      type="checkbox"
                      checked={checklist.safetyHazardAssessed}
                      onChange={e => setChecklist(prev => ({ ...prev, safetyHazardAssessed: e.target.checked }))}
                      className="rounded text-[#1F5F91]"
                    />
                    <span>Pedestrian / traffic hazard verified</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-[#253443]">
                    <input
                      type="checkbox"
                      checked={checklist.structuralDamageChecked}
                      onChange={e => setChecklist(prev => ({ ...prev, structuralDamageChecked: e.target.checked }))}
                      className="rounded text-[#1F5F91]"
                    />
                    <span>Structural component examined</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-[#253443]">
                    <input
                      type="checkbox"
                      checked={checklist.utilityImpactVerified}
                      onChange={e => setChecklist(prev => ({ ...prev, utilityImpactVerified: e.target.checked }))}
                      className="rounded text-[#1F5F91]"
                    />
                    <span>Water/power utility lines checked</span>
                  </label>
                </div>
              </div>

              {/* Observations */}
              <div>
                <label className="block font-bold text-[#153E63] mb-1">
                  Detailed Field Observations: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={observations}
                  onChange={e => setObservations(e.target.value)}
                  placeholder="Record precise physical condition, dimensions of blockage/damage, ground evidence..."
                  className="w-full p-2.5 bg-white border border-[#DCE3EA] rounded-md text-xs text-[#253443] focus:outline-hidden focus:border-[#1F5F91]"
                />
              </div>

              {/* Recommended Action */}
              <div>
                <label className="block font-bold text-[#153E63] mb-1">
                  Recommended Remedial Action:
                </label>
                <input
                  type="text"
                  value={recommendedAction}
                  onChange={e => setRecommendedAction(e.target.value)}
                  placeholder="e.g. Deploy suction tanker, patch asphalt with cold mix..."
                  className="w-full p-2 bg-white border border-[#DCE3EA] rounded-md text-xs text-[#253443] focus:outline-hidden focus:border-[#1F5F91]"
                />
              </div>

              {/* Photos */}
              <div>
                <label className="block font-bold text-[#153E63] mb-1">
                  On-Site Evidence Photographs:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={photoInputUrl}
                    onChange={e => setPhotoInputUrl(e.target.value)}
                    placeholder="Enter photo URL (e.g. https://...)"
                    className="flex-1 p-2 bg-white border border-[#DCE3EA] rounded-md text-xs text-[#253443]"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-3 py-1.5 bg-[#EAF2F8] text-[#153E63] font-semibold rounded-md border border-[#B9D5EB] hover:bg-[#dbeafe]"
                  >
                    Add Photo
                  </button>
                </div>

                {evidencePhotos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {evidencePhotos.map((p, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded border border-[#DCE3EA] overflow-hidden">
                        <img src={p} alt="evidence" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setEvidencePhotos(evidencePhotos.filter((_, i) => i !== idx))}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-bl p-0.5 text-[9px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCE3EA]">
                <button
                  type="button"
                  onClick={() => setInspectingIncident(null)}
                  className="px-4 py-2 border border-[#DCE3EA] text-[#657586] hover:bg-[#F5F7FA] rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#153E63] hover:bg-[#1F5F91] text-white font-semibold rounded-md shadow-2xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Filing Inspection...' : 'Submit & Sign Report'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
