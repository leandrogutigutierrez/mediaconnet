'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, MessageSquare, Menu, X, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n, type Locale } from '@/contexts/I18nContext';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export function Navbar() {
  const { user, logout }      = useAuth();
  const { t, locale, setLocale } = useI18n();
  const router                = useRouter();
  const pathname              = usePathname();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [dropOpen,    setDropOpen]    = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    toast.success(t('nav.logout'));
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navLinks = user?.role === 'student'
    ? [
        { href: '/opportunities', label: t('nav.opportunities') },
        { href: '/students',      label: t('nav.community')     },
        { href: '/applications',  label: t('nav.applications')  },
      ]
    : [
        { href: '/opportunities/new', label: t('nav.postOpportunity') },
        { href: '/students',          label: t('nav.findTalent')      },
        { href: '/applications',      label: t('nav.applicants')      },
      ];

  const otherLocale: Locale = locale === 'es' ? 'en' : 'es';

  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 shrink-0">
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="nb" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00205B"/>
                  <stop offset="100%" stopColor="#001440"/>
                </linearGradient>
                <linearGradient id="ng" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFD050"/>
                  <stop offset="100%" stopColor="#F5B800"/>
                </linearGradient>
                <linearGradient id="nn" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2196F3"/>
                  <stop offset="100%" stopColor="#1565C0"/>
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="24" fill="url(#nb)"/>
              <polygon points="24,8 37,15.5 37,30.5 24,38 11,30.5 11,15.5" fill="none" stroke="#1A5FA8" strokeWidth="0.7" opacity="0.35"/>
              <line x1="24" y1="24" x2="24" y2="9"     stroke="#1976D2" strokeWidth="1.2" opacity="0.55"/>
              <line x1="24" y1="24" x2="37" y2="15.5"  stroke="#1976D2" strokeWidth="1.2" opacity="0.55"/>
              <line x1="24" y1="24" x2="37" y2="30.5"  stroke="#1976D2" strokeWidth="1.2" opacity="0.55"/>
              <line x1="24" y1="24" x2="24" y2="39"    stroke="#1976D2" strokeWidth="1.2" opacity="0.55"/>
              <line x1="24" y1="24" x2="11" y2="30.5"  stroke="#1976D2" strokeWidth="1.2" opacity="0.55"/>
              <line x1="24" y1="24" x2="11" y2="15.5"  stroke="#1976D2" strokeWidth="1.2" opacity="0.55"/>
              <circle cx="24" cy="9"    r="3" fill="url(#nn)"/>
              <circle cx="37" cy="15.5" r="3" fill="url(#nn)"/>
              <circle cx="37" cy="30.5" r="3" fill="url(#nn)"/>
              <circle cx="24" cy="39"   r="3" fill="url(#nn)"/>
              <circle cx="11" cy="30.5" r="3" fill="url(#nn)"/>
              <circle cx="11" cy="15.5" r="3" fill="url(#nn)"/>
              <circle cx="24" cy="24" r="6.5" fill="url(#ng)" opacity="0.85"/>
              <circle cx="24" cy="24" r="4"   fill="#FFD050"/>
              <circle cx="24" cy="24" r="1.8" fill="#FFF8DC" opacity="0.9"/>
            </svg>

            <div className="hidden sm:flex flex-col leading-none gap-0.5">
              <span className="font-bold text-content-primary text-[17px] tracking-tight">
                Media<span className="text-primary-500">Connet</span>
              </span>
              <span className="text-[8.5px] font-medium tracking-[0.12em] text-content-subtle uppercase">
                Univ. Santiago de Cali
              </span>
            </div>
          </Link>

          {/* Search */}
          {user && (
            <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden md:flex">
              <div className="relative w-full">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-subtle" />
                <input
                  type="search"
                  placeholder={t('nav.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-bg-surface border border-border rounded-xl
                             text-content-primary placeholder:text-content-subtle
                             focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition"
                />
              </div>
            </form>
          )}

          <div className="flex-1" />

          {/* Desktop nav */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname.startsWith(link.href)
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-content-muted hover:text-content-primary hover:bg-bg-hover'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Language switcher */}
          <button
            onClick={() => setLocale(otherLocale)}
            title={otherLocale === 'en' ? 'Switch to English' : 'Cambiar a Español'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border
                       text-xs font-semibold text-content-muted hover:text-content-primary
                       hover:border-primary-500/40 hover:bg-bg-hover transition-all shrink-0"
          >
            <span className="text-base leading-none">{otherLocale === 'en' ? '🇬🇧' : '🇨🇴'}</span>
            <span className="hidden sm:inline uppercase tracking-wide">{otherLocale}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-1">
              <Link href="/messages"
                className="p-2 rounded-lg text-content-muted hover:text-primary-400 hover:bg-bg-hover transition-all">
                <MessageSquare size={19} />
              </Link>

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-bg-hover transition-all"
                >
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <ChevronDown size={13} className="text-content-subtle hidden sm:block" />
                </button>

                {dropOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-bg-surface rounded-xl border border-border shadow-xl z-20 animate-fade-in">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-content-primary truncate">{user.name}</p>
                        <p className="text-xs text-content-subtle capitalize">{user.role}</p>
                      </div>
                      <div className="p-1.5">
                        <Link href={`/profile/${user._id}`} onClick={() => setDropOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-content-muted rounded-lg hover:bg-bg-hover hover:text-content-primary transition-colors">
                          <User size={14} /> {t('nav.viewProfile')}
                        </Link>
                        <Link href="/profile/edit" onClick={() => setDropOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-content-muted rounded-lg hover:bg-bg-hover hover:text-content-primary transition-colors">
                          <Settings size={14} /> {t('nav.editProfile')}
                        </Link>
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                          <LogOut size={14} /> {t('nav.logout')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-lg text-content-muted hover:bg-bg-hover">
                {menuOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login"
                className="px-4 py-2 text-sm font-medium text-content-muted hover:text-content-primary transition-colors">
                {t('nav.login')}
              </Link>
              <Link href="/register"
                className="px-4 py-2 text-sm font-semibold bg-primary-500 text-bg rounded-xl hover:bg-primary-400 transition-all shadow-glow-sm">
                {t('nav.signup')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && user && (
        <div className="lg:hidden border-t border-border bg-bg-surface px-4 py-3 space-y-1 animate-slide-up">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-content-muted hover:text-content-primary hover:bg-bg-hover">
              {link.label}
            </Link>
          ))}
          <form onSubmit={handleSearch} className="pt-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-subtle" />
              <input type="search" placeholder={t('nav.searchPlaceholder')} value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-bg-card border border-border rounded-xl text-content-primary focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
