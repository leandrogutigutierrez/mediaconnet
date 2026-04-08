'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { useI18n } from '@/contexts/I18nContext';
import type { Opportunity } from '@/types';
import toast from 'react-hot-toast';

const CATEGORY_VALUES = ['video','photography','social-media','branding','animation','journalism','podcast','documentary','advertising','other'] as const;
const MODALITY_VALUES = ['remote','on-site','hybrid'] as const;

const schema = z.object({
  title:        z.string().min(5),
  description:  z.string().min(20),
  category:     z.string().min(1),
  location:     z.string().optional(),
  modality:     z.string().min(1),
  compensation: z.string().optional(),
  deadline:     z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface OpportunityFormProps { existing?: Opportunity; }

export function OpportunityForm({ existing }: OpportunityFormProps) {
  const router = useRouter();
  const { t }  = useI18n();
  const [requirements, setRequirements] = useState<string[]>(existing?.requirements ?? []);
  const [skills,       setSkills]       = useState<string[]>(existing?.skills       ?? []);
  const [reqInput,     setReqInput]     = useState('');
  const [skillInput,   setSkillInput]   = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:        existing?.title        ?? '',
      description:  existing?.description  ?? '',
      category:     existing?.category     ?? '',
      location:     existing?.location     ?? '',
      modality:     existing?.modality     ?? 'remote',
      compensation: existing?.compensation ?? '',
      deadline:     existing?.deadline ? new Date(existing.deadline).toISOString().split('T')[0] : '',
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
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, requirements, skills }) });
      const json   = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed');
      toast.success(existing ? t('forms.opportunity.successEdit') : t('forms.opportunity.successNew'));
      router.push(`/opportunities/${json.data._id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t('forms.opportunity.errorMsg'));
    }
  };

  const CATEGORIES = CATEGORY_VALUES.map((v) => ({ value: v, label: t(`opportunities.categories.${v}`) }));
  const MODALITIES = MODALITY_VALUES.map((v) => ({ value: v, label: t(`opportunities.modalities.${v}`) }));

  const tagInputClass = `w-full rounded-xl border border-border bg-bg-surface px-3 py-2.5 text-sm
    text-content-primary placeholder:text-content-subtle
    focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input label={t('forms.opportunity.title')} placeholder={t('forms.opportunity.titlePh')} error={errors.title?.message} required {...register('title')} />
      <Textarea label={t('forms.opportunity.description')} placeholder={t('forms.opportunity.descPh')} rows={5} error={errors.description?.message} required {...register('description')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label={t('forms.opportunity.category')} options={CATEGORIES} placeholder={t('forms.opportunity.categoryPh')} error={errors.category?.message} {...register('category')} />
        <Select label={t('forms.opportunity.modality')} options={MODALITIES} {...register('modality')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label={t('forms.opportunity.location')} placeholder={t('forms.opportunity.locationPh')} {...register('location')} />
        <Input label={t('forms.opportunity.compensation')} placeholder={t('forms.opportunity.compensationPh')} {...register('compensation')} />
      </div>

      <Input label={t('forms.opportunity.deadline')} type="date" {...register('deadline')} />

      {/* Requirements */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-content-muted">{t('forms.opportunity.requirements')}</label>
        <div className="flex gap-2">
          <input value={reqInput} onChange={(e) => setReqInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(requirements, setRequirements, reqInput); setReqInput(''); } }}
            placeholder={t('forms.opportunity.requirementsPh')} className={tagInputClass} />
          <Button type="button" variant="secondary" size="sm" icon={<Plus size={14} />}
            onClick={() => { addTag(requirements, setRequirements, reqInput); setReqInput(''); }}>
            {t('common.add')}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {requirements.map((r) => (
            <span key={r} className="flex items-center gap-1.5 px-3 py-1 bg-bg-hover border border-border text-content-muted rounded-full text-xs font-medium">
              {r}
              <button type="button" className="hover:text-content-primary transition-colors" onClick={() => setRequirements(requirements.filter((x) => x !== r))}>
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-content-muted">{t('forms.opportunity.skills')}</label>
        <div className="flex gap-2">
          <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(skills, setSkills, skillInput); setSkillInput(''); } }}
            placeholder={t('forms.opportunity.skillsPh')} className={tagInputClass} />
          <Button type="button" variant="secondary" size="sm" icon={<Plus size={14} />}
            onClick={() => { addTag(skills, setSkills, skillInput); setSkillInput(''); }}>
            {t('common.add')}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
              {s}
              <button type="button" className="hover:text-primary-300 transition-colors" onClick={() => setSkills(skills.filter((x) => x !== s))}>
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isSubmitting}>
          {existing ? t('forms.opportunity.submitEdit') : t('forms.opportunity.submitNew')}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  );
}
