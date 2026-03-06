import { Job } from 'bullmq';
import { prisma } from '@ots/db';
import { createWorker } from './base';
import { sendSMS } from '../notifications/sms';
import { sendEmail } from '../notifications/email';
import {
  createNotificationRecord,
  markNotificationSent,
  markNotificationFailed,
} from '../notifications/tracker';
import {
  patrolMissAlertSMS,
  shiftNoShowAlertSMS,
  escalationAlertSMS,
  lowComplianceAlertSMS,
  escalationAlertEmail,
} from '../notifications/templates';
import type {
  PatrolMissAlertJob,
  ScheduleCheckpointWatchJob,
  ShiftNoShowAlertJob,
  IncidentEscalationJob,
  LowComplianceAlertJob,
} from '../jobs/types';

export function startAlertsWorker() {
  return createWorker(
    { queue: 'alerts', concurrency: 10 },
    {
      'patrol-miss-alert': async (job: Job<PatrolMissAlertJob>) => {
        const { shiftId, guardId, siteId, expectedCheckpoint, expectedBy } = job.data;

        const [guard, site] = await Promise.all([
          prisma.guard.findUniqueOrThrow({ where: { id: guardId } }),
          prisma.site.findUniqueOrThrow({ where: { id: siteId }, include: { client: true } }),
        ]);

        await prisma.shift.update({
          where: { id: shiftId },
          data: { riskLevel: 'AT_RISK' },
        });

        const smsBody = patrolMissAlertSMS({
          guardName: guard.name,
          siteName: site.location,
          checkpoint: expectedCheckpoint,
          expectedBy,
        });

        if (site.client.phone) {
          const notifId = await createNotificationRecord({
            channel: 'SMS',
            recipientId: site.client.id,
            recipientType: 'client',
            body: smsBody,
            eventId: job.data.eventId,
          });

          try {
            const sid = await sendSMS({ to: site.client.phone, body: smsBody });
            await markNotificationSent(notifId, sid);
          } catch (err) {
            await markNotificationFailed(notifId, err instanceof Error ? err.message : 'Unknown error');
          }
        }

        await prisma.event.create({
          data: {
            type: 'PATROL_MISSED_CHECKPOINT',
            entityType: 'shift',
            entityId: shiftId,
            payload: { guardId, siteId, expectedCheckpoint, expectedBy, alertSent: true },
            actorType: 'SYSTEM',
          },
        });
      },

      'schedule-checkpoint-watch': async (job: Job<ScheduleCheckpointWatchJob>) => {
        const { shiftId, patrolLogId } = job.data;

        const CHECKPOINT_WINDOW_MINUTES = parseInt(process.env.CHECKPOINT_WINDOW_MINUTES ?? '30', 10);

        const currentLog = await prisma.patrolLog.findUnique({ where: { id: patrolLogId } });
        if (!currentLog) return;

        const windowEnd = new Date(currentLog.timestamp.getTime() + CHECKPOINT_WINDOW_MINUTES * 60 * 1000);
        const now = new Date();

        if (now < windowEnd) {
          const delayMs = windowEnd.getTime() - now.getTime();
          const queue = (await import('../jobs/queues')).getQueue('alerts');
          await queue.add('schedule-checkpoint-watch', job.data, { delay: delayMs });
          return;
        }

        const newerLog = await prisma.patrolLog.findFirst({
          where: {
            shiftId,
            timestamp: { gt: currentLog.timestamp },
          },
          orderBy: { timestamp: 'asc' },
        });

        if (!newerLog) {
          const queue = (await import('../jobs/queues')).getQueue('alerts');
          await queue.add('patrol-miss-alert', {
            eventId: job.data.eventId,
            eventType: 'PATROL_MISSED_CHECKPOINT',
            shiftId: job.data.shiftId,
            guardId: job.data.guardId,
            siteId: job.data.siteId,
            expectedCheckpoint: 'next after ' + job.data.checkpoint,
            expectedBy: windowEnd.toISOString(),
          }, { priority: 1 });
        }
      },

      'shift-no-show-alert': async (job: Job<ShiftNoShowAlertJob>) => {
        const { shiftId, guardId, siteId, scheduledStart } = job.data;

        const [guard, site] = await Promise.all([
          prisma.guard.findUniqueOrThrow({ where: { id: guardId } }),
          prisma.site.findUniqueOrThrow({ where: { id: siteId }, include: { client: true } }),
        ]);

        await prisma.shift.update({
          where: { id: shiftId },
          data: { status: 'CANCELLED', riskLevel: 'CRITICAL' },
        });

        const smsBody = shiftNoShowAlertSMS({
          guardName: guard.name,
          siteName: site.location,
          scheduledStart,
        });

        if (site.client.phone) {
          const notifId = await createNotificationRecord({
            channel: 'SMS',
            recipientId: site.client.id,
            recipientType: 'client',
            body: smsBody,
            eventId: job.data.eventId,
          });

          try {
            const sid = await sendSMS({ to: site.client.phone, body: smsBody });
            await markNotificationSent(notifId, sid);
          } catch (err) {
            await markNotificationFailed(notifId, err instanceof Error ? err.message : 'Unknown error');
          }
        }
      },

      'incident-escalation': async (job: Job<IncidentEscalationJob>) => {
        const { incidentId, severity } = job.data;

        const incident = await prisma.incident.findUniqueOrThrow({
          where: { id: incidentId },
          include: { site: { include: { client: true } } },
        });

        const smsBody = escalationAlertSMS({
          siteName: incident.site.location,
          severity,
          incidentTitle: incident.description.slice(0, 100),
        });

        if (incident.site.client.phone) {
          const notifId = await createNotificationRecord({
            channel: 'SMS',
            recipientId: incident.site.client.id,
            recipientType: 'client',
            body: smsBody,
            eventId: job.data.eventId,
          });

          try {
            const sid = await sendSMS({ to: incident.site.client.phone, body: smsBody });
            await markNotificationSent(notifId, sid);
          } catch (err) {
            await markNotificationFailed(notifId, err instanceof Error ? err.message : 'Unknown error');
          }
        }

        if (incident.site.client.email) {
          const emailContent = escalationAlertEmail({
            siteName: incident.site.location,
            incidentTitle: incident.description.slice(0, 100),
            severity,
            escalationReason: `Incident classified as ${severity} severity - requires immediate attention`,
          });

          const notifId = await createNotificationRecord({
            channel: 'EMAIL',
            recipientId: incident.site.client.id,
            recipientType: 'client',
            subject: emailContent.subject,
            body: emailContent.html,
            eventId: job.data.eventId,
          });

          try {
            const msgId = await sendEmail({
              to: incident.site.client.email,
              subject: emailContent.subject,
              html: emailContent.html,
            });
            await markNotificationSent(notifId, msgId);
          } catch (err) {
            await markNotificationFailed(notifId, err instanceof Error ? err.message : 'Unknown error');
          }
        }
      },

      'low-compliance-alert': async (job: Job<LowComplianceAlertJob>) => {
        const { siteId, overallScore, grade } = job.data;

        const site = await prisma.site.findUniqueOrThrow({
          where: { id: siteId },
          include: { client: true },
        });

        const smsBody = lowComplianceAlertSMS({
          siteName: site.location,
          score: overallScore,
          grade,
        });

        if (site.client.phone) {
          const notifId = await createNotificationRecord({
            channel: 'SMS',
            recipientId: site.client.id,
            recipientType: 'client',
            body: smsBody,
            eventId: job.data.eventId,
          });

          try {
            const sid = await sendSMS({ to: site.client.phone, body: smsBody });
            await markNotificationSent(notifId, sid);
          } catch (err) {
            await markNotificationFailed(notifId, err instanceof Error ? err.message : 'Unknown error');
          }
        }
      },

      'check-shift-no-shows': async (_job: Job) => {
        const NO_SHOW_THRESHOLD_MINUTES = parseInt(process.env.NO_SHOW_THRESHOLD_MINUTES ?? '30', 10);
        const threshold = new Date(Date.now() - NO_SHOW_THRESHOLD_MINUTES * 60 * 1000);

        const noShowShifts = await prisma.shift.findMany({
          where: {
            status: 'SCHEDULED',
            startTime: { lte: threshold },
            checkIns: { none: {} },
          },
          select: { id: true, guardId: true, siteId: true, startTime: true },
        });

        const queue = (await import('../jobs/queues')).getQueue('alerts');

        for (const shift of noShowShifts) {
          await queue.add('shift-no-show-alert', {
            eventId: '',
            eventType: 'SHIFT_NO_SHOW',
            shiftId: shift.id,
            guardId: shift.guardId,
            siteId: shift.siteId,
            scheduledStart: shift.startTime.toISOString(),
          }, { priority: 1 });
        }
      },
    }
  );
}
