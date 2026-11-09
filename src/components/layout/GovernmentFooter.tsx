// SCIP Government Portal - Rich Footer
// Complies with Indian Government Web Guidelines (GIGW) & MyGov.in information structure
import React from 'react';
import { Shield, ExternalLink, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

interface GovernmentFooterProps {
  onNavigate: (tab: string) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const GovernmentFooter: React.FC<GovernmentFooterProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <footer className="bg-[#112E4A] text-slate-300 border-t-4 border-[#E89B36] pt-12 pb-6 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: SCIP Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#153E63] text-white flex flex-col items-center justify-center p-1 border border-[#1F5F91]">
                <Shield className="w-4 h-4 text-[#E89B36]" />
                <span className="font-extrabold text-[9px] tracking-wider leading-none">SCIP</span>
              </div>
              <div>
                <div className="font-black text-white text-base leading-none">SCIP</div>
                <div className="text-[10px] text-[#E89B36] font-semibold mt-0.5">
                  Government Digital Portal
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              Smart Community Intelligence Platform connects citizen ground reports, detects spatio-temporal hazard clusters, and delivers explainable decision support with Responsible AI governance.
            </p>

            <div className="p-3 bg-[#153E63]/70 rounded-lg border border-[#1F5F91] text-[11px] space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#28834A]" />
                <span>Citizen-Centric Municipal Service</span>
              </div>
              <p className="text-slate-300 text-[10px]">
                Transparent workflow from observation to human-verified work orders.
              </p>
            </div>
          </div>

          {/* Column 2: Citizen Services Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#1E4E7A] pb-2">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('submit-report')}
                  className="hover:text-[#E89B36] transition-colors text-left"
                >
                  Submit a Community Report
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track-report')}
                  className="hover:text-[#E89B36] transition-colors text-left"
                >
                  Track Report & Grievance Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('citizen-dashboard')}
                  className="hover:text-[#E89B36] transition-colors text-left"
                >
                  My Citizen Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('departments')}
                  className="hover:text-[#E89B36] transition-colors text-left"
                >
                  Municipal Department Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('map')}
                  className="hover:text-[#E89B36] transition-colors text-left"
                >
                  Geospatial Hazard Map
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Intelligence */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#1E4E7A] pb-2">
              Governance & AI Charter
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#E89B36] transition-colors text-left"
                >
                  Responsible AI Principles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('incidents')}
                  className="hover:text-[#E89B36] transition-colors text-left"
                >
                  Incident Review & Queue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trends')}
                  className="hover:text-[#E89B36] transition-colors text-left"
                >
                  Hazard Trends & Recurrence Analysis
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('agent')}
                  className="hover:text-[#E89B36] transition-colors text-left"
                >
                  SCIP Multi-Tool Intelligence Agent
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tests')}
                  className="hover:text-[#E89B36] transition-colors text-left"
                >
                  25-Point System Audit & Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Public Contact & Helpdesk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#1E4E7A] pb-2">
              Citizen Helpdesk & Contact
            </h4>
            <div className="space-y-2.5 text-[11px] text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E89B36] shrink-0 mt-0.5" />
                <span>Municipal Corporation Headquarters, Civil Lines, Central District</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E89B36] shrink-0" />
                <span>Toll Free Civic Helpline: <strong>1912</strong> (24x7)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E89B36] shrink-0" />
                <span>support@scip.gov.in</span>
              </div>
              <div className="pt-2">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Grievance Escalation SLA:</div>
                <div className="text-white font-medium text-[11px] mt-0.5">Critical (24h) · Standard (72h)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Links & GIGW Compliance Bar */}
        <div className="border-t border-[#1E4E7A] pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => onNavigate('about')} className="hover:text-white">Citizen Charter</button>
            <span>·</span>
            <button onClick={() => onNavigate('about')} className="hover:text-white">Website Policies</button>
            <span>·</span>
            <button onClick={() => onNavigate('about')} className="hover:text-white">Privacy Statement</button>
            <span>·</span>
            <button onClick={() => onNavigate('about')} className="hover:text-white">Terms of Use</button>
            <span>·</span>
            <button onClick={() => onNavigate('about')} className="hover:text-white">Accessibility Statement</button>
          </div>

          <div className="text-slate-400 text-[10px]">
            Designed & Developed in alignment with Indian Digital Public Service Guidelines.
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="border-t border-[#1A456E] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500">
          <div>
            © 2026 Smart Community Intelligence Platform (SCIP). All rights reserved.
          </div>
          <div>
            MCA Project Implementation by Adarsh Verma · Non-Autonomous Responsible AI Architecture
          </div>
        </div>
      </div>
    </footer>
  );
};
