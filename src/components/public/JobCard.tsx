'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Vacancy } from '@/lib/types';
import { formatDateID, getProdiBadgeStyle } from '@/lib/utils';
import {
  Building2,
  MapPin,
  ExternalLink,
  MoreHorizontal,
  Edit,
  EyeOff,
  Eye,
  Trash2,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';

interface JobCardProps {
  job: Vacancy;
  isAdmin?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  onEdit?: (job: Vacancy) => void;
  onToggleStatus?: (id: string, currentStatus: boolean) => void;
  onDelete?: (job: Vacancy) => void;
}

export function JobCard({
  job,
  isAdmin = false,
  isBookmarked = false,
  onToggleBookmark,
  onEdit,
  onToggleStatus,
  onDelete,
}: JobCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const formattedDate = formatDateID(job.created_at);

  return (
    <article
      className={`relative glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 ${
        !job.is_active ? 'opacity-70 border-dashed border-stone-500/50' : ''
      }`}
    >
      <div>
        {/* Top Row: Prodi Badges & Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {job.prodi_tags && job.prodi_tags.length > 0 ? (
              job.prodi_tags.map((tag) => {
                const style = getProdiBadgeStyle(tag);
                return (
                  <span
                    key={tag}
                    style={{ backgroundColor: style.bgHex, color: style.textColor }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold shadow-xs tracking-wide"
                  >
                    {tag}
                  </span>
                );
              })
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#B07A3C] text-white">
                FTMM
              </span>
            )}

            {/* Inactive Badge for Admin */}
            {isAdmin && !job.is_active && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-700/80 text-stone-300 border border-stone-500/40">
                Nonaktif
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Student Bookmark Action (Public mode) */}
            {!isAdmin && onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(job.id)}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  isBookmarked
                    ? 'text-[#F4C542] bg-[#F4C542]/20'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/10'
                }`}
                title={isBookmarked ? 'Hapus dari tersimpan' : 'Simpan lowongan ini'}
                aria-label={isBookmarked ? 'Hapus dari tersimpan' : 'Simpan lowongan ini'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Admin Three Dots Menu (Mockup 2) */}
            {isAdmin && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Menu Aksi Lowongan"
                  aria-label="Menu Aksi Lowongan"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {/* Action Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 top-8 z-30 w-44 rounded-2xl bg-[#3E2412]/95 backdrop-blur-xl border border-[#D9B26A]/30 p-1.5 shadow-2xl text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit?.(job);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-stone-200 hover:bg-[#B07A3C]/40 hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#D9B26A]" />
                      <span>Edit Lowongan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onToggleStatus?.(job.id, job.is_active);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-stone-200 hover:bg-[#B07A3C]/40 hover:text-white transition-colors cursor-pointer"
                    >
                      {job.is_active ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                          <span>Nonaktifkan</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Aktifkan</span>
                        </>
                      )}
                    </button>

                    <div className="my-1 border-t border-white/10" />

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete?.(job);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-rose-300 hover:bg-rose-900/40 hover:text-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Permanen</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Job Title */}
        <h3 className="font-heading font-bold text-lg sm:text-xl text-[#FAFAFA] leading-snug tracking-tight mb-2">
          {job.title}
        </h3>

        {/* Company & Location Metadata */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-300/80 mb-3">
          <div className="flex items-center gap-1.5 font-medium">
            <Building2 className="w-3.5 h-3.5 text-[#D9B26A]" />
            <span>{job.company}</span>
          </div>
          {job.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D9B26A]/80" />
              <span>{job.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <p className="text-xs leading-relaxed text-stone-300/80 line-clamp-3 mb-4 font-light">
            {job.description}
          </p>
        )}
      </div>

      {/* Card Footer: Date & "Lebih Lengkap ↗" Button */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 mt-2">
        <span className="text-[11px] font-medium text-stone-400">
          {formattedDate}
        </span>

        <a
          href={job.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass-btn-primary text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <span>Lebih Lengkap</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
}
