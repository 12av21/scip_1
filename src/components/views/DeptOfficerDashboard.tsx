// SCIP Department Officer Dashboard - Department Incident Queue, Field Assignments & Verification Approvals
import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient';
import { Incident, InspectionRecord, Department, User } from '../../types/scip';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Send,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  FileText,
  UserCheck,
  Flame,
  X
} from 'lucide-react';

export const DeptOfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [officers, setOfficers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [assigningIncident, setAssigningIncident] = useState<Incident | null>(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  const [verifyingInspection, setVerifyingInspection] = useState<InspectionRecord | null>(null);
  const [deptRemarks, setDeptRemarks] = useState('');
  const [isApproved, setIsApproved] = useState(true);

  const [escalatingIncident, setEscalatingIncident] = useState<Incident | null>(null);
  const [escalateReason, setEscalateReason] = useState('');

  const [activeTab, setActiveTab] = useState<'queue' | 'inspections' | 'officers'>('queue');

  useEffect(() => {
    loadDepartmentData();
  }, [user]);

  const loadDepartmentData = async () => {
    setIsLoading(true);
    try {
      const [allIncidents, allDepts, allUsers] = await Promise.all([
        api.getIncidents(),
        api.getDepartments(),
        api.getUsers().catch(() => [])
      ]);

      // Filter by officer's department or show all for desk overview
      const deptId = user?.departmentId || 'DEP-WTR';
      const deptIncidents = allIncidents.filter(
        i => i.assignedDepartmentId === deptId || !i.assignedDepartmentId || i.category === 'Water & Drainage'
      );

      setIncidents(deptIncidents);
      setDepartments(allDepts);
      setOfficers(allUsers.filter(u => u.role === 'officer'));

      // Fetch inspections
      const inspPromises = deptIncidents.map(inc => api.getInspections(inc.id).catch(() => []));
      const inspResults = await Promise.all(inspPromises);
      setInspections(inspResults.flat());
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningIncident || !selectedOfficerId) return;

    const officer = officers.find(o => o.id === selectedOfficerId);
    if (!officer) return;

    try {
      await api.assignIncident(assigningIncident.id, {
        departmentId: user?.departmentId || 'DEP-WTR',
        officerId: officer.id,
        officerName: officer.name,
        notes: assignmentNotes
      });

      alert(`Incident assigned to Field Officer ${officer.name}.`);
      setAssigningIncident(null);
      await loadDepartmentData();
    } catch (err: any) {
      alert(err.message || 'Failed to assign officer.');
    }
  };

  const handleVerifyInspectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingInspection || !deptRemarks.trim()) {
      alert('Official department remarks are mandatory.');
      return;
    }

    try {
      await api.verifyInspection(verifyingInspection.incidentId, {
        inspectionId: verifyingInspection.id,
        departmentRemarks: deptRemarks,
        isApproved
      });

      alert(`Inspection ${verifyingInspection.id} ${isApproved ? 'verified and approved' : 'disputed'}.`);
      setVerifyingInspection(null);
      await loadDepartmentData();
    } catch (err: any) {
      alert(err.message || 'Failed to verify inspection.');
    }
  };

  const handleEscalateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalatingIncident || !escalateReason.trim()) {
      alert('Escalation reason is required.');
      return;
    }

    try {
      await api.escalateIncident(escalatingIncident.id, escalateReason);
      alert(`Incident ${escalatingIncident.id} escalated to P1_CRITICAL.`);
      setEscalatingIncident(null);
      await loadDepartmentData();
    } catch (err: any) {
      alert(err.message || 'Failed to escalate incident.');
    }
  };

  const handleExportCsv = () => {
    window.location.href = '/api/intelligence/export-csv?type=incidents';
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

  const unassignedCount = incidents.filter(i => !i.assignedOfficerId).length;
  const inProgressCount = incidents.filter(i => i.status === 'in_progress').length;
  const pendingInspectionVerification = inspections.filter(i => !i.departmentVerified).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Title & Role Header */}
      <div className="border-b border-[#DCE3EA] pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#EAF2F8] text-[#153E63] border border-[#B9D5EB] mb-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#1F5F91]" />
            <span>Department Operations Desk</span>
          </div>
          <h1 className="text-xl font-bold text-[#153E63]">Department Incident Queue & Field Dispatch</h1>
          <p className="text-xs text-[#657586] mt-0.5">
            Officer {user?.name || 'Er. Sunita Patel'} · {user?.departmentName || 'Water & Sewerage Authority'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-white border border-[#DCE3EA] hover:border-[#1F5F91] text-[#153E63] text-xs font-semibold rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#1F5F91]" />
            <span>Export Department CSV</span>
          </button>
          <button
            onClick={loadDepartmentData}
            disabled={isLoading}
            className="px-3 py-1.5 bg-[#153E63] hover:bg-[#1F5F91] text-white text-xs font-semibold rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#E89B36]' : ''}`} />
            <span>Sync Queue</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#DCE3EA] shadow-2xs">
          <div className="text-xs text-[#657586] font-medium">Department Work Orders</div>
          <div className="text-2xl font-bold text-[#153E63] mt-1 font-mono tabular-nums">{incidents.length}</div>
          <div className="text-[10px] text-[#657586] mt-1">In active jurisdiction</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#DCE3EA] shadow-2xs">
          <div className="text-xs text-[#657586] font-medium">Unassigned Incidents</div>
          <div className="text-2xl font-bold text-[#B42318] mt-1 font-mono tabular-nums">{unassignedCount}</div>
          <div className="text-[10px] text-[#B42318] mt-1">Require officer dispatch</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#DCE3EA] shadow-2xs">
          <div className="text-xs text-[#657586] font-medium">Active Remediation</div>
          <div className="text-2xl font-bold text-[#1F5F91] mt-1 font-mono tabular-nums">{inProgressCount}</div>
          <div className="text-[10px] text-[#1F5F91] mt-1">In progress on ground</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#DCE3EA] shadow-2xs">
          <div className="text-xs text-[#657586] font-medium">Pending Inspection Audits</div>
          <div className="text-2xl font-bold text-[#A15C00] mt-1 font-mono tabular-nums">{pendingInspectionVerification}</div>
          <div className="text-[10px] text-[#A15C00] mt-1">Field reports to approve</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#DCE3EA] text-xs bg-white rounded-t-lg px-2 pt-1">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'queue'
              ? 'border-[#E89B36] text-[#153E63] font-bold bg-[#EAF2F8]/50'
              : 'border-transparent text-[#657586] hover:text-[#153E63]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>Incident Dispatch Queue ({incidents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inspections')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'inspections'
              ? 'border-[#E89B36] text-[#153E63] font-bold bg-[#EAF2F8]/50'
              : 'border-transparent text-[#657586] hover:text-[#153E63]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>Verify Inspection Reports ({inspections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('officers')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'officers'
              ? 'border-[#E89B36] text-[#153E63] font-bold bg-[#EAF2F8]/50'
              : 'border-transparent text-[#657586] hover:text-[#153E63]'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>Field Staff Directory ({officers.length})</span>
        </button>
      </div>

      {/* Tab 1: Queue */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-lg border border-[#DCE3EA] overflow-hidden shadow-2xs space-y-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#657586] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search department queue by title or ID..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F5F7FA] border border-[#DCE3EA] rounded-md focus:outline-hidden focus:border-[#1F5F91]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F5F7FA] border border-[#DCE3EA] rounded-md text-xs text-[#253443] focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="potential">Potential</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="border border-[#DCE3EA] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#EAF2F8]/70 border-b border-[#DCE3EA] text-[#153E63] font-semibold">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Incident & Location</th>
                  <th className="p-3">Assigned Officer</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Department Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE3EA] text-[#253443]">
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#657586]">
                      No incidents in department queue.
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
                        <div className="text-[11px] text-[#657586] mt-0.5">{inc.locationName}</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {inc.assignedOfficerName ? (
                          <span className="font-semibold text-[#153E63] flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-[#28834A]" />
                            <span>{inc.assignedOfficerName}</span>
                          </span>
                        ) : (
                          <span className="text-rose-600 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Unassigned
                          </span>
                        )}
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setAssigningIncident(inc);
                              setSelectedOfficerId(inc.assignedOfficerId || officers[0]?.id || '');
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-[#153E63] bg-[#EAF2F8] hover:bg-[#dbeafe] rounded border border-[#B9D5EB]"
                          >
                            {inc.assignedOfficerId ? 'Reassign' : 'Assign'}
                          </button>
                          <button
                            onClick={() => {
                              setEscalatingIncident(inc);
                              setEscalateReason('');
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-[#B42318] bg-rose-50 hover:bg-rose-100 rounded border border-rose-200"
                            title="Escalate to Critical P1"
                          >
                            Escalate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Inspections Verification */}
      {activeTab === 'inspections' && (
        <div className="bg-white rounded-lg border border-[#DCE3EA] overflow-hidden shadow-2xs p-4">
          <div className="border border-[#DCE3EA] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#EAF2F8]/70 border-b border-[#DCE3EA] text-[#153E63] font-semibold">
                <tr>
                  <th className="p-3">Inspection ID</th>
                  <th className="p-3">Incident</th>
                  <th className="p-3">Field Officer</th>
                  <th className="p-3">Ground Finding</th>
                  <th className="p-3">Observations</th>
                  <th className="p-3">Verification Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE3EA] text-[#253443]">
                {inspections.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#657586]">
                      No inspection reports awaiting verification.
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
                      <td className="p-3 font-semibold text-[#153E63] whitespace-nowrap">
                        {insp.officerName}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="capitalize px-2 py-0.5 rounded text-[10px] bg-slate-100 font-bold border border-slate-200">
                          {insp.verifiedStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs truncate text-[#253443]">
                        {insp.observations}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {insp.departmentVerified ? (
                          <span className="text-[10px] font-bold text-[#28834A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Approved
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#A15C00] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setVerifyingInspection(insp);
                            setDeptRemarks(insp.departmentRemarks || '');
                            setIsApproved(true);
                          }}
                          className="px-3 py-1.5 bg-[#153E63] text-white hover:bg-[#1F5F91] font-semibold text-xs rounded shadow-2xs"
                        >
                          Review & Sign
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

      {/* Tab 3: Staff Directory */}
      {activeTab === 'officers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {officers.map(off => (
            <div key={off.id} className="bg-white p-4 rounded-lg border border-[#DCE3EA] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#153E63]">{off.name}</span>
                <span className="text-[10px] font-mono text-[#28834A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Active
                </span>
              </div>
              <div className="text-xs text-[#657586]">{off.email}</div>
              <div className="text-xs text-[#657586]">{off.phone || '+91-98765-XXXXX'}</div>
              <div className="pt-2 border-t border-[#DCE3EA] text-[11px] text-[#1F5F91] font-medium">
                {off.departmentName || 'Field Operations Division'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assignment Modal */}
      {assigningIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#DCE3EA] w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-3">
              <h3 className="font-bold text-sm text-[#153E63]">Assign Field Officer</h3>
              <button onClick={() => setAssigningIncident(null)} className="text-[#657586] hover:text-[#153E63]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-[#EAF2F8] rounded-md text-[#153E63]">
                <div className="font-bold">{assigningIncident.id}</div>
                <div>{assigningIncident.title}</div>
              </div>

              <div>
                <label className="block font-bold text-[#153E63] mb-1">Select Field Officer:</label>
                <select
                  value={selectedOfficerId}
                  onChange={e => setSelectedOfficerId(e.target.value)}
                  className="w-full p-2 bg-white border border-[#DCE3EA] rounded-md text-xs text-[#253443]"
                >
                  {officers.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#153E63] mb-1">Dispatch Directives / Notes:</label>
                <textarea
                  rows={3}
                  value={assignmentNotes}
                  onChange={e => setAssignmentNotes(e.target.value)}
                  placeholder="Specify inspection priority, safety precautions, or required equipment..."
                  className="w-full p-2 bg-white border border-[#DCE3EA] rounded-md text-xs text-[#253443]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCE3EA]">
                <button
                  type="button"
                  onClick={() => setAssigningIncident(null)}
                  className="px-4 py-2 border border-[#DCE3EA] text-[#657586] rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#153E63] hover:bg-[#1F5F91] text-white rounded font-semibold"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verify Inspection Modal */}
      {verifyingInspection && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#DCE3EA] w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-3">
              <h3 className="font-bold text-sm text-[#153E63]">Department Inspection Verification</h3>
              <button onClick={() => setVerifyingInspection(null)} className="text-[#657586] hover:text-[#153E63]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyInspectionSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-[#F5F7FA] rounded-md border border-[#DCE3EA] space-y-1">
                <div className="font-bold text-[#153E63]">
                  Inspection {verifyingInspection.id} · {verifyingInspection.officerName}
                </div>
                <div className="text-[#253443]">{verifyingInspection.observations}</div>
                <div className="text-[11px] text-[#657586]">
                  Finding: <strong>{verifyingInspection.verifiedStatus}</strong>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#153E63] mb-1">Department Decision:</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#28834A]">
                    <input
                      type="radio"
                      checked={isApproved}
                      onChange={() => setIsApproved(true)}
                    />
                    <span>Approve & Verify Inspection</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#B42318]">
                    <input
                      type="radio"
                      checked={!isApproved}
                      onChange={() => setIsApproved(false)}
                    />
                    <span>Dispute / Request Re-inspection</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#153E63] mb-1">
                  Official Department Remarks: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={deptRemarks}
                  onChange={e => setDeptRemarks(e.target.value)}
                  placeholder="Record verification notes, remediation budget approval, or dispatch orders..."
                  className="w-full p-2 bg-white border border-[#DCE3EA] rounded-md text-xs text-[#253443]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCE3EA]">
                <button
                  type="button"
                  onClick={() => setVerifyingInspection(null)}
                  className="px-4 py-2 border border-[#DCE3EA] text-[#657586] rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#153E63] hover:bg-[#1F5F91] text-white rounded font-semibold"
                >
                  Sign Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Escalation Modal */}
      {escalatingIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-300 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h3 className="font-bold text-sm text-[#B42318] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#B42318]" />
                <span>Escalate Incident to P1_CRITICAL</span>
              </h3>
              <button onClick={() => setEscalatingIncident(null)} className="text-[#657586] hover:text-[#153E63]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEscalateSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-rose-50 rounded-md border border-rose-200 text-[#B42318]">
                <div className="font-bold">{escalatingIncident.id}</div>
                <div>{escalatingIncident.title}</div>
              </div>

              <div>
                <label className="block font-bold text-[#153E63] mb-1">
                  Official Justification for Escalation: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={escalateReason}
                  onChange={e => setEscalateReason(e.target.value)}
                  placeholder="Detail immediate public risk, flooding severity, traffic blockage, or life-safety hazard..."
                  className="w-full p-2 bg-white border border-[#DCE3EA] rounded-md text-xs text-[#253443]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCE3EA]">
                <button
                  type="button"
                  onClick={() => setEscalatingIncident(null)}
                  className="px-4 py-2 border border-[#DCE3EA] text-[#657586] rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B42318] hover:bg-rose-800 text-white rounded font-semibold"
                >
                  Confirm P1 Escalation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
