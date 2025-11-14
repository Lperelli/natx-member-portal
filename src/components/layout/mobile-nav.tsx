'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  CalendarDaysIcon,
  UsersIcon,
  DocumentIcon,
  UserCircleIcon,
  HomeModernIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { Logo } from '@/components/logo';
import { LogoutButton } from '@/components/logout-button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeModernIcon },
  { name: 'Events Calendar', href: '/dashboard/events', icon: CalendarDaysIcon },
  { name: 'My Events', href: '/dashboard/my-events', icon: CalendarDaysIcon },
  { name: 'Community', href: '/dashboard/community', icon: UsersIcon },
  { name: 'Resources', href: '/dashboard/resources', icon: DocumentIcon },
  { name: 'Profile Settings', href: '/dashboard/profile', icon: UserCircleIcon }
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-neutral-border">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo size="sm" />
        <button
          type="button"
          className="rounded-lg border border-neutral-border p-2 text-primary-dark focus-visible:ring-primary"
          onClick={() => setOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <Transition show={open} as={Fragment}>
        <Dialog onClose={setOpen} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-200"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative flex h-full w-full max-w-xs flex-col bg-white px-6 py-6 shadow-card">
                <div className="flex items-center justify-between">
                  <Logo size="sm" />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-neutral-border p-2 text-primary-dark focus-visible:ring-primary"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <nav className="mt-8 flex flex-col gap-3">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all',
                          'hover:bg-primary-light/60 hover:text-primary-dark',
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

                <div className="mt-auto pt-6">
                  <LogoutButton className="w-full justify-start" icon={ArrowRightOnRectangleIcon} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </header>
  );
}
