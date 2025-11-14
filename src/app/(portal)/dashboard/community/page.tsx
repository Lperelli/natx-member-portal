import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { CommunityCard } from '@/components/community/community-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

async function Filters({
  activeRegion,
  activeIndustry
}: {
  activeRegion?: string;
  activeIndustry?: string;
}) {
  const [regions, industries] = await Promise.all([
    prisma.memberProfile.findMany({
      distinct: ['region'],
      select: { region: true }
    }),
    prisma.memberProfile.findMany({
      distinct: ['industry'],
      select: { industry: true }
    })
  ]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-3">
        <span className="text-xs font-semibold uppercase text-neutral-soft">Region</span>
        <a href="/dashboard/community">
          <Badge variant={activeRegion ? 'outline' : 'primary'} className="cursor-pointer">
            All
          </Badge>
        </a>
        {regions.map(({ region }) => (
          <a
            key={region}
            href={`/dashboard/community?region=${region}${activeIndustry ? `&industry=${activeIndustry}` : ''}`}
          >
            <Badge
              variant={activeRegion === region ? 'primary' : 'outline'}
              className="cursor-pointer"
            >
              {region}
            </Badge>
          </a>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <span className="text-xs font-semibold uppercase text-neutral-soft">Industry</span>
        <a href={`/dashboard/community${activeRegion ? `?region=${activeRegion}` : ''}`}>
          <Badge variant={activeIndustry ? 'outline' : 'primary'} className="cursor-pointer">
            All
          </Badge>
        </a>
        {industries.map(({ industry }) => (
          <a
            key={industry}
            href={`/dashboard/community?industry=${industry}${activeRegion ? `&region=${activeRegion}` : ''}`}
          >
            <Badge
              variant={activeIndustry === industry ? 'primary' : 'outline'}
              className="cursor-pointer"
            >
              {industry}
            </Badge>
          </a>
        ))}
      </div>
    </div>
  );
}

async function CommunityGrid({
  query,
  region,
  industry
}: {
  query?: string;
  region?: string;
  industry?: string;
}) {
  const members = await prisma.memberProfile.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { fullName: { contains: query, mode: 'insensitive' } },
                { company: { contains: query, mode: 'insensitive' } },
                { title: { contains: query, mode: 'insensitive' } }
              ]
            }
          : {},
        region ? { region } : {},
        industry ? { industry } : {}
      ]
    },
    orderBy: { fullName: 'asc' }
  });

  if (members.length === 0) {
    return (
      <div className="card p-10 text-center">
        <h3 className="text-2xl font-semibold text-primary-dark">No members match those filters</h3>
        <p className="mt-2 text-sm text-neutral-soft">
          Adjust the filters or search query to explore more of the NATX community.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {members.map((member) => (
        <CommunityCard key={member.id} member={member} />
      ))}
    </div>
  );
}

type CommunityPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function CommunityPage({ searchParams }: CommunityPageProps) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : undefined;
  const region = typeof searchParams?.region === 'string' ? searchParams.region : undefined;
  const industry = typeof searchParams?.industry === 'string' ? searchParams.industry : undefined;

  return (
    <div className="space-y-10 animate-fade-in-up">
      <header className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold text-primary-dark">Community</h1>
          <p className="text-sm text-neutral-soft max-w-3xl">
            Connect with fellow NATX members—technology executives, founders, and innovators shaping
            high-growth companies. Reach out directly via email or LinkedIn.
          </p>
        </div>
        <form className="max-w-xl">
          <Input
            name="q"
            placeholder="Search by name, company or title…"
            defaultValue={query}
            className="h-12 rounded-xl"
          />
        </form>
        <Suspense fallback={null}>
          {/* @ts-expect-error Async Server Component */}
          <Filters activeRegion={region} activeIndustry={industry} />
        </Suspense>
      </header>

      <Suspense
        key={`${query ?? ''}-${region ?? ''}-${industry ?? ''}`}
        fallback={<p className="text-neutral-soft">Loading members…</p>}
      >
        {/* @ts-expect-error Async Server Component */}
        <CommunityGrid query={query} region={region} industry={industry} />
      </Suspense>
    </div>
  );
}
