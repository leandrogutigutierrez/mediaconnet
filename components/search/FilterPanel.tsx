'use client';

import React from 'react';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { SearchFilters, OpportunityCategory } from '@/types';

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'video',        label: 'Video Production'  },
  { value: 'photography',  label: 'Photography'       },
  { value: 'social-media', label: 'Social Media'      },
  { value: 'branding',     label: 'Branding & Design' },
  { value: 'animation',    label: 'Animation'         },
  { value: 'journalism',   label: 'Journalism'        },
  { value: 'podcast',      label: 'Podcast'           },
  { value: 'documentary',  label: 'Documentary'       },
  { value: 'advertising',  label: 'Advertising'       },
  { value: 'other',        label: 'Other'             },
];

const MODALITIES = [
  { value: 'remote',  label: 'Remote'  },
  { value: 'on-site', label: 'On-site' },
  { value: 'hybrid',  label: 'Hybrid'  },
];

interface FilterPanelProps {
  filters:    SearchFilters;
  onChange:   (f: Partial<SearchFilters>) => void;
  onReset:    () => void;
  className?: string;
}

export function FilterPanel({ filters, onChange, onReset, className }: FilterPanelProps) {
  const hasActiveFilters = !!(filters.category || filters.modality);

  return (
    <aside className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <Select
          label="Category"
          placeholder="All categories"
          value={filters.category ?? ''}
          onChange={(e) => onChange({ category: (e.target.value as OpportunityCategory) || undefined })}
          options={CATEGORIES}
        />
        <Select
          label="Modality"
          placeholder="All modalities"
          value={filters.modality ?? ''}
          onChange={(e) => onChange({ modality: e.target.value || undefined })}
          options={MODALITIES}
        />
      </div>
    </aside>
  );
}
