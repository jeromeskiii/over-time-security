import { Worker, Job } from 'bullmq';
import { getRedisConnection } from '../jobs/connection';
import type { QueueName } from '../jobs/queues';

interface WorkerConfig {
  queue: QueueName;
  concurrency?: number;
}

type JobProcessor<T = any> = (job: Job<T>) => Promise<void>;

const activeWorkers: Worker[] = [];

/**
 * Create a BullMQ worker with standardized error handling and logging.
 */
export function createWorker(
  config: WorkerConfig,
  processors: Record<string, JobProcessor>
): Worker {
  const worker = new Worker(
    config.queue,
    async (job: Job) => {
      const processor = processors[job.name];
      if (!processor) {
        console.warn(`[Worker:${config.queue}] No processor for job: ${job.name}`);
        return;
      }

      const startTime = Date.now();
      console.log(`[Worker:${config.queue}] Processing ${job.name} (${job.id})`);

      try {
        await processor(job);
        const duration = Date.now() - startTime;
        console.log(`[Worker:${config.queue}] Completed ${job.name} (${job.id}) in ${duration}ms`);
      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(
          `[Worker:${config.queue}] Failed ${job.name} (${job.id}) after ${duration}ms:`,
          error
        );
        throw error; // Re-throw so BullMQ handles retry
      }
    },
    {
      connection: getRedisConnection(),
      concurrency: config.concurrency ?? 5,
    }
  );

  worker.on('error', (err) => {
    console.error(`[Worker:${config.queue}] Worker error:`, err);
  });

  activeWorkers.push(worker);
  return worker;
}

/**
 * Gracefully shut down all workers.
 */
export async function shutdownAllWorkers(): Promise<void> {
  console.log(`[Workers] Shutting down ${activeWorkers.length} workers...`);
  await Promise.all(activeWorkers.map((w) => w.close()));
  console.log('[Workers] All workers shut down');
}
