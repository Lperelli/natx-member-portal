import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = 'text', ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'block w-full rounded-lg border-2 border-neutral-border bg-white px-4 py-3 text-base text-neutral placeholder:text-[#94A3B8] focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all',
        className
      )}
      {...props}
    />
  );
});
