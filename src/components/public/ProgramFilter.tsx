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
    <div className="w-full max-w-3xl mx-auto overflow-x-auto py-2.5 px-1 no-scrollbar">
      <div className="flex items-center justify-start sm:justify-center gap-2.5 min-w-max px-2 py-1">
        {prodis.map((name) => {
          const isSelected =
            selectedTag === name ||
            (name === 'Semua' && (!selectedTag || selectedTag === 'all'));

          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelectTag(name === 'Semua' ? 'all' : name)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                isSelected
                  ? 'bg-[#B07A3C] text-[#FAFAFA] border border-[#D9B26A] shadow-md font-bold ring-1 ring-[#D9B26A]/50'
                  : 'bg-[#9E6935]/80 hover:bg-[#A8723C] text-[#DEBE7E] hover:text-[#FAFAFA] border border-[#D9B26A]/20'
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
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none active:scale-95 ${
              selectedTag === 'saved'
                ? 'bg-[#B07A3C] text-[#FAFAFA] border border-[#D9B26A] shadow-md font-bold ring-1 ring-[#D9B26A]/50'
                : 'bg-[#9E6935]/80 hover:bg-[#A8723C] text-[#DEBE7E] hover:text-[#FAFAFA] border border-[#D9B26A]/20'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current text-[#DEBE7E]" />
            <span>Tersimpan ({bookmarkCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}
