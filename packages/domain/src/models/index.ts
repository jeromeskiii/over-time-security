export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUOTED' | 'WON' | 'LOST';
export type GuardStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type ShiftStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentType =
  | 'THEFT'
  | 'VANDALISM'
  | 'TRESPASS'
  | 'MEDICAL'
  | 'FIRE'
  | 'SUSPICIOUS_ACTIVITY'
  | 'OTHER';
export type RiskLevel = 'NORMAL' | 'AT_RISK' | 'CRITICAL';
export type ReportStatus =
  | 'PENDING'
  | 'AI_GENERATED'
  | 'SUPERVISOR_REVIEW'
  | 'APPROVED'
  | 'SENT';

export interface ComplianceMetrics {
  patrolCompletion: number;    // 0–1
  incidentFrequency: number;   // 0–1 (lower = better)
  missedCheckIns: number;      // 0–1 (lower = better)
  reportTimeliness: number;    // 0–1
}

export interface ComplianceScore {
  overallScore: number;
  grade: string;
}

export interface ShiftRiskInput {
  status: ShiftStatus;
  missedCheckInsCount: number;
  openIncidentCount: number;
  minutesSinceLastActivity: number | null;
}

// ── Domain entity interfaces ──────────────────────────────

export interface Guard {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: GuardStatus;
  createdAt: Date;
}

export interface Shift {
  id: string;
  guardId: string;
  siteId: string;
  startTime: Date;
  endTime: Date;
  status: ShiftStatus;
  riskLevel: RiskLevel;
  createdAt: Date;
}

export interface Incident {
  id: string;
  guardId: string;
  siteId: string;
  shiftId?: string;
  type: IncidentType;
  description: string;
  severity: IncidentSeverity;
  photoKeys: string[];
  occurredAt: Date;
  createdAt: Date;
}

// ── RBAC types ──────────────────────────────

export type UserRole = 'admin' | 'supervisor' | 'client' | 'guard';
