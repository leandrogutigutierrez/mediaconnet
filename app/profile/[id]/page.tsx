'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin, Globe, Linkedin, Instagram, Briefcase,
  Edit, MessageSquare, Star,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { Modal } from '@/components/ui/Modal';
import { PortfolioItemCard } from '@/components/student/PortfolioItem';
import { PageLoader } from '@/components/ui/Loading';
import type { User, PortfolioItem, Rating } from '@/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { id }                 = useParams<{ id: string }>();
  const { user: me }           = useAuth();
  const router                 = useRouter();
  const [profile, setProfile]  = useState<User | null>(null);
  const [ratings, setRatings]  = useState<{ ratings: Rating[]; average: number; count: number } | null>(null);
  const [loading, setLoading]  = useState(true);
  const [rateModal, setRateModal] = useState(false);
  const [rateScore, setRateScore] = useState(5);
  const [rateComment, setRateComment] = useState('');
  const [rating, setRating]    = useState(false);

  const isOwn = me?._id === id;

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${id}`).then((r) => r.json()),
      fetch(`/api/ratings?userId=${id}`).then((r) => r.json()),
    ]).then(([uJson, rJson]) => {
      setProfile(uJson.data);
      setRatings(rJson.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleRate = async () => {
    setRating(true);
    try {
      const res = await fetch('/api/ratings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ revieweeId: id, score: rateScore, comment: rateComment }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Rating submitted!');
      setRateModal(false);
      const rJson = await fetch(`/api/ratings?userId=${id}`).then((r) => r.json());
      setRatings(rJson.data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to rate');
    } finally {
      setRating(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!profile) return <div className="p-8 text-center text-slate-500">User not found.</div>;

  const isStudent = profile.role === 'student';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden mb-6">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-primary-600 to-purple-600" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <Avatar
              src={profile.avatar}
              name={profile.name}
              size="xl"
              className="ring-4 ring-white"
            />
            <div className="flex gap-2 mb-1">
              {isOwn ? (
                <Button size="sm" variant="outline" icon={<Edit size={14} />} onClick={() => router.push('/profile/edit')}>
                  Edit profile
                </Button>
              ) : (
                <>
                  {me && (
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<MessageSquare size={14} />}
                      onClick={() => router.push(`/messages?to=${profile._id}`)}
                    >
                      Message
                    </Button>
                  )}
                  {me && me._id !== id && (
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<Star size={14} />}
                      onClick={() => setRateModal(true)}
                    >
                      Rate
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
              <Badge variant={isStudent ? 'primary' : 'purple'}>{profile.role}</Badge>
            </div>

            {isStudent ? (
              <p className="text-slate-600 flex items-center gap-1.5 text-sm">
                <Briefcase size={13} /> {profile.career}
              </p>
            ) : (
              <p className="text-slate-600 font-medium">{profile.companyName}</p>
            )}

            {profile.location && (
              <p className="text-slate-400 text-sm flex items-center gap-1.5">
                <MapPin size={13} /> {profile.location}
              </p>
            )}

            {ratings && ratings.count > 0 && (
              <div className="flex items-center gap-2">
                <RatingStars value={Math.round(ratings.average)} size="sm" />
                <span className="text-sm text-slate-500">
                  {ratings.average.toFixed(1)} ({ratings.count} review{ratings.count !== 1 ? 's' : ''})
                </span>
              </div>
            )}
          </div>

          {/* Bio / description */}
          {(isStudent ? profile.bio : profile.description) && (
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              {isStudent ? profile.bio : profile.description}
            </p>
          )}

          {/* Skills */}
          {isStudent && profile.skills && profile.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <Badge key={s} variant="primary">{s}</Badge>
              ))}
            </div>
          )}

          {/* Social / links */}
          <div className="mt-4 flex flex-wrap gap-3">
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors">
                <Globe size={14} /> {new URL(profile.website).hostname}
              </a>
            )}
            {profile.socialLinks?.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors">
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
            {profile.socialLinks?.instagram && (
              <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors">
                <Instagram size={14} /> Instagram
              </a>
            )}
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Member since {formatDate(profile.createdAt)}
          </p>
        </div>
      </div>

      {/* Portfolio */}
      {isStudent && profile.portfolio && profile.portfolio.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Portfolio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(profile.portfolio as unknown as PortfolioItem[]).map((item) => (
              <PortfolioItemCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {ratings && ratings.ratings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            Reviews ({ratings.count})
          </h2>
          <div className="space-y-4">
            {ratings.ratings.map((r) => (
              <div key={r._id} className="flex gap-3">
                <Avatar src={(r.reviewer as unknown as User).avatar} name={(r.reviewer as unknown as User).name} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{(r.reviewer as unknown as User).name}</p>
                    <RatingStars value={r.score} size="sm" />
                  </div>
                  {r.comment && <p className="text-sm text-slate-600 mt-1">{r.comment}</p>}
                  <p className="text-xs text-slate-400 mt-1">{formatDate(r.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rate modal */}
      <Modal open={rateModal} onClose={() => setRateModal(false)} title={`Rate ${profile.name}`}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Score</label>
            <RatingStars value={rateScore} interactive onChange={setRateScore} size="lg" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Comment (optional)</label>
            <textarea
              rows={3}
              value={rateComment}
              onChange={(e) => setRateComment(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Share your experience…"
            />
          </div>
          <div className="flex gap-3">
            <Button loading={rating} onClick={handleRate}>Submit rating</Button>
            <Button variant="outline" onClick={() => setRateModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
