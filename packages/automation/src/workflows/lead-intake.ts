import type { EventBus } from '../events/bus';
import type { LeadCreatedPayload } from '@ots/domain';

/**
 * Workflow: Process a new lead from the website.
 * Triggers auto-response email/SMS and dispatcher notification.
 */
export async function processNewLead(
  eventBus: EventBus,
  data: LeadCreatedPayload
): Promise<string> {
  const eventId = await eventBus.emit('LEAD_CREATED', {
    entityType: 'lead',
    entityId: data.leadId,
    payload: {
      leadId: data.leadId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
    },
  });

  return eventId;
}
