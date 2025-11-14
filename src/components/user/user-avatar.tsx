import Image from 'next/image';
import { cn } from '@/lib/utils';

type UserAvatarProps = {
  name: string;
  src?: string | null;
  size?: number;
  status?: 'online' | 'offline';
  className?: string;
};

export function UserAvatar({
  name,
  src,
  size = 48,
  status = 'offline',
  className
}: UserAvatarProps) {
  return (
    <div className={cn('relative inline-flex', className)} style={{ width: size, height: size }}>
      {src ? (
        <Image
          src={src}
          alt={`${name} avatar`}
          fill
          sizes={`${size}px`}
          className="rounded-full object-cover border-2 border-white shadow-subtle"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary-light text-primary-dark font-semibold border-2 border-white shadow-subtle">
          {name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
      )}
      <span
        className={cn(
          'absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white',
          status === 'online' ? 'bg-success' : 'bg-neutral-border'
        )}
      />
    </div>
  );
}
