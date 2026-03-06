import { describe, it, expect } from 'vitest';
import type {
  GuardCheckedInPayload,
  PatrolCheckpointScannedPayload,
  IncidentCreatedPayload,
  ComplianceCalculatedPayload,
  EventPayloadMap,
} from '@ots/domain';

// Contract tests ensure event payloads match expected schema
describe('Event Payload Contracts', () => {
  describe('GUARD_CHECKED_IN', () => {
    it('should have required fields', () => {
      const payload: GuardCheckedInPayload = {
        shiftId: 'shift-1',
        guardId: 'guard-1',
        siteId: 'site-1',
        checkInType: 'CLOCK_IN',
      };

      expect(payload.shiftId).toBeDefined();
      expect(payload.guardId).toBeDefined();
      expect(payload.siteId).toBeDefined();
      expect(['CLOCK_IN', 'CLOCK_OUT']).toContain(payload.checkInType);
    });

    it('should allow optional location fields', () => {
      const payload: GuardCheckedInPayload = {
        shiftId: 'shift-1',
        guardId: 'guard-1',
        siteId: 'site-1',
        checkInType: 'CLOCK_IN',
        latitude: 34.0522,
        longitude: -118.2437,
      };

      expect(payload.latitude).toBeTypeOf('number');
      expect(payload.longitude).toBeTypeOf('number');
    });
  });

  describe('PATROL_CHECKPOINT_SCANNED', () => {
    it('should have required fields', () => {
      const payload: PatrolCheckpointScannedPayload = {
        shiftId: 'shift-1',
        guardId: 'guard-1',
        siteId: 'site-1',
        checkpoint: 'Main Entrance',
        patrolLogId: 'log-1',
      };

      expect(payload.shiftId).toBeDefined();
      expect(payload.guardId).toBeDefined();
      expect(payload.siteId).toBeDefined();
      expect(payload.checkpoint).toBeDefined();
      expect(payload.patrolLogId).toBeDefined();
    });
  });

  describe('INCIDENT_CREATED', () => {
    it('should have required fields', () => {
      const payload: IncidentCreatedPayload = {
        incidentId: 'inc-1',
        shiftId: 'shift-1',
        guardId: 'guard-1',
        siteId: 'site-1',
        severity: 'HIGH',
        type: 'THEFT',
        title: 'Test incident',
      };

      expect(payload.incidentId).toBeDefined();
      expect(payload.shiftId).toBeDefined();
      expect(payload.guardId).toBeDefined();
      expect(payload.siteId).toBeDefined();
      expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(payload.severity);
      expect([
        'THEFT',
        'VANDALISM',
        'TRESPASS',
        'MEDICAL',
        'FIRE',
        'SUSPICIOUS_ACTIVITY',
        'OTHER',
      ]).toContain(payload.type);
    });
  });

  describe('COMPLIANCE_CALCULATED', () => {
    it('should have required fields', () => {
      const payload: ComplianceCalculatedPayload = {
        siteId: 'site-1',
        scoreId: 'score-1',
        overallScore: 0.85,
        grade: 'B',
      };

      expect(payload.siteId).toBeDefined();
      expect(payload.scoreId).toBeDefined();
      expect(payload.overallScore).toBeTypeOf('number');
      expect(payload.overallScore).toBeGreaterThanOrEqual(0);
      expect(payload.overallScore).toBeLessThanOrEqual(1);
      expect(payload.grade).toBeDefined();
    });
  });

  describe('EventPayloadMap completeness', () => {
    it('should have payload definitions for all event types', () => {
      const requiredEvents = [
        'GUARD_CHECKED_IN',
        'GUARD_CHECKED_OUT',
        'PATROL_STARTED',
        'PATROL_CHECKPOINT_SCANNED',
        'PATROL_MISSED_CHECKPOINT',
        'INCIDENT_CREATED',
        'INCIDENT_ESCALATED',
        'SHIFT_STARTED',
        'SHIFT_ENDED',
        'SHIFT_NO_SHOW',
        'REPORT_GENERATED',
        'LEAD_CREATED',
        'COMPLIANCE_CALCULATED',
      ] as const;

      for (const eventType of requiredEvents) {
        expect(eventType in ({} as EventPayloadMap)).toBe(true);
      }
    });
  });
});
