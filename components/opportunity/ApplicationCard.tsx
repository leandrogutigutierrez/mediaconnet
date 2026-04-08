'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, X, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import type { Application } from '@/types';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/contexts/I18nContext';
import { timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ApplicationCardProps {
  application: Application;
  viewAs:      'student' | 'company';
  onStatusChange?: (id: string, status: 'accepted' | 'rejected') => void;
}

export function ApplicationCard({ application, viewAs, onStatusChange }: ApplicationCardProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (status: 'accepted' | 'rejected') => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/applications/${application._id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(`Application ${status}`);
      onStatusChange?.(application._id, status);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const person = viewAs === 'company' ? application.student : null;
  const opp    = application.opportunity;

  return (
    <Card>
      <div className="flex items-start gap-3">
        {viewAs === 'company' && person ? (
          <Link href={`/profile/${person._id}`}>
            <Avatar src={person.avatar} name={person.name} size="md" />
          </Link>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-sm shrink-0">
            {(opp?.title ?? 'O')[0].toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {viewAs === 'company' && person ? (
            <>
              <Link href={`/profile/${person._id}`} className="font-semibold text-content-primary hover:text-primary-400 transition-colors">
                {person.name}
              </Link>
              <p className="text-sm text-content-muted">{person.career}</p>
            </>
          ) : (
            <>
              <Link href={`/opportunities/${opp?._id}`} className="font-semibold text-content-primary hover:text-primary-400 transition-colors line-clamp-1">
                {opp?.title}
              </Link>
              <p className="text-sm text-content-muted">
                {(opp?.company as unknown as { companyName?: string; name: string })?.companyName
                  ?? (opp?.company as unknown as { name: string })?.name}
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={application.status} />
          <span className="text-xs text-content-subtle">{timeAgo(application.createdAt)}</span>
        </div>
      </div>

      {application.coverLetter && (
        <div className="mt-3">
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-content-subtle hover:text-content-muted transition-colors">
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {t('applications.coverLetter')}
          </button>
          {expanded && (
            <p className="mt-2 text-sm text-content-muted bg-bg-surface border border-border rounded-lg px-3 py-2.5 leading-relaxed">
              {application.coverLetter}
            </p>
          )}
        </div>
      )}

      {viewAs === 'company' && application.status === 'pending' && (
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" variant="primary" icon={<Check size={13} />} loading={updating} onClick={() => handleStatus('accepted')}>
            {t('common.accept')}
          </Button>
          <Button size="sm" variant="danger" icon={<X size={13} />} loading={updating} onClick={() => handleStatus('rejected')}>
            {t('common.reject')}
          </Button>
          {person && (
            <Link href={`/messages?to=${person._id}`}>
              <Button size="sm" variant="outline" icon={<MessageSquare size={13} />}>
                {t('common.message')}
              </Button>
            </Link>
          )}
        </div>
      )}
    </Card>
  );
}
