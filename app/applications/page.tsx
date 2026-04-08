'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { ApplicationCard } from '@/components/opportunity/ApplicationCard';
import { PageLoader } from '@/components/ui/Loading';
import type { Application, ApplicationStatus } from '@/types';
import { cn } from '@/lib/utils';

const TAB_VALUES: (ApplicationStatus | 'all')[] = ['all', 'pending', 'accepted', 'rejected'];

export default function ApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useI18n();
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
    setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
  };

  if (authLoading || !user) return <PageLoader />;

  const filtered = tab === 'all' ? applications : applications.filter((a) => a.status === tab);
  const counts = TAB_VALUES.reduce((acc, v) => {
    acc[v] = v === 'all' ? applications.length : applications.filter((a) => a.status === v).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-content-primary tracking-tight mb-1">
        {user.role === 'student' ? t('applications.titleStudent') : t('applications.titleCompany')}
      </h1>
      <p className="text-content-subtle text-sm mb-6">
        {applications.length === 1
          ? t('applications.total',  { count: '1' })
          : t('applications.totalP', { count: String(applications.length) })}
      </p>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-bg-surface border border-border rounded-xl w-fit mb-6">
        {TAB_VALUES.map((v) => (
          <button key={v} onClick={() => setTab(v)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              tab === v
                ? 'bg-bg-card text-content-primary shadow-sm border border-border'
                : 'text-content-subtle hover:text-content-muted'
            )}>
            {t(`applications.tabs.${v}`)}
            {counts[v] > 0 && (
              <span className={cn('ml-1.5 px-1.5 py-0.5 rounded-full text-xs',
                tab === v ? 'bg-primary-500/15 text-primary-400' : 'bg-bg-hover text-content-subtle')}>
                {counts[v]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-content-subtle text-sm">{t('common.loading')}</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-content-muted font-medium">
            {t('applications.noApps', { status: tab === 'all' ? '' : t(`applications.tabs.${tab}`).toLowerCase() })}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <ApplicationCard key={app._id} application={app} viewAs={user.role} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
