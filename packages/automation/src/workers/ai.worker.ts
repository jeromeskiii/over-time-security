import { Job } from 'bullmq';
import { prisma } from '@ots/db';
import { createWorker } from './base';
import { safeAICall } from '../ai/guardrails';
import { buildIncidentReportPrompt } from '../ai/prompts';
import { incidentReportSchema } from '../ai/schemas';
import type { GenerateIncidentReportJob } from '../jobs/types';

export function startAIWorker() {
  return createWorker(
    { queue: 'ai', concurrency: 3 },
    {
      'generate-incident-report': async (job: Job<GenerateIncidentReportJob>) => {
        const { incidentId, shiftId, guardId, siteId, severity } = job.data;

        const [incident, guard, site, shift] = await Promise.all([
          prisma.incident.findUniqueOrThrow({ where: { id: incidentId } }),
          prisma.guard.findUniqueOrThrow({ where: { id: guardId } }),
          prisma.site.findUniqueOrThrow({ where: { id: siteId } }),
          prisma.shift.findUniqueOrThrow({ where: { id: shiftId } }),
        ]);

        const prompt = buildIncidentReportPrompt({
          incident: {
            type: incident.type,
            severity: incident.severity,
            description: incident.description,
            createdAt: incident.createdAt,
          },
          guard: {
            firstName: guard.name.split(' ')[0] ?? guard.name,
            lastName: guard.name.split(' ').slice(1).join(' ') || '',
            licenseNumber: guard.licenseNumber,
          },
          site: { name: site.location, address: site.location },
          shift: { startTime: shift.startTime, endTime: shift.endTime },
          photoCount: incident.photoKeys.length,
        });

        const aiResult = await safeAICall(prompt, incidentReportSchema);

        if (aiResult.success && aiResult.data) {
          const needsReview = severity === 'HIGH' || severity === 'CRITICAL';
          const reportStatus = needsReview ? 'SUPERVISOR_REVIEW' : 'AI_GENERATED';

          await prisma.report.upsert({
            where: { incidentId },
            create: {
              incidentId,
              content: `${aiResult.data.summary}\n\nRecommended Actions:\n${aiResult.data.recommendedActions.join('\n')}`,
              status: reportStatus,
            },
            update: {
              content: `${aiResult.data.summary}\n\nRecommended Actions:\n${aiResult.data.recommendedActions.join('\n')}`,
              status: reportStatus,
            },
          });

          if (aiResult.data.escalationRequired && severity !== 'CRITICAL') {
            const queue = (await import('../jobs/queues')).getQueue('alerts');
            await queue.add('incident-escalation', {
              eventId: job.data.eventId,
              eventType: 'INCIDENT_ESCALATED',
              incidentId,
              severity: aiResult.data.severityAssessment,
              siteId,
            }, { priority: 1 });
          }

          console.log(
            `[AI Worker] Report generated for incident ${incidentId}. ` +
            `Status: ${reportStatus}. Sources: ${aiResult.sourceFieldsUsed.join(', ')}`
          );
        } else {
          console.error(`[AI Worker] AI failed for incident ${incidentId}: ${aiResult.error}`);

          await prisma.report.upsert({
            where: { incidentId },
            create: {
              incidentId,
              content: `[Auto-generated fallback] ${incident.type} incident: ${incident.description.slice(0, 100)}. ${incident.description}\n\nManual review required — AI report generation failed.`,
              status: 'SUPERVISOR_REVIEW',
            },
            update: {
              content: `[Auto-generated fallback] ${incident.type} incident: ${incident.description.slice(0, 100)}. ${incident.description}\n\nManual review required — AI report generation failed.`,
              status: 'SUPERVISOR_REVIEW',
            },
          });
        }
      },
    }
  );
}
