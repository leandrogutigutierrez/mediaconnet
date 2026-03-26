'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Opportunity, SearchFilters, PaginatedResponse } from '@/types';
import { buildQuery } from '@/lib/utils';

interface UseOpportunitiesReturn {
  opportunities: Opportunity[];
  total:         number;
  pages:         number;
  loading:       boolean;
  error:         string | null;
  filters:       SearchFilters;
  setFilters:    (f: Partial<SearchFilters>) => void;
  refresh:       () => void;
}

export function useOpportunities(initial?: Partial<SearchFilters>): UseOpportunitiesReturn {
  const [filters,       setFiltersState] = useState<SearchFilters>({ page: 1, limit: 12, ...initial });
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [total,         setTotal]         = useState(0);
  const [pages,         setPages]         = useState(1);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [tick,          setTick]          = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const setFilters = useCallback((f: Partial<SearchFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...f, page: f.page ?? 1 }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params: Record<string, string | number | boolean | undefined> = {
      page:     filters.page,
      limit:    filters.limit,
      q:        filters.query,
      category: filters.category,
      modality: filters.modality,
    };
    if (filters.skills?.length) params.skills = filters.skills.join(',');

    fetch(`/api/opportunities${buildQuery(params)}`)
      .then((r) => r.json())
      .then((json: { success: boolean; data: PaginatedResponse<Opportunity> }) => {
        if (!cancelled) {
          setOpportunities(json.data.items);
          setTotal(json.data.total);
          setPages(json.data.pages);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filters, tick]);

  return { opportunities, total, pages, loading, error, filters, setFilters, refresh };
}
