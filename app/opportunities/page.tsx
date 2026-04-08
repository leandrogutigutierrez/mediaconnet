'use client';

import React from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';
import { SkeletonGrid } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useI18n } from '@/contexts/I18nContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function OpportunitiesPage() {
  const { opportunities, total, pages, loading, filters, setFilters } = useOpportunities();
  const { t } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content-primary tracking-tight">{t('opportunities.title')}</h1>
        <p className="text-content-subtle text-sm mt-1">
          {total > 0
            ? t('opportunities.countLabel', { total: String(total) })
            : t('opportunities.browseLabel')}
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          navigate={false}
          placeholder={t('opportunities.searchPh')}
          onSearch={(q) => setFilters({ query: q })}
          defaultValue={filters.query ?? ''}
          size="lg"
        />
      </div>

      <div className="flex gap-6">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters({ query: '', category: undefined, modality: undefined })}
          className="hidden md:block w-52 shrink-0"
        />

        <div className="flex-1 min-w-0">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : opportunities.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-content-muted text-base font-medium">{t('opportunities.noResults')}</p>
              <p className="text-content-subtle text-sm mt-1">{t('opportunities.noResultsSub')}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {opportunities.map((opp) => <OpportunityCard key={opp._id} opportunity={opp} />)}
              </div>

              {pages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <Button variant="outline" size="sm" icon={<ChevronLeft size={14} />}
                    disabled={filters.page === 1}
                    onClick={() => setFilters({ page: (filters.page ?? 1) - 1 })}>
                    {t('common.prev')}
                  </Button>
                  <span className="text-sm text-content-subtle px-3">
                    {t('common.page', { page: String(filters.page), pages: String(pages) })}
                  </span>
                  <Button variant="outline" size="sm" iconRight={<ChevronRight size={14} />}
                    disabled={filters.page === pages}
                    onClick={() => setFilters({ page: (filters.page ?? 1) + 1 })}>
                    {t('common.next')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
