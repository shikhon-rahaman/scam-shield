import React from 'react';
import { cn } from '../utils/cn';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  narrow?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  title,
  subtitle,
  badge,
  action,
  narrow = false,
  ...props
}) => {
  return (
    <section
      className={cn(
        'w-full max-w-shield mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-colors duration-normal',
        narrow && 'max-w-xl',
        className
      )}
      {...props}
    >
      {(title || subtitle || badge || action) && (
        <header className="mb-6 space-y-2">
          <div className="flex items-center justify-between gap-4">
            {badge && <div>{badge}</div>}
            {action && <div className="ml-auto">{action}</div>}
          </div>
          {title && (
            <h2 className="text-heading-xl font-heading font-semibold text-ink tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-body text-ink-muted leading-relaxed">
              {subtitle}
            </p>
          )}
        </header>
      )}
      <div>{children}</div>
    </section>
  );
};
