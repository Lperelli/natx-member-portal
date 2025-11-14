import { prisma } from '@/lib/prisma';
import { EventCard } from '@/components/events/event-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

async function EventsList({ query }: { query?: string }) {
  const events = await prisma.event.findMany({
    where: query
      ? {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } },
              { location: { contains: query } }
            ]
        }
      : undefined,
    orderBy: { startAt: 'asc' }
  });

  if (events.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-4 p-10 text-center">
        <CalendarDaysIcon className="h-12 w-12 text-primary" />
        <h3 className="text-2xl font-semibold text-primary-dark">No events found</h3>
        <p className="text-sm text-neutral-soft">
          Adjust your search filters or check back soon—new programming is added regularly.
        </p>
          <Button variant="outline" asChild>
            <Link href="/dashboard/events">Reset filters</Link>
          </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

type EventsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = typeof resolvedSearchParams?.q === 'string' ? resolvedSearchParams.q : undefined;

  return (
    <div className="space-y-10 animate-fade-in-up">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-primary-dark">Events Calendar</h1>
          <p className="text-sm text-neutral-soft max-w-2xl">
            Explore the NATX programming lineup—designed for ambitious technology leaders ready to
            collaborate, learn, and move faster.
          </p>
        </div>
        <form className="w-full max-w-sm">
          <Input
            name="q"
            placeholder="Search events by topic, location, or format…"
            defaultValue={query}
            className="h-12 rounded-xl"
          />
        </form>
      </header>

        <Suspense key={query} fallback={<p className="text-neutral-soft">Loading events…</p>}>
          <EventsList query={query} />
        </Suspense>
    </div>
  );
}
