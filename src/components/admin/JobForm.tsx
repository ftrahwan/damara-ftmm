'use client';

import React, { useState } from 'react';
import { Vacancy, VacancyFormData } from '@/lib/types';
import { FTMM_PRODI_LIST } from '@/lib/mock-data';
import { isValidUrl } from '@/lib/utils';
import { ArrowLeft, Check, X, AlertCircle } from 'lucide-react';

interface JobFormProps {
  initialData?: Vacancy | null;
  onSave: (data: VacancyFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function JobForm({
  initialData,
  onSave,
  onCancel,
  isSubmitting = false,
}: JobFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [sourceUrl, setSourceUrl] = useState(initialData?.source_url || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [selectedProdis, setSelectedProdis] = useState<string[]>(
    initialData?.prodi_tags || ['Robotika & AI']
  );
  const [isActive, setIsActive] = useState<boolean>(
    initialData ? initialData.is_active : true
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const toggleProdi = (prodiName: string) => {
    setSelectedProdis((prev) => {
      if (prev.includes(prodiName)) {
        if (prev.length === 1) return prev; // minimal pilih 1 prodi
        return prev.filter((p) => p !== prodiName);
      } else {
        return [...prev, prodiName];
      }
    });
  };

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!title.trim()) {
      errs.title = 'Judul posisi wajib diisi';
    } else if (title.length > 100) {
      errs.title = 'Maksimal 100 karakter';
    }

    if (!company.trim()) {
      errs.company = 'Nama perusahaan wajib diisi';
    } else if (company.length > 100) {
      errs.company = 'Maksimal 100 karakter';
    }

    if (!location.trim()) {
      errs.location = 'Lokasi wajib diisi';
    } else if (location.length > 100) {
      errs.location = 'Maksimal 100 karakter';
    }

    if (!sourceUrl.trim()) {
      errs.sourceUrl = 'Tautan sumber wajib diisi';
    } else if (!isValidUrl(sourceUrl)) {
      errs.sourceUrl = 'Format URL tidak valid (harus diawali http:// atau https://)';
    }

    if (!description.trim()) {
      errs.description = 'Deskripsi lowongan wajib diisi';
    } else if (description.length > 500) {
      errs.description = 'Maksimal 500 karakter';
    }

    if (selectedProdis.length === 0) {
      errs.prodis = 'Pilih minimal 1 program studi';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSave({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      source_url: sourceUrl.trim(),
      description: description.trim(),
      prodi_tags: selectedProdis,
      is_active: isActive,
    });
  };

  // Color mappings for the 5 prodi pill containers in form
  const getProdiCardStyle = (name: string, isSelected: boolean) => {
    if (name.includes('Robotika')) {
      return isSelected
        ? 'bg-[#9CA3AF]/40 border-[#9CA3AF] text-white shadow-md'
        : 'bg-black/30 border-white/10 text-stone-300 opacity-60';
    }
    if (name.includes('Elektro')) {
      return isSelected
        ? 'bg-[#F4C542]/40 border-[#F4C542] text-amber-100 shadow-md'
        : 'bg-black/30 border-white/10 text-stone-300 opacity-60';
    }
    if (name.includes('Industri')) {
      return isSelected
        ? 'bg-[#2563EB]/40 border-[#2563EB] text-blue-100 shadow-md'
        : 'bg-black/30 border-white/10 text-stone-300 opacity-60';
    }
    if (name.includes('Data') || name.includes('Sains')) {
      return isSelected
        ? 'bg-[#A855F7]/40 border-[#A855F7] text-purple-100 shadow-md'
        : 'bg-black/30 border-white/10 text-stone-300 opacity-60';
    }
    if (name.includes('Nano')) {
      return isSelected
        ? 'bg-[#EF4444]/40 border-[#EF4444] text-rose-100 shadow-md'
        : 'bg-black/30 border-white/10 text-stone-300 opacity-60';
    }
    return isSelected
      ? 'bg-[#B07A3C]/40 border-[#D9B26A] text-white'
      : 'bg-black/30 border-white/10 text-stone-300 opacity-60';
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Header: < Kembali */}
      <div className="mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Informasi Utama */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-xl">
          <h2 className="font-heading font-bold text-base sm:text-lg text-[#FAFAFA] mb-4">
            Informasi Utama
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Judul Posisi */}
            <div>
              <label className="block text-stone-200 font-semibold mb-1">
                Judul Posisi
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                placeholder="Cth : AI Engineer"
                className="w-full rounded-2xl glass-input py-2.5 px-4 text-xs sm:text-sm placeholder:text-stone-400/50"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.title ? (
                  <span className="text-rose-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.title}
                  </span>
                ) : <span />}
                <span className="text-[10px] text-stone-400 ml-auto">{title.length}/100</span>
              </div>
            </div>

            {/* Nama Perusahaan / Institusi */}
            <div>
              <label className="block text-stone-200 font-semibold mb-1">
                Nama Perusahaan / Institusi
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                maxLength={100}
                placeholder="Cth : Terra Softech"
                className="w-full rounded-2xl glass-input py-2.5 px-4 text-xs sm:text-sm placeholder:text-stone-400/50"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.company ? (
                  <span className="text-rose-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.company}
                  </span>
                ) : <span />}
                <span className="text-[10px] text-stone-400 ml-auto">{company.length}/100</span>
              </div>
            </div>

