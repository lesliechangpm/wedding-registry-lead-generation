import React from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'floating' | 'search';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    variant = 'default',
    size = 'md',
    fullWidth = true,
    className,
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = 'border rounded-wedding shadow-sm placeholder-warm-gray-400 focus:outline-none transition-colors duration-200 text-warm-gray-900 dark:text-gray-100';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    const stateClasses = {
      default: 'border-warm-gray-300 dark:border-gray-600 focus:border-navy-500 focus:ring-navy-500 bg-white dark:bg-gray-700',
      error: 'border-burgundy-500 focus:border-burgundy-500 focus:ring-burgundy-500 bg-white dark:bg-gray-700',
      success: 'border-forest-500 focus:border-forest-500 focus:ring-forest-500 bg-white dark:bg-gray-700',
    };

    const currentState = error ? 'error' : 'default';

    const inputClasses = clsx(
      baseClasses,
      sizeClasses[size],
      stateClasses[currentState],
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      fullWidth && 'w-full',
      className
    );

    if (variant === 'floating') {
      return (
        <div className="floating-input">
          <input
            ref={ref}
            id={inputId}
            className={clsx(inputClasses, 'pt-6 pb-2')}
            placeholder=" "
            {...props}
          />
          {label && (
            <label 
              htmlFor={inputId}
              className="absolute left-3 top-2 text-xs text-warm-gray-500 dark:text-gray-400 font-medium transition-all peer-focus:text-navy-600 peer-focus:scale-90 peer-focus:-translate-y-1 peer-[:not(:placeholder-shown)]:text-navy-600 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:-translate-y-1"
            >
              {label}
            </label>
          )}
          {error && (
            <p className="mt-1 text-sm text-burgundy-500">{error}</p>
          )}
          {hint && !error && (
            <p className="mt-1 text-sm text-warm-gray-500 dark:text-gray-400">{hint}</p>
          )}
        </div>
      );
    }

    if (variant === 'search') {
      return (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-warm-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={ref}
            id={inputId}
            className={clsx(inputClasses, 'pl-10 rounded-full')}
            placeholder={props.placeholder || 'Search...'}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={clsx('space-y-1', !fullWidth && 'inline-block')}>
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-warm-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-burgundy-500">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-warm-gray-500 dark:text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    label,
    error,
    hint,
    resize = 'vertical',
    fullWidth = true,
    className,
    id,
    ...props
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = 'border border-warm-gray-300 dark:border-gray-600 rounded-wedding shadow-sm placeholder-warm-gray-400 focus:outline-none focus:border-navy-500 focus:ring-navy-500 transition-colors duration-200 text-warm-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700';
    
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    const stateClasses = error 
      ? 'border-burgundy-500 focus:border-burgundy-500 focus:ring-burgundy-500'
      : '';

    return (
      <div className={clsx('space-y-1', !fullWidth && 'inline-block')}>
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-warm-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            baseClasses,
            resizeClasses[resize],
            stateClasses,
            fullWidth && 'w-full',
            'px-3 py-2 text-sm',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-burgundy-500">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-warm-gray-500 dark:text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Input;