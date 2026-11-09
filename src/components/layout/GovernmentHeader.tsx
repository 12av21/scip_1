// SCIP Government Portal - Main Header
// Professional Indian Government Digital Portal Aesthetic inspired by MyGov.in
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/apiClient';
import { Notification, UserRole } from '../../types/scip';
import {
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Shield,
  CheckCircle,
  FileText,
  AlertTriangle,
  Building2,
  Sparkles
} from 'lucide-react';

interface GovernmentHeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  language: 'EN' | 'HI';
}

export const GovernmentHeader: React.FC<GovernmentHeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenAuth,
  language
}) => {
  const { user, role, switchDemoRole, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 12000);
    return () => clearInterval(interval);
  }, [user]);

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (res && res.data) {
        setNotifications(res.data);
      }
    } catch {
      // Ignore
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim().toUpperCase();
    if (q.startsWith('REP') || q.startsWith('INC')) {
      onNavigate('track-report');
    } else {
      onNavigate('departments');
    }
  };

  return (
    <header className="bg-white border-b border-[#DCE3EA] py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: SCIP Crest & Government Portal Wordmark */}
        <div
          className="flex items-center gap-3 sm:gap-4 cursor-pointer select-none"
          onClick={() => onNavigate('home')}
        >
          {/* Custom SCIP Civic Crest / Insignia */}
          <div className="w-12 h-12 rounded-xl bg-[#153E63] text-white flex flex-col items-center justify-center p-1 border-2 border-[#1F5F91] shadow-xs relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#E89B36]" />
            <Shield className="w-5 h-5 text-[#E89B36] mb-0.5" />
            <span className="font-extrabold text-[10px] tracking-wider leading-none">SCIP</span>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#28834A]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#153E63] tracking-tight leading-none">
                SCIP
              </span>
              <span className="text-xs px-2 py-0.5 font-bold uppercase rounded bg-[#EAF2F8] text-[#1F5F91] border border-[#DCE3EA]">
                Government Edition
              </span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#253443] tracking-tight leading-tight mt-1">
              Smart Community Intelligence Platform
            </div>
            <div className="text-[11px] text-[#657586] font-medium leading-none mt-0.5">
              Connecting Communities · Enabling Better Governance
            </div>
          </div>
        </div>

        {/* Center: Search Box */}
        <div className="flex-1 max-w-md hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-[#657586] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search services, report ID (REP-...), or department..."
              className="w-full pl-9 pr-20 py-2 text-xs bg-[#F5F7FA] border border-[#DCE3EA] rounded-lg text-[#253443] placeholder-[#657586] focus:bg-white focus:border-[#1F5F91] focus:outline-hidden transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-[#1F5F91] hover:bg-[#153E63] rounded transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Right: Quick Role Persona Switcher, Notifications & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* Role Persona Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#153E63] bg-[#EAF2F8] hover:bg-[#dbeafe] rounded-md border border-[#DCE3EA] transition-colors cursor-pointer"
                  title="Switch Role Persona"
                >
                  <span className="text-[10px] text-[#657586] uppercase font-normal">Role:</span>
                  <span className="uppercase text-[11px] font-bold text-[#1F5F91]">{role}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#1F5F91]" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-[#DCE3EA] py-1 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-[#657586] uppercase tracking-wider border-b border-[#DCE3EA] flex items-center justify-between">
                      <span>Government Roles (6)</span>
                      <span className="text-[9px] text-[#1F5F91] font-semibold">RBAC Verified</span>
                    </div>
                    {([
                      { role: 'citizen' as UserRole, label: 'Citizen', sub: 'Priya Sharma (Public)', target: 'citizen-dashboard' },
                      { role: 'officer' as UserRole, label: 'Field Officer', sub: 'Er. Vikram Sharma (PWD)', target: 'field-officer-dashboard' },
                      { role: 'dept_officer' as UserRole, label: 'Dept Desk Officer', sub: 'Er. Sunita Patel (Urban Dev)', target: 'dept-officer-dashboard' },
                      { role: 'analyst' as UserRole, label: 'Data & AI Analyst', sub: 'Dr. Kavita Rao (Analytics)', target: 'analyst-dashboard' },
                      { role: 'authority' as UserRole, label: 'Authority Director', sub: 'Dr. Rajesh Gupta (Directorate)', target: 'intel-dashboard' },
                      { role: 'admin' as UserRole, label: 'Super Administrator', sub: 'Adarsh Verma (MCA Gov)', target: 'admin-panel' },
                    ]).map(item => (
                      <button
                        key={item.role}
                        onClick={() => {
                          switchDemoRole(item.role);
                          setIsRoleDropdownOpen(false);
                          onNavigate(item.target);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#EAF2F8] transition-colors cursor-pointer ${
                          role === item.role ? 'font-bold text-[#1F5F91] bg-[#F5F7FA]' : 'text-[#253443]'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-[10px] text-[#657586] font-normal">{item.sub}</div>
                        </div>
                        {role === item.role && <CheckCircle className="w-3.5 h-3.5 text-[#28834A] shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Center */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 text-[#253443] hover:text-[#153E63] rounded-md hover:bg-[#F5F7FA] border border-transparent hover:border-[#DCE3EA] transition-colors cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#B42318] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-[#DCE3EA] py-2 z-50">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-[#DCE3EA]">
                      <span className="text-xs font-bold text-[#153E63]">
                        Official Notifications ({notifications.length})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={async () => {
                            await api.markAllNotificationsRead();
                            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                          }}
                          className="text-[11px] text-[#1F5F91] hover:underline font-semibold cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-[#F0F4F8]">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-[#657586]">
                          No notifications available.
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              api.markNotificationRead(notif.id);
                              if (notif.link?.startsWith('INC')) {
                                onNavigate('incidents');
                              } else if (notif.link?.startsWith('REP')) {
                                onNavigate('my-reports');
                              }
                              setIsNotifOpen(false);
                            }}
                            className={`p-3 text-xs hover:bg-[#F5F7FA] cursor-pointer transition-colors ${
                              !notif.read ? 'bg-[#EAF2F8]/50' : ''
                            }`}
                          >
                            <div className="font-semibold text-[#253443] flex items-center justify-between">
                              <span>{notif.title}</span>
                              <span className="text-[10px] text-[#657586] font-normal">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[#657586] mt-1 text-[11px] leading-relaxed line-clamp-2">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-md hover:bg-[#F5F7FA] border border-[#DCE3EA] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-md bg-[#153E63] text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden xl:block text-left text-xs">
                    <div className="font-semibold text-[#253443] leading-none">{user.name}</div>
                    <div className="text-[10px] text-[#1F5F91] font-bold uppercase mt-1 leading-none">
                      {role}
                    </div>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#DCE3EA] py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-[#DCE3EA]">
                      <div className="text-xs font-bold text-[#153E63]">{user.name}</div>
                      <div className="text-[11px] text-[#657586] truncate">{user.email}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#EAF2F8] text-[#1F5F91]">
                        {role} account
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate(role === 'citizen' ? 'my-reports' : 'admin-panel');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#253443] hover:bg-[#F5F7FA] flex items-center gap-2 cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#657586]" />
                      <span>Citizen Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('track-report');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#253443] hover:bg-[#F5F7FA] flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#657586]" />
                      <span>Track Submissions</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                        onNavigate('home');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#B42318] hover:bg-[#FDF2F2] flex items-center gap-2 border-t border-[#DCE3EA] cursor-pointer font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#153E63] hover:text-[#1F5F91] hover:bg-[#EAF2F8] rounded-md border border-[#DCE3EA] transition-colors cursor-pointer"
              >
                Citizen Login
              </button>
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#1F5F91] hover:bg-[#153E63] rounded-md shadow-xs transition-colors cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
