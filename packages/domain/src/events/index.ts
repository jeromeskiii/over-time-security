import type { EventType, ActorType } from '@ots/db';

/**
 * Base event shape emitted by the EventBus.
 * Every domain action that matters produces one of these.
 */
export interface DomainEvent<T extends EventType = EventType> {
  type: T;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  actorId?: string;
  actorType?: ActorType;
  timestamp?: Date;
}

// ── Typed event payloads ──────────────────────────────

export interface GuardCheckedInPayload {
  shiftId: string;
  guardId: string;
  siteId: string;
  latitude?: number;
  longitude?: number;
  checkInType: 'CLOCK_IN' | 'CLOCK_OUT';
}

export interface PatrolCheckpointScannedPayload {
  shiftId: string;
  guardId: string;
  siteId: string;
  checkpoint: string;
  patrolLogId: string;
}

export interface PatrolMissedCheckpointPayload {
  shiftId: string;
  guardId: string;
  siteId: string;
  expectedCheckpoint: string;
  expectedBy: string; // ISO date
}

export interface IncidentCreatedPayload {
  incidentId: string;
  shiftId: string;
  guardId: string;
  siteId: string;
  severity: string;
  type: string;
  title: string;
}

export interface ShiftNoShowPayload {
  shiftId: string;
  guardId: string;
  siteId: string;
  scheduledStart: string; // ISO date
}

export interface ReportGeneratedPayload {
  reportId: string;
  incidentId?: string;
  siteId: string;
  reportType: 'incident' | 'daily' | 'compliance';
  pdfKey?: string;
}

export interface LeadCreatedPayload {
  leadId: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
}

export interface ComplianceCalculatedPayload {
  siteId: string;
  scoreId: string;
  overallScore: number;
  grade: string;
}

// ── Event type map for type-safe dispatch ──────────────

export interface EventPayloadMap {
  GUARD_CHECKED_IN: GuardCheckedInPayload;
  GUARD_CHECKED_OUT: GuardCheckedInPayload;
  PATROL_STARTED: { shiftId: string; guardId: string; siteId: string };
  PATROL_CHECKPOINT_SCANNED: PatrolCheckpointScannedPayload;
  PATROL_MISSED_CHECKPOINT: PatrolMissedCheckpointPayload;
  INCIDENT_CREATED: IncidentCreatedPayload;
  INCIDENT_ESCALATED: IncidentCreatedPayload & { escalationReason: string };
  SHIFT_STARTED: { shiftId: string; guardId: string; siteId: string };
  SHIFT_ENDED: { shiftId: string; guardId: string; siteId: string };
  SHIFT_NO_SHOW: ShiftNoShowPayload;
  REPORT_GENERATED: ReportGeneratedPayload;
  LEAD_CREATED: LeadCreatedPayload;
  COMPLIANCE_CALCULATED: ComplianceCalculatedPayload;
}

/**
 * Type-safe domain event — guarantees payload matches event type.
 */
export type TypedDomainEvent<T extends EventType> = DomainEvent<T> & {
  payload: EventPayloadMap[T];
};
