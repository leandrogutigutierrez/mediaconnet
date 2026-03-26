'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Globe, Linkedin, Instagram } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  name:        z.string().min(2),
  bio:         z.string().max(500).optional(),
  location:    z.string().optional(),
  career:      z.string().optional(),
  description: z.string().max(1000).optional(),
  companyName: z.string().optional(),
  industry:    z.string().optional(),
  website:     z.string().url('Enter a valid URL').optional().or(z.literal('')),
  'socialLinks.linkedin':  z.string().optional(),
  'socialLinks.instagram': z.string().optional(),
  'socialLinks.behance':   z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ProfileForm() {
  const { user, refresh } = useAuth();
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
    if (s && !skills.includes(s) && skills.length < 20) {
      setSkills([...skills, s]);
      setSkillInput('');
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    try {
      const body: Record<string, unknown> = {
        name:     data.name,
        location: data.location,
        socialLinks: {
          linkedin:  data['socialLinks.linkedin'],
          instagram: data['socialLinks.instagram'],
          behance:   data['socialLinks.behance'],
        },
      };
      if (user.role === 'student') {
        body.bio    = data.bio;
        body.career = data.career;
        body.skills = skills;
      } else {
        body.description = data.description;
        body.companyName = data.companyName;
        body.industry    = data.industry;
        body.website     = data.website;
      }

      const res = await fetch(`/api/users/${user._id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await refresh();
      toast.success('Profile updated!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Basic Information</h2>

        <Input label="Full name" required error={errors.name?.message} {...register('name')} />

        <Input
          label="Location"
          placeholder="City, Country"
          icon={<MapPin size={15} />}
          {...register('location')}
        />

        {user?.role === 'student' ? (
          <>
            <Input label="Career / Programme" placeholder="Transmedia Production" {...register('career')} />
            <Textarea label="Bio" placeholder="Tell companies about yourself…" rows={3} {...register('bio')} />
          </>
        ) : (
          <>
            <Input label="Company name"  {...register('companyName')} />
            <Input label="Industry"      placeholder="Media, Advertising…" {...register('industry')} />
            <Input
              label="Website"
              placeholder="https://yourcompany.com"
              icon={<Globe size={15} />}
              error={errors.website?.message}
              {...register('website')}
            />
            <Textarea label="Company description" rows={3} {...register('description')} />
          </>
        )}
      </section>

      {/* Skills (student only) */}
      {user?.role === 'student' && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">Skills</h2>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="Add a skill and press Enter"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button type="button" variant="secondary" size="sm" icon={<Plus size={14} />} onClick={addSkill}>
              Add
            </Button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((s) => s !== skill))}
                    className="hover:text-primary-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Social links */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Social Links</h2>
        <Input
          label="LinkedIn"
          placeholder="https://linkedin.com/in/username"
          icon={<Linkedin size={15} />}
          {...register('socialLinks.linkedin')}
        />
        <Input
          label="Instagram"
          placeholder="https://instagram.com/username"
          icon={<Instagram size={15} />}
          {...register('socialLinks.instagram')}
        />
        <Input
          label="Behance"
          placeholder="https://behance.net/username"
          {...register('socialLinks.behance')}
        />
      </section>

      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        Save changes
      </Button>
    </form>
  );
}
