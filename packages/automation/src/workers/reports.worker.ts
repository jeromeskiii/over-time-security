import { Job } from 'bullmq';
import { prisma } from '@ots/db';
import { createWorker } from './base';
import { safeAICall } from '../ai/guardrails';
import { buildDailyReportPrompt } from '../ai/prompts';
import { dailyReportSummarySchema } from '../ai/schemas';
import { generateDailyReportHTML } from '../reports/pdf';
import { sendEmail } from '../notifications/email';
import { dailyReportEmail } from '../notifications/templates';
import {
  createNotificationRecord,
  markNotificationSent,
  markNotificationFailed,
} from '../notifications/tracker';
import { subHours, startOfDay, format } from 'date-fns';
import type { GenerateDailyReportJob } from '../jobs/types';

export function startReportsWorker() {
  return createWorker(
    { queue: 'reports', concurrency: 3 },
    {
      'generate-daily-reports': async (_job: Job) => {
        const sites = await prisma.site.findMany({
          include: { client: true },
        });

        const queue = (await import('../jobs/queues')).getQueue('reports');

        for (const site of sites) {
          const now = new Date();
          const periodEnd = startOfDay(now);
          const periodStart = subHours(periodEnd, 24);

          await queue.add('generate-site-daily-report', {
            siteId: site.id,
            clientId: site.clientId,
            periodStart: periodStart.toISOString(),
            periodEnd: periodEnd.toISOString(),
          });
        }
      },

      'generate-site-daily-report': async (job: Job<GenerateDailyReportJob>) => {
        const { siteId, periodStart, periodEnd } = job.data;
        const start = new Date(periodStart);
        const end = new Date(periodEnd);

        const site = await prisma.site.findUniqueOrThrow({
          where: { id: siteId },
          include: { client: true },
        });

        const shifts = await prisma.shift.findMany({
          where: {
            siteId,
            startTime: { gte: start },
            endTime: { lte: end },
          },
          include: {
            guard: true,
            patrolLogs: true,
            checkIns: true,
          },
        });

        const incidents = await prisma.incident.findMany({
          where: {
            siteId,
            createdAt: { gte: start, lte: end },
          },
          include: { guard: true },
        });

        const totalShifts = shifts.length;
        const completedShifts = shifts.filter((s) => s.status === 'COMPLETED').length;
        const guardIds = new Set(shifts.map((s) => s.guardId));
        const totalCheckIns = shifts.reduce((sum, s) => sum + s.checkIns.length, 0);
        const totalPatrolCheckpoints = shifts.reduce((sum, s) => sum + s.patrolLogs.length, 0);
        const missedCheckIns = shifts.filter((s) => s.checkIns.length === 0).length;

        const prompt = buildDailyReportPrompt({
          site: { name: site.location, address: site.location },
          periodStart: format(start, 'MMM d, yyyy HH:mm'),
          periodEnd: format(end, 'MMM d, yyyy HH:mm'),
          totalShifts,
          completedShifts,
          totalPatrolCheckpoints,
          completedPatrolCheckpoints: totalPatrolCheckpoints,
          incidents: incidents.map((i) => ({
            type: i.type,
            severity: i.severity,
            title: i.description.slice(0, 100),
          })),
          guardCount: guardIds.size,
          totalCheckIns,
          missedCheckIns,
        });

        const aiResult = await safeAICall(prompt, dailyReportSummarySchema);

        const summary = aiResult.success && aiResult.data
          ? {
              executiveSummary: aiResult.data.executiveSummary,
              highlights: aiResult.data.highlights,
              concerns: aiResult.data.concerns,
              patrolSummary: aiResult.data.patrolSummary,
              incidentSummary: aiResult.data.incidentSummary,
              recommendations: aiResult.data.recommendations,
            }
          : {
              executiveSummary: `Daily security report for ${site.location}. ${totalShifts} shifts scheduled, ${completedShifts} completed. ${incidents.length} incidents reported.`,
              highlights: [] as string[],
              concerns: missedCheckIns > 0 ? [`${missedCheckIns} shift(s) had no check-in recorded`] : [] as string[],
              patrolSummary: `${totalPatrolCheckpoints} patrol checkpoints logged across ${totalShifts} shifts.`,
              incidentSummary: incidents.length > 0 ? `${incidents.length} incident(s) reported during this period.` : 'No incidents reported.',
              recommendations: [] as string[],
            };

        const latestScore = await prisma.complianceScore.findFirst({
          where: { siteId },
          orderBy: { calculatedAt: 'desc' },
        });

        const html = generateDailyReportHTML({
          siteName: site.location,
          siteAddress: site.location,
          clientName: site.client.name,
          periodStart: start,
          periodEnd: end,
          shifts: shifts.map((s) => ({
            guardName: s.guard.name,
            startTime: s.startTime,
            endTime: s.endTime,
            status: s.status,
            checkpoints: s.patrolLogs.length,
            completedCheckpoints: s.patrolLogs.length,
          })),
          incidents: incidents.map((i) => ({
            title: i.description.slice(0, 100),
            type: i.type,
            severity: i.severity,
            description: i.description,
            guardName: i.guard.name,
            createdAt: i.createdAt,
            photoCount: i.photoKeys.length,
          })),
          summary,
          complianceScore: latestScore
            ? {
                overallScore: latestScore.overallScore,
                grade: latestScore.grade,
                patrolCompletion: latestScore.patrolCompletion,
              }
            : undefined,
        });

        if (site.client.email) {
          const emailContent = dailyReportEmail({
            siteName: site.location,
            periodStart: format(start, 'MMM d, yyyy'),
            periodEnd: format(end, 'MMM d, yyyy'),
            executiveSummary: summary.executiveSummary,
          });

          const notifId = await createNotificationRecord({
            channel: 'EMAIL',
            recipientId: site.client.id,
            recipientType: 'client',
            subject: emailContent.subject,
            body: html,
          });

          try {
            const msgId = await sendEmail({
              to: site.client.email,
              subject: emailContent.subject,
              html,
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
