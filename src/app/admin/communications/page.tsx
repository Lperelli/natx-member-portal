import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default async function AdminCommunicationsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary-dark">Communications</h1>
          <p className="text-sm text-neutral-soft">
            Send announcements and lifecycle updates to NATX members and admin teams.
          </p>
        </div>
        <Button className="w-full md:w-auto">Compose announcement</Button>
      </header>

      <div className="card p-6 space-y-6">
        {announcements.length === 0 ? (
          <div className="text-center text-sm text-neutral-soft">
            No announcements yet. Use the button above to send your first communication.
          </div>
        ) : (
          <ul className="space-y-4">
            {announcements.map((announcement) => (
              <li
                key={announcement.id}
                className="rounded-2xl border border-neutral-border p-5 hover:border-primary transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-primary-dark">
                      {announcement.title}
                    </h3>
                    <p className="text-xs text-neutral-soft mt-1">
                      Sent {format(announcement.createdAt, 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                  <Badge variant="outline">{announcement.audience.toLowerCase()}</Badge>
                </div>
                <p className="mt-3 text-sm text-neutral-soft leading-relaxed">
                  {announcement.message}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Button variant="ghost" size="sm">
                    Duplicate
                  </Button>
                  <Button variant="ghost" size="sm">
                    View metrics
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
