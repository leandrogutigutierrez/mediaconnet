'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { OpportunityForm } from '@/components/forms/OpportunityForm';
import { PageLoader } from '@/components/ui/Loading';
import type { Opportunity } from '@/types';

export default function EditOpportunityPage() {
  const { id } = useParams<{ id: string }>();
  const [opp,     setOpp]     = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/opportunities/${id}`)
      .then((r) => r.json())
      .then((j) => setOpp(j.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!opp)   return <div className="p-8 text-center text-slate-500">Opportunity not found.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Edit Opportunity</h1>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
        <OpportunityForm existing={opp} />
      </div>
    </div>
  );
}
