import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
};

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary text-white hover:bg-[#4a8cb0] focus-visible:ring-primary shadow-card hover:shadow-card transition transform hover:-translate-y-0.5 active:translate-y-0',
  secondary: 'bg-primary-dark text-white hover:bg-[#17354f] focus-visible:ring-primary-dark',
  outline:
    'border border-primary text-primary hover:bg-primary-light focus-visible:ring-primary bg-white',
  ghost: 'text-primary hover:bg-primary-light focus-visible:ring-primary'
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-6 text-base'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    className,
    type = 'button',
    isLoading = false,
    disabled,
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-[10px] font-semibold transition-all focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {isLoading ? 'Please wait…' : children}
    </button>
  );
});
