import React from 'react';
import { cn } from '../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'elevated' | 'verdict-scam' | 'verdict-suspicious' | 'verdict-fine';
  radius?: 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'default', radius = 'md', ...props }, ref) => {
    const baseStyles = 'relative overflow-hidden transition-all duration-normal ease-protective';

    const radiusMap = {
      sm: 'rounded-card-sm', // 16px
      md: 'rounded-card',    // 20px
      lg: 'rounded-card-lg', // 24px
    };

    const variants = {
      default: 'bg-surface border border-border shadow-card text-ink',
      subtle: 'bg-surface-subtle border border-border-subtle text-ink shadow-subtle',
      elevated: 'bg-surface border border-border/80 shadow-elevated text-ink',
      'verdict-scam':
        'bg-verdict-scam-subtle/70 border-2 border-verdict-scam-border text-ink shadow-card',
      'verdict-suspicious':
        'bg-verdict-suspicious-subtle/80 border-2 border-verdict-suspicious-border text-ink shadow-card',
      'verdict-fine':
        'bg-verdict-fine-subtle/80 border-2 border-verdict-fine-border text-ink shadow-card',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, radiusMap[radius], variants[variant], 'p-4 sm:p-6', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={cn('text-heading-md font-heading font-semibold text-ink', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-body text-ink-muted', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('text-body text-ink', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex items-center pt-4 mt-4 border-t border-border-subtle', className)} {...props}>
    {children}
  </div>
);