            {/* Lokasi */}
            <div>
              <label className="block text-stone-200 font-semibold mb-1">
                Lokasi
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={100}
                placeholder="Cth : Surabaya"
                className="w-full rounded-2xl glass-input py-2.5 px-4 text-xs sm:text-sm placeholder:text-stone-400/50"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.location ? (
                  <span className="text-rose-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.location}
                  </span>
                ) : <span />}
                <span className="text-[10px] text-stone-400 ml-auto">{location.length}/100</span>
              </div>
            </div>

            {/* Sumber URL */}
            <div>
              <label className="block text-stone-200 font-semibold mb-1">
                Sumber
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://linkedin.com/"
                className="w-full rounded-2xl glass-input py-2.5 px-4 text-xs sm:text-sm placeholder:text-stone-400/50"
              />
              {errors.sourceUrl && (
                <span className="text-rose-400 text-[11px] flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.sourceUrl}
                </span>
              )}
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-stone-200 font-semibold mb-1">
                Deskripsi
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Ringkasan singkat mengenai lowongan magang..."
                className="w-full rounded-2xl glass-input py-2.5 px-4 text-xs sm:text-sm placeholder:text-stone-400/50 resize-none"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description ? (
                  <span className="text-rose-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.description}
                  </span>
                ) : <span />}
                <span className="text-[10px] text-stone-400 ml-auto">{description.length}/500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Program Studi (Mockup 3) */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#FAFAFA]">
              Program Studi
            </h2>
            <span className="text-[11px] text-stone-300/80">Minimal memilih 1 prodi</span>
          </div>

          {errors.prodis && (
            <div className="text-rose-400 text-xs flex items-center gap-1 mb-3">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.prodis}
            </div>
          )}

          <div className="space-y-2.5">
            {FTMM_PRODI_LIST.map((prodi) => {
              const isSelected = selectedProdis.includes(prodi.name);
              const cardStyle = getProdiCardStyle(prodi.name, isSelected);

              return (
                <button
                  key={prodi.id}
                  type="button"
                  onClick={() => toggleProdi(prodi.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-200 cursor-pointer ${cardStyle}`}
                >
                  <span className="font-semibold text-xs sm:text-sm">{prodi.name}</span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${isSelected
                        ? 'bg-white text-[#5B3A1E] shadow-sm'
                        : 'border border-white/40 bg-transparent'
                      }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Status Lowongan Toggle */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="block font-semibold text-xs sm:text-sm text-stone-200">
                Status Lowongan
              </span>
              <span className="text-[11px] text-stone-400">
                {isActive ? 'Aktif (Tampil di publik)' : 'Nonaktif (Tersembunyi dari publik)'}
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B07A3C]"></div>
            </label>
          </div>
        </div>

        {/* Action Buttons: Batal & Simpan (Mockup 3) */}
        <div className="flex items-center justify-center sm:justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl border border-white/20 bg-black/20 text-stone-300 hover:bg-white/10 hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Batal</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-2.5 rounded-2xl glass-btn-primary text-xs sm:text-sm font-bold text-white shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
