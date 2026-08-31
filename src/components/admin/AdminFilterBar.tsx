'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { FTMM_PRODI_LIST } from '@/lib/mock-data';

export type StatusFilterOption = 'all' | 'active' | 'inactive';

interface AdminFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: StatusFilterOption;
  onStatusChange: (status: StatusFilterOption) => void;
  selectedProdi: string;
  onProdiChange: (prodi: string) => void;
}

const STATUS_OPTIONS: { label: string; value: StatusFilterOption }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Aktif', value: 'active' },
  { label: 'Nonaktif', value: 'inactive' },
];

export function AdminFilterBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedProdi,
  onProdiChange,
}: AdminFilterBarProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isProdiOpen, setIsProdiOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const prodiRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false);
      }
      if (
        prodiRef.current &&
        !prodiRef.current.contains(event.target as Node)
      ) {
        setIsProdiOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsStatusOpen(false);
        setIsProdiOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentStatusLabel =
    STATUS_OPTIONS.find((opt) => opt.value === selectedStatus)?.label || 'Semua';

  const currentProdiLabel =
    !selectedProdi || selectedProdi === 'all' || selectedProdi === 'Semua'
      ? 'Semua'
      : selectedProdi;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* 1. Top Search Bar (Capsule Pill Style) */}
      <div className="relative w-full">
        <div className="relative flex items-center h-12 bg-[#9E6935] hover:bg-[#A8723C] focus-within:bg-[#A8723C] rounded-full border border-[#D9B26A]/25 shadow-md transition-all">
          {/* Search Icon */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[#DEBE7E]">
            <Search className="h-5 w-5" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Temukan Lowongan"
            className="w-full bg-transparent py-3 pl-12 pr-10 text-sm font-semibold text-[#FAFAFA] placeholder:text-[#DEBE7E] focus:outline-none"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Hapus pencarian"
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#DEBE7E] hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Bottom Row: 2 Dropdown Pills side by side */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Status Filter Dropdown */}
        <div className="relative" ref={statusRef}>
          <button
            type="button"
            onClick={() => {
              setIsStatusOpen((prev) => !prev);
              setIsProdiOpen(false);
            }}
            className="w-full h-12 flex items-center justify-between px-5 bg-[#9E6935] hover:bg-[#A8723C] rounded-full border border-[#D9B26A]/25 shadow-md text-sm font-bold text-[#DEBE7E] hover:text-[#FAFAFA] transition-all cursor-pointer"
          >
            <span className="truncate">{currentStatusLabel}</span>
            <ChevronDown
              className={`w-4 h-4 shrink-0 text-[#DEBE7E] transition-transform duration-200 ${
                isStatusOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Status Dropdown Menu */}
          {isStatusOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl glass-card border border-[#D9B26A]/40 p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="space-y-1">
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = selectedStatus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onStatusChange(opt.value);
                        setIsStatusOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#B07A3C]/50 text-[#FAFAFA] font-bold'
                          : 'text-stone-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#D9B26A]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Program Studi Filter Dropdown */}
        <div className="relative" ref={prodiRef}>
          <button
            type="button"
            onClick={() => {
              setIsProdiOpen((prev) => !prev);
              setIsStatusOpen(false);
            }}
            className="w-full h-12 flex items-center justify-between px-5 bg-[#9E6935] hover:bg-[#A8723C] rounded-full border border-[#D9B26A]/25 shadow-md text-sm font-bold text-[#DEBE7E] hover:text-[#FAFAFA] transition-all cursor-pointer"
          >
            <span className="truncate">{currentProdiLabel}</span>
            <ChevronDown
              className={`w-4 h-4 shrink-0 text-[#DEBE7E] transition-transform duration-200 ${
                isProdiOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Prodi Dropdown Menu */}
          {isProdiOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl glass-card border border-[#D9B26A]/40 p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto">
              <div className="space-y-1">
                {/* Option Semua */}
                <button
                  type="button"
                  onClick={() => {
                    onProdiChange('all');
                    setIsProdiOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    !selectedProdi || selectedProdi === 'all' || selectedProdi === 'Semua'
                      ? 'bg-[#B07A3C]/50 text-[#FAFAFA] font-bold'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>Semua</span>
                  {(!selectedProdi || selectedProdi === 'all' || selectedProdi === 'Semua') && (
                    <Check className="w-3.5 h-3.5 text-[#D9B26A]" />
                  )}
                </button>

                {/* Prodi List */}
                {FTMM_PRODI_LIST.map((p) => {
                  const isSelected = selectedProdi === p.name;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onProdiChange(p.name);
                        setIsProdiOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#B07A3C]/50 text-[#FAFAFA] font-bold'
                          : 'text-stone-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#D9B26A]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
