'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { login }    = useAuth();
  const { t }        = useI18n();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get('redirect') ?? '/dashboard';
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      toast.success(t('forms.login.successMsg'));
      router.push(redirect);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t('forms.login.errorMsg'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t('forms.login.email')}
        type="email"
        placeholder={t('forms.login.emailPlaceholder')}
        icon={<Mail size={15} />}
        error={errors.email ? t('forms.register.errEmail') : undefined}
        required
        {...register('email')}
      />

      <div className="flex flex-col gap-1">
        <Input
          label={t('forms.login.password')}
          type={showPw ? 'text' : 'password'}
          placeholder={t('forms.login.passwordPh')}
          icon={<Lock size={15} />}
          error={errors.password ? t('forms.register.errPassword') : undefined}
          required
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPw(!showPw)}
          className="self-end flex items-center gap-1 text-xs text-content-subtle hover:text-content-muted"
        >
          {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
          {showPw ? t('forms.login.hide') : t('forms.login.show')}
        </button>
      </div>

      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t('forms.login.submit')}
      </Button>

      <p className="text-center text-sm text-content-subtle">
        {t('forms.login.noAccount')}{' '}
        <Link href="/register" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
          {t('forms.login.signup')}
        </Link>
      </p>
    </form>
  );
}
