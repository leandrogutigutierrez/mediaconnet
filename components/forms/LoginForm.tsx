'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { login }     = useAuth();
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const redirect      = searchParams.get('redirect') ?? '/dashboard';
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push(redirect);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        icon={<Mail size={15} />}
        error={errors.email?.message}
        required
        {...register('email')}
      />

      <div className="flex flex-col gap-1">
        <Input
          label="Password"
          type={showPw ? 'text' : 'password'}
          placeholder="••••••••"
          icon={<Lock size={15} />}
          error={errors.password?.message}
          required
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPw(!showPw)}
          className="self-end flex items-center gap-1 text-xs text-content-subtle hover:text-content-muted"
        >
          {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
          {showPw ? 'Hide' : 'Show'}
        </button>
      </div>

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Log in
      </Button>

      <p className="text-center text-sm text-content-subtle">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
          Sign up
        </Link>
      </p>
    </form>
  );
}
