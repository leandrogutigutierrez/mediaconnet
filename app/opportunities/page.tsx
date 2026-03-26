'use client';

import React from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';
import { SkeletonGrid } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { useOpportunities } from '@/hooks/useOpportunities';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function OpportunitiesPage() {
  const {
    opportunities, total, pages, loading, filters, setFilters,
  } = useOpportunities();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
        <p className="text-slate-500 text-sm mt-1">
          {total > 0 ? `${total} opportunities available` : 'Browse creative opportunities'}
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          navigate={false}
          placeholder="Search by title, skill, or keyword…"
          onSearch={(q) => setFilters({ query: q })}
          defaultValue={filters.query ?? ''}
          size="lg"
        />
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters({ query: '', category: undefined, modality: undefined })}
          className="hidden md:block w-52 shrink-0"
        />

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : opportunities.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">No opportunities found.</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {opportunities.map((opp) => (
                  <OpportunityCard key={opp._id} opportunity={opp} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<ChevronLeft size={14} />}
                    disabled={filters.page === 1}
                    onClick={() => setFilters({ page: (filters.page ?? 1) - 1 })}
                  >
                    Prev
                  </Button>
                  <span className="text-sm text-slate-500 px-4">
                    Page {filters.page} of {pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    iconRight={<ChevronRight size={14} />}
                    disabled={filters.page === pages}
                    onClick={() => setFilters({ page: (filters.page ?? 1) + 1 })}
                  >
                    Next
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
