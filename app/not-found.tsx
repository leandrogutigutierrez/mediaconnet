import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-extrabold text-primary-100 select-none">404</p>
      <h1 className="text-2xl font-bold text-slate-900 mt-4">Page not found</h1>
      <p className="text-slate-500 mt-2 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 transition-colors"
      >
        <ArrowLeft size={15} /> Back to home
      </Link>
    </div>
  );
}
