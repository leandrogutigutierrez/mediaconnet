import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, Users, Wifi } from 'lucide-react';
import type { Opportunity } from '@/types';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { timeAgo, formatDate, truncate } from '@/lib/utils';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const categoryColors: Record<string, 'primary' | 'purple' | 'teal' | 'warning' | 'default'> = {
  video:        'primary',
  photography:  'teal',
  'social-media': 'purple',
  branding:     'warning',
  animation:    'purple',
  journalism:   'teal',
  podcast:      'default',
  documentary:  'primary',
  advertising:  'warning',
  other:        'default',
};

const modalityIcons: Record<string, React.ReactNode> = {
  remote:   <Wifi    size={12} />,
  'on-site': <MapPin size={12} />,
  hybrid:   <MapPin  size={12} />,
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const company = opportunity.company;

  return (
    <Link href={`/opportunities/${opportunity._id}`}>
      <Card hover className="h-full flex flex-col">
        {/* Company header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar
            src={company?.avatar}
            name={company?.companyName ?? company?.name ?? '?'}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 truncate">
              {company?.companyName ?? company?.name}
            </p>
            <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2">
              {opportunity.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 flex-1 leading-relaxed">
          {truncate(opportunity.description, 100)}
        </p>

        {/* Skills */}
        {opportunity.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {opportunity.skills.slice(0, 4).map((s) => (
              <Badge key={s} variant="primary">{s}</Badge>
            ))}
            {opportunity.skills.length > 4 && (
              <Badge variant="default">+{opportunity.skills.length - 4}</Badge>
            )}
          </div>
        )}

        {/* Footer meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <Badge variant={categoryColors[opportunity.category] ?? 'default'}>
              {opportunity.category}
            </Badge>
            <span className="flex items-center gap-1">
              {modalityIcons[opportunity.modality]}
              {opportunity.modality}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {opportunity.applicantCount > 0 && (
              <span className="flex items-center gap-1">
                <Users size={11} />
                {opportunity.applicantCount}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {timeAgo(opportunity.createdAt)}
            </span>
          </div>
        </div>

        {/* Deadline warning */}
        {opportunity.deadline && (
          <p className="mt-1 text-xs text-amber-600">
            Deadline: {formatDate(opportunity.deadline)}
          </p>
        )}
      </Card>
    </Link>
  );
}
