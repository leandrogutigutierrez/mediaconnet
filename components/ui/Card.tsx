import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?:    boolean;
  glow?:     boolean;
  padding?:  'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-7' };

export function Card({ hover = false, glow = false, padding = 'md', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-bg-card rounded-xl border border-border transition-all duration-200',
        hover && 'hover:border-primary-500/40 hover:shadow-card-hover cursor-pointer hover:bg-bg-hover',
        glow  && 'shadow-glow-sm border-primary-500/20',
        paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-semibold text-content-primary', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-border flex items-center gap-3', className)} {...props}>
      {children}
    </div>
  );
}
