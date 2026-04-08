'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Globe, Linkedin, Instagram, X, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  name:        z.string().min(2),
  bio:         z.string().max(500).optional(),
  location:    z.string().optional(),
  career:      z.string().optional(),
  description: z.string().max(1000).optional(),
  companyName: z.string().optional(),
  industry:    z.string().optional(),
  website:     z.string().url().optional().or(z.literal('')),
  'socialLinks.linkedin':  z.string().optional(),
  'socialLinks.instagram': z.string().optional(),
  'socialLinks.behance':   z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ProfileForm() {
  const { user, refresh } = useAuth();
  const { t } = useI18n();
  const [skills, setSkills] = useState<string[]>(user?.skills ?? []);
  const [skillInput, setSkillInput] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:        user?.name        ?? '',
      bio:         user?.bio         ?? '',
      location:    user?.location    ?? '',
      career:      user?.career      ?? '',
      description: user?.description ?? '',
      companyName: user?.companyName ?? '',
      industry:    user?.industry    ?? '',
      website:     user?.website     ?? '',
      'socialLinks.linkedin':  user?.socialLinks?.linkedin  ?? '',
      'socialLinks.instagram': user?.socialLinks?.instagram ?? '',
      'socialLinks.behance':   user?.socialLinks?.behance   ?? '',
    },
  });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s) && skills.length < 20) { setSkills([...skills, s]); setSkillInput(''); }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    try {
      const body: Record<string, unknown> = {
        name: data.name, location: data.location,
        socialLinks: {
          linkedin:  data['socialLinks.linkedin'],
          instagram: data['socialLinks.instagram'],
          behance:   data['socialLinks.behance'],
        },
      };
      if (user.role === 'student') { body.bio = data.bio; body.career = data.career; body.skills = skills; }
      else { body.description = data.description; body.companyName = data.companyName; body.industry = data.industry; body.website = data.website; }

      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await refresh();
      toast.success(t('forms.profile.successMsg'));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t('forms.profile.errorMsg'));
    }
  };

  const tagInputClass = `w-full rounded-xl border border-border bg-bg-surface px-3 py-2.5 text-sm
    text-content-primary placeholder:text-content-subtle
    focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-content-subtle uppercase tracking-widest">
          {t('forms.profile.basicInfo')}
        </h2>
        <Input label={t('forms.profile.fullName')} required error={errors.name?.message} {...register('name')} />
        <Input label={t('forms.profile.location')} placeholder={t('forms.profile.locationPh')} icon={<MapPin size={15} />} {...register('location')} />
        {user?.role === 'student' ? (
          <>
            <Input label={t('forms.profile.career')} placeholder={t('forms.profile.careerPh')} {...register('career')} />
            <Textarea label={t('forms.profile.bio')} placeholder={t('forms.profile.bioPh')} rows={3} {...register('bio')} />
          </>
        ) : (
          <>
            <Input label={t('forms.profile.companyName')} {...register('companyName')} />
            <Input label={t('forms.profile.industry')} placeholder={t('forms.profile.industryPh')} {...register('industry')} />
            <Input label={t('forms.profile.website')} placeholder={t('forms.profile.websitePh')} icon={<Globe size={15} />} error={errors.website?.message} {...register('website')} />
            <Textarea label={t('forms.profile.description')} rows={3} {...register('description')} />
          </>
        )}
      </section>

      {user?.role === 'student' && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-content-subtle uppercase tracking-widest">
            {t('forms.profile.skills')}
          </h2>
          <div className="flex gap-2">
            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder={t('forms.profile.addSkill')} className={tagInputClass} />
            <Button type="button" variant="secondary" size="sm" icon={<Plus size={14} />} onClick={addSkill}>
              {t('common.add')}
            </Button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill}
                  className="flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
                  {skill}
                  <button type="button" onClick={() => setSkills(skills.filter((s) => s !== skill))} className="hover:text-primary-300 transition-colors">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-content-subtle uppercase tracking-widest">
          {t('forms.profile.socialLinks')}
        </h2>
        <Input label={t('forms.profile.linkedin')} placeholder={t('forms.profile.linkedinPh')} icon={<Linkedin size={15} />} {...register('socialLinks.linkedin')} />
        <Input label={t('forms.profile.instagram')} placeholder={t('forms.profile.instagramPh')} icon={<Instagram size={15} />} {...register('socialLinks.instagram')} />
        <Input label={t('forms.profile.behance')} placeholder={t('forms.profile.behancePh')} {...register('socialLinks.behance')} />
      </section>

      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        {t('common.save')}
      </Button>
    </form>
  );
}
