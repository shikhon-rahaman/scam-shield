import React from 'react';
import { cn } from '../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-normal ease-protective select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:pointer-events-none';

    const variants = {
      primary:
        'bg-primary text-primary-text hover:bg-primary-hover active:bg-primary-active shadow-card shadow-primary/10 border border-transparent',
      secondary:
        'bg-surface-subtle text-ink hover:bg-surface-hover active:bg-surface-hover/80 border border-border shadow-subtle',
      outline:
        'border-2 border-primary/30 text-primary hover:border-primary hover:bg-primary-subtle/50 active:bg-primary-subtle',
      ghost:
        'text-ink hover:bg-surface-subtle active:bg-surface-hover border border-transparent',
      danger:
        'bg-verdict-scam text-white hover:opacity-95 active:opacity-90 shadow-card shadow-verdict-scam/15 border border-transparent',
    };

    const sizes = {
      sm: 'text-caption px-3.5 py-2 rounded-md min-h-[38px] gap-1.5',
      md: 'text-body px-5 py-3 rounded-card-sm min-h-[48px] gap-2 font-medium',
      lg: 'text-body-lg px-7 py-3.5 rounded-card min-h-[56px] gap-2.5 font-semibold',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
