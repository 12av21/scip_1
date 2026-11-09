// SCIP - Centralized Typed API Client
// Handles authentication headers, token persistence, error parsing, and graceful fallback

import {
  User,
  Report,
  Incident,
  AIAnalysis,
  SpatioTemporalCluster,
  AgentBriefing,
  AuditLog,
  Department,
  Notification,
  Feedback,
  UserRole,
  InspectionRecord,
  ModelEvaluationMetrics
} from '../types/scip.js';

const TOKEN_KEY = 'scip_auth_token';
const USER_KEY = 'scip_auth_user';

class APIClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  public getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const str = localStorage.getItem(USER_KEY);
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  public setStoredUser(user: User | null) {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    const token = this.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const res = await fetch(endpoint, {
        ...options,
        headers
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Request failed with status ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      throw err;
    }
  }

  // --- Public API Methods ---

  // Auth
  public async register(payload: { name: string; email: string; password: string; role?: UserRole; phone?: string }) {
    const res = await this.request<{ success: boolean; data: { user: User; token: string } }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    this.setToken(res.data.token);
    this.setStoredUser(res.data.user);
    return res.data;
  }

  public async login(payload: { email: string; password: string }) {
    const res = await this.request<{ success: boolean; data: { user: User; token: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    this.setToken(res.data.token);
    this.setStoredUser(res.data.user);
    return res.data;
  }

  public async demoLogin(role: UserRole) {
    const res = await this.request<{ success: boolean; data: { user: User; token: string } }>('/api/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
    this.setToken(res.data.token);
    this.setStoredUser(res.data.user);
    return res.data;
  }

  public async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    this.setToken(null);
    this.setStoredUser(null);
  }

  // Reports
  public async getReports(params?: { category?: string; status?: string; urgency?: string; myOnly?: boolean }) {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    if (params?.urgency) query.set('urgency', params.urgency);
    if (params?.myOnly) query.set('myOnly', 'true');

    const res = await this.request<{ success: boolean; data: Report[] }>(`/api/reports?${query.toString()}`);
    return res.data;
  }

  public async getReportById(id: string) {
    const res = await this.request<{ success: boolean; data: { report: Report; analysis: AIAnalysis | null } }>(`/api/reports/${id}`);
    return res.data;
  }

  public async createReport(payload: Partial<Report>) {
    const res = await this.request<{ success: boolean; data: { report: Report; analysis: AIAnalysis } }>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  }

  public async updateReport(id: string, updates: Partial<Report>) {
    const res = await this.request<{ success: boolean; data: Report }>(`/api/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return res.data;
  }

  public async reanalyzeReport(id: string) {
    const res = await this.request<{ success: boolean; data: AIAnalysis }>(`/api/reports/${id}/reanalyze`, {
      method: 'POST'
    });
    return res.data;
  }

  // Incidents
  public async getIncidents(params?: { status?: string; category?: string; priority?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.category) query.set('category', params.category);
    if (params?.priority) query.set('priority', params.priority);

    const res = await this.request<{ success: boolean; data: Incident[] }>(`/api/incidents?${query.toString()}`);
    return res.data;
  }

  public async getIncidentById(id: string) {
    const res = await this.request<{ success: boolean; data: { incident: Incident; linkedReports: Report[] } }>(`/api/incidents/${id}`);
    return res.data;
  }

  public async createIncidentFromCluster(cluster: SpatioTemporalCluster) {
    const res = await this.request<{ success: boolean; data: Incident }>('/api/incidents/from-cluster', {
      method: 'POST',
      body: JSON.stringify({ cluster })
    });
    return res.data;
  }

  public async reviewIncident(id: string, payload: { action: 'confirm' | 'dismiss'; notes: string; departmentId?: string; officerId?: string }) {
    const res = await this.request<{ success: boolean; data: Incident }>(`/api/incidents/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  }

  public async resolveIncident(id: string, payload: { actionTaken: string; preventiveMeasures?: string; costEstimate?: number }) {
    const res = await this.request<{ success: boolean; data: Incident }>(`/api/incidents/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  }

  // Intelligence
  public async runAgentQuery(query: string, specificTool?: string) {
    const res = await this.request<{ success: boolean; data: AgentBriefing }>('/api/intelligence/agent', {
      method: 'POST',
      body: JSON.stringify({ query, specificTool })
    });
    return res.data;
  }

  public async getClusters() {
    const res = await this.request<{ success: boolean; data: SpatioTemporalCluster[] }>('/api/intelligence/clusters');
    return res.data;
  }

  public async getHotspots() {
    const res = await this.request<{ success: boolean; data: any[] }>('/api/intelligence/hotspots');
    return res.data;
  }

  public async getTrends() {
    const res = await this.request<{ success: boolean; data: any }>('/api/intelligence/trends');
    return res.data;
  }

  // Admin
  public async getUsers() {
    const res = await this.request<{ success: boolean; data: User[] }>('/api/admin/users');
    return res.data;
  }

  public async updateUserRole(userId: string, role: UserRole) {
    const res = await this.request<{ success: boolean; data: User }>(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
    return res.data;
  }

  public async getDepartments() {
    const res = await this.request<{ success: boolean; data: Department[] }>('/api/admin/departments');
    return res.data;
  }

  public async getAuditLogs(params?: { module?: string; action?: string }) {
    const query = new URLSearchParams();
    if (params?.module) query.set('module', params.module);
    if (params?.action) query.set('action', params.action);
    const res = await this.request<{ success: boolean; data: AuditLog[] }>(`/api/admin/audit-logs?${query.toString()}`);
    return res.data;
  }

  // Misc
  public async getNotifications() {
    const res = await this.request<{ success: boolean; data: Notification[]; unreadCount: number }>('/api/notifications');
    return res;
  }

  public async markNotificationRead(id: string) {
    return await this.request(`/api/notifications/${id}/read`, { method: 'PUT' });
  }

  public async markAllNotificationsRead() {
    return await this.request('/api/notifications/read-all', { method: 'POST' });
  }

  public async submitFeedback(payload: { reportId?: string; incidentId?: string; rating: number; comments: string }) {
    const res = await this.request<{ success: boolean; data: Feedback }>('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  }

  public async changePassword(payload: { oldPassword: string; newPassword: string }) {
    return await this.request<{ success: boolean; message: string }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async updateProfile(payload: { name?: string; phone?: string }) {
    const res = await this.request<{ success: boolean; data: User }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    this.setStoredUser(res.data);
    return res.data;
  }

  public async resetPassword(email: string) {
    return await this.request<{ success: boolean; message: string; meta?: any }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  public async withdrawReport(id: string) {
    const res = await this.request<{ success: boolean; data: Report }>(`/api/reports/${id}`, {
      method: 'DELETE'
    });
    return res.data;
  }

  public async rejectReport(id: string, reason: string) {
    const res = await this.request<{ success: boolean; data: Report }>(`/api/reports/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
    return res.data;
  }

  public async updateUserStatus(userId: string, status: 'active' | 'suspended') {
    const res = await this.request<{ success: boolean; data: User }>(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return res.data;
  }

  public async submitInspection(incidentId: string, payload: {
    verifiedStatus: 'verified_match' | 'disputed' | 'partial';
    observations: string;
    checklist: {
      physicalVerification: boolean;
      safetyHazardAssessed: boolean;
      structuralDamageChecked: boolean;
      utilityImpactVerified: boolean;
    };
    evidencePhotos?: string[];
    recommendedAction?: string;
  }) {
    const res = await this.request<{ success: boolean; data: InspectionRecord }>(
      `/api/incidents/${incidentId}/inspection`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
    return res.data;
  }

  public async getInspections(incidentId: string) {
    const res = await this.request<{ success: boolean; data: InspectionRecord[] }>(
      `/api/incidents/${incidentId}/inspections`
    );
    return res.data;
  }

  public async verifyInspection(incidentId: string, payload: {
    inspectionId: string;
    departmentRemarks: string;
    isApproved: boolean;
  }) {
    const res = await this.request<{ success: boolean; data: InspectionRecord }>(
      `/api/incidents/${incidentId}/verify-inspection`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
    return res.data;
  }

  public async assignIncident(incidentId: string, payload: {
    departmentId?: string;
    officerId: string;
    officerName: string;
    notes?: string;
  }) {
    const res = await this.request<{ success: boolean; data: Incident }>(
      `/api/incidents/${incidentId}/assign`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
    return res.data;
  }

  public async escalateIncident(incidentId: string, reason: string) {
    const res = await this.request<{ success: boolean; data: Incident }>(
      `/api/incidents/${incidentId}/escalate`,
      {
        method: 'POST',
        body: JSON.stringify({ reason })
      }
    );
    return res.data;
  }

  public async getModelMetrics() {
    const res = await this.request<{ success: boolean; data: ModelEvaluationMetrics }>(
      '/api/intelligence/model-metrics'
    );
    return res.data;
  }

  public async getDatasetQuality() {
    const res = await this.request<{ success: boolean; data: any }>(
      '/api/intelligence/dataset-quality'
    );
    return res.data;
  }

  public async runAutomatedTests() {
    const res = await this.request<{ success: boolean; data: any }>('/api/tests/run', {
      method: 'POST'
    });
    return res.data;
  }
}

export const api = new APIClient();
