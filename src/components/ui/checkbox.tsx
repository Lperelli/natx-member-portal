'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, ...props },
  ref
) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 text-sm text-neutral cursor-pointer',
        className
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        className="h-5 w-5 rounded border-2 border-neutral-border text-primary focus:ring-primary focus:ring-offset-0"
        {...props}
      />
      {label ? <span>{label}</span> : null}
    </label>
  );
});
