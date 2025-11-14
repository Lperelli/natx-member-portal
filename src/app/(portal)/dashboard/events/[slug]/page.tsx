import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPinIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { RegisterEventButton } from '@/components/events/register-event-button';

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const resolvedParams = await params;
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const event = await prisma.event.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      registrations: {
        where: { userId: user.id }
      }
    }
  });

  if (!event) {
    notFound();
  }

  const isRegistered = event.registrations.some(
    (registration) => registration.status === 'REGISTERED'
  );

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="card overflow-hidden p-0">
        {event.featuredImage ? (
          <div className="relative h-80 w-full">
            <Image
              src={event.featuredImage}
              alt={event.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ) : null}
        <div className="space-y-6 p-8">
          <div className="flex flex-wrap items-center gap-4">
            <Badge>{event.eventType}</Badge>
            <span className="text-sm text-neutral-soft">
              {format(event.startAt, 'EEEE, MMMM d, yyyy • h:mm a')}
            </span>
          </div>
          <h1 className="text-3xl font-semibold text-primary-dark">{event.title}</h1>
          <p className="text-base leading-relaxed text-neutral">{event.description}</p>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl bg-primary-light/50 px-4 py-5 text-sm font-medium text-primary-dark">
              <ClockIcon className="h-6 w-6 text-primary-dark" />
              <div>
                <p>{format(event.startAt, 'MMM d, yyyy')}</p>
                <p className="text-xs text-primary-dark/80">
                  {format(event.startAt, 'h:mm a')} –{' '}
                  {event.endAt ? format(event.endAt, 'h:mm a') : 'Duration TBA'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-primary-light/50 px-4 py-5 text-sm font-medium text-primary-dark">
              <MapPinIcon className="h-6 w-6 text-primary-dark" />
              <p>{event.location}</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-primary-light/50 px-4 py-5 text-sm font-medium text-primary-dark">
              <UserGroupIcon className="h-6 w-6 text-primary-dark" />
              <p>{event.capacity ? `${event.capacity} seats` : 'Limited-access session'}</p>
            </div>
          </div>

          <RegisterEventButton eventId={event.id} isRegistered={isRegistered} />
        </div>
      </div>

      <div className="card p-8">
        <h2 className="text-2xl font-semibold text-primary-dark">Event overview</h2>
        <p className="mt-4 text-sm text-neutral-soft leading-relaxed">
          Expect a curated agenda shaped by the NATX Member Success team. We prioritize peer
          exchange, tactical frameworks, and room to tackle your pressing challenges. Registered
          members will receive agenda details, prep materials, and on-site logistics in advance of
          the program.
        </p>
        <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/dashboard/events">Back to events</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
