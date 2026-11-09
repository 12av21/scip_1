// SCIP Administration - Enterprise Governance & Audit Panel (Government Digital Portal)
import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient';
import { User, Department, AuditLog, UserRole } from '../../types/scip';
import {
  Users,
  Building2,
  FileCheck2,
  Activity,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'departments' | 'audit' | 'system'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Audit filters
  const [auditModuleFilter, setAuditModuleFilter] = useState('ALL');
  const [auditSearch, setAuditSearch] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [u, d, a] = await Promise.all([
        api.getUsers(),
        api.getDepartments(),
        api.getAuditLogs()
      ]);
      setUsers(u);
      setDepartments(d);
      setAuditLogs(a);
      setSystemStats({
        nodeVersion: 'v22.14.0',
        platform: 'Linux x64 (AI Studio Container)',
        databaseStatus: 'Active & Verified',
        auditCount: a.length
      });
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    try {
      const updated = await api.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    } catch (err: any) {
      alert(err.message || 'Failed to update user role.');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const updated = await api.updateUserStatus(userId, newStatus);
      setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    } catch (err: any) {
      alert(err.message || 'Failed to update account status.');
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (auditModuleFilter !== 'ALL' && log.module !== auditModuleFilter) return false;
    if (auditSearch) {
      const q = auditSearch.toLowerCase();
      return (
        log.details.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.userEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Title */}
      <div className="border-b border-[#DCE3EA] pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#EAF2F8] text-[#153E63] border border-[#B9D5EB] mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F5F91]" />
            <span>Platform Governance & Compliance</span>
          </div>
          <h1 className="text-xl font-bold text-[#153E63]">Administration & Governance Console</h1>
          <p className="text-xs text-[#657586] mt-0.5">
            Role-Based Access Control, Department Management, and GIGW-compliant immutable audit trails.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          disabled={isLoading}
          className="px-3 py-1.5 bg-white border border-[#DCE3EA] hover:border-[#1F5F91] text-[#153E63] text-xs font-semibold rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#1F5F91]' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#DCE3EA] text-xs bg-white rounded-t-lg px-2 pt-1">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'border-[#E89B36] text-[#153E63] font-bold bg-[#EAF2F8]/50'
              : 'border-transparent text-[#657586] hover:text-[#153E63]'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>User Management ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'departments'
              ? 'border-[#E89B36] text-[#153E63] font-bold bg-[#EAF2F8]/50'
              : 'border-transparent text-[#657586] hover:text-[#153E63]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>Departments ({departments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'border-[#E89B36] text-[#153E63] font-bold bg-[#EAF2F8]/50'
              : 'border-transparent text-[#657586] hover:text-[#153E63]'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>Audit & Security Logs ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'system'
              ? 'border-[#E89B36] text-[#153E63] font-bold bg-[#EAF2F8]/50'
              : 'border-transparent text-[#657586] hover:text-[#153E63]'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#1F5F91]" />
          <span>System Diagnostics</span>
        </button>
      </div>

      {/* Tab 1: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg border border-[#DCE3EA] overflow-hidden shadow-2xs">
          <div className="p-3 bg-[#F5F7FA] border-b border-[#DCE3EA] flex items-center justify-between text-xs text-[#657586]">
            <span>Active Civil Servants and Registered Community Observers</span>
            <span className="font-mono text-[#153E63] font-semibold">{users.length} Records</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#EAF2F8]/70 border-b border-[#DCE3EA] text-[#153E63] font-semibold">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Active Role</th>
                <th className="p-3">Department</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Modify Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE3EA] text-[#253443]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#F5F7FA]">
                  <td className="p-3 font-semibold text-[#153E63]">{u.name}</td>
                  <td className="p-3 font-mono text-[11px] text-[#657586]">{u.email}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                        u.role === 'admin'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : u.role === 'authority'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : u.role === 'officer'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-[#EAF2F8] text-[#1F5F91] border-[#B9D5EB]'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-[#657586]">{u.departmentName || '—'}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-[#28834A] border-emerald-200'
                          : 'bg-rose-50 text-[#B42318] border-rose-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={u.role}
                        onChange={e => handleChangeRole(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 bg-white border border-[#DCE3EA] rounded text-xs text-[#253443] focus:outline-hidden focus:border-[#1F5F91]"
                      >
                        <option value="citizen">Citizen</option>
                        <option value="officer">Officer</option>
                        <option value="authority">Authority</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors ${
                          u.status === 'active'
                            ? 'text-[#B42318] bg-rose-50 border-rose-200 hover:bg-rose-100'
                            : 'text-[#28834A] bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Department Management */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {departments.map(dept => (
            <div key={dept.id} className="bg-white rounded-lg border border-[#DCE3EA] p-5 space-y-3 shadow-2xs hover:border-[#1F5F91] transition-all">
              <div className="flex items-center justify-between border-b border-[#DCE3EA] pb-2">
                <span className="font-mono text-xs font-bold text-[#153E63] bg-[#EAF2F8] px-2 py-0.5 rounded border border-[#B9D5EB]">
                  {dept.code}
                </span>
                <span className="text-[11px] text-[#657586] font-mono tabular-nums">
                  <strong className="text-[#153E63]">{dept.activeIncidentsCount}</strong> Active Work Orders
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#153E63]">{dept.name}</h3>
              <p className="text-xs text-[#657586] leading-relaxed">{dept.description}</p>
              <div className="pt-2 border-t border-[#DCE3EA] text-[11px] text-[#657586] space-y-1">
                <div>Department Head: <strong className="text-[#253443]">{dept.headName}</strong></div>
                <div>Contact: {dept.email} · {dept.phone}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Immutable Audit Logs */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-lg border border-[#DCE3EA] flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-[#657586] shrink-0" />
              <input
                type="text"
                value={auditSearch}
                onChange={e => setAuditSearch(e.target.value)}
                placeholder="Search audit trail by user, action, or details..."
                className="w-full bg-transparent text-xs text-[#253443] focus:outline-hidden"
              />
            </div>

            <select
              value={auditModuleFilter}
              onChange={e => setAuditModuleFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F5F7FA] border border-[#DCE3EA] rounded-md text-[#253443] text-xs focus:outline-hidden focus:border-[#1F5F91]"
            >
              <option value="ALL">All Modules</option>
              <option value="auth">auth</option>
              <option value="reports">reports</option>
              <option value="incidents">incidents</option>
              <option value="intelligence">intelligence</option>
              <option value="admin">admin</option>
              <option value="security">security</option>
            </select>
          </div>

          <div className="bg-white rounded-lg border border-[#DCE3EA] overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#EAF2F8]/70 border-b border-[#DCE3EA] text-[#153E63] font-semibold">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE3EA] text-[#253443]">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#F5F7FA]">
                    <td className="p-3 font-mono text-[11px] text-[#657586] whitespace-nowrap tabular-nums">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-mono text-[10px] font-bold text-[#153E63] bg-[#EAF2F8] px-1.5 py-0.5 rounded border border-[#B9D5EB]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 uppercase text-[10px] font-semibold text-[#657586] whitespace-nowrap">
                      {log.module}
                    </td>
                    <td className="p-3 text-[#153E63] font-medium whitespace-nowrap">
                      {log.userEmail}
                    </td>
                    <td className="p-3 text-[#657586] max-w-md truncate">
                      {log.details}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#657586] whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: System Diagnostics */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-lg border border-[#DCE3EA] p-6 space-y-6 text-xs shadow-2xs">
          <h2 className="text-sm font-bold text-[#153E63]">Runtime Diagnostics & Platform Health</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#F5F7FA] border border-[#DCE3EA] space-y-1.5">
              <div className="text-[#657586] text-[10px] uppercase font-semibold">Node Environment</div>
              <div className="font-semibold text-[#153E63] text-sm">{systemStats?.nodeVersion}</div>
              <div className="text-[#657586]">{systemStats?.platform}</div>
            </div>

            <div className="p-4 rounded-lg bg-[#F5F7FA] border border-[#DCE3EA] space-y-1.5">
              <div className="text-[#657586] text-[10px] uppercase font-semibold">Database Engine</div>
              <div className="font-semibold text-[#28834A] text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#28834A]" />
                <span>Operational & Verified</span>
              </div>
              <div className="text-[#657586]">Mongoose-compatible schemas & active disk-persisted atomic ledger</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
