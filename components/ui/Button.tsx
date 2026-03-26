import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   Variant;
  size?:      Size;
  loading?:   boolean;
  icon?:      React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:   'bg-primary-500 text-bg hover:bg-primary-400 focus:ring-primary-500 shadow-glow-sm font-semibold',
  secondary: 'bg-bg-hover text-primary-400 border border-primary-500/30 hover:border-primary-500/60 hover:bg-primary-500/10 focus:ring-primary-500',
  outline:   'border border-border text-content-primary hover:border-border-light hover:bg-bg-hover focus:ring-border-light',
  ghost:     'text-content-muted hover:text-content-primary hover:bg-bg-hover focus:ring-border',
  danger:    'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 focus:ring-red-500',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3 text-base gap-2 rounded-xl',
};

export function Button({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  icon,
  iconRight,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
