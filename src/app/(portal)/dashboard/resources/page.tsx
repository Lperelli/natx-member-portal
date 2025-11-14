import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { ResourceCard } from '@/components/resources/resource-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

async function ResourcesGrid({ query, category }: { query?: string; category?: string }) {
  const resources = await prisma.resource.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { tags: { has: query } }
              ]
            }
          : {},
        category ? { category } : {}
      ]
    },
    orderBy: { publishedAt: 'desc' }
  });

  if (resources.length === 0) {
    return (
      <div className="card p-10 text-center">
        <h3 className="text-2xl font-semibold text-primary-dark">No resources match that filter</h3>
        <p className="mt-2 text-sm text-neutral-soft">
          Try a different keyword or browse all categories to discover more premium insights.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}

async function CategoryFilters({ activeCategory }: { activeCategory?: string }) {
  const categories = await prisma.resource.findMany({
    distinct: ['category'],
    select: { category: true }
  });

  return (
    <div className="flex flex-wrap gap-3">
      <a href="/dashboard/resources">
        <Badge variant={activeCategory ? 'outline' : 'primary'} className="cursor-pointer">
          All categories
        </Badge>
      </a>
      {categories.map(({ category }) => (
        <a key={category} href={`/dashboard/resources?category=${encodeURIComponent(category)}`}>
          <Badge
            variant={activeCategory === category ? 'primary' : 'outline'}
            className="cursor-pointer"
          >
            {category}
          </Badge>
        </a>
      ))}
    </div>
  );
}

type ResourcesPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : undefined;
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;

  return (
    <div className="space-y-10 animate-fade-in-up">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-primary-dark">Resources Library</h1>
        <p className="text-sm text-neutral-soft max-w-3xl">
          Access executive-level playbooks, benchmarks, and intelligence crafted exclusively for
          NATX premium members.
        </p>
        <form className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <Input
            name="q"
            placeholder="Search by keyword, tag, or insight…"
            defaultValue={query}
            className="h-12 md:max-w-md rounded-xl"
          />
        </form>
        <Suspense fallback={null}>
          {/* @ts-expect-error Async Server Component */}
          <CategoryFilters activeCategory={category} />
        </Suspense>
      </header>

      <Suspense
        key={`${query}-${category}`}
        fallback={<p className="text-neutral-soft">Loading resources…</p>}
      >
        {/* @ts-expect-error Async Server Component */}
        <ResourcesGrid query={query} category={category} />
      </Suspense>
    </div>
  );
}
