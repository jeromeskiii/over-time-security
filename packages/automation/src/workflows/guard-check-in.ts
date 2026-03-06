import type { EventBus } from '../events/bus';
import type { GuardCheckedInPayload } from '@ots/domain';

/**
 * Workflow: Process a guard check-in/check-out.
 */
export async function processGuardCheckIn(
  eventBus: EventBus,
  data: GuardCheckedInPayload & { actorId?: string }
): Promise<string> {
  const eventType = data.checkInType === 'CLOCK_IN' ? 'GUARD_CHECKED_IN' : 'GUARD_CHECKED_OUT';

  const eventId = await eventBus.emit(eventType as any, {
    entityType: 'shift',
    entityId: data.shiftId,
    payload: {
      shiftId: data.shiftId,
      guardId: data.guardId,
      siteId: data.siteId,
      latitude: data.latitude,
      longitude: data.longitude,
      checkInType: data.checkInType,
    },
    actorId: data.actorId ?? data.guardId,
    actorType: 'GUARD',
  });

  return eventId;
}
