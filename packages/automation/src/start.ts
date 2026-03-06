import { registerScheduledJobs } from './jobs/scheduler';
import { startAlertsWorker } from './workers/alerts.worker';
import { startAIWorker } from './workers/ai.worker';
import { startReportsWorker } from './workers/reports.worker';
import { startNotificationsWorker } from './workers/notifications.worker';
import { startComplianceWorker } from './workers/compliance.worker';
import { shutdownAllWorkers } from './workers/base';
import { closeAllQueues } from './jobs/queues';
import { closeRedisConnection } from './jobs/connection';

async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     OVER TIME SECURITY — Automation Workers     ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  // Start all workers
  console.log('[Boot] Starting workers...');
  const workers = [
    { name: 'Alerts', worker: startAlertsWorker() },
    { name: 'AI', worker: startAIWorker() },
    { name: 'Reports', worker: startReportsWorker() },
    { name: 'Notifications', worker: startNotificationsWorker() },
    { name: 'Compliance', worker: startComplianceWorker() },
  ];

  for (const { name } of workers) {
    console.log(`  ✓ ${name} worker started`);
  }

  // Register scheduled (cron) jobs
  console.log('[Boot] Registering scheduled jobs...');
  await registerScheduledJobs();

  console.log('');
  console.log('[Boot] All workers running. Waiting for jobs...');
  console.log('[Boot] Press Ctrl+C to gracefully shut down.');

  // Graceful shutdown handler
  const shutdown = async (signal: string) => {
    console.log(`\n[Shutdown] Received ${signal}. Shutting down gracefully...`);

    try {
      await shutdownAllWorkers();
      console.log('[Shutdown] Workers stopped');

      await closeAllQueues();
      console.log('[Shutdown] Queues closed');

      await closeRedisConnection();
      console.log('[Shutdown] Redis connection closed');

      console.log('[Shutdown] Clean shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('[Shutdown] Error during shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Keep process alive
  await new Promise(() => {});
}

main().catch((error) => {
  console.error('[Fatal] Worker process failed:', error);
  process.exit(1);
});
