import type { EventBus } from '../events/bus';
import type { PatrolCheckpointScannedPayload } from '@ots/domain';

/**
 * Workflow: Process a patrol checkpoint scan.
 * Triggers the checkpoint watch system that detects missed checkpoints.
 */
export async function processPatrolScan(
  eventBus: EventBus,
  data: PatrolCheckpointScannedPayload & { actorId?: string }
): Promise<string> {
  const eventId = await eventBus.emit('PATROL_CHECKPOINT_SCANNED', {
    entityType: 'patrol_log',
    entityId: data.patrolLogId,
    payload: {
      shiftId: data.shiftId,
      guardId: data.guardId,
      siteId: data.siteId,
      checkpoint: data.checkpoint,
      patrolLogId: data.patrolLogId,
    },
    actorId: data.actorId ?? data.guardId,
    actorType: 'GUARD',
  });

  return eventId;
}
