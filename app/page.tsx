'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, Briefcase, Star, Zap, Shield, Globe } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function LandingPage() {
  const { t } = useI18n();

  const FEATURES = [
    { icon: <Users    size={20} />, key: 'profiles',  color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20'  },
    { icon: <Briefcase size={20}/>, key: 'opps',      color: 'text-usc-400',     bg: 'bg-usc-500/10     border-usc-500/20'      },
    { icon: <Star     size={20} />, key: 'rating',    color: 'text-amber-400',   bg: 'bg-amber-500/10   border-amber-500/20'  },
    { icon: <Zap      size={20} />, key: 'matching',  color: 'text-purple-400',  bg: 'bg-purple-500/10  border-purple-500/20' },
    { icon: <Shield   size={20} />, key: 'messaging', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20'  },
    { icon: <Globe    size={20} />, key: 'modality',  color: 'text-usc-400',     bg: 'bg-usc-500/10     border-usc-500/20'      },
  ];

  const STEPS = [
    { step: '01', color: 'text-primary-400' },
    { step: '02', color: 'text-usc-400'     },
    { step: '03', color: 'text-purple-400'  },
  ];

  return (
    <div className="overflow-hidden">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image src="/wave-bg.svg" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute top-0 left-0 w-[600px] h-[500px] bg-primary-500/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-usc-700/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center w-full">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-usc-800/50 border border-usc-700/40
                           rounded-full text-xs font-semibold text-usc-300 mb-8 tracking-wide uppercase">
            <Zap size={11} /> {t('landing.badge')}
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
            <span className="text-content-primary">{t('landing.h1a')}</span>{' '}
            <span className="text-content-primary">{t('landing.h1b')}</span>
            <br />
            <span className="text-gold">{t('landing.h1c')}</span>
          </h1>

          <p className="text-lg sm:text-xl text-content-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('landing.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 text-bg font-semibold
                         rounded-xl hover:bg-primary-400 transition-all shadow-glow text-sm">
              {t('landing.cta')}
              <ArrowRight size={16} />
            </Link>
            <Link href="/opportunities"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent border border-border
                         text-content-muted hover:text-content-primary hover:border-border-light
                         rounded-xl font-medium transition-all text-sm">
              {t('landing.browse')}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {(['500+', '200+', '1,000+', '98%'] as const).map((val, i) => {
              const keys = ['students', 'companies', 'opportunities', 'satisfaction'] as const;
              return (
                <div key={keys[i]}
                  className="bg-bg-card/60 backdrop-blur border border-border rounded-xl py-4 px-3 text-center">
                  <p className="text-2xl font-extrabold text-primary-400">{val}</p>
                  <p className="text-xs text-content-subtle mt-0.5">{t(`landing.stats.${keys[i]}`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-content-primary mb-4 tracking-tight">
            {t('landing.features.title')}
          </h2>
          <p className="text-content-muted max-w-xl mx-auto text-lg">
            {t('landing.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.key}
              className="bg-bg-card border border-border rounded-2xl p-6
                         hover:border-primary-500/25 hover:bg-bg-hover transition-all duration-300 group">
              <div className={`inline-flex p-3 rounded-xl mb-4 border ${f.bg}`}>
                <span className={f.color}>{f.icon}</span>
              </div>
              <h3 className="font-semibold text-content-primary mb-2 group-hover:text-primary-400 transition-colors">
                {t(`landing.features.items.${f.key}.title`)}
              </h3>
              <p className="text-sm text-content-subtle leading-relaxed">
                {t(`landing.features.items.${f.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="relative py-24 bg-bg-surface border-y border-border overflow-hidden">
        <div className="absolute inset-0 bg-wave-gold pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-content-primary mb-3 tracking-tight">
              {t('landing.howItWorks.title')}
            </h2>
            <p className="text-content-muted">{t('landing.howItWorks.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((item, i) => (
              <div key={item.step} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0 -translate-y-1/2" />
                )}
                <div className="relative z-10 text-center">
                  <span className={`text-6xl font-extrabold opacity-15 ${item.color}`}>{item.step}</span>
                  <h3 className={`text-base font-semibold mb-2 mt-2 ${item.color}`}>
                    {t(`landing.howItWorks.steps.${i}.title`)}
                  </h3>
                  <p className="text-content-subtle text-sm leading-relaxed">
                    {t(`landing.howItWorks.steps.${i}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-wave-blue pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-6">
            <Zap size={28} className="text-primary-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-content-primary mb-4 tracking-tight">
            {t('landing.cta2.title')}
          </h2>
          <p className="text-content-muted text-lg mb-8">{t('landing.cta2.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"
              className="px-8 py-3.5 bg-primary-500 text-bg rounded-xl font-semibold
                         hover:bg-primary-400 transition-all shadow-glow text-sm">
              {t('landing.cta2.joinBtn')}
            </Link>
            <Link href="/register"
              className="px-8 py-3.5 bg-bg-card border border-border text-content-muted rounded-xl
                         font-medium hover:border-primary-500/40 hover:text-primary-400 transition-all text-sm">
              {t('landing.cta2.postBtn')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
