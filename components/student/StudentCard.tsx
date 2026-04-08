import React from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, FolderOpen } from 'lucide-react';
import type { User } from '@/types';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { truncate } from '@/lib/utils';

interface StudentCardProps {
  student: User;
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <Link href={`/profile/${student._id}`}>
      <Card hover className="h-full flex flex-col group">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Avatar src={student.avatar} name={student.name} size="md" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-content-primary truncate group-hover:text-primary-400 transition-colors">
              {student.name}
            </h3>
            {student.career && (
              <p className="text-sm text-content-muted flex items-center gap-1 truncate mt-0.5">
                <Briefcase size={12} className="text-content-subtle shrink-0" />
                {student.career}
              </p>
            )}
            {student.location && (
              <p className="text-xs text-content-subtle flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="shrink-0" />
                {student.location}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {student.bio && (
          <p className="mt-3 text-sm text-content-muted leading-relaxed flex-1">
            {truncate(student.bio, 120)}
          </p>
        )}

        {/* Skills */}
        {student.skills && student.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {student.skills.slice(0, 5).map((skill) => (
              <Badge key={skill} variant="primary">{skill}</Badge>
            ))}
            {student.skills.length > 5 && (
              <Badge variant="default">+{student.skills.length - 5}</Badge>
            )}
          </div>
        )}

        {/* Portfolio indicator */}
        {student.portfolio && student.portfolio.length > 0 && (
          <p className="mt-3 flex items-center gap-1 text-xs text-content-subtle">
            <FolderOpen size={12} />
            {student.portfolio.length} portfolio item{student.portfolio.length !== 1 ? 's' : ''}
          </p>
        )}
      </Card>
    </Link>
  );
}
