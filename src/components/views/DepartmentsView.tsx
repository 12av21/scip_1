// SCIP Government Portal - Municipal Departments & Public Services Directory
// Live data retrieved from /api/admin/departments
import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient';
import { Department } from '../../types/scip';
import {
  Building2,
  Phone,
  Mail,
  UserCheck,
  PlusCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  Shield
} from 'lucide-react';

interface DepartmentsViewProps {
  onNavigateToSubmit: () => void;
  onNavigateToIncidents: () => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  onNavigateToSubmit,
  onNavigateToIncidents
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await api.getDepartments();
      setDepartments(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to retrieve department directory from municipal server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8 text-[#253443]">
      {/* Title Header */}
      <div className="border-b border-[#DCE3EA] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E89B36]" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#153E63]">
            Municipal Departments & Public Services Directory
          </h1>
        </div>
        <p className="text-xs text-[#657586] font-medium mt-1">
          Official directory of municipal utility departments responsible for infrastructure remediation, hazard mitigation, and civic maintenance.
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-20 text-center text-xs text-[#657586]">
          Loading municipal departments from server...
        </div>
      )}

      {/* Error state */}
      {errorMessage && (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] p-4 rounded-xl text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#B42318] shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={loadDepartments}
            className="px-3 py-1 bg-white border border-[#FCA5A5] rounded text-[11px] font-semibold hover:bg-slate-50"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !errorMessage && departments.length === 0 && (
        <div className="bg-white rounded-xl border border-[#DCE3EA] p-12 text-center text-xs text-[#657586] space-y-2">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
          <div className="font-semibold text-slate-700">No departments configured</div>
          <p>Please check the municipal administrative settings or database initialization.</p>
        </div>
      )}

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map(dept => (
          <div
            key={dept.id}
            className="bg-white rounded-xl border border-[#DCE3EA] p-6 shadow-xs hover:border-[#1F5F91] transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-[#EAF2F8] border border-[#DCE3EA] text-[#1F5F91] flex items-center justify-center font-bold text-sm shrink-0">
                    <Building2 className="w-5 h-5 text-[#153E63]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#153E63] leading-snug">
                      {dept.name}
                    </h3>
                    <div className="font-mono text-[11px] text-[#657586]">
                      Dept Code: <span className="font-semibold text-[#1F5F91]">{dept.code}</span>
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#EAF2F8] text-[#1F5F91] border border-[#DCE3EA] tabular-nums whitespace-nowrap">
                  {dept.activeIncidentsCount} Active Work Orders
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#657586] leading-relaxed">
                {dept.description}
              </p>

              {/* Categories Covered */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#657586]">
                  Jurisdiction & Categories:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(dept.categoriesCovered || ['Civil Infrastructure', 'Emergency Response', 'Public Safety']).map((cat: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#F5F7FA] border border-[#DCE3EA] text-[#253443] font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Department Head & Contact */}
              <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#DCE3EA] text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#253443]">
                  <UserCheck className="w-3.5 h-3.5 text-[#1F5F91]" />
                  <span>Head of Department: <strong>{dept.headName}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-[#657586]">
                  <Mail className="w-3.5 h-3.5 text-[#657586]" />
                  <span>{dept.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[#657586]">
                  <Phone className="w-3.5 h-3.5 text-[#657586]" />
                  <span>{dept.phone}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-[#DCE3EA] flex items-center justify-between gap-3">
              <button
                onClick={onNavigateToIncidents}
                className="text-xs font-semibold text-[#1F5F91] hover:text-[#153E63] flex items-center gap-1 cursor-pointer"
              >
                <span>View Dispatched Incidents</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={onNavigateToSubmit}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#1F5F91] hover:bg-[#153E63] rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit Grievance</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
