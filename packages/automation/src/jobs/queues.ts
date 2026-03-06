import { Queue } from 'bullmq';
import { getRedisConnection } from './connection';

export const QUEUE_NAMES = {
  ALERTS: 'alerts',
  REPORTS: 'reports',
  AI: 'ai',
  NOTIFICATIONS: 'notifications',
  COMPLIANCE: 'compliance',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

const queues = new Map<string, Queue>();

/**
 * Get or create a BullMQ queue by name.
 * Queues are lazily instantiated and cached.
 */
export function getQueue(name: QueueName): Queue {
  let queue = queues.get(name);
  if (!queue) {
    queue = new Queue(name, {
      connection: getRedisConnection(),
      defaultJobOptions: getDefaultJobOptions(name),
    });
    queues.set(name, queue);
  }
  return queue;
}

/**
 * Get all active queues (for registering with EventBus).
 */
export function getAllQueues(): Map<string, Queue> {
  // Ensure all queues are initialized
  for (const name of Object.values(QUEUE_NAMES)) {
    getQueue(name);
  }
  return queues;
}

/**
 * Close all queues (for graceful shutdown).
 */
export async function closeAllQueues(): Promise<void> {
  for (const queue of queues.values()) {
    await queue.close();
  }
  queues.clear();
}

function getDefaultJobOptions(queueName: QueueName) {
  switch (queueName) {
    case 'alerts':
      return {
        attempts: 3,
        backoff: { type: 'exponential' as const, delay: 2000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      };
    case 'ai':
      return {
        attempts: 2,
        backoff: { type: 'exponential' as const, delay: 5000 },
        removeOnComplete: { count: 500 },
        removeOnFail: { count: 1000 },
      };
    case 'reports':
      return {
        attempts: 3,
        backoff: { type: 'exponential' as const, delay: 10000 },
        removeOnComplete: { count: 500 },
        removeOnFail: { count: 1000 },
      };
    case 'notifications':
      return {
        attempts: 3,
        backoff: { type: 'exponential' as const, delay: 3000 },
        removeOnComplete: { count: 2000 },
        removeOnFail: { count: 5000 },
      };
    case 'compliance':
      return {
        attempts: 2,
        backoff: { type: 'exponential' as const, delay: 5000 },
        removeOnComplete: { count: 500 },
        removeOnFail: { count: 500 },
      };
    default:
      return {
        attempts: 3,
        backoff: { type: 'exponential' as const, delay: 3000 },
      };
  }
}
