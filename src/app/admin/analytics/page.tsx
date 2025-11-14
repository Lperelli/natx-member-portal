import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export default async function AdminAnalyticsPage() {
  const [registrationCounts, resourceDownloads] = await Promise.all([
    prisma.eventRegistration.groupBy({
      by: ['status'],
      _count: { _all: true }
    }),
    prisma.resource.count()
  ]);

  const stats = [
    {
      label: 'Total registrations',
      value: registrationCounts.reduce((total, item) => total + item._count._all, 0)
    },
    {
      label: 'Active resources',
      value: resourceDownloads
    },
    {
      label: 'Last data refresh',
      value: format(new Date(), 'MMM d, yyyy • h:mm a')
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in-up">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-primary-dark">Analytics</h1>
        <p className="text-sm text-neutral-soft">
          Watch engagement across programming, content, and member activity.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <p className="text-xs uppercase tracking-wide text-neutral-soft font-semibold">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-primary-dark">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="card p-6">
        <h2 className="text-2xl font-semibold text-primary-dark">Registration breakdown</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {registrationCounts.map((item) => (
            <div
              key={item.status}
              className="rounded-2xl border border-neutral-border p-4 text-center"
            >
              <p className="text-sm uppercase text-neutral-soft">{item.status.toLowerCase()}</p>
              <p className="mt-2 text-2xl font-semibold text-primary-dark">{item._count._all}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
