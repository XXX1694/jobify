import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  icon?: ReactNode;
  suffix?: ReactNode;
}

const FIELD =
  'h-10 w-full rounded-xl border border-line bg-canvas text-sm text-fg transition-colors duration-150 placeholder:text-fg-faint focus:border-accent/55 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, icon, suffix, ...props }, ref) => {
    const invalidCls = invalid
      ? 'border-danger/60 focus:border-danger focus:ring-danger/20'
      : '';

    if (icon || suffix) {
      return (
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint [&>svg]:size-4">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              FIELD,
              icon ? 'pl-9' : 'pl-3',
              suffix ? 'pr-10' : 'pr-3',
              invalidCls,
              className,
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-fg-faint">
              {suffix}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(FIELD, 'px-3', invalidCls, className)}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
