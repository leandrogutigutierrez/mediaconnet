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
  /** If true, navigates to /search on submit. If false, calls onSearch instead. */
  navigate?:     boolean;
}

const sizeMap = {
  sm: 'py-2 text-sm pl-9',
  md: 'py-2.5 text-sm pl-10',
  lg: 'py-3 text-base pl-11',
};
const iconMap = { sm: 15, md: 17, lg: 20 };

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
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => { setQuery(e.target.value); if (!navigate) onSearch?.(e.target.value); }}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-xl border border-slate-300 bg-white pr-10 focus:outline-none',
          'focus:ring-2 focus:ring-primary-500 focus:border-transparent transition',
          sizeMap[size]
        )}
      />
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(''); onSearch?.(''); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
