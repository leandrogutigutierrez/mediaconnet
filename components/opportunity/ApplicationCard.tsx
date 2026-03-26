'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, X, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import type { Application } from '@/types';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ApplicationCardProps {
  application: Application;
  viewAs:      'student' | 'company';
  onStatusChange?: (id: string, status: 'accepted' | 'rejected') => void;
}

export function ApplicationCard({ application, viewAs, onStatusChange }: ApplicationCardProps) {
  const [expanded,  setExpanded]  = useState(false);
  const [updating,  setUpdating]  = useState(false);

  const handleStatus = async (status: 'accepted' | 'rejected') => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/applications/${application._id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
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
        {/* Avatar — show student to company, show opportunity info to student */}
        {viewAs === 'company' && person ? (
          <Link href={`/profile/${person._id}`}>
            <Avatar src={person.avatar} name={person.name} size="md" />
          </Link>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
            {(opp?.title ?? 'O')[0].toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {viewAs === 'company' && person ? (
            <>
              <Link href={`/profile/${person._id}`} className="font-semibold text-slate-900 hover:text-primary-600">
                {person.name}
              </Link>
              <p className="text-sm text-slate-500">{person.career}</p>
            </>
          ) : (
            <>
              <Link href={`/opportunities/${opp?._id}`} className="font-semibold text-slate-900 hover:text-primary-600 line-clamp-1">
                {opp?.title}
              </Link>
              <p className="text-sm text-slate-500">
                {(opp?.company as unknown as { companyName?: string; name: string })?.companyName
                  ?? (opp?.company as unknown as { name: string })?.name}
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={application.status} />
          <span className="text-xs text-slate-400">{timeAgo(application.createdAt)}</span>
        </div>
      </div>

      {/* Cover letter expandable */}
      {application.coverLetter && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            Cover letter
          </button>
          {expanded && (
            <p className="mt-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
              {application.coverLetter}
            </p>
          )}
        </div>
      )}

      {/* Company actions */}
      {viewAs === 'company' && application.status === 'pending' && (
        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            icon={<Check size={13} />}
            loading={updating}
            onClick={() => handleStatus('accepted')}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={<X size={13} />}
            loading={updating}
            onClick={() => handleStatus('rejected')}
          >
            Reject
          </Button>
          {person && (
            <Link href={`/messages?to=${person._id}`}>
              <Button size="sm" variant="outline" icon={<MessageSquare size={13} />}>
                Message
              </Button>
            </Link>
          )}
        </div>
      )}
    </Card>
  );
}
