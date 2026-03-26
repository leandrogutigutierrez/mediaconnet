import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; className?: string }
const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <svg className={cn('animate-spin text-primary-500', sizeMap[size], className)} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center animate-pulse-glow">
          <span className="text-primary-500 font-extrabold text-lg">M</span>
        </div>
        <Spinner size="md" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-bg-hover" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-bg-hover rounded w-1/2" />
          <div className="h-2 bg-bg-hover rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-bg-hover rounded" />
        <div className="h-3 bg-bg-hover rounded w-5/6" />
        <div className="h-3 bg-bg-hover rounded w-4/6" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}
