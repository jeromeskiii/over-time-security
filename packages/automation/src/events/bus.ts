import { PrismaClient, EventType, ActorType } from '@ots/db';
import type { DomainEvent, EventPayloadMap } from '@ots/domain';
import { eventJobRouter } from './handlers';
import type { Queue } from 'bullmq';

type EventListener = (event: DomainEvent) => void | Promise<void>;

interface EventBusConfig {
  prisma: PrismaClient;
  queues?: Map<string, Queue>;
}

/**
 * Central event bus for the OTS platform.
 *
 * On every emit:
 * 1. Persists the event to the `events` table
 * 2. Routes to BullMQ job queues for async processing
 * 3. Notifies in-process listeners (for testing/debugging)
 */
export class EventBus {
  private prisma: PrismaClient;
  private queues: Map<string, Queue>;
  private listeners: Map<EventType, EventListener[]> = new Map();

  constructor(config: EventBusConfig) {
    this.prisma = config.prisma;
    this.queues = config.queues ?? new Map();
  }

  /**
   * Type-safe event emission. Persists to DB and enqueues jobs.
   */
  async emit<T extends EventType>(
    type: T,
    event: Omit<DomainEvent<T>, 'type'> & { payload: EventPayloadMap[T] }
  ): Promise<string> {
    // 1. Persist to events table
    const stored = await this.prisma.event.create({
      data: {
        type,
        entityType: event.entityType,
        entityId: event.entityId,
        payload: event.payload as any,
        actorId: event.actorId ?? null,
        actorType: event.actorType ?? 'SYSTEM',
      },
    });

    // 2. Route to BullMQ queues
    const jobs = eventJobRouter(type, event.payload as Record<string, unknown>, stored.id);
    for (const job of jobs) {
      const queue = this.queues.get(job.queue);
      if (queue) {
        await queue.add(
          job.name,
          {
            eventId: stored.id,
            eventType: type,
            ...job.data,
          },
          job.options ?? {}
        );
      }
    }

    // 3. Notify in-process listeners
    const typeListeners = this.listeners.get(type) ?? [];
    const fullEvent: DomainEvent<T> = { type, ...event } as DomainEvent<T>;
    for (const listener of typeListeners) {
      try {
        await listener(fullEvent);
      } catch (err) {
        console.error(`[EventBus] Listener error for ${type}:`, err);
      }
    }

    return stored.id;
  }

  /**
   * Register an in-process listener for an event type.
   * Useful for testing and real-time reactions.
   */
  on(type: EventType, listener: EventListener): void {
    const existing = this.listeners.get(type) ?? [];
    existing.push(listener);
    this.listeners.set(type, existing);
  }

  /**
   * Remove a listener.
   */
  off(type: EventType, listener: EventListener): void {
    const existing = this.listeners.get(type) ?? [];
    this.listeners.set(
      type,
      existing.filter((l) => l !== listener)
    );
  }

  /**
   * Register BullMQ queues for job routing.
   */
  registerQueue(name: string, queue: Queue): void {
    this.queues.set(name, queue);
  }
}
