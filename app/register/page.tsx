'use client';

import React from 'react';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { useI18n } from '@/contexts/I18nContext';

export default function RegisterPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 bg-wave-gold pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-500 font-extrabold text-xl">M</span>
            </div>
            <h1 className="text-2xl font-bold text-content-primary">{t('auth.register.title')}</h1>
            <p className="text-content-subtle text-sm mt-1">{t('auth.register.subtitle')}</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
