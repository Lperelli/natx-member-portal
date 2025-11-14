'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/server-actions/auth-actions';
import type { ComponentType, SVGProps } from 'react';

type LogoutButtonProps = {
  className?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

export function LogoutButton({ className, icon: Icon }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.push('/login?status=logged-out');
    });
  };

  return (
    <Button
      variant="secondary"
      size="md"
      className={cn('w-full text-white', className)}
      onClick={handleLogout}
      isLoading={isPending}
    >
      {Icon ? <Icon className="h-5 w-5 mr-2" /> : null}
      Logout
    </Button>
  );
}
