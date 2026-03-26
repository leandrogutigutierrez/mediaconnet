'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, MessageSquare, Menu, X, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export function Navbar() {
  const { user, logout } = useAuth();
  const router           = useRouter();
  const pathname         = usePathname();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [dropOpen,    setDropOpen]    = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navLinks = user?.role === 'student'
    ? [
        { href: '/opportunities', label: 'Opportunities' },
        { href: '/students',      label: 'Community'     },
        { href: '/applications',  label: 'Applications'  },
      ]
    : [
        { href: '/opportunities/new', label: 'Post Opportunity' },
        { href: '/students',          label: 'Find Talent'      },
        { href: '/applications',      label: 'Applicants'       },
      ];

  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/30 flex items-center justify-center">
              <span className="text-primary-500 font-extrabold text-sm">M</span>
            </div>
            <span className="font-bold text-content-primary text-lg hidden sm:block">
              Media<span className="text-primary-500">Connet</span>
            </span>
          </Link>

          {/* Search */}
          {user && (
            <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden md:flex">
              <div className="relative w-full">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-subtle" />
                <input
                  type="search"
                  placeholder="Search opportunities, students…"
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
                          <User size={14} /> View Profile
                        </Link>
                        <Link href="/profile/edit" onClick={() => setDropOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-content-muted rounded-lg hover:bg-bg-hover hover:text-content-primary transition-colors">
                          <Settings size={14} /> Edit Profile
                        </Link>
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                          <LogOut size={14} /> Log out
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
                Log in
              </Link>
              <Link href="/register"
                className="px-4 py-2 text-sm font-semibold bg-primary-500 text-bg rounded-xl hover:bg-primary-400 transition-all shadow-glow-sm">
                Sign up
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
              <input type="search" placeholder="Search…" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-bg-card border border-border rounded-xl text-content-primary focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
