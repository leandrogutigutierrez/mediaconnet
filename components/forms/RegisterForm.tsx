'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const schema = z.object({
  name:        z.string().min(2),
  email:       z.string().email(),
  password:    z.string().min(6),
  role:        z.enum(['student', 'company']),
  career:      z.string().optional(),
  companyName: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === 'student' && !data.career) {
    ctx.addIssue({ code: 'custom', path: ['career'],      message: 'required' });
  }
  if (data.role === 'company' && !data.companyName) {
    ctx.addIssue({ code: 'custom', path: ['companyName'], message: 'required' });
  }
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'company'>('student');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'student' },
  });

  const handleRoleChange = (r: 'student' | 'company') => {
    setRole(r);
    setValue('role', r);
  };

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data);
      toast.success(t('forms.register.successMsg'));
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t('forms.register.errorMsg'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Role selector */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-bg-surface border border-border rounded-xl">
        {(['student', 'company'] as const).map((r) => (
          <button key={r} type="button" onClick={() => handleRoleChange(r)}
            className={cn(
              'flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
              role === r
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/30'
                : 'text-content-subtle hover:text-content-muted'
            )}>
            {r === 'student' ? <GraduationCap size={15} /> : <Briefcase size={15} />}
            {r === 'student' ? t('forms.register.student') : t('forms.register.company')}
          </button>
        ))}
      </div>

      <Input
        label={t('forms.register.fullName')}
        placeholder={t('forms.register.namePh')}
        icon={<User size={15} />}
        error={errors.name ? t('forms.register.errName') : undefined}
        required
        {...register('name')}
      />

      <Input
        label={t('forms.register.email')}
        type="email"
        placeholder={t('forms.register.emailPlaceholder')}
        icon={<Mail size={15} />}
        error={errors.email ? t('forms.register.errEmail') : undefined}
        required
        {...register('email')}
      />

      <Input
        label={t('forms.register.password')}
        type="password"
        placeholder={t('forms.register.passwordPh')}
        icon={<Lock size={15} />}
        error={errors.password ? t('forms.register.errPassword') : undefined}
        required
        {...register('password')}
      />

      {role === 'student' ? (
        <Input
          label={t('forms.register.career')}
          placeholder={t('forms.register.careerPh')}
          icon={<GraduationCap size={15} />}
          error={errors.career ? t('forms.register.errCareer') : undefined}
          required
          {...register('career')}
        />
      ) : (
        <Input
          label={t('forms.register.companyName')}
          placeholder={t('forms.register.companyPh')}
          icon={<Briefcase size={15} />}
          error={errors.companyName ? t('forms.register.errCompany') : undefined}
          required
          {...register('companyName')}
        />
      )}

      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t('forms.register.submit')}
      </Button>

      <p className="text-center text-sm text-content-subtle">
        {t('forms.register.hasAccount')}{' '}
        <Link href="/login" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
          {t('forms.register.login')}
        </Link>
      </p>
    </form>
  );
}
