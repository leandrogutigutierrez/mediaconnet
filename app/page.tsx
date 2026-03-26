import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, Briefcase, Star, Zap, Shield, Globe } from 'lucide-react';

const FEATURES = [
  { icon: <Users size={20} />,    title: 'Student Profiles',   description: 'Showcase your skills, portfolio, and career goals to hundreds of companies.',       color: 'text-primary-400', bg: 'bg-primary-500/10  border-primary-500/20'  },
  { icon: <Briefcase size={20} />, title: 'Real Opportunities', description: 'Apply to video, photography, social media, and other transmedia projects.',          color: 'text-teal-400',    bg: 'bg-teal-500/10    border-teal-500/20'    },
  { icon: <Star size={20} />,      title: 'Rating System',      description: 'Build reputation through peer and company reviews after each collaboration.',         color: 'text-amber-400',   bg: 'bg-amber-500/10   border-amber-500/20'  },
  { icon: <Zap size={20} />,       title: 'Smart Matching',     description: 'Find opportunities that match your exact skill set and career interests.',            color: 'text-purple-400',  bg: 'bg-purple-500/10  border-purple-500/20' },
  { icon: <Shield size={20} />,    title: 'Secure Messaging',   description: 'Communicate directly with companies through our built-in messaging system.',          color: 'text-primary-400', bg: 'bg-primary-500/10  border-primary-500/20'  },
  { icon: <Globe size={20} />,     title: 'Remote & On-site',   description: 'Filter opportunities by remote, on-site, or hybrid work modalities.',                color: 'text-teal-400',    bg: 'bg-teal-500/10    border-teal-500/20'    },
];

const STATS = [
  { value: '500+',   label: 'Active Students'  },
  { value: '200+',   label: 'Companies'        },
  { value: '1,000+', label: 'Opportunities'    },
  { value: '98%',    label: 'Satisfaction'     },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* Wave background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/wave-bg.svg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Radial glow top-left */}
        <div className="absolute top-0 left-0 w-[600px] h-[500px] bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />
        {/* Radial glow bottom-right */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-teal-500/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center w-full">
          {/* Pill badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full text-sm font-medium text-primary-400 mb-8">
            <Zap size={13} /> For Transmedia Production students
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
            <span className="text-content-primary">Connect.</span>{' '}
            <span className="text-content-primary">Create.</span>{' '}
            <br />
            <span className="text-neon">Grow.</span>
          </h1>

          <p className="text-lg sm:text-xl text-content-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            MediaConnet bridges the gap between talented Transmedia Production students
            and companies seeking fresh creative perspectives.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 text-bg font-semibold rounded-xl
                         hover:bg-primary-400 transition-all shadow-glow hover:shadow-glow text-sm"
            >
              Get started — it&apos;s free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent border border-border
                         text-content-muted hover:text-content-primary hover:border-border-light
                         rounded-xl font-medium transition-all text-sm"
            >
              Browse opportunities
            </Link>
          </div>

          {/* Floating stats row */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-bg-card/60 backdrop-blur border border-border rounded-xl py-4 px-3 text-center"
              >
                <p className="text-2xl font-extrabold text-primary-400">{s.value}</p>
                <p className="text-xs text-content-subtle mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-content-primary mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-content-muted max-w-xl mx-auto text-lg">
            A full platform tailored for creative students and companies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-bg-card border border-border rounded-2xl p-6 hover:border-primary-500/30 hover:bg-bg-hover transition-all duration-300 group"
            >
              <div className={`inline-flex p-3 rounded-xl mb-4 border ${f.bg}`}>
                <span className={f.color}>{f.icon}</span>
              </div>
              <h3 className="font-semibold text-content-primary mb-2 group-hover:text-primary-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-content-subtle leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section className="relative py-24 bg-bg-surface border-y border-border overflow-hidden">
        <div className="absolute inset-0 bg-wave-green pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-content-primary mb-3">How it works</h2>
            <p className="text-content-muted">Three steps to launch your transmedia career</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your profile',  desc: 'Sign up as a student or company and build your professional profile with skills and portfolio.',          color: 'text-primary-400' },
              { step: '02', title: 'Connect & apply',      desc: 'Browse opportunities, filter by skills, and apply with a personalized cover letter.',                     color: 'text-teal-400'   },
              { step: '03', title: 'Collaborate & grow',   desc: 'Work on real projects, receive feedback, build your reputation, and launch your career.',                  color: 'text-purple-400' },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0 -translate-y-1/2" />
                )}
                <div className="relative z-10 text-center">
                  <span className={`text-6xl font-extrabold opacity-20 ${item.color}`}>{item.step}</span>
                  <h3 className={`text-lg font-semibold mb-2 mt-2 ${item.color}`}>{item.title}</h3>
                  <p className="text-content-subtle text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-wave-teal pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-6">
            <Zap size={28} className="text-primary-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-content-primary mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-content-muted text-lg mb-8">
            Join hundreds of students and companies already using MediaConnet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-primary-500 text-bg rounded-xl font-semibold hover:bg-primary-400 transition-all shadow-glow text-sm"
            >
              Join as student
            </Link>
            <Link
              href="/register"
              className="px-8 py-3.5 bg-bg-card border border-border text-content-muted rounded-xl font-medium hover:border-primary-500/40 hover:text-primary-400 transition-all text-sm"
            >
              Post an opportunity
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
