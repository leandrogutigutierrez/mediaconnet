'use client';

import React from 'react';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/contexts/I18nContext';
import type { SearchFilters, OpportunityCategory } from '@/types';

const CATEGORY_VALUES = ['video','photography','social-media','branding','animation','journalism','podcast','documentary','advertising','other'] as const;
const MODALITY_VALUES = ['remote','on-site','hybrid'] as const;

interface FilterPanelProps {
  filters:    SearchFilters;
  onChange:   (f: Partial<SearchFilters>) => void;
  onReset:    () => void;
  className?: string;
}

export function FilterPanel({ filters, onChange, onReset, className }: FilterPanelProps) {
  const { t } = useI18n();
  const hasActiveFilters = !!(filters.category || filters.modality);

  const CATEGORIES = CATEGORY_VALUES.map((v) => ({ value: v, label: t(`opportunities.categories.${v}`) }));
  const MODALITIES = MODALITY_VALUES.map((v) => ({ value: v, label: t(`opportunities.modalities.${v}`) }));

  return (
    <aside className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-content-subtle uppercase tracking-widest">
          {t('filter.title')}
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>{t('common.reset')}</Button>
        )}
      </div>

      <div className="space-y-4">
        <Select
          label={t('filter.category')}
          placeholder={t('filter.categoryPh')}
          value={filters.category ?? ''}
          onChange={(e) => onChange({ category: (e.target.value as OpportunityCategory) || undefined })}
          options={CATEGORIES}
        />
        <Select
          label={t('filter.modality')}
          placeholder={t('filter.modalityPh')}
          value={filters.modality ?? ''}
          onChange={(e) => onChange({ modality: e.target.value || undefined })}
          options={MODALITIES}
        />
      </div>
    </aside>
  );
}
