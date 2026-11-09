// Smart Community Intelligence Platform (SCIP) - Master Application Shell
// Redesigned with Indian Government Digital Portal standard inspired by MyGov.in
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { GovernmentUtilityBar } from './components/layout/GovernmentUtilityBar';
import { GovernmentHeader } from './components/layout/GovernmentHeader';
import { GovernmentNavigation } from './components/layout/GovernmentNavigation';
import { GovernmentFooter } from './components/layout/GovernmentFooter';

import { LandingPage } from './components/views/LandingPage';
import { AboutPage } from './components/views/AboutPage';
import { CitizenDashboard } from './components/views/CitizenDashboard';
import { SubmitReportView } from './components/views/SubmitReportView';
import { MyReportsView } from './components/views/MyReportsView';
import { TrackReportView } from './components/views/TrackReportView';
import { DepartmentsView } from './components/views/DepartmentsView';
import { IntelligenceDashboard } from './components/views/IntelligenceDashboard';
import { IncidentManagementView } from './components/views/IncidentManagementView';
import { ReportInvestigationView } from './components/views/ReportInvestigationView';
import { GeospatialIntelligenceView } from './components/views/GeospatialIntelligenceView';
import { TrendAnalysisView } from './components/views/TrendAnalysisView';
import { AgentConsoleView } from './components/views/AgentConsoleView';
import { AdminPanelView } from './components/views/AdminPanelView';
import { TestRunnerView } from './components/views/TestRunnerView';
import { FieldOfficerDashboard } from './components/views/FieldOfficerDashboard';
import { DeptOfficerDashboard } from './components/views/DeptOfficerDashboard';
import { DataAnalystDashboard } from './components/views/DataAnalystDashboard';
import { ReportDetailModal } from './components/views/ReportDetailModal';
import { AuthModal } from './components/views/AuthModal';
import { Report, Incident } from './types/scip';
import { Home, ChevronRight, Shield } from 'lucide-react';

