'use client';

import React from 'react';
import { DashboardMetrics } from '@/lib/types';
import { Briefcase, CheckCircle2, XCircle } from 'lucide-react';

interface StatsOverviewProps {
  metrics: DashboardMetrics;
}

export function StatsOverview({ metrics }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Metric 1: Total Lowongan */}
      <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Total Lowongan
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-brand-primary dark:bg-amber-950/60 dark:text-amber-200">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 font-heading text-3xl font-black text-brand-primary dark:text-amber-100">
          {metrics.totalJobs}
        </p>
        <span className="mt-1 block text-xs text-stone-400">
          Semua data terdaftar di sistem
        </span>
      </div>

      {/* Metric 2: Lowongan Aktif */}
      <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Lowongan Aktif
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 font-heading text-3xl font-black text-emerald-600 dark:text-emerald-400">
          {metrics.activeJobs}
        </p>
        <span className="mt-1 block text-xs text-stone-400">
          Tampil dan dapat dicari di publik
        </span>
      </div>

      {/* Metric 3: Lowongan Nonaktif */}
      <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Lowongan Nonaktif
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 font-heading text-3xl font-black text-stone-600 dark:text-stone-300">
          {metrics.inactiveJobs}
        </p>
        <span className="mt-1 block text-xs text-stone-400">
          Disembunyikan dari halaman publik
        </span>
      </div>
    </div>
  );
}
