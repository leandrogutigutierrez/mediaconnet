'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/contexts/I18nContext';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <svg width="26" height="26" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="fb" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00205B"/><stop offset="100%" stopColor="#001440"/>
                  </linearGradient>
                  <linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFD050"/><stop offset="100%" stopColor="#F5B800"/>
                  </linearGradient>
                </defs>
                <circle cx="24" cy="24" r="24" fill="url(#fb)"/>
                <line x1="24" y1="24" x2="24" y2="9"    stroke="#1976D2" strokeWidth="1.2" opacity="0.5"/>
                <line x1="24" y1="24" x2="37" y2="15.5" stroke="#1976D2" strokeWidth="1.2" opacity="0.5"/>
                <line x1="24" y1="24" x2="37" y2="30.5" stroke="#1976D2" strokeWidth="1.2" opacity="0.5"/>
                <line x1="24" y1="24" x2="24" y2="39"   stroke="#1976D2" strokeWidth="1.2" opacity="0.5"/>
                <line x1="24" y1="24" x2="11" y2="30.5" stroke="#1976D2" strokeWidth="1.2" opacity="0.5"/>
                <line x1="24" y1="24" x2="11" y2="15.5" stroke="#1976D2" strokeWidth="1.2" opacity="0.5"/>
                <circle cx="24" cy="24" r="6" fill="url(#fg)" opacity="0.85"/>
                <circle cx="24" cy="24" r="3.5" fill="#FFD050"/>
              </svg>
              <div className="leading-none">
                <span className="text-content-primary font-bold text-sm block">
                  Media<span className="text-primary-500">Connet</span>
                </span>
                <span className="text-[9px] font-medium tracking-[0.1em] text-content-subtle uppercase">USC</span>
              </div>
            </div>
            <p className="text-sm text-content-subtle leading-relaxed">{t('footer.tagline')}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-content-subtle uppercase tracking-widest mb-3">
              {t('footer.platform')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/opportunities" className="text-content-subtle hover:text-primary-400 transition-colors">{t('footer.links.browseOpps')}</Link></li>
              <li><Link href="/students"      className="text-content-subtle hover:text-primary-400 transition-colors">{t('footer.links.findStudents')}</Link></li>
              <li><Link href="/register"      className="text-content-subtle hover:text-primary-400 transition-colors">{t('footer.links.joinCompany')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-content-subtle uppercase tracking-widest mb-3">
              {t('footer.students')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register"      className="text-content-subtle hover:text-primary-400 transition-colors">{t('footer.links.createProfile')}</Link></li>
              <li><Link href="/opportunities" className="text-content-subtle hover:text-primary-400 transition-colors">{t('footer.links.applyProjects')}</Link></li>
              <li><Link href="/messages"      className="text-content-subtle hover:text-primary-400 transition-colors">{t('footer.links.messages')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-content-subtle uppercase tracking-widest mb-3">
              {t('footer.about')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-content-subtle">{t('footer.transmedia')}</span></li>
              <li>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-usc-800/40
                                 border border-usc-700/30 text-usc-300 text-xs font-medium">
                  Universidad Santiago de Cali
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-content-subtle">
          <p>{t('footer.rights', { year: String(new Date().getFullYear()) })}</p>
          <p>{t('footer.usc')}</p>
        </div>
      </div>
    </footer>
  );
}
