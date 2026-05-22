import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm leading-relaxed text-fg transition-colors duration-150 placeholder:text-fg-faint focus:border-accent/55 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50',
        invalid && 'border-danger/60 focus:border-danger focus:ring-danger/20',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
