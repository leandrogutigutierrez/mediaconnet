'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl mb-4">⚠️</p>
      <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
      <p className="text-slate-500 mt-2 text-sm max-w-sm">
        {error.message ?? 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        className="mt-6 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
