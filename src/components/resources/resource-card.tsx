import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type Resource = {
  id: string;
  title: string;
  slug: string;
  category: string;
  resourceType: string;
  description: string;
  publishedAt: Date;
  externalUrl?: string | null;
  fileUrl?: string | null;
  tags?: string | null;
};

type ResourceCardProps = {
  resource: Resource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const link = resource.externalUrl ?? resource.fileUrl ?? `/dashboard/resources/${resource.slug}`;
  const isExternal = resource.externalUrl?.startsWith('http');
  const tags = (() => {
    if (!resource.tags) return [];
    try {
      const parsed = JSON.parse(resource.tags);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  })();

  return (
    <article className="card flex h-full flex-col gap-4 p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-card">
      <div className="flex items-center justify-between gap-4">
        <Badge variant="outline">{resource.category}</Badge>
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-soft">
          {resource.resourceType}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-primary-dark">{resource.title}</h3>
      <p className="text-sm text-neutral-soft line-clamp-3">{resource.description}</p>
      {tags.length ? (
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary-light/60 px-3 py-1 text-xs font-semibold text-primary-dark"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <p className="text-xs text-neutral-soft">
        Published {format(resource.publishedAt, 'MMMM d, yyyy')}
      </p>
      <Link
        href={link}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noreferrer' : undefined}
        className="mt-auto flex h-11 w-full items-center justify-center rounded-[10px] bg-primary px-5 text-sm font-semibold uppercase tracking-wide text-white !text-white transition-all hover:-translate-y-0.5 hover:bg-[#4a8cb0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        {resource.externalUrl ? 'View resource' : 'Download'}
      </Link>
    </article>
  );
}
