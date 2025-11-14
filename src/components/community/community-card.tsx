import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user/user-avatar';

type CommunityMember = {
  id: string;
  fullName: string;
  title: string | null;
  company: string | null;
  bio: string | null;
  profilePhoto: string | null;
  email: string;
  linkedinUrl: string | null;
  region: string;
  industry: string;
  memberSince: Date;
  online: boolean;
};

type CommunityCardProps = {
  member: CommunityMember;
};

export function CommunityCard({ member }: CommunityCardProps) {
  return (
    <article className="card flex flex-col gap-6 p-6 transition-all hover:-translate-y-2 hover:border-primary hover:shadow-card md:flex-row md:items-center">
      <UserAvatar
        name={member.fullName}
        src={member.profilePhoto ?? undefined}
        size={64}
        status={member.online ? 'online' : 'offline'}
        className="flex-shrink-0"
      />
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-semibold text-primary-dark">{member.fullName}</h3>
          <Badge variant="outline" className="uppercase text-xs">
            {member.industry}
          </Badge>
          <Badge variant="outline" className="uppercase text-xs">
            {member.region}
          </Badge>
        </div>
        <p className="text-sm font-medium text-neutral-soft">
          {member.title ? `${member.title} at ${member.company ?? 'Independent'}` : member.company}
        </p>
        {member.bio ? <p className="text-sm text-neutral-soft line-clamp-3">{member.bio}</p> : null}
        <p className="text-xs text-neutral-soft">
          Member since{' '}
          {member.memberSince.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
        </p>
      </div>
      <div className="flex w-full flex-col gap-3 md:w-auto">
        <Button asChild variant="outline" className="w-full">
          <a href={`mailto:${member.email}`} aria-label={`Email ${member.fullName}`}>
            Email
          </a>
        </Button>
        {member.linkedinUrl ? (
          <Button asChild className="w-full">
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${member.fullName} on LinkedIn`}
            >
              LinkedIn
            </a>
          </Button>
        ) : null}
      </div>
    </article>
  );
}