function SCIPMainLayout() {
  const { user, role, isAuthenticated } = useAuth();
  const { activeTheme } = useTheme();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeModalReportId, setActiveModalReportId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Accessibility State (Utility Bar)
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0); // -1, 0, 1, 2
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Route protection guard - allows public browsing on home, about, tests, track-report, departments
  useEffect(() => {
    const publicTabs = ['home', 'about', 'tests', 'track-report', 'departments'];
    if (!isAuthenticated && !publicTabs.includes(currentTab)) {
      setCurrentTab('home');
      handleOpenAuth('login');
    }
  }, [currentTab, isAuthenticated]);

  const handleSelectReport = (report: Report) => {
    setActiveModalReportId(report.id);
  };

  const handleSelectIncident = (incident: Incident) => {
    setCurrentTab('incidents');
  };

  const getBreadcrumbLabel = (tab: string) => {
    switch (tab) {
      case 'home': return 'Portal Home';
      case 'about': return 'Citizen Charter & Responsible AI';
      case 'citizen-dashboard': return 'Citizen Services Dashboard';
      case 'submit-report': return 'File a Community Grievance';
      case 'my-reports': return 'My Submitted Observations';
      case 'track-report': return 'Track Grievance Status';
      case 'departments': return 'Municipal Departments Directory';
      case 'field-officer-dashboard': return 'Field Officer Operations & Inspections';
      case 'dept-officer-dashboard': return 'Department Operations Desk';
      case 'analyst-dashboard': return 'Data & AI Analytics Command';
      case 'intel-dashboard': return 'Operations / Intelligence Command';
      case 'incidents': return 'Operations / Incident Queue';
      case 'investigation': return 'Forensic Investigation';
      case 'map': return 'Geospatial Intelligence Map';
      case 'trends': return 'Trends & Recurrence Analytics';
      case 'agent': return 'Decision Support Agent';
      case 'admin-panel': return 'Administration & Audit Trail';
      case 'tests': return '25-Point System Audit';
      default: return 'Government Portal';
    }
  };

  const getFontSizeClass = () => {
    if (fontSizeLevel === -1) return 'text-[92%]';
    if (fontSizeLevel === 1) return 'text-[108%]';
    if (fontSizeLevel === 2) return 'text-[115%]';
    return '';
  };

  return (
    <div
      className={`min-h-screen text-[#253443] flex flex-col font-sans antialiased transition-colors duration-150 ${getFontSizeClass()} ${highContrast ? 'contrast-125 saturate-150' : ''}`}
      style={{ backgroundColor: '#F5F7FA' }}
    >
      {/* 1. Government Utility Bar (Section A) */}
      <GovernmentUtilityBar
        fontSizeLevel={fontSizeLevel}
        onAdjustFontSize={(delta) => setFontSizeLevel(prev => Math.max(-1, Math.min(2, prev + delta)))}
        onResetFontSize={() => setFontSizeLevel(0)}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(prev => !prev)}
        language={language}
        onToggleLanguage={() => setLanguage(prev => (prev === 'EN' ? 'HI' : 'EN'))}
        onNavigateHelp={() => setCurrentTab('about')}
      />

      {/* 2. Main Government Header (Section B) */}
      <GovernmentHeader
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenAuth={handleOpenAuth}
        language={language}
      />

      {/* 3. Primary Horizontal Navigation Bar (Section C) */}
      <GovernmentNavigation
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenAuth={handleOpenAuth}
      />

      {/* 4. Official Breadcrumbs Bar */}
      <div className="bg-[#EAF2F8] border-b border-[#DCE3EA] py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#657586] font-medium">
            <button
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-1 hover:text-[#153E63] cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#1F5F91]" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#DCE3EA]" />
            <span className="font-bold text-[#153E63]">{getBreadcrumbLabel(currentTab)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#657586]">
            <span className="w-2 h-2 rounded-full bg-[#28834A]" />
            <span>Civic SLA Active: Standard 72h / Critical 24h</span>
          </div>
        </div>
      </div>

      {/* 5. Main Content Viewport */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentTab === 'home' && (
          <LandingPage
            onNavigate={setCurrentTab}
            onOpenAuth={handleOpenAuth}
            onSelectReportId={reportId => setActiveModalReportId(reportId)}
          />
        )}

        {currentTab === 'track-report' && (
          <TrackReportView
            onNavigateToSubmit={() => setCurrentTab('submit-report')}
            onOpenReportModal={reportId => setActiveModalReportId(reportId)}
          />
        )}

        {currentTab === 'departments' && (
          <DepartmentsView
            onNavigateToSubmit={() => setCurrentTab('submit-report')}
            onNavigateToIncidents={() => setCurrentTab('incidents')}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage />
        )}

        {currentTab === 'citizen-dashboard' && (
          <CitizenDashboard
            onNavigateToSubmit={() => setCurrentTab('submit-report')}
            onNavigateToMyReports={() => setCurrentTab('my-reports')}
            onOpenIncident={() => setCurrentTab('incidents')}
          />
        )}

        {currentTab === 'submit-report' && (
          <SubmitReportView
            onReportCreated={() => {}}
            onNavigateToMyReports={() => setCurrentTab('my-reports')}
          />
        )}

        {currentTab === 'my-reports' && (
          <MyReportsView
            onNavigateToSubmit={() => setCurrentTab('submit-report')}
            onOpenIncident={() => setCurrentTab('incidents')}
          />
        )}

        {currentTab === 'intel-dashboard' && (
          <IntelligenceDashboard
            onNavigateToIncidents={() => setCurrentTab('incidents')}
            onNavigateToInvestigation={() => setCurrentTab('investigation')}
            onNavigateToMap={() => setCurrentTab('map')}
            onSelectIncident={handleSelectIncident}
            onSelectReport={handleSelectReport}
          />
        )}

        {currentTab === 'incidents' && (
          <IncidentManagementView
            onOpenReport={reportId => setActiveModalReportId(reportId)}
          />
        )}

        {currentTab === 'investigation' && (
          <ReportInvestigationView />
        )}

        {currentTab === 'map' && (
          <GeospatialIntelligenceView />
        )}

        {currentTab === 'trends' && (
          <TrendAnalysisView />
        )}

        {currentTab === 'field-officer-dashboard' && (
          <FieldOfficerDashboard />
        )}

        {currentTab === 'dept-officer-dashboard' && (
          <DeptOfficerDashboard />
        )}

        {currentTab === 'analyst-dashboard' && (
          <DataAnalystDashboard />
        )}

        {currentTab === 'agent' && (
          <AgentConsoleView />
        )}

        {currentTab === 'admin-panel' && (
          <AdminPanelView />
        )}

        {currentTab === 'tests' && (
          <TestRunnerView />
        )}
      </main>

      {/* 6. Global Report Detail Inspector Modal */}
      {activeModalReportId && (
        <ReportDetailModal
          reportId={activeModalReportId}
          onClose={() => setActiveModalReportId(null)}
          onOpenIncident={() => {
            setActiveModalReportId(null);
            setCurrentTab('incidents');
          }}
        />
      )}

      {/* 7. Municipal Authentication Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessNavigate={(targetTab) => {
          setIsAuthModalOpen(false);
          setCurrentTab(targetTab);
        }}
      />

      {/* 8. Rich Government Footer (Section L) */}
      <GovernmentFooter
        onNavigate={setCurrentTab}
        onOpenAuth={handleOpenAuth}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SCIPMainLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
