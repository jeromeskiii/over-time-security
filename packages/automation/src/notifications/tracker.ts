import { prisma } from '@ots/db';
import type { NotificationChannel } from '@ots/db';

/**
 * Create a notification record and return its ID.
 */
export async function createNotificationRecord(data: {
  channel: NotificationChannel;
  recipientId: string;
  recipientType: string;
  subject?: string;
  body: string;
  eventId?: string;
  metadata?: Record<string, unknown>;
}): Promise<string> {
  const notification = await prisma.notification.create({
    data: {
      channel: data.channel,
      recipientId: data.recipientId,
      recipientType: data.recipientType,
      subject: data.subject,
      body: data.body,
      eventId: data.eventId,
      metadata: data.metadata ?? {},
      status: 'PENDING',
    },
  });
  return notification.id;
}

/**
 * Mark notification as sent.
 */
export async function markNotificationSent(id: string, externalId?: string): Promise<void> {
  await prisma.notification.update({
    where: { id },
    data: {
      status: 'SENT',
      sentAt: new Date(),
      metadata: externalId ? { externalId } : undefined,
    },
  });
}

/**
 * Mark notification as failed.
 */
export async function markNotificationFailed(id: string, reason: string): Promise<void> {
  await prisma.notification.update({
    where: { id },
    data: {
      status: 'FAILED',
      failReason: reason,
    },
  });
}
