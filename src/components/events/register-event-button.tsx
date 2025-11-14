'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { registerForEvent, cancelRegistration } from '@/lib/server-actions/event-actions';

type RegisterEventButtonProps = {
  eventId: string;
  isRegistered: boolean;
};

export function RegisterEventButton({ eventId, isRegistered }: RegisterEventButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      if (isRegistered) {
        await cancelRegistration(eventId);
      } else {
        await registerForEvent(eventId);
      }
      router.refresh();
    });
  };

  return (
    <Button onClick={handleClick} isLoading={isPending} className="w-full md:w-fit">
      {isRegistered ? 'Cancel registration' : 'Register for this event'}
    </Button>
  );
}
