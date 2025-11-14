import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'md' | 'lg';
};

const cardWidths: Record<NonNullable<AuthCardProps['size']>, string> = {
  md: 'max-w-md',
  lg: 'max-w-lg'
};

export function AuthCard({ title, subtitle, children, className, size = 'md' }: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-background px-6 py-12">
      <div className="flex flex-col items-center gap-6 animate-fade-in-up">
        <Logo size="md" href="/login" />
        <div
          className={cn(
            'w-full rounded-3xl bg-white border border-neutral-border shadow-card px-10 py-12',
            cardWidths[size],
            className
          )}
        >
          <header className="mb-10 space-y-3 text-center">
            <h1 className="text-3xl font-semibold text-primary-dark">{title}</h1>
            {subtitle ? <p className="text-sm text-neutral-soft">{subtitle}</p> : null}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
