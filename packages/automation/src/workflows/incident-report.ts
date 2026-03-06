import type { EventBus } from '../events/bus';
import type { IncidentCreatedPayload } from '@ots/domain';

/**
 * Workflow: Process a new incident.
 * Triggers AI report generation and potential escalation.
 */
export async function processNewIncident(
  eventBus: EventBus,
  data: IncidentCreatedPayload & { actorId?: string }
): Promise<string> {
  const eventId = await eventBus.emit('INCIDENT_CREATED', {
    entityType: 'incident',
    entityId: data.incidentId,
    payload: {
      incidentId: data.incidentId,
      shiftId: data.shiftId,
      guardId: data.guardId,
      siteId: data.siteId,
      severity: data.severity,
      type: data.type,
      title: data.title,
    },
    actorId: data.actorId,
    actorType: data.actorId ? 'GUARD' : 'SYSTEM',
  });

  return eventId;
}
