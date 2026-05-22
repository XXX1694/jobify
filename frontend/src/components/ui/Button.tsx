import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
}

const BASE =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium leading-none transition-[transform,background-color,border-color,box-shadow,filter,color] duration-200 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-45 active:scale-[0.97]';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-accent-ink font-semibold shadow-glow-sm hover:brightness-110 hover:shadow-glow',
  secondary:
    'bg-surface-hi text-fg border border-line hover:border-line-hi hover:brightness-[1.15]',
  outline: 'border border-line text-fg hover:bg-surface-hi hover:border-line-hi',
  ghost: 'text-fg-muted hover:bg-surface-hi hover:text-fg',
  danger:
    'border border-danger/30 bg-danger/10 text-danger hover:bg-danger/18 hover:border-danger/45',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
  icon: 'h-10 w-10',
  'icon-sm': 'h-8 w-8',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'md',
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    if (asChild) {
      return (
        <Slot ref={ref} className={cn(BASE, VARIANTS[variant], SIZES[size], className)}>
          {children}
        </Slot>
      );
    }
    return (
      <button
        ref={ref}
        className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner className="size-3.5" />}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
