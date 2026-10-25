import React, { useId } from 'react';
import { cn } from '../utils/cn';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
  id: customId,
}) => {
  const generatedId = useId();
  const toggleId = customId || generatedId;
  const descriptionId = `${toggleId}-desc`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={cn('flex items-center justify-between gap-4 select-none', className)}>
      {(label || description) && (
        <label htmlFor={toggleId} className="flex flex-col cursor-pointer">
          {label && <span className="text-body font-medium text-ink">{label}</span>}
          {description && (
            <span id={descriptionId} className="text-caption text-ink-muted">
              {description}
            </span>
          )}
        </label>
      )}

      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? descriptionId : undefined}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-normal ease-protective focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-surface-hover border border-border'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-card transition-transform duration-normal ease-protective',
            checked ? 'translate-x-6' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
};
