import { Queue } from 'bullmq';
import { getQueue, QUEUE_NAMES } from './queues';

/**
 * Registers all recurring/cron jobs.
 * Call this once during worker process startup.
 */
export async function registerScheduledJobs(): Promise<void> {
  const reportsQueue = getQueue(QUEUE_NAMES.REPORTS);
  const complianceQueue = getQueue(QUEUE_NAMES.COMPLIANCE);

  // Daily report generation — runs every day at 6:00 AM UTC
  // Each site's timezone is handled inside the worker
  await reportsQueue.upsertJobScheduler(
    'daily-report-all-sites',
    {
      pattern: '0 6 * * *', // 6:00 AM UTC daily
    },
    {
      name: 'generate-daily-reports',
      data: { trigger: 'scheduled' },
    }
  );

  // Compliance score batch recalculation — runs every day at 7:00 AM UTC
  await complianceQueue.upsertJobScheduler(
    'daily-compliance-batch',
    {
      pattern: '0 7 * * *', // 7:00 AM UTC daily
    },
    {
      name: 'batch-compliance-recalculation',
      data: { trigger: 'scheduled' },
    }
  );

  // Shift no-show checker — runs every 15 minutes
  const alertsQueue = getQueue(QUEUE_NAMES.ALERTS);
  await alertsQueue.upsertJobScheduler(
    'shift-no-show-checker',
    {
      pattern: '*/15 * * * *', // Every 15 minutes
    },
    {
      name: 'check-shift-no-shows',
      data: { trigger: 'scheduled' },
    }
  );

  console.log('[Scheduler] All recurring jobs registered');
}
