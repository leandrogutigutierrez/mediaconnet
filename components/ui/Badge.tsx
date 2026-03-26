import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'teal';

interface BadgeProps {
  variant?:  BadgeVariant;
  size?:     'sm' | 'md';
  children:  React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-bg-hover   text-content-muted  border border-border',
  primary: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
  success: 'bg-green-500/10   text-green-400   border border-green-500/20',
  warning: 'bg-amber-500/10   text-amber-400   border border-amber-500/20',
  danger:  'bg-red-500/10     text-red-400     border border-red-500/20',
  purple:  'bg-purple-500/10  text-purple-400  border border-purple-500/20',
  teal:    'bg-teal-500/10    text-teal-400    border border-teal-500/20',
};

const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-2.5 py-1' };

export function Badge({ variant = 'default', size = 'sm', children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full font-medium', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    pending:  'warning',
    accepted: 'success',
    rejected: 'danger',
    active:   'primary',
  };
  return <Badge variant={map[status] ?? 'default'}>{status}</Badge>;
}
