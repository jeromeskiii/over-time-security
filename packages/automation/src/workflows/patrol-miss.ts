import { prisma } from '@ots/db';
import type { EventBus } from '../events/bus';

/**
 * Workflow: Handle a missed patrol checkpoint.
 * Called when the system detects a guard hasn't scanned the next checkpoint in time.
 */
export async function handlePatrolMiss(
  eventBus: EventBus,
  data: {
    shiftId: string;
    guardId: string;
    siteId: string;
    expectedCheckpoint: string;
    expectedBy: Date;
  }
): Promise<string> {
  // Emit the event — the EventBus will persist it and route to workers
  const eventId = await eventBus.emit('PATROL_MISSED_CHECKPOINT', {
    entityType: 'shift',
    entityId: data.shiftId,
    payload: {
      shiftId: data.shiftId,
      guardId: data.guardId,
      siteId: data.siteId,
      expectedCheckpoint: data.expectedCheckpoint,
      expectedBy: data.expectedBy.toISOString(),
    },
    actorType: 'SYSTEM',
  });

  return eventId;
}
