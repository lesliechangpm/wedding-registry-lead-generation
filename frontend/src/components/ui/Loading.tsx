import React from 'react';
import { clsx } from 'clsx';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'primary',
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const variantClasses = {
    primary: 'text-navy-600',
    secondary: 'text-rose-gold-500',
    white: 'text-white',
  };

  return (
    <svg 
      className={clsx(
        'animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'neutral';
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  size = 'md', 
  variant = 'primary',
  className 
}) => {
  const sizeClasses = {
    sm: 'h-1 w-1',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  };

  const variantClasses = {
    primary: 'bg-navy-600',
    secondary: 'bg-rose-gold-500',
    neutral: 'bg-warm-gray-400',
  };

  return (
    <div className={clsx('flex items-center space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            'rounded-full animate-bounce',
            sizeClasses[size],
            variantClasses[variant]
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

export interface LoadingBarProps {
  progress?: number;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ 
  progress,
  variant = 'primary',
  size = 'md',
  animated = false,
  className 
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    primary: 'bg-navy-600',
    secondary: 'bg-rose-gold-500',
    accent: 'bg-sage-400',
  };

  const isIndeterminate = progress === undefined;

  return (
    <div className={clsx('w-full bg-warm-gray-200 rounded-full overflow-hidden', sizeClasses[size], className)}>
      <div
        className={clsx(
          'h-full rounded-full transition-all duration-300',
          variantClasses[variant],
          isIndeterminate && 'animate-pulse',
          animated && 'transition-all duration-500 ease-out'
        )}
        style={{
          width: isIndeterminate ? '100%' : `${Math.min(100, Math.max(0, progress || 0))}%`,
        }}
      />
    </div>
  );
};

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className,
  variant = 'text',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-warm-gray-300 dark:bg-gray-600';
  
  const variantClasses = {
    text: 'rounded h-4',
    rectangular: 'rounded-wedding',
    circular: 'rounded-full',
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={clsx('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              baseClasses,
              variantClasses[variant],
              i === lines - 1 && 'w-3/4' // Last line is shorter
            )}
            style={{ 
              width: i === lines - 1 ? '75%' : width,
              height: height || 'auto'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
    />
  );
};

export interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  variant?: 'primary' | 'secondary' | 'white';
  backdrop?: 'light' | 'dark' | 'blur';
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible,
  message = 'Loading...',
  variant = 'primary',
  backdrop = 'blur',
  className 
}) => {
  if (!isVisible) return null;

  const backdropClasses = {
    light: 'bg-white/80',
    dark: 'bg-black/50',
    blur: 'bg-white/80 backdrop-blur-sm',
  };

  return (
    <div 
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center',
        backdropClasses[backdrop],
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-800 rounded-wedding-lg shadow-wedding-xl">
        <LoadingSpinner size="xl" variant={variant} />
        {message && (
          <p className="text-sm font-medium text-warm-gray-600 dark:text-gray-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

// Wedding-themed loading animation
export interface WeddingLoadingProps {
  message?: string;
  className?: string;
}

export const WeddingLoading: React.FC<WeddingLoadingProps> = ({ 
  message = 'Loading beautiful data...',
  className 
}) => {
  return (
    <div className={clsx('flex flex-col items-center space-y-4', className)}>
      <div className="relative">
        <div className="w-16 h-16 border-4 border-rose-gold-200 rounded-full animate-spin border-t-rose-gold-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-rose-gold-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <p className="text-sm font-medium text-warm-gray-600 dark:text-gray-400 font-accent">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;