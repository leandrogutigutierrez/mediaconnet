'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?:  string;
  size?:         'sm' | 'md' | 'lg';
  onSearch?:     (query: string) => void;
  className?:    string;
  navigate?:     boolean;
}

const sizeMap = {
  sm: 'py-2 text-sm pl-9',
  md: 'py-2.5 text-sm pl-10',
  lg: 'py-3 text-sm pl-11',
};
const iconMap = { sm: 15, md: 17, lg: 18 };

export function SearchBar({
  defaultValue = '',
  placeholder  = 'Search…',
  size         = 'md',
  onSearch,
  navigate     = true,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (navigate) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      onSearch?.(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative w-full', className)}>
      <Search
        size={iconMap[size]}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-content-subtle pointer-events-none"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => { setQuery(e.target.value); if (!navigate) onSearch?.(e.target.value); }}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-xl border border-border bg-bg-surface pr-10',
          'text-content-primary placeholder:text-content-subtle',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50',
          'transition-all duration-200',
          sizeMap[size]
        )}
      />
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(''); onSearch?.(''); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-content-subtle hover:text-content-muted transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
