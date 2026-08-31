'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Temukan Lowongan',
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center h-12 bg-[#9E6935] hover:bg-[#A8723C] focus-within:bg-[#A8723C] rounded-full border border-[#D9B26A]/25 shadow-md transition-all">
        {/* Search Icon */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[#DEBE7E]">
          <Search className="h-5 w-5" />
        </div>

        {/* Capsule Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 pl-12 pr-10 text-sm font-semibold text-[#FAFAFA] placeholder:text-[#DEBE7E] focus:outline-none"
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Hapus pencarian"
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#DEBE7E] hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
