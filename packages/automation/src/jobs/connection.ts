import IORedis from 'ioredis';
import type { ConnectionOptions } from 'bullmq';

let connection: IORedis | null = null;

/**
 * Shared Redis connection for all BullMQ queues and workers.
 * Reuses a single connection per process.
 */
export function getRedisConnection(): ConnectionOptions {
  if (!connection) {
    connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: null, // Required by BullMQ
      enableReadyCheck: false,
    });
  }
  // Cast needed due to ioredis version differences between packages
  return connection as unknown as ConnectionOptions;
}

/**
 * Close the shared Redis connection (for graceful shutdown).
 */
export async function closeRedisConnection(): Promise<void> {
  if (connection) {
    await connection.quit();
    connection = null;
  }
}
