import { cn } from '@/lib/utils';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'success';
  className?: string;
};

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  const styles = {
    primary: 'bg-primary text-white',
    outline: 'border border-primary text-primary',
    success: 'bg-success/10 text-success'
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
