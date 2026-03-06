import { Job } from 'bullmq';
import { prisma } from '@ots/db';
import { calculateComplianceScore } from '@ots/domain';
import { createWorker } from './base';
import { subDays } from 'date-fns';
import type { RecalculateSiteScoreJob } from '../jobs/types';
import { createEventBus } from '../factory';

async function calculateSiteScore(
  siteId: string,
  eventBus: ReturnType<typeof createEventBus>,
  periodDays: number = 7
): Promise<void> {
  const now = new Date();
  const periodStart = subDays(now, periodDays);

  const shifts = await prisma.shift.findMany({
    where: {
      siteId,
      startTime: { gte: periodStart },
    },
    include: {
      patrolLogs: true,
      checkIns: true,
      incidents: true,
    },
  });

  if (shifts.length === 0) return;

  const shiftsWithPatrols = shifts.filter((s) => s.patrolLogs.length > 0).length;
  const patrolCompletionRatio = shiftsWithPatrols / shifts.length;

  const totalIncidents = shifts.reduce((sum, s) => sum + s.incidents.length, 0);
  const incidentFrequencyRatio = Math.min(1, totalIncidents / shifts.length);

  const shiftsWithCheckIn = shifts.filter((s) => s.checkIns.length > 0).length;
  const checkInRateRatio = shiftsWithCheckIn / shifts.length;
  const missedCheckInsRatio = 1 - checkInRateRatio;

  let reportTimelinessRatio = 1;
  if (totalIncidents > 0) {
    const incidentIds = shifts.flatMap((s) => s.incidents.map((i) => i.id));
    const reportsGenerated = await prisma.report.count({
      where: { incidentId: { in: incidentIds } },
    });
    reportTimelinessRatio = reportsGenerated / totalIncidents;
  }

  const score = calculateComplianceScore({
    patrolCompletion: patrolCompletionRatio,
    incidentFrequency: incidentFrequencyRatio,
    missedCheckIns: missedCheckInsRatio,
    reportTimeliness: reportTimelinessRatio,
  });

  const createdScore = await prisma.complianceScore.create({
    data: {
      siteId,
      periodStart,
      periodEnd: now,
      patrolCompletion: patrolCompletionRatio * 100,
      incidentFrequency: (1 - incidentFrequencyRatio) * 100,
      missedCheckIns: (1 - missedCheckInsRatio) * 100,
      reportTimeliness: reportTimelinessRatio * 100,
      overallScore: score.overallScore * 100,
      grade: score.grade,
    },
  });

  // Emit through EventBus so routing + queue dispatch happen consistently.
  if (createdScore.overallScore < 60) {
    await eventBus.emit('COMPLIANCE_CALCULATED', {
      entityType: 'site',
      entityId: siteId,
      payload: {
        siteId,
        scoreId: createdScore.id,
        overallScore: createdScore.overallScore,
        grade: createdScore.grade,
      },
      actorType: 'SYSTEM',
    });
  }
}

export function startComplianceWorker() {
  const eventBus = createEventBus();

  return createWorker(
    { queue: 'compliance', concurrency: 5 },
    {
      'recalculate-site-score': async (job: Job<RecalculateSiteScoreJob>) => {
        await calculateSiteScore(job.data.siteId, eventBus);
      },

      'batch-compliance-recalculation': async (_job: Job) => {
        const sites = await prisma.site.findMany({
          select: { id: true },
        });

        for (const site of sites) {
          await calculateSiteScore(site.id, eventBus);
        }

        console.log(`[Compliance Worker] Batch recalculation complete for ${sites.length} sites`);
      },
    }
  );
}
