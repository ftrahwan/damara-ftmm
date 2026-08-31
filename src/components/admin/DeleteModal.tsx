'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  jobTitle: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteModal({
  isOpen,
  jobTitle,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-card rounded-3xl p-6 shadow-2xl border border-rose-500/30">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-[#FAFAFA]">
              Konfirmasi Hapus Lowongan
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-300/80 leading-relaxed">
              Apakah Anda yakin ingin menghapus lowongan{' '}
              <strong className="font-bold text-white">
                &ldquo;{jobTitle}&rdquo;
              </strong>
              ? Tindakan ini bersifat permanen.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-2xl border border-white/20 bg-black/20 px-4 py-2 text-xs font-semibold text-stone-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-2xl bg-rose-600 hover:bg-rose-700 px-5 py-2 text-xs font-bold text-white shadow-lg transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Lowongan'}
          </button>
        </div>
      </div>
    </div>
  );
}
