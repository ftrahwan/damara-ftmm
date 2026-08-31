'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminLogout, getAdminSession } from '@/lib/auth';
import { Compass, LogOut, ArrowLeft, Plus, LayoutDashboard } from 'lucide-react';

interface AdminNavbarProps {
  userEmail?: string;
}

export function AdminNavbar({ userEmail }: AdminNavbarProps) {
  const router = useRouter();
  const session = typeof window !== 'undefined' ? getAdminSession() : null;
  const currentEmail = userEmail || session?.email || 'admin@ftmm.unair.ac.id';

  const handleLogout = async () => {
    await adminLogout();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#351E0E]/85 backdrop-blur-xl shadow-md text-stone-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Admin Brand */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B07A3C]/40 border border-[#D9B26A]/40 text-[#D9B26A] shadow-xs">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-base font-black tracking-tight text-[#FAFAFA]">
                  DAMARA Admin
                </span>
                <span className="rounded bg-[#B07A3C]/40 px-1.5 py-0.5 text-[10px] font-bold text-[#D9B26A] border border-[#D9B26A]/30">
                  CMS
                </span>
              </div>
              <p className="text-[11px] font-medium text-stone-400">
                FTMM Universitas Airlangga
              </p>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <nav className="hidden items-center gap-2 pl-4 sm:flex">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-[#D9B26A]" />
              <span>Dashboard</span>
            </Link>
          </nav>
        </div>

        {/* Right: Actions, User Info, Logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/jobs/new"
            id="btn-add-job-nav"
            className="hidden items-center gap-1.5 rounded-2xl glass-btn-primary px-3.5 py-2 text-xs font-bold text-white shadow-md active:scale-95 sm:inline-flex cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Lowongan</span>
          </Link>

          <Link
            href="/"
            aria-label="Kembali ke portal mahasiswa publik"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-semibold text-stone-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Halaman Publik</span>
          </Link>

          <div className="hidden text-right lg:block">
            <span className="block text-xs font-semibold text-stone-200">
              {currentEmail}
            </span>
            <span className="block text-[10px] text-stone-400">Pengelola FTMM</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            id="btn-admin-logout"
            aria-label="Keluar dari sesi admin"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-500/40 bg-rose-950/60 px-3 py-1.5 text-xs font-bold text-rose-200 hover:bg-rose-900/60 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

