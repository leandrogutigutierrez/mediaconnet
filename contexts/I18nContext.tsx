'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { en } from '@/messages/en';
import { es } from '@/messages/es';

export type Locale = 'en' | 'es';

const MESSAGES = { en, es } as const;
const STORAGE_KEY = 'mc_locale';
const DEFAULT_LOCALE: Locale = 'es';

// ── Deep get with dot-notation key ──────────────────────────────
function deepGet(obj: Record<string, unknown>, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : path;
}

// ── Interpolate {placeholder} tokens ────────────────────────────
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  );
}

// ── Context types ────────────────────────────────────────────────
interface I18nContextValue {
  locale:    Locale;
  setLocale: (l: Locale) => void;
  t:         (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale:    DEFAULT_LOCALE,
  setLocale: () => {},
  t:         (key) => key,
});

// ── Provider ─────────────────────────────────────────────────────
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Hydrate from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && (stored === 'en' || stored === 'es')) {
      setLocaleState(stored);
    }
  }, []);

  // Update <html lang> whenever locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback((key: string, vars?: Record<string, string | number>): string => {
    const messages = MESSAGES[locale] as unknown as Record<string, unknown>;
    const raw = deepGet(messages, key);
    return interpolate(raw, vars);
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────
export function useI18n() {
  return useContext(I18nContext);
}
