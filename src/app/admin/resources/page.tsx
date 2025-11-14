import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default async function AdminResourcesPage() {
  const resources = await prisma.resource.findMany({
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary-dark">Manage Resources</h1>
          <p className="text-sm text-neutral-soft">
            Publish premium insights, update metadata, and control member-facing assets.
          </p>
        </div>
        <Button className="w-full md:w-auto">Upload resource</Button>
      </header>

      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-border text-sm">
          <thead className="bg-neutral-background">
            <tr>
              <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-neutral-soft">
                Title
              </th>
              <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-neutral-soft">
                Category
              </th>
              <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-neutral-soft">
                Type
              </th>
              <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-neutral-soft">
                Published
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
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-primary-light/40 transition-colors">
                <td className="px-5 py-4 text-primary-dark font-medium">{resource.title}</td>
                <td className="px-5 py-4 text-neutral-soft">{resource.category}</td>
                <td className="px-5 py-4 text-neutral-soft">{resource.resourceType}</td>
                <td className="px-5 py-4 text-neutral-soft">
                  {format(resource.publishedAt, 'MMM d, yyyy')}
                </td>
                <td className="px-5 py-4">
                  <Badge variant={resource.status === 'PUBLISHED' ? 'primary' : 'outline'}>
                    {resource.status.toLowerCase()}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-3">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      Preview
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
