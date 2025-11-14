'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function registerForEvent(eventId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  await prisma.eventRegistration.upsert({
    where: {
      userId_eventId: {
        userId: session.userId,
        eventId
      }
    },
    update: { status: 'REGISTERED' },
    create: {
      userId: session.userId,
      eventId
    }
  });

  revalidatePath('/dashboard/events');
  revalidatePath('/dashboard/my-events');
}

export async function cancelRegistration(eventId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  await prisma.eventRegistration.updateMany({
    where: { userId: session.userId, eventId },
    data: { status: 'CANCELLED' }
  });

  revalidatePath('/dashboard/events');
  revalidatePath('/dashboard/my-events');
}
