'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { StudentCard } from '@/components/student/StudentCard';
import { SkeletonGrid } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/contexts/I18nContext';
import type { User } from '@/types';
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';

const SKILL_SUGGESTIONS = [
  'Premiere Pro', 'After Effects', 'Photoshop', 'DaVinci Resolve',
  'Video Production', 'Photography', 'Social Media', 'Copywriting',
  'Animation', 'Motion Graphics', 'Podcast', 'Journalism',
];

export default function StudentsPage() {
  const { t } = useI18n();
  const [students,       setStudents]       = useState<User[]>([]);
  const [total,          setTotal]          = useState(0);
  const [pages,          setPages]          = useState(1);
  const [page,           setPage]           = useState(1);
  const [query,          setQuery]          = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading,        setLoading]        = useState(true);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (query)                 params.set('q',      query);
      if (selectedSkills.length) params.set('skills', selectedSkills.join(','));
      const res  = await fetch(`/api/search?type=students&${params}`);
      const json = await res.json();
      setStudents(json.data?.students?.items ?? []);
      setTotal(json.data?.students?.total ?? 0);
      setPages(Math.ceil((json.data?.students?.total ?? 0) / 12));
    } finally {
      setLoading(false);
    }
  }, [page, query, selectedSkills]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content-primary tracking-tight">{t('students.title')}</h1>
        <p className="text-content-subtle text-sm mt-1">
          {total > 0
            ? t('students.countLabel', { total: String(total) })
            : t('students.discoverLabel')}
        </p>
      </div>

      <SearchBar navigate={false} placeholder={t('students.searchPh')}
        onSearch={(q) => { setQuery(q); setPage(1); }} defaultValue={query} size="lg" className="mb-5" />

      {/* Skill filters */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-content-subtle uppercase tracking-widest mb-2.5">
          {t('students.filterBy')}
        </p>
        <div className="flex flex-wrap gap-2">
          {SKILL_SUGGESTIONS.map((skill) => {
            const active = selectedSkills.includes(skill);
            return (
              <button key={skill} onClick={() => toggleSkill(skill)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-primary-500/15 border border-primary-500/30 text-primary-400'
                    : 'bg-bg-surface border border-border text-content-muted hover:border-primary-500/30 hover:text-primary-400'
                }`}>
                {active ? <X size={10} /> : <Plus size={10} />}
                {skill}
              </button>
            );
          })}
        </div>
        {selectedSkills.length > 0 && (
          <button onClick={() => setSelectedSkills([])}
            className="mt-2 text-xs text-content-subtle hover:text-content-muted transition-colors">
            {t('students.clearFilters')}
          </button>
        )}
      </div>

      {loading ? (
        <SkeletonGrid count={12} />
      ) : students.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-content-muted font-medium text-base">{t('students.noResults')}</p>
          <p className="text-content-subtle text-sm mt-1">{t('students.noResultsSub')}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {students.map((s) => <StudentCard key={s._id} student={s} />)}
          </div>
          {pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button variant="outline" size="sm" icon={<ChevronLeft size={14} />}
                disabled={page === 1} onClick={() => setPage(page - 1)}>{t('common.prev')}</Button>
              <span className="text-sm text-content-subtle px-3">
                {t('common.page', { page: String(page), pages: String(pages) })}
              </span>
              <Button variant="outline" size="sm" iconRight={<ChevronRight size={14} />}
                disabled={page === pages} onClick={() => setPage(page + 1)}>{t('common.next')}</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
