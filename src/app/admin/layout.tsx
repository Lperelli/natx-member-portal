import { ReactNode } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/current-user';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminMobileNav } from '@/components/layout/admin-mobile-nav';

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    const headerStore = await headers();
    const pathname = headerStore.get('x-pathname') ?? '/admin';
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  if (user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-neutral-background">
      <AdminMobileNav />
      <div className="mx-auto flex w-full max-w-[1600px] justify-center gap-6">
        <AdminSidebar user={user} />
        <main className="flex-1 px-4 py-8 sm:px-8 lg:pl-[320px] lg:pr-12">
          <div className="mx-auto max-w-[1400px] space-y-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
