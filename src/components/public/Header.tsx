'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Compass, GraduationCap } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo & FTMM Info */}
        <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-95">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary via-[#7A4E29] to-brand-secondary text-white shadow-md shadow-brand-primary/20 ring-1 ring-brand-accent/30">
            <Compass className="h-6 w-6 text-white transition-transform group-hover:rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-black tracking-tight text-brand-primary dark:text-amber-100">
                DAMARA
              </span>
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-brand-primary ring-1 ring-brand-secondary/30 dark:bg-amber-950/60 dark:text-amber-200">
                FTMM UNAIR
              </span>
            </div>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Daya Magang Industri Mandala
            </p>
          </div>
        </Link>

        {/* Navigation & Admin portal link */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-full bg-stone-100 px-3.5 py-1 text-xs font-medium text-stone-700 sm:flex dark:bg-stone-800 dark:text-stone-300">
            <GraduationCap className="h-3.5 w-3.5 text-brand-secondary" />
            <span>Fakultas Teknologi Maju dan Multidisiplin</span>
          </div>

          <Link
            href="/admin"
            id="nav-admin-link"
            aria-label="Masuk ke Panel Admin DAMARA"
            className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-3.5 py-1.5 text-xs font-semibold text-brand-primary transition-colors hover:border-brand-secondary hover:bg-amber-50/50 hover:text-brand-primary dark:border-stone-700 dark:text-stone-300 dark:hover:border-brand-accent dark:hover:bg-stone-800"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-brand-secondary" />
            <span>Panel Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
