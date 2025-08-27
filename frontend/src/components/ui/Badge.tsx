import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  outline?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    variant = 'neutral', 
    size = 'md',
    dot = false,
    outline = false,
    children, 
    className, 
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';
    
    const sizeClasses = {
      sm: dot ? 'h-2 w-2' : 'px-2 py-0.5 text-xs',
      md: dot ? 'h-2.5 w-2.5' : 'px-2.5 py-0.5 text-xs',
      lg: dot ? 'h-3 w-3' : 'px-3 py-1 text-sm',
    };

    const solidVariantClasses = {
      primary: 'bg-navy-100 text-navy-800 dark:bg-navy-900 dark:text-navy-200',
      secondary: 'bg-rose-gold-100 text-rose-gold-800 dark:bg-rose-gold-900 dark:text-rose-gold-200',
      accent: 'bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-200',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      neutral: 'bg-warm-gray-100 text-warm-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };

    const outlineVariantClasses = {
      primary: 'border border-navy-200 text-navy-700 dark:border-navy-700 dark:text-navy-300',
      secondary: 'border border-rose-gold-200 text-rose-gold-700 dark:border-rose-gold-700 dark:text-rose-gold-300',
      accent: 'border border-sage-200 text-sage-700 dark:border-sage-700 dark:text-sage-300',
      success: 'border border-green-200 text-green-700 dark:border-green-700 dark:text-green-300',
      warning: 'border border-yellow-200 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300',
      danger: 'border border-red-200 text-red-700 dark:border-red-700 dark:text-red-300',
      neutral: 'border border-warm-gray-200 text-warm-gray-700 dark:border-gray-600 dark:text-gray-300',
    };

    const dotVariantClasses = {
      primary: 'bg-navy-600',
      secondary: 'bg-rose-gold-500',
      accent: 'bg-sage-400',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
      neutral: 'bg-warm-gray-400',
    };

    if (dot) {
      return (
        <span
          ref={ref}
          className={clsx(
            baseClasses,
            sizeClasses[size],
            dotVariantClasses[variant],
            className
          )}
          {...props}
        />
      );
    }

    const variantClasses = outline ? outlineVariantClasses[variant] : solidVariantClasses[variant];

    return (
      <span
        ref={ref}
        className={clsx(
          baseClasses,
          sizeClasses[size],
          variantClasses,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Status Badge - specifically for lead/couple statuses
export interface StatusBadgeProps {
  status: 'new' | 'contacted' | 'qualified' | 'application' | 'approved' | 'closed' | 'declined';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const statusConfig = {
    new: { variant: 'neutral' as const, text: 'New' },
    contacted: { variant: 'primary' as const, text: 'Contacted' },
    qualified: { variant: 'accent' as const, text: 'Qualified' },
    application: { variant: 'warning' as const, text: 'Application' },
    approved: { variant: 'success' as const, text: 'Approved' },
    closed: { variant: 'success' as const, text: 'Closed' },
    declined: { variant: 'danger' as const, text: 'Declined' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} size={size}>
      {config.text}
    </Badge>
  );
};

// Priority Badge - for lead scoring
export interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const priorityConfig = {
    low: { variant: 'neutral' as const, text: 'Low Priority' },
    medium: { variant: 'accent' as const, text: 'Medium Priority' },
    high: { variant: 'warning' as const, text: 'High Priority' },
    urgent: { variant: 'danger' as const, text: 'Urgent' },
  };

  const config = priorityConfig[priority];

  return (
    <Badge variant={config.variant} size={size}>
      {config.text}
    </Badge>
  );
};

export default Badge;