import React from 'react';
import { OpportunityForm } from '@/components/forms/OpportunityForm';

export const metadata = { title: 'Post Opportunity — MediaConnet' };

export default function NewOpportunityPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Post an Opportunity</h1>
        <p className="text-slate-500 text-sm mt-1">
          Reach talented Transmedia Production students for your project.
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
        <OpportunityForm />
      </div>
    </div>
  );
}
