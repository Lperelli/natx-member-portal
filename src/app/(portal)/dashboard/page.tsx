import { format, isWithinInterval, addDays, startOfMonth } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDaysIcon, UsersIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const now = new Date();
  const thirtyDays = addDays(now, 30);

  const [
    upcomingEventsCount,
    newEventsThisWeek,
    memberCount,
    newMembersThisMonth,
    upcomingEvents,
    userRegistrations
  ] = await Promise.all([
    prisma.event.count({
      where: {
        startAt: { gte: now, lte: thirtyDays }
      }
    }),
    prisma.event.count({
      where: {
        startAt: {
          gte: addDays(now, -7),
          lt: now
        }
      }
    }),
    prisma.memberProfile.count(),
    prisma.memberProfile.count({
      where: { memberSince: { gte: startOfMonth(new Date()) } }
    }),
    prisma.event.findMany({
      where: {
        startAt: { gte: now }
      },
      orderBy: { startAt: 'asc' },
      take: 3
    }),
    prisma.eventRegistration.findMany({
      where: { userId: user.id },
      include: { event: true }
    })
  ]);

  const userUpcomingEvents = userRegistrations.filter((registration) =>
    isWithinInterval(registration.event.startAt, { start: now, end: thirtyDays })
  );

  const cards = [
    {
      title: 'Upcoming Events',
      stat: upcomingEventsCount,
      subtitle: `${newEventsThisWeek} new this week`,
      icon: CalendarDaysIcon
    },
    {
      title: 'Community Members',
      stat: memberCount,
      subtitle: `Tracking ${newMembersThisMonth} new this month`,
      icon: UsersIcon
    },
    {
      title: 'My Engagement',
      stat: userRegistrations.length,
      subtitle: `${userUpcomingEvents.length} in the next 30 days`,
      icon: CheckCircleIcon
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in-up">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-3 rounded-full bg-primary-light/60 px-4 py-2 text-sm font-semibold text-primary-dark">
          Personalized for you
        </div>
        <h1 className="text-4xl font-semibold text-primary-dark">Welcome back, {user.firstName}</h1>
        <p className="text-sm text-neutral-soft">{format(now, 'EEEE, MMMM d, yyyy • hh:mm a')}</p>
      </header>

      <section aria-label="Key metrics" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="card group flex flex-col gap-4 p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-card"
          >
            <card.icon className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-neutral-soft font-medium uppercase tracking-wide">
                {card.title}
              </p>
              <p className="mt-2 text-3xl font-semibold text-primary-dark">{card.stat}</p>
              <p className="mt-1 text-sm text-neutral-soft">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </section>

      <section aria-labelledby="upcoming-events">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 id="upcoming-events" className="text-3xl font-semibold text-primary-dark">
              Upcoming Events
            </h2>
            <p className="text-sm text-neutral-soft">Your curated lineup for the next month.</p>
          </div>
          <Link
            href="/dashboard/events"
            className="text-sm font-semibold text-primary hover:text-primary-dark"
          >
            View all events →
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="card flex items-center justify-between gap-6 p-8">
            <div>
              <h3 className="text-xl font-semibold text-primary-dark">No scheduled events yet</h3>
              <p className="mt-2 text-sm text-neutral-soft">
                Check back soon—our team is curating your next experiences.
              </p>
            </div>
            <Button asChild variant="primary">
              <Link href="/dashboard/events">Explore events</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-subtle transition-all hover:-translate-y-2 hover:border-primary hover:shadow-card"
              >
                {event.featuredImage ? (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={event.featuredImage}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase text-white tracking-wide">
                      {format(event.startAt, 'MMM d')}
                    </div>
                  </div>
                ) : null}
                <div className="flex flex-col gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <Badge>{event.eventType}</Badge>
                    <p className="text-sm text-neutral-soft">{format(event.startAt, 'h:mm a')}</p>
                  </div>
                  <h3 className="text-xl font-semibold text-primary-dark">{event.title}</h3>
                  <p className="text-sm text-neutral-soft line-clamp-3">{event.description}</p>
                  <div className="flex flex-col gap-2 text-sm text-neutral-soft">
                    <span>
                      <strong className="text-primary-dark">Location:</strong> {event.location}
                    </span>
                    {event.endAt ? (
                      <span>
                        <strong className="text-primary-dark">Ends:</strong>{' '}
                        {format(event.endAt, 'MMM d, h:mm a')}
                      </span>
                    ) : null}
                  </div>
                  <Link
                    href={`/dashboard/events/${event.slug}`}
                    className="mt-2 flex h-11 w-full items-center justify-center rounded-[10px] bg-primary px-5 text-sm font-semibold uppercase tracking-wide text-white !text-white transition-all hover:-translate-y-0.5 hover:bg-[#4a8cb0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="card p-6 xl:col-span-2 flex flex-col gap-4">
          <h3 className="text-2xl font-semibold text-primary-dark">Latest Resources</h3>
          <p className="text-sm text-neutral-soft">
            Stay ahead with new playbooks, benchmarks, and executive briefings crafted for NATX
            members.
          </p>
          <Link
            href="/dashboard/resources"
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-primary px-5 text-sm font-semibold uppercase tracking-wide text-primary transition-all hover:-translate-y-0.5 hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Browse resources
          </Link>
        </div>
        <div className="card p-6">
          <h3 className="text-2xl font-semibold text-primary-dark">Community Pulse</h3>
          <p className="mt-2 text-sm text-neutral-soft">
            Connect with {memberCount} peers shaping the future of technology leadership.
          </p>
          <Link
            href="/dashboard/community"
            className="mt-6 flex h-11 w-full items-center justify-center rounded-[10px] bg-primary px-5 text-sm font-semibold uppercase tracking-wide text-white !text-white transition-all hover:-translate-y-0.5 hover:bg-[#4a8cb0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Open community directory
          </Link>
        </div>
      </section>
    </div>
  );
}
