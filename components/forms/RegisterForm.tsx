'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const schema = z.object({
  name:        z.string().min(2, 'Name must be at least 2 characters'),
  email:       z.string().email('Enter a valid email'),
  password:    z.string().min(6, 'At least 6 characters'),
  role:        z.enum(['student', 'company']),
  career:      z.string().optional(),
  companyName: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === 'student' && !data.career) {
    ctx.addIssue({ code: 'custom', path: ['career'], message: 'Career is required for students' });
  }
  if (data.role === 'company' && !data.companyName) {
    ctx.addIssue({ code: 'custom', path: ['companyName'], message: 'Company name is required' });
  }
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const { register: registerUser } = useAuth();
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
      toast.success('Account created! Welcome to MediaConnet');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Role selector */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-bg-surface border border-border rounded-xl">
        {(['student', 'company'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => handleRoleChange(r)}
            className={cn(
              'flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
              role === r
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/30'
                : 'text-content-subtle hover:text-content-muted'
            )}
          >
            {r === 'student' ? <GraduationCap size={15} /> : <Briefcase size={15} />}
            {r === 'student' ? 'Student' : 'Company'}
          </button>
        ))}
      </div>

      <Input
        label="Full name"
        placeholder={role === 'company' ? 'John Smith' : 'Jane Doe'}
        icon={<User size={15} />}
        error={errors.name?.message}
        required
        {...register('name')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        icon={<Mail size={15} />}
        error={errors.email?.message}
        required
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="At least 6 characters"
        icon={<Lock size={15} />}
        error={errors.password?.message}
        required
        {...register('password')}
      />

      {/* Role-specific field */}
      {role === 'student' ? (
        <Input
          label="Career / Programme"
          placeholder="e.g. Transmedia Production"
          icon={<GraduationCap size={15} />}
          error={errors.career?.message}
          required
          {...register('career')}
        />
      ) : (
        <Input
          label="Company name"
          placeholder="e.g. Acme Studios"
          icon={<Briefcase size={15} />}
          error={errors.companyName?.message}
          required
          {...register('companyName')}
        />
      )}

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Create account
      </Button>

      <p className="text-center text-sm text-content-subtle">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
          Log in
        </Link>
      </p>
    </form>
  );
}
