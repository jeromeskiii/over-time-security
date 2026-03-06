import { Job } from 'bullmq';
import { prisma } from '@ots/db';
import { createWorker } from './base';
import { sendEmail } from '../notifications/email';
import { sendSMS } from '../notifications/sms';
import {
  createNotificationRecord,
  markNotificationSent,
  markNotificationFailed,
} from '../notifications/tracker';
import {
  leadAutoResponseEmail,
  leadConfirmationSMS,
  incidentReportEmail,
  escalationAlertEmail,
} from '../notifications/templates';
import { safeAICall } from '../ai/guardrails';
import { buildLeadEstimatePrompt } from '../ai/prompts';
import { leadEstimateSchema } from '../ai/schemas';
import type {
  LeadAutoResponseJob,
  DispatcherNewLeadTaskJob,
  SendReportNotificationJob,
  EscalationNotificationJob,
} from '../jobs/types';

export function startNotificationsWorker() {
  return createWorker(
    { queue: 'notifications', concurrency: 10 },
    {
      'lead-auto-response': async (job: Job<LeadAutoResponseJob>) => {
        const { leadId, name, email, phone, service } = job.data;

        const emailContent = leadAutoResponseEmail({ name, service });
        const emailNotifId = await createNotificationRecord({
          channel: 'EMAIL',
          recipientId: leadId,
          recipientType: 'lead',
          subject: emailContent.subject,
          body: emailContent.html,
          eventId: job.data.eventId,
        });

        try {
          const msgId = await sendEmail({
            to: email,
            subject: emailContent.subject,
            html: emailContent.html,
          });
          await markNotificationSent(emailNotifId, msgId);
        } catch (err) {
          await markNotificationFailed(emailNotifId, err instanceof Error ? err.message : 'Unknown error');
        }

        if (phone) {
          const smsBody = leadConfirmationSMS({ name });
          const smsNotifId = await createNotificationRecord({
            channel: 'SMS',
            recipientId: leadId,
            recipientType: 'lead',
            body: smsBody,
            eventId: job.data.eventId,
          });

          try {
            const sid = await sendSMS({ to: phone, body: smsBody });
            await markNotificationSent(smsNotifId, sid);
          } catch (err) {
            await markNotificationFailed(smsNotifId, err instanceof Error ? err.message : 'Unknown error');
          }
        }

        try {
          const lead = await prisma.lead.findUnique({ where: { id: leadId } });
          if (lead) {
            const estimateResult = await safeAICall(
              buildLeadEstimatePrompt({
                service,
                company: lead.company ?? undefined,
                message: lead.message ?? undefined,
              }),
              leadEstimateSchema
            );

            if (estimateResult.success && estimateResult.data) {
              await prisma.lead.update({
                where: { id: leadId },
                data: { estimateData: estimateResult.data as any },
              });
            }
          }
        } catch (err) {
          // Non-critical: estimate is optional
          console.warn(`[Notifications Worker] Failed to generate lead estimate: ${err}`);
        }
      },

      'dispatcher-new-lead-task': async (job: Job<DispatcherNewLeadTaskJob>) => {
        const { leadId, name, service } = job.data;

        const dispatchEmail = process.env.DISPATCH_EMAIL ?? 'dispatch@overtimesecurity.com';
        const subject = `New Lead: ${name} — ${service}`;
        const html = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>New Lead Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Lead ID:</strong> ${leadId}</p>
            <p>Please review in the Operations Dashboard and follow up within 2 business hours.</p>
          </div>
        `;

        const notifId = await createNotificationRecord({
          channel: 'EMAIL',
          recipientId: 'dispatch-team',
          recipientType: 'internal',
          subject,
          body: html,
          eventId: job.data.eventId,
        });

        try {
          const msgId = await sendEmail({ to: dispatchEmail, subject, html });
          await markNotificationSent(notifId, msgId);
        } catch (err) {
          await markNotificationFailed(notifId, err instanceof Error ? err.message : 'Unknown error');
        }
      },

      'send-report-notification': async (job: Job<SendReportNotificationJob>) => {
        const { reportId, siteId, reportType, pdfKey } = job.data;

        const site = await prisma.site.findUniqueOrThrow({
          where: { id: siteId },
          include: { client: true },
        });

        if (!site.client.email) return;

        if (reportType === 'incident') {
          const report = await prisma.report.findUnique({
            where: { id: reportId },
            include: { incident: true },
          });

          if (!report || !report.incident) return;

          const emailContent = incidentReportEmail({
            siteName: site.location,
            incidentTitle: report.incident.description.slice(0, 100),
            severity: report.incident.severity,
            summary: report.content,
            hasPDF: !!pdfKey,
          });

          const notifId = await createNotificationRecord({
            channel: 'EMAIL',
            recipientId: site.client.id,
            recipientType: 'client',
            subject: emailContent.subject,
            body: emailContent.html,
            eventId: job.data.eventId,
          });

          try {
            const msgId = await sendEmail({
              to: site.client.email,
              subject: emailContent.subject,
              html: emailContent.html,
            });
            await markNotificationSent(notifId, msgId);

            await prisma.report.update({
              where: { id: reportId },
              data: { sentAt: new Date(), sentTo: site.client.email, status: 'SENT' },
            });
          } catch (err) {
            await markNotificationFailed(notifId, err instanceof Error ? err.message : 'Unknown error');
          }
        }
      },

      'escalation-notification': async (job: Job<EscalationNotificationJob>) => {
        const { incidentId, severity, escalationReason } = job.data;

        const incident = await prisma.incident.findUniqueOrThrow({
          where: { id: incidentId },
          include: { site: { include: { client: true } } },
        });

        const emailContent = escalationAlertEmail({
          siteName: incident.site.location,
          incidentTitle: incident.description.slice(0, 100),
          severity,
          escalationReason,
        });

        if (incident.site.client.email) {
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
    }
  );
}
