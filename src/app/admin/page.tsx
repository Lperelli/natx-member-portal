import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default async function AdminDashboardPage() {
  const [users, events, registrations] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.event.findMany({ orderBy: { startAt: 'asc' }, take: 5 }),
    prisma.eventRegistration.count()
  ]);

  const totalUsers = await prisma.user.count();
  const activeMembers = await prisma.memberProfile.count();
  const upcomingEvents = await prisma.event.count({ where: { startAt: { gte: new Date() } } });

  return (
    <div className="space-y-10 animate-fade-in-up">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-primary-dark">Admin Overview</h1>
        <p className="text-sm text-neutral-soft">
          Monitor platform health, member activity, and program operations at a glance.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="card p-6">
          <p className="text-sm uppercase tracking-wide text-neutral-soft font-semibold">
            Total Members
          </p>
          <p className="mt-2 text-3xl font-semibold text-primary-dark">{totalUsers}</p>
          <p className="text-xs text-neutral-soft">Includes admins and premium members</p>
        </div>
        <div className="card p-6">
          <p className="text-sm uppercase tracking-wide text-neutral-soft font-semibold">
            Active profiles
          </p>
          <p className="mt-2 text-3xl font-semibold text-primary-dark">{activeMembers}</p>
          <p className="text-xs text-neutral-soft">Members visible in the community directory</p>
        </div>
        <div className="card p-6">
          <p className="text-sm uppercase tracking-wide text-neutral-soft font-semibold">
            Upcoming events
          </p>
          <p className="mt-2 text-3xl font-semibold text-primary-dark">{upcomingEvents}</p>
          <p className="text-xs text-neutral-soft">{registrations} total registrations</p>
        </div>
      </section>

      <section className="card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-primary-dark">Latest members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-border text-sm">
            <thead className="bg-neutral-background">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-neutral-soft uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-soft uppercase tracking-wide">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-soft uppercase tracking-wide">
                  Role
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-soft uppercase tracking-wide">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 text-primary-dark font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-neutral-soft">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === 'ADMIN' ? 'primary' : 'outline'}>
                      {user.role.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-neutral-soft">
                    {format(user.memberSince, 'MMM d, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-primary-dark">Upcoming programming</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-border text-sm">
            <thead className="bg-neutral-background">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-neutral-soft uppercase tracking-wide">
                  Event
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-soft uppercase tracking-wide">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-soft uppercase tracking-wide">
                  Location
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-soft uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-4 py-3 text-primary-dark font-medium">{event.title}</td>
                  <td className="px-4 py-3 text-neutral-soft">
                    {format(event.startAt, 'MMM d, yyyy • h:mm a')}
                  </td>
                  <td className="px-4 py-3 text-neutral-soft">{event.location}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{event.status.toLowerCase()}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
