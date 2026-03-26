'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  value:     number;
  max?:      number;
  size?:     'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const sizeMap = { sm: 14, md: 18, lg: 24 };

export function RatingStars({
  value, max = 5, size = 'md', interactive = false, onChange, className,
}: RatingStarsProps) {
  const [hovered, setHovered] = useState(0);
  const px = sizeMap[size];

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }, (_, i) => {
        const filled = (interactive ? hovered || value : value) >= i + 1;
        return (
          <Star
            key={i}
            size={px}
            className={cn(
              'transition-colors',
              filled ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200',
              interactive && 'cursor-pointer hover:scale-110 transition-transform'
            )}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onChange?.(i + 1)}
          />
        );
      })}
    </div>
  );
}
