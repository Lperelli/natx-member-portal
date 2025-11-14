import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary-dark">Manage Events</h1>
          <p className="text-sm text-neutral-soft">
            Curate, schedule, and publish experiences for the NATX member community.
          </p>
        </div>
        <Button className="w-full md:w-auto">Create event</Button>
      </header>

      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-border text-sm">
          <thead className="bg-neutral-background">
            <tr>
              <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-neutral-soft">
                Title
              </th>
              <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-neutral-soft">
                Type
              </th>
              <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-neutral-soft">
                Date
              </th>
              <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-neutral-soft">
                Location
              </th>
              <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-neutral-soft">
                Status
              </th>
              <th className="px-5 py-3 text-right font-semibold uppercase tracking-wide text-neutral-soft">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-border">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-primary-light/40 transition-colors">
                <td className="px-5 py-4 text-primary-dark font-medium">{event.title}</td>
                <td className="px-5 py-4 text-neutral-soft">{event.eventType}</td>
                <td className="px-5 py-4 text-neutral-soft">
                  {format(event.startAt, 'MMM d, yyyy • h:mm a')}
                </td>
                <td className="px-5 py-4 text-neutral-soft">{event.location}</td>
                <td className="px-5 py-4">
                  <Badge variant="outline">{event.status.toLowerCase()}</Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-3">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      Duplicate
                    </Button>
                    <Button variant="ghost" size="sm">
                      Archive
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
