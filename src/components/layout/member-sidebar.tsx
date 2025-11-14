/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { UserAvatar } from '@/components/user/user-avatar';
import { cn } from '@/lib/utils';
import {
  CalendarDaysIcon,
  UserCircleIcon,
  UsersIcon,
  DocumentIcon,
  ArrowRightOnRectangleIcon,
  HomeModernIcon
} from '@heroicons/react/24/outline';
import { LogoutButton } from '@/components/logout-button';

type SidebarProps = {
  user: {
    firstName: string;
    lastName: string;
    role: string;
    title?: string | null;
    avatarUrl?: string | null;
  };
};

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeModernIcon },
  { name: 'Events Calendar', href: '/dashboard/events', icon: CalendarDaysIcon },
  { name: 'My Events', href: '/dashboard/my-events', icon: CalendarDaysIcon },
  { name: 'Community', href: '/dashboard/community', icon: UsersIcon },
  { name: 'Resources', href: '/dashboard/resources', icon: DocumentIcon },
  { name: 'Profile Settings', href: '/dashboard/profile', icon: UserCircleIcon }
];

export function MemberSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const displayName = `${user.firstName} ${user.lastName}`;

  return (
    <aside className="hidden lg:block lg:w-[290px] xl:w-[310px]">
      <div className="sticky top-8 flex h-[calc(100vh-64px)] flex-col gap-6 rounded-3xl border border-neutral-border bg-white px-6 py-8 shadow-subtle">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo size="lg" />
          <p className="text-xs uppercase tracking-[0.32em] text-primary font-semibold">
            Member Portal
          </p>
        </div>

        <div className="rounded-2xl bg-neutral-background/60 border border-neutral-border/70 p-5 flex flex-col items-center text-center gap-3">
          <UserAvatar
            name={displayName}
            src={user.avatarUrl ?? undefined}
            status="online"
            size={56}
          />
          <div>
            <p className="text-base font-semibold text-primary-dark">{displayName}</p>
            <p className="text-xs text-neutral-soft">{user.title ?? 'Member'}</p>
          </div>
          <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark uppercase">
            {user.role === 'ADMIN' ? 'Admin' : 'Member'}
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all',
                  'border shadow-sm hover:shadow-md',
                  isActive
                    ? 'bg-primary text-white border-primary hover:bg-[#4a8cb0]'
                    : 'bg-white text-primary-dark border-neutral-border hover:bg-primary-light/70 hover:text-primary-dark'
                )}
              >
                <item.icon className="h-5 w-5 text-current" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-2">
          <LogoutButton
            className="w-full justify-center font-semibold"
            icon={ArrowRightOnRectangleIcon}
          />
        </div>
      </div>
    </aside>
  );
}
