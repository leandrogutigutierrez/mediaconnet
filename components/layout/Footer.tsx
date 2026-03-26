import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-primary-500/10 border border-primary-500/30 flex items-center justify-center">
                <span className="text-primary-500 font-bold text-xs">M</span>
              </div>
              <span className="text-content-primary font-bold">
                Media<span className="text-primary-500">Connet</span>
              </span>
            </div>
            <p className="text-sm text-content-subtle leading-relaxed">
              Connecting Transmedia Production students with real-world creative opportunities.
            </p>
          </div>

          <div>
            <h4 className="text-content-primary text-sm font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/opportunities" className="text-content-subtle hover:text-primary-400 transition-colors">Browse Opportunities</Link></li>
              <li><Link href="/students"      className="text-content-subtle hover:text-primary-400 transition-colors">Find Students</Link></li>
              <li><Link href="/register"      className="text-content-subtle hover:text-primary-400 transition-colors">Join as Company</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-content-primary text-sm font-semibold mb-3">Students</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register"      className="text-content-subtle hover:text-primary-400 transition-colors">Create Profile</Link></li>
              <li><Link href="/opportunities" className="text-content-subtle hover:text-primary-400 transition-colors">Apply to Projects</Link></li>
              <li><Link href="/messages"      className="text-content-subtle hover:text-primary-400 transition-colors">Messages</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-content-primary text-sm font-semibold mb-3">About</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-content-subtle">Transmedia Production Platform</span></li>
              <li><span className="text-content-subtle">Universidad Santiago de Cali</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-content-subtle">
          <p>© {new Date().getFullYear()} MediaConnet. All rights reserved.</p>
          <p>Tecnología en Producción Transmedia — USC 2026</p>
        </div>
      </div>
    </footer>
  );
}
