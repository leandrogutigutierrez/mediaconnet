'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import type { Opportunity } from '@/types';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'video',        label: 'Video Production'  },
  { value: 'photography',  label: 'Photography'       },
  { value: 'social-media', label: 'Social Media'      },
  { value: 'branding',     label: 'Branding & Design' },
  { value: 'animation',    label: 'Animation'         },
  { value: 'journalism',   label: 'Journalism'        },
  { value: 'podcast',      label: 'Podcast'           },
  { value: 'documentary',  label: 'Documentary'       },
  { value: 'advertising',  label: 'Advertising'       },
  { value: 'other',        label: 'Other'             },
];

const MODALITIES = [
  { value: 'remote',   label: 'Remote'  },
  { value: 'on-site',  label: 'On-site' },
  { value: 'hybrid',   label: 'Hybrid'  },
];

const schema = z.object({
  title:        z.string().min(5, 'Title must be at least 5 characters'),
  description:  z.string().min(20, 'Description must be at least 20 characters'),
  category:     z.string().min(1, 'Select a category'),
  location:     z.string().optional(),
  modality:     z.string().min(1),
  compensation: z.string().optional(),
  deadline:     z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface OpportunityFormProps {
  existing?: Opportunity; // if provided, switches to edit mode
}

export function OpportunityForm({ existing }: OpportunityFormProps) {
  const router = useRouter();
  const [requirements, setRequirements] = useState<string[]>(existing?.requirements ?? []);
  const [skills,        setSkills]       = useState<string[]>(existing?.skills       ?? []);
  const [reqInput,      setReqInput]     = useState('');
  const [skillInput,    setSkillInput]   = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:        existing?.title        ?? '',
      description:  existing?.description  ?? '',
      category:     existing?.category     ?? '',
      location:     existing?.location     ?? '',
      modality:     existing?.modality     ?? 'remote',
      compensation: existing?.compensation ?? '',
      deadline:     existing?.deadline
        ? new Date(existing.deadline).toISOString().split('T')[0]
        : '',
    },
  });

  const addTag = (list: string[], setList: (v: string[]) => void, input: string) => {
    const v = input.trim();
    if (v && !list.includes(v)) setList([...list, v]);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const url    = existing ? `/api/opportunities/${existing._id}` : '/api/opportunities';
      const method = existing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...data, requirements, skills }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to save');

      toast.success(existing ? 'Opportunity updated!' : 'Opportunity posted!');
      router.push(`/opportunities/${json.data._id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving opportunity');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Title"
        placeholder="e.g. Video Editor for Brand Campaign"
        error={errors.title?.message}
        required
        {...register('title')}
      />

      <Textarea
        label="Description"
        placeholder="Describe the project, responsibilities, and what you're looking for…"
        rows={5}
        error={errors.description?.message}
        required
        {...register('description')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Category"
          options={CATEGORIES}
          placeholder="Select category"
          error={errors.category?.message}
          {...register('category')}
        />
        <Select
          label="Modality"
          options={MODALITIES}
          {...register('modality')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Location"
          placeholder="City, Country (or Remote)"
          {...register('location')}
        />
        <Input
          label="Compensation"
          placeholder="e.g. Paid, Unpaid, Stipend…"
          {...register('compensation')}
        />
      </div>

      <Input
        label="Application deadline"
        type="date"
        {...register('deadline')}
      />

      {/* Requirements */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Requirements</label>
        <div className="flex gap-2">
          <input
            value={reqInput}
            onChange={(e) => setReqInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(requirements, setRequirements, reqInput); setReqInput(''); } }}
            placeholder="Add a requirement and press Enter"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button
            type="button" variant="secondary" size="sm" icon={<Plus size={14} />}
            onClick={() => { addTag(requirements, setRequirements, reqInput); setReqInput(''); }}
          >Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {requirements.map((r) => (
            <span key={r} className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
              {r}
              <button type="button" onClick={() => setRequirements(requirements.filter((x) => x !== r))}><X size={12} /></button>
            </span>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Skills needed</label>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(skills, setSkills, skillInput); setSkillInput(''); } }}
            placeholder="e.g. Premiere Pro, After Effects…"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button
            type="button" variant="secondary" size="sm" icon={<Plus size={14} />}
            onClick={() => { addTag(skills, setSkills, skillInput); setSkillInput(''); }}
          >Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
              {s}
              <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}><X size={12} /></button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {existing ? 'Update opportunity' : 'Post opportunity'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
