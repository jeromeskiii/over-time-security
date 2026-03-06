/**
 * All job payload types for type-safe worker implementations.
 */

// ── Alerts Queue ─────────────────────────────────────────

export interface PatrolMissAlertJob {
  eventId: string;
  eventType: string;
  shiftId: string;
  guardId: string;
  siteId: string;
  expectedCheckpoint: string;
  expectedBy: string;
}

export interface ScheduleCheckpointWatchJob {
  eventId: string;
  eventType: string;
  shiftId: string;
  guardId: string;
  siteId: string;
  checkpoint: string;
  patrolLogId: string;
}

export interface ShiftNoShowAlertJob {
  eventId: string;
  eventType: string;
  shiftId: string;
  guardId: string;
  siteId: string;
  scheduledStart: string;
}

export interface IncidentEscalationJob {
  eventId: string;
  eventType: string;
  incidentId: string;
  severity: string;
  siteId: string;
}

export interface LowComplianceAlertJob {
  eventId: string;
  eventType: string;
  siteId: string;
  scoreId: string;
  overallScore: number;
  grade: string;
}

// ── AI Queue ─────────────────────────────────────────────

export interface GenerateIncidentReportJob {
  eventId: string;
  eventType: string;
  incidentId: string;
  shiftId: string;
  guardId: string;
  siteId: string;
  severity: string;
}

// ── Reports Queue ────────────────────────────────────────

export interface GenerateDailyReportJob {
  siteId: string;
  clientId: string;
  periodStart: string;
  periodEnd: string;
}

// ── Notifications Queue ──────────────────────────────────

export interface LeadAutoResponseJob {
  eventId: string;
  eventType: string;
  leadId: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
}

export interface DispatcherNewLeadTaskJob {
  eventId: string;
  eventType: string;
  leadId: string;
  name: string;
  service: string;
}

export interface SendReportNotificationJob {
  eventId: string;
  eventType: string;
  reportId: string;
  siteId: string;
  reportType: 'incident' | 'daily' | 'compliance';
  pdfKey?: string;
}

export interface EscalationNotificationJob {
  eventId: string;
  eventType: string;
  incidentId: string;
  severity: string;
  siteId: string;
  escalationReason: string;
}

// ── Compliance Queue ─────────────────────────────────────

export interface RecalculateSiteScoreJob {
  eventId: string;
  eventType: string;
  siteId: string;
  shiftId: string;
}

// ── Union types for each queue ──────────────────────────

export type AlertsJobData =
  | PatrolMissAlertJob
  | ScheduleCheckpointWatchJob
  | ShiftNoShowAlertJob
  | IncidentEscalationJob
  | LowComplianceAlertJob;

export type AIJobData = GenerateIncidentReportJob;

export type ReportsJobData = GenerateDailyReportJob;

export type NotificationsJobData =
  | LeadAutoResponseJob
  | DispatcherNewLeadTaskJob
  | SendReportNotificationJob
  | EscalationNotificationJob;

export type ComplianceJobData = RecalculateSiteScoreJob;
