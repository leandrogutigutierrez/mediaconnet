'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, FileText, MessageSquare, Users, PlusCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';
import { ApplicationCard } from '@/components/opportunity/ApplicationCard';
import { PageLoader } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import type { Opportunity, Application } from '@/types';

export default function DashboardPage() {
  const { user, loading }  = useAuth();
  const { t }              = useI18n();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications,  setApplications]  = useState<Application[]>([]);
  const [stats, setStats] = useState({ opps: 0, apps: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      try {
        const [oppsRes, appsRes] = await Promise.all([
          fetch('/api/opportunities?limit=3'),
          fetch('/api/applications'),
        ]);
        const oppsJson = await oppsRes.json();
        const appsJson = await appsRes.json();
        setOpportunities(oppsJson.data?.items ?? []);
        setApplications(appsJson.data ?? []);
        setStats({ opps: oppsJson.data?.total ?? 0, apps: (appsJson.data ?? []).length });
      } finally {
        setDataLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading || !user) return <PageLoader />;
  const isStudent = user.role === 'student';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome banner */}
      <div className="mb-8 rounded-2xl overflow-hidden relative bg-gradient-usc p-6 text-white">
        <div className="absolute inset-0 bg-wave-blue pointer-events-none" />
        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-widest text-white/60 uppercase mb-1">
            {t('dashboard.usc')}
          </p>
          <h1 className="text-2xl font-bold text-white">
            {t('dashboard.welcome', { name: user.name.split(' ')[0] })}
          </h1>
          <p className="text-white/70 text-sm mt-1">
            {isStudent ? t('dashboard.subtitleStudent') : t('dashboard.subtitleCompany')}
          </p>
          <div className="mt-4">
            {isStudent ? (
              <Link href="/opportunities">
                <Button variant="secondary" size="sm" iconRight={<ArrowRight size={14} />}>
                  {t('dashboard.browseBtn')}
                </Button>
              </Link>
            ) : (
              <Link href="/opportunities/new">
                <Button variant="secondary" size="sm" icon={<PlusCircle size={14} />}>
                  {t('dashboard.postBtn')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isStudent ? (
          <>
            <StatsCard title={t('dashboard.stats.available')}  value={stats.opps} icon={<Briefcase    size={20} />} color="blue"   />
            <StatsCard title={t('dashboard.stats.applied')}    value={stats.apps} icon={<FileText     size={20} />} color="purple" />
            <StatsCard title={t('dashboard.stats.messages')}   value={0}          icon={<MessageSquare size={20} />} color="green" />
            <StatsCard title={t('dashboard.stats.portfolio')}  value={user.portfolio?.length ?? 0} icon={<Users size={20} />} color="amber" />
          </>
        ) : (
          <>
            <StatsCard title={t('dashboard.stats.myPostings')} value={stats.apps} icon={<Briefcase    size={20} />} color="blue"   />
            <StatsCard title={t('dashboard.stats.applicants')} value={stats.apps} icon={<Users        size={20} />} color="purple" />
            <StatsCard title={t('dashboard.stats.messages')}   value={0}          icon={<MessageSquare size={20} />} color="green" />
            <StatsCard title={t('dashboard.stats.openOpps')}   value={stats.opps} icon={<FileText     size={20} />} color="amber"  />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {isStudent ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-content-primary">{t('dashboard.latestOpps')}</h2>
                <Link href="/opportunities" className="text-sm text-primary-500 hover:text-primary-400 transition-colors">
                  {t('common.viewAll')}
                </Link>
              </div>
              {dataLoading ? (
                <p className="text-sm text-content-subtle">{t('common.loading')}</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {opportunities.map((opp) => <OpportunityCard key={opp._id} opportunity={opp} />)}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-content-primary">{t('dashboard.recentApps')}</h2>
                <Link href="/applications" className="text-sm text-primary-500 hover:text-primary-400 transition-colors">
                  {t('common.viewAll')}
                </Link>
              </div>
              {dataLoading ? (
                <p className="text-sm text-content-subtle">{t('common.loading')}</p>
              ) : applications.length === 0 ? (
                <p className="text-sm text-content-subtle">{t('dashboard.noApps')}</p>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <ApplicationCard key={app._id} application={app} viewAs="company" />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Profile completeness */}
          <div className="bg-bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-content-primary mb-4">{t('dashboard.profile')}</h3>
            {(() => {
              const fields = isStudent
                ? [user.bio, user.career, user.location, user.skills?.length, user.avatar, user.portfolio?.length]
                : [user.description, user.companyName, user.location, user.website, user.avatar];
              const filled = fields.filter(Boolean).length;
              const pct    = Math.round((filled / fields.length) * 100);
              return (
                <>
                  <div className="flex items-center justify-between mb-2.5 text-sm">
                    <span className="text-content-subtle">
                      {t('dashboard.completed', { filled: String(filled), total: String(fields.length) })}
                    </span>
                    <span className="font-semibold text-primary-500">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  {pct < 100 && (
                    <Link href="/profile/edit" className="mt-3 inline-flex text-xs text-primary-500 hover:text-primary-400 transition-colors">
                      {t('dashboard.completeLink')}
                    </Link>
                  )}
                </>
              );
            })()}
          </div>

          {/* Quick links */}
          <div className="bg-bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-content-primary mb-3">{t('dashboard.quickLinks')}</h3>
            <ul className="space-y-0.5">
              {(isStudent
                ? [
                    { href: '/profile/edit',        key: 'editProfile'    },
                    { href: '/opportunities',        key: 'browseOpps'    },
                    { href: '/applications',         key: 'myApps'        },
                    { href: '/messages',             key: 'messages'      },
                    { href: `/profile/${user._id}`,  key: 'publicProfile' },
                  ]
                : [
                    { href: '/opportunities/new', key: 'postOpp'        },
                    { href: '/applications',      key: 'viewApplicants' },
                    { href: '/students',          key: 'findTalent'     },
                    { href: '/messages',          key: 'messages'       },
                    { href: '/profile/edit',      key: 'editCompany'    },
                  ]
              ).map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="flex items-center justify-between text-sm text-content-muted
                               hover:text-content-primary hover:bg-bg-hover px-2.5 py-2 rounded-lg transition-colors">
                    {t(`dashboard.links.${l.key}`)}
                    <ArrowRight size={12} className="text-content-subtle" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
