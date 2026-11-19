import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'sage' | 'lavender' | 'blue' | 'peach' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-cream-200 text-ink-900',
    sage: 'bg-sage-100 text-sage-700 border border-sage-200',
    lavender: 'bg-lavender-100 text-lavender-500 border border-lavender-200',
    blue: 'bg-dustyBlue-100 text-dustyBlue-500 border border-dustyBlue-200',
    peach: 'bg-peach-100 text-peach-500 border border-peach-200',
    outline: 'border border-border text-foreground',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
