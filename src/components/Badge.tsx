import React from 'react';
import { AlertOctagon, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { cn } from '../utils/cn';

export type VerdictType = 'scam' | 'suspicious' | 'fine';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'primary' | 'scam' | 'suspicious' | 'fine';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  icon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-medium rounded-full transition-colors duration-normal';

  const sizes = {
    sm: 'text-caption px-2.5 py-1 gap-1.5',
    md: 'text-body-sm px-3.5 py-1.5 gap-2 font-medium',
    lg: 'text-body px-4 py-2 gap-2.5 font-semibold',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 20,
  };

  const variants = {
    neutral: 'bg-surface-subtle text-ink-muted border border-border',
    primary: 'bg-primary-subtle text-primary border border-primary/20',
    scam: 'bg-verdict-scam-subtle text-verdict-scam-text border-2 border-verdict-scam-border',
    suspicious:
      'bg-verdict-suspicious-subtle text-verdict-suspicious-text border-2 border-verdict-suspicious-border',
    fine: 'bg-verdict-fine-subtle text-verdict-fine-text border-2 border-verdict-fine-border',
  };

  // Determine icon to ensure verdict colors are NEVER alone
  const getVerdictIcon = () => {
    if (icon) return icon;
    const currentSize = iconSizes[size];

    switch (variant) {
      case 'scam':
        return <AlertOctagon size={currentSize} className="text-verdict-scam shrink-0" aria-hidden="true" />;
      case 'suspicious':
        return <AlertTriangle size={currentSize} className="text-verdict-suspicious shrink-0" aria-hidden="true" />;
      case 'fine':
        return <ShieldCheck size={currentSize} className="text-verdict-fine shrink-0" aria-hidden="true" />;
      case 'primary':
        return <Info size={currentSize} className="text-primary shrink-0" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const resolvedIcon = getVerdictIcon();

  return (
    <span
      className={cn(baseStyles, sizes[size], variants[variant], className)}
      role="status"
      {...props}
    >
      {resolvedIcon && <span className="inline-flex shrink-0">{resolvedIcon}</span>}
      <span>{children}</span>
    </span>
  );
};
