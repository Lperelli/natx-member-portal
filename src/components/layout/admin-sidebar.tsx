'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeModernIcon,
  UsersIcon,
  CalendarDaysIcon,
  DocumentIcon,
  EnvelopeIcon,
  ChartBarSquareIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Logo } from '@/components/logo';
import { UserAvatar } from '@/components/user/user-avatar';
import { cn } from '@/lib/utils';
import { LogoutButton } from '@/components/logout-button';

const adminNav = [
  { name: 'Admin Overview', href: '/admin', icon: HomeModernIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Events', href: '/admin/events', icon: CalendarDaysIcon },
  { name: 'Resources', href: '/admin/resources', icon: DocumentIcon },
  { name: 'Communications', href: '/admin/communications', icon: EnvelopeIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarSquareIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon }
];

type AdminSidebarProps = {
  user: {
    firstName: string;
    lastName: string;
    title?: string | null;
    avatarUrl?: string | null;
  };
};

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const displayName = `${user.firstName} ${user.lastName}`;

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-[280px] lg:flex-col lg:gap-6 lg:bg-neutral-background lg:px-6 lg:py-8 lg:border-r lg:border-neutral-border">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo size="lg" href="/admin" />
        <p className="text-xs uppercase tracking-[0.32em] text-primary font-semibold">
          Admin Panel
        </p>
      </div>
      <div className="rounded-2xl bg-white border border-neutral-border p-5 shadow-subtle flex flex-col items-center text-center gap-3">
        <UserAvatar
          name={displayName}
          src={user.avatarUrl ?? undefined}
          status="online"
          size={56}
        />
        <div>
          <p className="text-base font-semibold text-primary-dark">{displayName}</p>
          <p className="text-xs text-neutral-soft">{user.title ?? 'NATX Team'}</p>
        </div>
        <span className="rounded-full bg-primary text-white px-3 py-1 text-xs font-semibold uppercase">
          Admin
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {adminNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:bg-primary-light/50',
                isActive
                  ? 'bg-primary-light text-primary border-l-4 border-primary'
                  : 'text-neutral'
              )}
            >
              <item.icon
                className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-primary-dark')}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <LogoutButton />
    </aside>
  );
}
