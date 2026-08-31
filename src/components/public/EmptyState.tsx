'use client';

import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onReset?: () => void;
  message?: string;
}

export function EmptyState({
  onReset,
  message = 'Tidak ada lowongan yang sesuai. Coba ubah kata kunci atau filter prodi.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center max-w-md mx-auto animate-in fade-in duration-300 px-4">
      {/* Icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#9E6935]/40 text-[#DEBE7E] border border-[#D9B26A]/30 shadow-md">
        <SearchX className="h-8 w-8" />
      </div>

      {/* Heading */}
      <h3 className="mb-2 font-heading text-lg sm:text-xl font-bold text-[#FAFAFA]">
        Hasil Pencarian Nihil
      </h3>

      {/* Message */}
      <p className="text-xs sm:text-sm text-stone-300/80 leading-relaxed max-w-sm">
        {message}
      </p>

      {/* Reset CTA */}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full glass-btn-primary text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Atur Ulang Pencarian</span>
        </button>
      )}
    </div>
  );
}
