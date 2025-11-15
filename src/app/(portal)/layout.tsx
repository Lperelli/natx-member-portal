import { ReactNode } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/current-user';
import { MemberSidebar } from '@/components/layout/member-sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';

type PortalLayoutProps = {
  children: ReactNode;
};

export default async function PortalLayout({ children }: PortalLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    const headerStore = await headers();
    const pathname = headerStore.get('x-pathname') ?? '/dashboard';
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  return (
    <div className="min-h-screen bg-neutral-background">
      <MobileNav />
      <div className="mx-auto flex w-full max-w-[1600px] gap-8 px-4 sm:px-6 lg:px-10 xl:px-16">
        <MemberSidebar user={user} />
        <main className="flex-1 py-8">
          <div className="mx-auto max-w-[1400px] space-y-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
