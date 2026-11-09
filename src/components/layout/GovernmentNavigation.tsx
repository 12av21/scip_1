// SCIP Government Portal - Horizontal Navigation Bar
// Dynamic role-based navigation adhering to Indian Government Digital Portal standards
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  PlusCircle,
  Search,
  Radio,
  AlertTriangle,
  MapPin,
  Building2,
  TrendingUp,
  Cpu,
  Info,
  CheckCircle2,
  Menu,
  X,
  FileText,
  ClipboardCheck,
  ShieldAlert,
  BarChart3,
  SlidersHorizontal
} from 'lucide-react';

interface GovernmentNavigationProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const GovernmentNavigation: React.FC<GovernmentNavigationProps> = ({
  currentTab,
  onNavigate,
  onOpenAuth
}) => {
  const { user, role } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = (tab: string) => {
    onNavigate(tab);
    setIsMobileMenuOpen(false);
  };

  // Dynamically generate role-scoped navigation items
  const getNavItems = () => {
    if (!user) {
      return [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'track-report', label: 'Track Grievance', icon: Search },
        { id: 'departments', label: 'Departments', icon: Building2 },
        { id: 'about', label: 'Citizen Charter', icon: Info },
        { id: 'tests', label: 'Audit Suite', icon: CheckCircle2 }
      ];
    }

    switch (role) {
      case 'officer':
        // Field Officer
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'field-officer-dashboard', label: 'Field Operations', icon: ClipboardCheck },
          { id: 'incidents', label: 'Incident Work Orders', icon: AlertTriangle },
          { id: 'track-report', label: 'Track Report', icon: Search },
          { id: 'departments', label: 'Departments', icon: Building2 },
          { id: 'about', label: 'Citizen Charter', icon: Info }
        ];

      case 'dept_officer':
        // Department Desk Officer
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'dept-officer-dashboard', label: 'Department Desk', icon: Building2 },
          { id: 'incidents', label: 'Incident Queue', icon: AlertTriangle },
          { id: 'departments', label: 'Departments', icon: Building2 },
          { id: 'trends', label: 'SLA Trends', icon: TrendingUp },
          { id: 'track-report', label: 'Track Report', icon: Search },
          { id: 'about', label: 'Citizen Charter', icon: Info }
        ];

      case 'analyst':
        // Data & AI Analyst
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'analyst-dashboard', label: 'Analytics & Models', icon: BarChart3 },
          { id: 'trends', label: 'Trends & Recurrence', icon: TrendingUp },
          { id: 'map', label: 'Geospatial Map', icon: MapPin },
          { id: 'agent', label: 'SCIP Agent', icon: Cpu },
          { id: 'track-report', label: 'Track Report', icon: Search },
          { id: 'about', label: 'Citizen Charter', icon: Info }
        ];

      case 'authority':
        // Authority Director
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'intel-dashboard', label: 'Command Dashboard', icon: Radio },
          { id: 'incidents', label: 'Incident Queue', icon: AlertTriangle },
          { id: 'map', label: 'Geospatial Map', icon: MapPin },
          { id: 'trends', label: 'Trend Analytics', icon: TrendingUp },
          { id: 'agent', label: 'Decision Agent', icon: Cpu },
          { id: 'departments', label: 'Departments', icon: Building2 },
          { id: 'track-report', label: 'Track Report', icon: Search },
          { id: 'about', label: 'Citizen Charter', icon: Info }
        ];

      case 'admin':
        // Super Administrator
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'admin-panel', label: 'Governance & Audit', icon: SlidersHorizontal },
          { id: 'intel-dashboard', label: 'Command Center', icon: Radio },
          { id: 'incidents', label: 'Incident Queue', icon: AlertTriangle },
          { id: 'analyst-dashboard', label: 'Model Metrics', icon: BarChart3 },
          { id: 'tests', label: 'System Audit', icon: CheckCircle2 },
          { id: 'map', label: 'Geospatial Map', icon: MapPin },
          { id: 'departments', label: 'Departments', icon: Building2 },
          { id: 'about', label: 'Citizen Charter', icon: Info }
        ];

      case 'citizen':
      default:
        // Citizen
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'citizen-dashboard', label: 'Citizen Services', icon: Radio },
          { id: 'submit-report', label: 'File Grievance', icon: PlusCircle, isHighlight: true },
          { id: 'my-reports', label: 'My Grievances', icon: FileText },
          { id: 'track-report', label: 'Track Grievance', icon: Search },
          { id: 'departments', label: 'Departments', icon: Building2 },
          { id: 'about', label: 'Citizen Charter', icon: Info }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-[#153E63] text-white sticky top-0 z-40 shadow-xs border-b border-[#0F2D4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden py-2.5">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-md text-white hover:bg-[#1F5F91] focus:outline-hidden transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="ml-2 font-bold text-xs uppercase tracking-wider text-slate-200">
            Navigation ({role.replace('_', ' ')})
          </span>
        </div>

        {/* Desktop Navigation Items */}
        <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto py-0">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-semibold tracking-wide transition-all border-b-3 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#E89B36] text-[#FFFFFF] bg-[#1F5F91]'
                    : item.isHighlight
                    ? 'border-transparent text-[#E89B36] hover:bg-[#1F5F91] hover:text-white'
                    : 'border-transparent text-slate-200 hover:bg-[#1F5F91] hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${item.isHighlight && !isActive ? 'text-[#E89B36]' : ''}`} />
                <span>{item.label}</span>
                {item.isHighlight && (
                  <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[#E89B36]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right CTA / Quick Link */}
        <div className="hidden lg:flex items-center gap-2 py-2">
          {role === 'citizen' ? (
            <button
              onClick={() => handleLinkClick('submit-report')}
              className="px-3.5 py-1.5 text-xs font-bold text-[#153E63] bg-[#E89B36] hover:bg-[#d88d2c] rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>File Grievance</span>
            </button>
          ) : (
            <button
              onClick={() => handleLinkClick('track-report')}
              className="px-3 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-[#1F5F91] hover:bg-[#184b72] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#E89B36]" />
              <span>Look Up ID</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#112E4A] border-t border-[#1F5F91] px-4 py-3 space-y-1">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#1F5F91] text-white font-bold'
                    : 'text-slate-300 hover:bg-[#1F5F91] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-[#E89B36]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
