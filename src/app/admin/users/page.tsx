import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary-dark">Manage Users</h1>
          <p className="text-sm text-neutral-soft">
            Oversee membership access, roles, and account status across the NATX portal.
          </p>
        </div>
        <Button variant="primary" className="w-full md:w-auto">
          Add new user
        </Button>
      </header>

      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-border text-sm">
          <thead className="bg-neutral-background">
            <tr>
              <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-neutral-soft">
                Name
              </th>
              <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-neutral-soft">
                Email
              </th>
              <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-neutral-soft">
                Role
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
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-primary-light/40 transition-colors">
                <td className="px-5 py-4 text-sm font-semibold text-primary-dark">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-5 py-4 text-neutral-soft">{user.email}</td>
                <td className="px-5 py-4">
                  <Badge variant={user.role === 'ADMIN' ? 'primary' : 'outline'}>
                    {user.role.toLowerCase()}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={user.status === 'ACTIVE' ? 'success' : 'outline'}>
                    {user.status.toLowerCase()}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-3">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      Reset password
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
