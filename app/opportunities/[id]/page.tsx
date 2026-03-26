'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin, Clock, Users, Wifi, Calendar, DollarSign,
  Edit, Trash2, ArrowLeft, CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/Loading';
import type { Opportunity, Application } from '@/types';
import { timeAgo, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function OpportunityDetailPage() {
  const { id }    = useParams<{ id: string }>();
  const { user }  = useAuth();
  const router    = useRouter();

  const [opp,        setOpp]        = useState<Opportunity | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [applying,   setApplying]   = useState(false);
  const [applyModal, setApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [myApp,      setMyApp]      = useState<Application | null>(null);
  const [deleting,   setDeleting]   = useState(false);

  useEffect(() => {
    fetch(`/api/opportunities/${id}`)
      .then((r) => r.json())
      .then((j) => setOpp(j.data))
      .finally(() => setLoading(false));

    // Check if current user already applied
    if (user?.role === 'student') {
      fetch('/api/applications')
        .then((r) => r.json())
        .then((j) => {
          const existing = (j.data ?? []).find(
            (a: Application) => (a.opportunity as unknown as { _id: string })._id === id
            || (a.opportunity as unknown as string) === id
          );
          setMyApp(existing ?? null);
        });
    }
  }, [id, user]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await fetch(`/api/opportunities/${id}/apply`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ coverLetter }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success('Application submitted!');
      setMyApp(json.data);
      setApplyModal(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this opportunity?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/opportunities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Opportunity deleted');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
      setDeleting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!opp)   return <div className="p-8 text-center text-slate-500">Opportunity not found.</div>;

  const company   = opp.company;
  const isOwner   = user?._id === (company as unknown as { _id: string })?._id;
  const isStudent = user?.role === 'student';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3">
                <Avatar
                  src={company?.avatar}
                  name={company?.companyName ?? company?.name ?? '?'}
                  size="md"
                />
                <div>
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">{opp.title}</h1>
                  <p className="text-sm text-slate-500">{company?.companyName ?? company?.name}</p>
                </div>
              </div>
              {isOwner && (
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" icon={<Edit size={13} />}
                    onClick={() => router.push(`/opportunities/${id}/edit`)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" icon={<Trash2 size={13} />}
                    loading={deleting} onClick={handleDelete}>
                    Delete
                  </Button>
                </div>
              )}
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <Badge variant="primary">{opp.category}</Badge>
              <Badge variant="default" className="flex items-center gap-1">
                <Wifi size={11} /> {opp.modality}
              </Badge>
              {opp.location && (
                <Badge variant="default" className="flex items-center gap-1">
                  <MapPin size={11} /> {opp.location}
                </Badge>
              )}
              {opp.compensation && (
                <Badge variant="success" className="flex items-center gap-1">
                  <DollarSign size={11} /> {opp.compensation}
                </Badge>
              )}
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock size={11} /> Posted {timeAgo(opp.createdAt)}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Users size={11} /> {opp.applicantCount} applicant{opp.applicantCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Description */}
            <h2 className="font-semibold text-slate-900 mb-2">Description</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{opp.description}</p>

            {/* Requirements */}
            {opp.requirements.length > 0 && (
              <div className="mt-5">
                <h2 className="font-semibold text-slate-900 mb-2">Requirements</h2>
                <ul className="space-y-1">
                  {opp.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {opp.skills.length > 0 && (
              <div className="mt-5">
                <h2 className="font-semibold text-slate-900 mb-2">Skills needed</h2>
                <div className="flex flex-wrap gap-2">
                  {opp.skills.map((s) => <Badge key={s} variant="primary">{s}</Badge>)}
                </div>
              </div>
            )}

            {/* Deadline */}
            {opp.deadline && (
              <div className="mt-5 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                <Calendar size={14} />
                Application deadline: <strong>{formatDate(opp.deadline)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Apply CTA */}
          {isStudent && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
              {myApp ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 mb-2">Your application</p>
                  <StatusBadge status={myApp.status} />
                  <p className="text-xs text-slate-400 mt-2">{timeAgo(myApp.createdAt)}</p>
                </div>
              ) : (
                <>
                  <Button className="w-full mb-2" onClick={() => setApplyModal(true)}>
                    Apply now
                  </Button>
                  <p className="text-xs text-slate-400 text-center">
                    {opp.applicantCount} student{opp.applicantCount !== 1 ? 's' : ''} applied
                  </p>
                </>
              )}
            </div>
          )}

          {/* Company info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
            <h3 className="font-semibold text-slate-900 mb-3">About the company</h3>
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={company?.avatar} name={company?.companyName ?? company?.name ?? '?'} size="md" />
              <div>
                <p className="font-medium text-slate-900 text-sm">{company?.companyName ?? company?.name}</p>
                {company?.industry && <p className="text-xs text-slate-500">{company.industry}</p>}
              </div>
            </div>
            {company?.description && (
              <p className="text-xs text-slate-600 leading-relaxed">{company.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Apply modal */}
      <Modal open={applyModal} onClose={() => setApplyModal(false)} title="Apply to this opportunity">
        <div className="space-y-4">
          <Textarea
            label="Cover letter (optional)"
            placeholder="Tell the company why you're a great fit for this project…"
            rows={5}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <div className="flex gap-3">
            <Button loading={applying} onClick={handleApply}>Submit application</Button>
            <Button variant="outline" onClick={() => setApplyModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
