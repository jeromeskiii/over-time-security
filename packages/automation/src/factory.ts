import { prisma } from '@ots/db';
import { EventBus } from './events';
import { getAllQueues } from './jobs';

/**
 * Create a fully-wired EventBus with all queues registered.
 * Call this once in your server's startup path.
 *
 * Usage:
 * ```ts
 * import { createEventBus } from '@ots/automation';
 * const eventBus = createEventBus();
 * await eventBus.emit('INCIDENT_CREATED', { ... });
 * ```
 */
export function createEventBus(): EventBus {
  const queues = getAllQueues();
  const bus = new EventBus({ prisma, queues });
  return bus;
}
