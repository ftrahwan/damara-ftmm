'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { DamaraLogo } from '@/components/ui/DamaraLogo';

interface HeroSectionProps {
  isAdmin?: boolean;
  onLogout?: () => void;
  onOpenAdminLogin?: () => void;
}

export function HeroSection({
  isAdmin = false,
  onLogout,
}: HeroSectionProps) {
  return (
    <section className="relative pt-6 pb-4 sm:pt-10 sm:pb-6 text-center">
      {/* Admin Quick Action (Only visible when admin is logged in) */}
      {isAdmin && (
        <div className="flex items-center justify-end gap-2 max-w-4xl mx-auto px-4 mb-3 animate-in fade-in duration-200">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold hover:text-[#D9B26A] transition-all hover:scale-105"
            title="Buka Dashboard Admin"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#D9B26A]" />
            <span>Dashboard Admin</span>
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-btn-primary text-xs font-semibold shadow-md cursor-pointer transition-all hover:scale-105"
            title="Keluar dari sesi admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Main Branding Logo: DAMARA */}
      <div className="flex justify-center items-center px-4">
        <h1 className="sr-only">DAMARA</h1>
        <DamaraLogo className="w-full max-w-[340px] sm:max-w-[440px] md:max-w-[540px] h-auto select-none" />
      </div>

      {/* Subtitle / Welcome Text */}
      <p className="mt-3 text-xs sm:text-sm md:text-base text-stone-200/90 max-w-md sm:max-w-xl mx-auto px-6 leading-relaxed font-normal">
        {isAdmin ? (
          <>
            Panel Pengelolaan Lowongan Magang BEM FTMM UNAIR.
            <br className="hidden sm:inline" /> Kelola dan publikasikan informasi lowongan magang untuk KM-FTMM.
          </>
        ) : (
          <>
            Selamat datang KM-FTMM di platform magang BEM FTMM.
            <br className="hidden sm:inline" /> Temukan lowongan impianmu bersama kami
          </>
        )}
      </p>
    </section>
  );
}
