'use client';

import React from 'react';
import { FTMM_PRODI_LIST } from '@/lib/mock-data';
import { Bookmark } from 'lucide-react';

interface ProgramFilterProps {
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  bookmarkCount?: number;
}

export function ProgramFilter({
  selectedTag,
  onSelectTag,
  bookmarkCount = 0,
}: ProgramFilterProps) {
  const prodis = ['Semua', ...FTMM_PRODI_LIST.map((p) => p.name)];

  return (
    <div className="w-full max-w-3xl mx-auto overflow-x-auto pb-1 no-scrollbar">
      <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max px-2">
        {prodis.map((name) => {
          const isSelected =
            selectedTag === name ||
            (name === 'Semua' && (!selectedTag || selectedTag === 'all'));

          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelectTag(name === 'Semua' ? 'all' : name)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'glass-pill-active scale-105 shadow-md'
                  : 'glass-pill opacity-85 hover:opacity-100'
              }`}
            >
              {name}
            </button>
          );
        })}

        {/* Bookmark Tab */}
        {bookmarkCount > 0 && (
          <button
            type="button"
            onClick={() => onSelectTag('saved')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedTag === 'saved'
                ? 'glass-pill-active scale-105 shadow-md text-[#F4C542]'
                : 'glass-pill opacity-85 hover:opacity-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Tersimpan ({bookmarkCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}
