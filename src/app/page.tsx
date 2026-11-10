'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { HeroSection } from '@/components/public/HeroSection';
import { SearchBar } from '@/components/public/SearchBar';
import { ProgramFilter } from '@/components/public/ProgramFilter';
import { JobCard } from '@/components/public/JobCard';
import { JobCardSkeleton } from '@/components/public/JobCardSkeleton';
import { EmptyState } from '@/components/public/EmptyState';
import { ToastContainer, ToastMessage, ToastType } from '@/components/ui/Toast';
import {
  getPublicVacancies,
  subscribeToVacancies,
} from '@/lib/data-service';
import { Vacancy } from '@/lib/types';
import { ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

const ITEMS_PER_PAGE = 6;
const BOOKMARK_STORAGE_KEY = 'damara_bookmarked_ids';

function DamaraApp() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL search params sync
  const initialSearch = searchParams.get('q') || '';
  const initialProdi = searchParams.get('prodi') || 'all';

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedProdi, setSelectedProdi] = useState(initialProdi);

  // Student bookmarks state (initialized consistently for SSR)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Load client localStorage after hydration
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
        if (saved) {
          setBookmarkedIds(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to parse bookmarks:', e);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  // Sync state to URL params (shallow routing without reload)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    if (selectedProdi && selectedProdi !== 'all') {
      params.set('prodi', selectedProdi);
    }
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    window.history.replaceState(null, '', newUrl);
  }, [searchQuery, selectedProdi, pathname]);

  // Fetch public vacancies
  const fetchData = useCallback(() => {
    getPublicVacancies()
      .then((data) => {
        setVacancies(data);
        setIsLoading(false);
        setHasError(false);
      })
      .catch((err) => {
        console.error('Error fetching vacancies:', err);
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  // Initial fetch + real-time subscription to Supabase changes
  useEffect(() => {
    let isMounted = true;

    getPublicVacancies()
      .then((data) => {
        if (isMounted) {
          setVacancies(data);
          setIsLoading(false);
          setHasError(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching vacancies:', err);
          setHasError(true);
          setIsLoading(false);
        }
      });

    // Subscribe to Postgres real-time changes
    const unsubscribe = subscribeToVacancies(() => {
      fetchData();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [fetchData]);

  // Handle student bookmark toggle
  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      let updated: string[];
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
        addToast('Lowongan dihapus dari tersimpan.', 'info');
      } else {
        updated = [...prev, id];
        addToast('Lowongan disimpan ke daftar favorit!', 'success');
      }
      try {
        localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save bookmark:', e);
      }
      return updated;
    });
  };

  // Filter vacancies based on search query, selected prodi, and bookmarks
  const filteredVacancies = useMemo(() => {
    // Only verified active vacancies appear publicly; unknown rows stay hidden.
    let result = vacancies.filter(
      (v) => v.is_active && (!v.vacancy_status || v.vacancy_status === 'active')
    );

    // Filter by bookmarks if 'saved' tab is active
    if (selectedProdi === 'saved') {
      result = result.filter((v) => bookmarkedIds.includes(v.id));
    } else if (selectedProdi && selectedProdi !== 'all' && selectedProdi !== 'Semua') {
      result = result.filter((v) =>
        v.prodi_tags.some((tag) => tag.toLowerCase() === selectedProdi.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((v) => {
        const matchTitle = v.title.toLowerCase().includes(q);
        const matchCompany = v.company.toLowerCase().includes(q);
        const matchLocation = v.location ? v.location.toLowerCase().includes(q) : false;
        return matchTitle || matchCompany || matchLocation;
      });
    }

    return result;
  }, [vacancies, searchQuery, selectedProdi, bookmarkedIds]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredVacancies.length / ITEMS_PER_PAGE));
  const paginatedVacancies = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVacancies.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVacancies, currentPage]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <HeroSection />

        <div className="space-y-5 pb-12 sm:pb-16">
          {/* Search Bar */}
          <div className="px-2">
            <SearchBar
              value={searchQuery}
              onChange={(q) => {
                setSearchQuery(q);
                setCurrentPage(1);
              }}
              placeholder="Temukan Lowongan"
            />
          </div>

          {/* Prodi Filter Pills */}
          <ProgramFilter
            selectedTag={selectedProdi}
            onSelectTag={(tag) => {
              setSelectedProdi(tag);
              setCurrentPage(1);
            }}
            bookmarkCount={bookmarkedIds.length}
          />

          {/* Section Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <h2 className="font-heading font-bold text-base sm:text-xl text-[#fffaf0] tracking-tight">
              {selectedProdi === 'saved' ? 'Lowongan Tersimpan' : 'Daftar Lowongan'}
            </h2>
          </div>

          {/* Content States */}
          {isLoading ? (
            <JobCardSkeleton />
          ) : hasError ? (
            <div className="glass-card rounded-3xl p-8 text-center max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-base text-rose-200 mb-1">
                Gagal Memuat Data Lowongan
              </h3>
              <p className="text-xs text-stone-300 mb-4">
                Silakan periksa koneksi internet atau coba beberapa saat lagi.
              </p>
              <button
                type="button"
                onClick={fetchData}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-btn-primary text-xs font-bold text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>
            </div>
          ) : filteredVacancies.length === 0 ? (
            <EmptyState
              onReset={() => {
                setSearchQuery('');
                setSelectedProdi('all');
              }}
              message={
                selectedProdi === 'saved'
                  ? 'Belum ada lowongan yang Anda simpan. Tekan ikon bookmark pada kartu lowongan untuk menyimpannya.'
                  : 'Tidak ada lowongan yang sesuai. Coba ubah kata kunci atau filter prodi.'
              }
            />
          ) : (
            <>
              {/* Job Cards Responsive Grid: Mobile 1 col, Tablet 2 col, Desktop 3 col */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {paginatedVacancies.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isBookmarked={bookmarkedIds.includes(job.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-stone-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                        currentPage === pageNum
                          ? 'glass-pill-active scale-110 shadow-md'
                          : 'glass-pill'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-stone-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                    aria-label="Halaman berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#FAFAFA]">Memuat DAMARA...</div>}>
      <DamaraApp />
    </Suspense>
  );
}
