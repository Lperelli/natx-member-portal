import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

type EventCardProps = {
  event: {
    id: string;
    title: string;
    slug: string;
    description: string;
    eventType: string;
    location: string;
    startAt: Date;
    endAt: Date | null;
    featuredImage?: string | null;
  };
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function EventCard({
  event,
  actionLabel = 'View details',
  actionHref,
  className
}: EventCardProps) {
  const ctaHref = actionHref ?? `/dashboard/events/${event.slug}`;

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-subtle transition-all hover:-translate-y-2 hover:border-primary hover:shadow-card flex flex-col',
        className
      )}
    >
      {event.featuredImage ? (
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={event.featuredImage}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 30vw, 100vw"
          />
          <div className="absolute left-4 top-4 rounded-full bg-primary/95 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {format(event.startAt, 'MMM d')}
          </div>
        </div>
      ) : null}
      <div className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-center justify-between gap-2">
          <Badge>{event.eventType}</Badge>
          <p className="text-sm text-neutral-soft">{format(event.startAt, 'h:mm a')}</p>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-primary-dark">{event.title}</h3>
          <p className="text-sm text-neutral-soft line-clamp-3">{event.description}</p>
        </div>
        <div className="space-y-3 text-sm text-neutral-soft">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-primary" />
            <span>
              {format(event.startAt, 'MMM d, yyyy • h:mm a')}
              {event.endAt ? ` – ${format(event.endAt, 'h:mm a')}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>
        <Link
          href={ctaHref}
          className="mt-auto flex h-11 w-full items-center justify-center rounded-[10px] bg-primary px-5 text-sm font-semibold uppercase tracking-wide text-white !text-white transition-all hover:-translate-y-0.5 hover:bg-[#4a8cb0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {actionLabel}
        </Link>
      </div>
    </article>
  );
}
