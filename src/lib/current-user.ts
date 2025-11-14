import { cache } from 'react';
import { getSession } from '@/lib/auth';

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user ?? null;
});
