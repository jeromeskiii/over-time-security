import type { EventType } from '@ots/db';
import type { JobsOptions } from 'bullmq';

interface JobRouting {
  queue: string;
  name: string;
  data: Record<string, unknown>;
  options?: JobsOptions;
}

/**
 * Maps each event type to zero or more BullMQ jobs.
 * This is the single source of truth for "what happens when X occurs."
 */
export function eventJobRouter(
  type: EventType,
  payload: Record<string, unknown>,
  eventId: string
): JobRouting[] {
  const jobs: JobRouting[] = [];

  switch (type) {
    case 'GUARD_CHECKED_IN':
      // No immediate automation — logged for compliance scoring
      break;

    case 'GUARD_CHECKED_OUT':
      // Trigger compliance recalculation for this shift
      jobs.push({
        queue: 'compliance',
        name: 'recalculate-site-score',
        data: { siteId: payload.siteId, shiftId: payload.shiftId },
        options: { delay: 5000 }, // Small delay to let DB settle
      });
      break;

    case 'PATROL_CHECKPOINT_SCANNED':
      // Schedule a "missed checkpoint" check — if the next expected
      // checkpoint isn't scanned within the window, it'll fire an alert.
      jobs.push({
        queue: 'alerts',
        name: 'schedule-checkpoint-watch',
        data: {
          shiftId: payload.shiftId,
          guardId: payload.guardId,
          siteId: payload.siteId,
          checkpoint: payload.checkpoint,
          patrolLogId: payload.patrolLogId,
        },
        options: { delay: 0 }, // Worker decides the actual delay
      });
      break;

    case 'PATROL_MISSED_CHECKPOINT':
      // 🚨 High-priority alert
      jobs.push({
        queue: 'alerts',
        name: 'patrol-miss-alert',
        data: {
          shiftId: payload.shiftId,
          guardId: payload.guardId,
          siteId: payload.siteId,
          expectedCheckpoint: payload.expectedCheckpoint,
          expectedBy: payload.expectedBy,
        },
        options: { priority: 1 }, // Highest priority
      });
      break;

    case 'INCIDENT_CREATED':
      // AI report generation
      jobs.push({
        queue: 'ai',
        name: 'generate-incident-report',
        data: {
          incidentId: payload.incidentId,
          shiftId: payload.shiftId,
          guardId: payload.guardId,
          siteId: payload.siteId,
          severity: payload.severity,
        },
      });

      // Escalation check for HIGH/CRITICAL
      if (payload.severity === 'HIGH' || payload.severity === 'CRITICAL') {
        jobs.push({
          queue: 'alerts',
          name: 'incident-escalation',
          data: {
            incidentId: payload.incidentId,
            severity: payload.severity,
            siteId: payload.siteId,
          },
          options: { priority: 1 },
        });
      }
      break;

    case 'INCIDENT_ESCALATED':
      // Notify all supervisors + client
      jobs.push({
        queue: 'notifications',
        name: 'escalation-notification',
        data: {
          incidentId: payload.incidentId,
          severity: payload.severity,
          siteId: payload.siteId,
          escalationReason: (payload as any).escalationReason,
        },
        options: { priority: 1 },
      });
      break;

    case 'SHIFT_NO_SHOW':
      // Alert supervisor immediately
      jobs.push({
        queue: 'alerts',
        name: 'shift-no-show-alert',
        data: {
          shiftId: payload.shiftId,
          guardId: payload.guardId,
          siteId: payload.siteId,
          scheduledStart: payload.scheduledStart,
        },
        options: { priority: 1 },
      });
      break;

    case 'SHIFT_STARTED':
      // No immediate jobs, compliance tracking handled at shift end
      break;

    case 'SHIFT_ENDED':
      // Compliance score recalculation
      jobs.push({
        queue: 'compliance',
        name: 'recalculate-site-score',
        data: { siteId: payload.siteId, shiftId: payload.shiftId },
        options: { delay: 10000 }, // Let all final writes settle
      });
      break;

    case 'REPORT_GENERATED':
      // Send report to client
      jobs.push({
        queue: 'notifications',
        name: 'send-report-notification',
        data: {
          reportId: (payload as any).reportId,
          siteId: payload.siteId,
          reportType: (payload as any).reportType,
          pdfKey: (payload as any).pdfKey,
        },
      });
      break;

    case 'LEAD_CREATED':
      // Auto-response + dispatcher task
      jobs.push({
        queue: 'notifications',
        name: 'lead-auto-response',
        data: {
          leadId: payload.leadId,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          service: payload.service,
        },
      });
      jobs.push({
        queue: 'notifications',
        name: 'dispatcher-new-lead-task',
        data: {
          leadId: payload.leadId,
          name: payload.name,
          service: payload.service,
        },
      });
      break;

    case 'COMPLIANCE_CALCULATED':
      // If score is low, alert supervisor
      if (typeof payload.overallScore === 'number' && payload.overallScore < 60) {
        jobs.push({
          queue: 'alerts',
          name: 'low-compliance-alert',
          data: {
            siteId: payload.siteId,
            scoreId: payload.scoreId,
            overallScore: payload.overallScore,
            grade: payload.grade,
          },
        });
      }
      break;

    default:
      // Unknown event type — log for debugging
      console.warn(`[EventRouter] No handler for event type: ${type}`);
  }

  return jobs;
}
