'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { StudentCard } from '@/components/student/StudentCard';
import { SkeletonGrid } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import type { User } from '@/types';
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';

const SKILL_SUGGESTIONS = [
  'Premiere Pro', 'After Effects', 'Photoshop', 'DaVinci Resolve',
  'Video Production', 'Photography', 'Social Media', 'Copywriting',
  'Animation', 'Motion Graphics', 'Podcast', 'Journalism',
];

export default function StudentsPage() {
  const [students,      setStudents]      = useState<User[]>([]);
  const [total,         setTotal]         = useState(0);
  const [pages,         setPages]         = useState(1);
  const [page,          setPage]          = useState(1);
  const [query,         setQuery]         = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading,       setLoading]       = useState(true);

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
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Find Talent</h1>
        <p className="text-slate-500 text-sm mt-1">
          {total > 0 ? `${total} students available` : 'Discover talented students'}
        </p>
      </div>

      {/* Search */}
      <SearchBar
        navigate={false}
        placeholder="Search by name, career, or skill…"
        onSearch={(q) => { setQuery(q); setPage(1); }}
        defaultValue={query}
        size="lg"
        className="mb-4"
      />

      {/* Skill filters */}
      <div className="mb-6">
        <p className="text-xs font-medium text-slate-500 mb-2">Filter by skill:</p>
        <div className="flex flex-wrap gap-2">
          {SKILL_SUGGESTIONS.map((skill) => {
            const active = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  active
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-600 hover:border-primary-400 hover:text-primary-600'
                }`}
              >
                {active ? <X size={10} /> : <Plus size={10} />}
                {skill}
              </button>
            );
          })}
        </div>
        {selectedSkills.length > 0 && (
          <button
            onClick={() => setSelectedSkills([])}
            className="mt-2 text-xs text-slate-400 hover:text-slate-600"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <SkeletonGrid count={12} />
      ) : students.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">No students found.</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {students.map((s) => <StudentCard key={s._id} student={s} />)}
          </div>
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="sm" icon={<ChevronLeft size={14} />}
                disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
              <span className="text-sm text-slate-500 px-4">Page {page} of {pages}</span>
              <Button variant="outline" size="sm" iconRight={<ChevronRight size={14} />}
                disabled={page === pages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
