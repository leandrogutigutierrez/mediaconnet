import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title:     string;
  value:     string | number;
  icon:      React.ReactNode;
  trend?:    string;
  trendUp?:  boolean;
  color?:    'green' | 'blue' | 'teal' | 'purple' | 'amber';
  className?: string;
}

const colorMap = {
  green:  { icon: 'bg-primary-500/10 text-primary-400 border border-primary-500/20', value: 'text-primary-400' },
  blue:   { icon: 'bg-teal-500/10    text-teal-400    border border-teal-500/20',    value: 'text-teal-400'   },
  teal:   { icon: 'bg-teal-500/10    text-teal-400    border border-teal-500/20',    value: 'text-teal-400'   },
  purple: { icon: 'bg-purple-500/10  text-purple-400  border border-purple-500/20',  value: 'text-purple-400' },
  amber:  { icon: 'bg-amber-500/10   text-amber-400   border border-amber-500/20',   value: 'text-amber-400'  },
};

export function StatsCard({ title, value, icon, trend, trendUp, color = 'green', className }: StatsCardProps) {
  const c = colorMap[color] ?? colorMap.green;
  return (
    <div className={cn('bg-bg-card border border-border rounded-xl p-5 hover:border-primary-500/20 transition-all', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-content-subtle mb-1">{title}</p>
          <p className={cn('text-2xl font-bold', c.value)}>{value}</p>
          {trend && (
            <p className={cn('text-xs mt-1', trendUp ? 'text-primary-400' : 'text-red-400')}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-xl', c.icon)}>{icon}</div>
      </div>
    </div>
  );
}
