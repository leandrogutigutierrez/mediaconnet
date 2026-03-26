'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { StudentCard } from '@/components/student/StudentCard';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';
import { SkeletonGrid } from '@/components/ui/Loading';
import type { User, Opportunity } from '@/types';
import { cn } from '@/lib/utils';

type Tab = 'all' | 'opportunities' | 'students';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';

  const [tab,          setTab]          = useState<Tab>('all');
  const [students,     setStudents]     = useState<User[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading,      setLoading]      = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}&type=all`)
      .then((r) => r.json())
      .then((j) => {
        setStudents(j.data?.students?.items ?? []);
        setOpportunities(j.data?.opportunities?.items ?? []);
      })
      .finally(() => setLoading(false));
  }, [q]);

  const tabs: { label: string; value: Tab }[] = [
    { label: `All (${students.length + opportunities.length})`, value: 'all' },
    { label: `Opportunities (${opportunities.length})`,          value: 'opportunities' },
    { label: `Students (${students.length})`,                    value: 'students' },
  ];

  return (
    <>
      <div className="mb-8">
        <SearchBar defaultValue={q} size="lg" navigate />
      </div>

      {q ? (
        <>
          <p className="text-sm text-slate-500 mb-4">
            Results for <span className="font-medium text-slate-900">&quot;{q}&quot;</span>
          </p>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-6">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  tab === t.value
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <SkeletonGrid />
          ) : (
            <>
              {(tab === 'all' || tab === 'opportunities') && opportunities.length > 0 && (
                <section className="mb-8">
                  {tab === 'all' && <h2 className="text-base font-semibold text-slate-900 mb-4">Opportunities</h2>}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {opportunities.map((o) => <OpportunityCard key={o._id} opportunity={o} />)}
                  </div>
                </section>
              )}

              {(tab === 'all' || tab === 'students') && students.length > 0 && (
                <section>
                  {tab === 'all' && <h2 className="text-base font-semibold text-slate-900 mb-4">Students</h2>}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {students.map((s) => <StudentCard key={s._id} student={s} />)}
                  </div>
                </section>
              )}

              {students.length === 0 && opportunities.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-slate-500 text-lg">No results found for &quot;{q}&quot;.</p>
                  <p className="text-slate-400 text-sm mt-1">Try different keywords.</p>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <p className="text-slate-400 text-center py-12">Enter a search term to get started.</p>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Search</h1>
      <Suspense fallback={<SkeletonGrid />}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
