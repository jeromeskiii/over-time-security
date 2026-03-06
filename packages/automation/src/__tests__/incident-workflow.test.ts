import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventBus } from '../events/bus';
import { processNewIncident } from '../workflows/incident-report';
import type { IncidentCreatedPayload } from '@ots/domain';

// Mock Prisma
const mockPrisma = {
  event: {
    create: vi.fn().mockResolvedValue({ id: 'event-1' }),
  },
};

// Mock event bus that captures emitted events
class TestEventBus extends EventBus {
  public emittedEvents: Array<{ type: string; payload: unknown }> = [];

  override async emit(type: any, event: any): Promise<string> {
    this.emittedEvents.push({ type, payload: event.payload });
    return 'event-1';
  }
}

describe('Incident Workflow Integration', () => {
  let eventBus: TestEventBus;

  beforeEach(() => {
    eventBus = new TestEventBus({
      prisma: mockPrisma as any,
      queues: new Map(),
    });
    vi.clearAllMocks();
  });

  it('should emit INCIDENT_CREATED event with correct payload', async () => {
    const payload: IncidentCreatedPayload = {
      incidentId: 'inc-1',
      shiftId: 'shift-1',
      guardId: 'guard-1',
      siteId: 'site-1',
      severity: 'HIGH',
      type: 'THEFT',
      title: 'Shoplifter apprehended',
    };

    await processNewIncident(eventBus, payload);

    expect(eventBus.emittedEvents).toHaveLength(1);
    expect(eventBus.emittedEvents[0].type).toBe('INCIDENT_CREATED');
    expect(eventBus.emittedEvents[0].payload).toMatchObject({
      incidentId: 'inc-1',
      severity: 'HIGH',
      type: 'THEFT',
    });
  });

  it('should include all required fields in incident payload', async () => {
    const payload: IncidentCreatedPayload = {
      incidentId: 'inc-2',
      shiftId: 'shift-2',
      guardId: 'guard-2',
      siteId: 'site-2',
      severity: 'CRITICAL',
      type: 'MEDICAL',
      title: 'Medical emergency',
    };

    await processNewIncident(eventBus, payload);

    const emitted = eventBus.emittedEvents[0].payload as IncidentCreatedPayload;
    expect(emitted).toHaveProperty('incidentId');
    expect(emitted).toHaveProperty('shiftId');
    expect(emitted).toHaveProperty('guardId');
    expect(emitted).toHaveProperty('siteId');
    expect(emitted).toHaveProperty('severity');
    expect(emitted).toHaveProperty('type');
    expect(emitted).toHaveProperty('title');
  });
});
