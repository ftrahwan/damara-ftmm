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
    <div className="flex flex-col items-center justify-center rounded-3xl glass-card px-6 py-16 text-center max-w-lg mx-auto">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B07A3C]/30 text-[#D9B26A] border border-[#D9B26A]/30">
        <SearchX className="h-8 w-8" />
      </div>
      <h3 className="mb-2 font-heading text-lg font-bold text-[#FAFAFA]">
        Hasil Pencarian Nihil
      </h3>
      <p className="max-w-md text-xs sm:text-sm text-stone-300/80 leading-relaxed">
        {message}
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-btn-primary text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Atur Ulang Pencarian</span>
        </button>
      )}
    </div>
  );
}
