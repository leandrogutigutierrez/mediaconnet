import React from 'react';
import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?:      string | null;
  name:      string;
  size?:     AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, { cls: string; px: number }> = {
  xs:  { cls: 'w-6  h-6  text-xs',  px: 24  },
  sm:  { cls: 'w-8  h-8  text-xs',  px: 32  },
  md:  { cls: 'w-10 h-10 text-sm',  px: 40  },
  lg:  { cls: 'w-14 h-14 text-base',px: 56  },
  xl:  { cls: 'w-20 h-20 text-xl',  px: 80  },
};

// Simple deterministic colour from name
const COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
  'bg-teal-500',  'bg-orange-500', 'bg-green-500', 'bg-red-500',
];
function colorFor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return COLORS[hash % COLORS.length];
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const { cls, px } = sizeMap[size];
  const color       = colorFor(name);

  if (src) {
    return (
      <div className={cn('relative rounded-full overflow-hidden shrink-0', cls, className)}>
        <Image src={src} alt={name} fill className="object-cover" sizes={`${px}px`} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white shrink-0',
        cls,
        color,
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
