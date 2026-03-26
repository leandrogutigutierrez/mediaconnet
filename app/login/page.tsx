import React from 'react';
import { LoginForm } from '@/components/forms/LoginForm';

export const metadata = { title: 'Log in — MediaConnet' };

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-wave-green pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-500 font-extrabold text-xl">M</span>
            </div>
            <h1 className="text-2xl font-bold text-content-primary">Welcome back</h1>
            <p className="text-content-subtle text-sm mt-1">Log in to your MediaConnet account</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
