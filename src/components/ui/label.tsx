import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...props },
  ref
) {
  return (
    <label
      ref={ref}
      className={cn(
        'block text-sm font-semibold text-primary-dark mb-2 uppercase tracking-wide',
        className
      )}
      {...props}
    />
  );
});
