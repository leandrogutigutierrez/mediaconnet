'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, FileText, MessageSquare, Users, PlusCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';
import { ApplicationCard } from '@/components/opportunity/ApplicationCard';
import { PageLoader } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import type { Opportunity, Application } from '@/types';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications,  setApplications]  = useState<Application[]>([]);
  const [stats, setStats] = useState({ opps: 0, apps: 0, messages: 0, students: 0 });
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
        setStats({
          opps:     oppsJson.data?.total ?? 0,
          apps:     (appsJson.data ?? []).length,
          messages: 0,
          students: 0,
        });
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
      <div className="mb-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-white/80 text-sm mt-1">
          {isStudent
            ? 'Browse opportunities and build your portfolio'
            : 'Manage your postings and find the right talent'}
        </p>
        <div className="mt-4">
          {isStudent ? (
            <Link href="/opportunities">
              <Button variant="secondary" size="sm" iconRight={<ArrowRight size={14} />}>
                Browse opportunities
              </Button>
            </Link>
          ) : (
            <Link href="/opportunities/new">
              <Button variant="secondary" size="sm" icon={<PlusCircle size={14} />}>
                Post opportunity
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isStudent ? (
          <>
            <StatsCard title="Available"    value={stats.opps} icon={<Briefcase size={20} />} color="blue"   />
            <StatsCard title="Applied"      value={stats.apps} icon={<FileText  size={20} />} color="purple" />
            <StatsCard title="Messages"     value={0}          icon={<MessageSquare size={20} />} color="green"  />
            <StatsCard title="Portfolio"    value={user.portfolio?.length ?? 0} icon={<Users size={20} />} color="amber"  />
          </>
        ) : (
          <>
            <StatsCard title="My Postings"  value={stats.apps}   icon={<Briefcase size={20} />} color="blue"   />
            <StatsCard title="Applicants"   value={stats.apps}   icon={<Users     size={20} />} color="purple" />
            <StatsCard title="Messages"     value={0}            icon={<MessageSquare size={20} />} color="green"  />
            <StatsCard title="Open Opps"    value={stats.opps}   icon={<FileText  size={20} />} color="amber"  />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {isStudent ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Latest opportunities</h2>
                <Link href="/opportunities" className="text-sm text-primary-600 hover:underline">
                  View all
                </Link>
              </div>
              {dataLoading ? (
                <p className="text-sm text-slate-500">Loading…</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {opportunities.map((opp) => (
                    <OpportunityCard key={opp._id} opportunity={opp} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent applicants</h2>
                <Link href="/applications" className="text-sm text-primary-600 hover:underline">
                  View all
                </Link>
              </div>
              {dataLoading ? (
                <p className="text-sm text-slate-500">Loading…</p>
              ) : applications.length === 0 ? (
                <p className="text-sm text-slate-500">No applications yet.</p>
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
        <div className="space-y-6">
          {/* Profile completeness */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Profile completeness</h3>
            {(() => {
              const fields = isStudent
                ? [user.bio, user.career, user.location, user.skills?.length, user.avatar, user.portfolio?.length]
                : [user.description, user.companyName, user.location, user.website, user.avatar];
              const filled = fields.filter(Boolean).length;
              const pct    = Math.round((filled / fields.length) * 100);
              return (
                <>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-slate-500">{filled}/{fields.length} completed</span>
                    <span className="font-semibold text-primary-600">{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {pct < 100 && (
                    <Link href="/profile/edit" className="mt-3 inline-flex text-xs text-primary-600 hover:underline">
                      Complete your profile →
                    </Link>
                  )}
                </>
              );
            })()}
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Quick links</h3>
            <ul className="space-y-2">
              {(isStudent
                ? [
                    { href: '/profile/edit',   label: 'Edit profile'           },
                    { href: '/opportunities',   label: 'Browse opportunities'   },
                    { href: '/applications',    label: 'My applications'        },
                    { href: '/messages',        label: 'Messages'               },
                    { href: `/profile/${user._id}`, label: 'View public profile' },
                  ]
                : [
                    { href: '/opportunities/new', label: 'Post opportunity'  },
                    { href: '/applications',      label: 'View applicants'   },
                    { href: '/students',          label: 'Find talent'       },
                    { href: '/messages',          label: 'Messages'          },
                    { href: '/profile/edit',      label: 'Edit company info' },
                  ]
              ).map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex items-center justify-between text-sm text-slate-700 hover:text-primary-600 hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-colors"
                  >
                    {l.label}
                    <ArrowRight size={13} className="text-slate-400" />
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
