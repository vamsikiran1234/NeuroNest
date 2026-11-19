import * as React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none rounded-xl';

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm active:scale-[0.98]',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-cream-300 active:scale-[0.98]',
      outline: 'border-2 border-border bg-transparent hover:bg-cream-100 text-foreground active:scale-[0.98]',
      ghost: 'bg-transparent hover:bg-cream-200 text-foreground',
      soft: 'bg-sage-100 text-sage-700 hover:bg-sage-200 active:scale-[0.98]',
      danger: 'bg-peach-500 text-white hover:bg-peach-500/90 shadow-sm active:scale-[0.98]',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm gap-1.5',
      md: 'h-11 px-5 text-base gap-2',
      lg: 'h-13 px-7 text-lg font-semibold gap-2.5 rounded-2xl',
      icon: 'h-11 w-11 p-2 rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current mr-1" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
