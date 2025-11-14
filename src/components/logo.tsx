import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeMap: Record<LogoProps['size'], number> = {
  sm: 100,
  md: 120,
  lg: 140
};

export function Logo({ href = '/dashboard', size = 'md', className }: LogoProps) {
  const width = sizeMap[size];
  return (
    <Link href={href} className={cn('inline-flex justify-center', className)}>
      <Image
        src="https://cdn.prod.website-files.com/68ff7fb6dfdbb370a105daed/690e0b70b6d3d97461c692c6_NATX%20-%20Variation%204.svg"
        alt="NATX logo"
        width={width}
        height={Math.round(width * 0.28)}
        priority
      />
    </Link>
  );
}
