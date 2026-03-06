import { Job } from 'bullmq';
import { prisma } from '@ots/db';
import { createWorker } from './base';
import { subDays } from 'date-fns';
import type { RecalculateSiteScoreJob } from '../jobs/types';

const WEIGHTS = {
  patrolCompletion: 0.40,
  incidentFrequency: 0.20,
  missedCheckIns: 0.25,
  reportTimeliness: 0.15,
};

function calculateGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

async function calculateSiteScore(siteId: string, periodDays: number = 7): Promise<void> {
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
  const patrolCompletion = (shiftsWithPatrols / shifts.length) * 100;

  const totalIncidents = shifts.reduce((sum, s) => sum + s.incidents.length, 0);
  const incidentRate = totalIncidents / shifts.length;
  const incidentScore = Math.max(0, 100 - incidentRate * 20);

  const shiftsWithCheckIn = shifts.filter((s) =>
    s.checkIns.length > 0
  ).length;
  const checkInRate = (shiftsWithCheckIn / shifts.length) * 100;

  let reportTimeliness = 100;
  if (totalIncidents > 0) {
    const incidentIds = shifts.flatMap((s) => s.incidents.map((i) => i.id));
    const reportsGenerated = await prisma.report.count({
      where: { incidentId: { in: incidentIds } },
    });
    reportTimeliness = (reportsGenerated / totalIncidents) * 100;
  }

  const overallScore =
    patrolCompletion * WEIGHTS.patrolCompletion +
    incidentScore * WEIGHTS.incidentFrequency +
    checkInRate * WEIGHTS.missedCheckIns +
    reportTimeliness * WEIGHTS.reportTimeliness;

  const grade = calculateGrade(overallScore);

  await prisma.complianceScore.create({
    data: {
      siteId,
      periodStart,
      periodEnd: now,
      patrolCompletion,
      incidentFrequency: incidentScore,
      missedCheckIns: checkInRate,
      reportTimeliness,
      overallScore,
      grade,
    },
  });

  // Emit event for low scores so the alerts worker can notify the client
  if (overallScore < 60) {
    await prisma.event.create({
      data: {
        type: 'COMPLIANCE_CALCULATED',
        entityType: 'site',
        entityId: siteId,
        payload: { overallScore, grade, patrolCompletion, checkInRate },
        actorType: 'SYSTEM',
      },
    });
  }
}

export function startComplianceWorker() {
  return createWorker(
    { queue: 'compliance', concurrency: 5 },
    {
      'recalculate-site-score': async (job: Job<RecalculateSiteScoreJob>) => {
        await calculateSiteScore(job.data.siteId);
      },

      'batch-compliance-recalculation': async (_job: Job) => {
        const sites = await prisma.site.findMany({
          select: { id: true },
        });

        for (const site of sites) {
          await calculateSiteScore(site.id);
        }

        console.log(`[Compliance Worker] Batch recalculation complete for ${sites.length} sites`);
      },
    }
  );
}
