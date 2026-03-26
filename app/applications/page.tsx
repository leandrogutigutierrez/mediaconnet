'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ApplicationCard } from '@/components/opportunity/ApplicationCard';
import { PageLoader } from '@/components/ui/Loading';
import type { Application, ApplicationStatus } from '@/types';
import { cn } from '@/lib/utils';

const TABS: { label: string; value: ApplicationStatus | 'all' }[] = [
  { label: 'All',      value: 'all'      },
  { label: 'Pending',  value: 'pending'  },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
];

export default function ApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [tab,          setTab]          = useState<ApplicationStatus | 'all'>('all');
  const [loading,      setLoading]      = useState(true);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const res  = await fetch('/api/applications');
    const json = await res.json();
    setApplications(json.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleStatusChange = (id: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status } : a))
    );
  };

  if (authLoading || !user) return <PageLoader />;

  const filtered = tab === 'all'
    ? applications
    : applications.filter((a) => a.status === tab);

  const counts = TABS.reduce((acc, t) => {
    acc[t.value] = t.value === 'all'
      ? applications.length
      : applications.filter((a) => a.status === t.value).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        {user.role === 'student' ? 'My Applications' : 'Received Applications'}
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        {applications.length} total application{applications.length !== 1 ? 's' : ''}
      </p>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-6">
        {TABS.map((t) => (
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
            {counts[t.value] > 0 && (
              <span className={cn(
                'ml-1.5 px-1.5 py-0.5 rounded-full text-xs',
                tab === t.value ? 'bg-primary-100 text-primary-600' : 'bg-slate-200 text-slate-500'
              )}>
                {counts[t.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500">No {tab === 'all' ? '' : tab} applications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              viewAs={user.role}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
