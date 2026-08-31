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
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#D9B26A]/80">
          <Search className="h-4 w-4" />
        </div>

        {/* Glass Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl glass-input py-3 pl-11 pr-10 text-sm placeholder:text-stone-300/60 transition-all focus:outline-none"
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Hapus pencarian"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-300/60 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
