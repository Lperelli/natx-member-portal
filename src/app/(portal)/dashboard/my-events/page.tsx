import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';
import { EventCard } from '@/components/events/event-card';
import { Button } from '@/components/ui/button';

export default async function MyEventsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const registrations = await prisma.eventRegistration.findMany({
    where: { userId: user.id, status: 'REGISTERED' },
    include: { event: true },
    orderBy: { registeredAt: 'desc' }
  });

  return (
    <div className="space-y-10 animate-fade-in-up">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-primary-dark">My Events</h1>
        <p className="text-sm text-neutral-soft">
          Track sessions you&apos;re confirmed for and stay ready for upcoming programs.
        </p>
      </header>

      {registrations.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 p-10 text-center">
          <h3 className="text-2xl font-semibold text-primary-dark">No registrations yet</h3>
          <p className="text-sm text-neutral-soft">
            Explore the calendar and reserve your seat in high-impact programming curated for NATX
            members.
          </p>
          <Button asChild>
            <a href="/dashboard/events">View events</a>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {registrations.map(({ event, id }) => (
            <EventCard key={id} event={event} actionLabel="Manage registration" />
          ))}
        </div>
      )}
    </div>
  );
}
