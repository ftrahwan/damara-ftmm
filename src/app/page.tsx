'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, usePathname } from 'next/navigation';
import { HeroSection } from '@/components/public/HeroSection';
import { SearchBar } from '@/components/public/SearchBar';
import { ProgramFilter } from '@/components/public/ProgramFilter';
import { JobCard } from '@/components/public/JobCard';
import { JobCardSkeleton } from '@/components/public/JobCardSkeleton';
import { EmptyState } from '@/components/public/EmptyState';
import { JobForm } from '@/components/admin/JobForm';
import { AdminAuthModal } from '@/components/admin/AdminAuthModal';
import { DeleteModal } from '@/components/admin/DeleteModal';
import { ToastContainer, ToastMessage, ToastType } from '@/components/ui/Toast';
import {
  getPublicVacancies,
  getAllVacanciesAdmin,
  createVacancy,
  updateVacancy,
  toggleVacancyStatus,
  deleteVacancy,
  subscribeToVacancies,
} from '@/lib/data-service';
import { Vacancy, VacancyFormData } from '@/lib/types';
import { getAdminSession, adminLogout } from '@/lib/auth';
import { Plus, Phone, Send, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

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

  // Student bookmarks state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin state - lazy initialized from session
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(getAdminSession());
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingVacancy, setDeletingVacancy] = useState<Vacancy | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Fetch vacancies data
  const fetchData = useCallback(() => {
    const fetcher = isAdmin ? getAllVacanciesAdmin() : getPublicVacancies();

    fetcher
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
  }, [isAdmin]);

  // Initial fetch and Real-time subscription to Supabase changes
  useEffect(() => {
    let isMounted = true;
    const fetcher = isAdmin ? getAllVacanciesAdmin() : getPublicVacancies();

    fetcher
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
  }, [isAdmin, fetchData]);

  // Handle Admin Logout
  const handleLogout = async () => {
    await adminLogout();
    setIsAdmin(false);
    setIsFormOpen(false);
    setEditingVacancy(null);
    addToast('Anda telah keluar dari sesi admin.', 'info');
    fetchData();
  };

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
    let result = vacancies;

    // In public mode, hide inactive ones
    if (!isAdmin) {
      result = result.filter((v) => v.is_active);
    }

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
  }, [vacancies, searchQuery, selectedProdi, bookmarkedIds, isAdmin]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredVacancies.length / ITEMS_PER_PAGE));
  const paginatedVacancies = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVacancies.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVacancies, currentPage]);

  // Handle Add/Edit Vacancy Save with instant local sync
  const handleSaveVacancy = async (formData: VacancyFormData) => {
    setIsSubmitting(true);
    try {
      if (editingVacancy) {
        // Optimistic update
        setVacancies((prev) =>
          prev.map((v) =>
            v.id === editingVacancy.id
              ? { ...v, ...formData, updated_at: new Date().toISOString() }
              : v
          )
        );
        await updateVacancy(editingVacancy.id, formData);
        addToast('Lowongan berhasil diperbarui!', 'success');
      } else {
        const newVac = await createVacancy(formData);
        // Optimistic prepend
        setVacancies((prev) => [newVac, ...prev.filter((v) => v.id !== newVac.id)]);
        addToast('Lowongan baru berhasil dipublikasikan!', 'success');
      }
      setIsFormOpen(false);
      setEditingVacancy(null);
      fetchData();
    } catch (err) {
      console.error('Error saving vacancy:', err);
      addToast('Gagal menyimpan data lowongan.', 'error');
      fetchData();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Status Toggle with instant Optimistic UI update
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    // Immediate Optimistic Update
    setVacancies((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, is_active: nextStatus, updated_at: new Date().toISOString() } : v
      )
    );

    try {
      await toggleVacancyStatus(id, nextStatus);
      addToast(
        `Status lowongan diubah menjadi ${nextStatus ? 'Aktif' : 'Nonaktif'}.`,
        'info'
      );
      fetchData();
    } catch (err) {
      console.error('Error toggling status:', err);
      addToast('Gagal memperbarui status lowongan.', 'error');
      fetchData(); // Rollback on error
    }
  };

  // Handle Delete Confirmation with instant Optimistic UI update
  const handleConfirmDelete = async () => {
    if (!deletingVacancy) return;
    const target = deletingVacancy;
    setIsDeleting(true);

    // Immediate Optimistic Update
    setVacancies((prev) => prev.filter((v) => v.id !== target.id));

    try {
      await deleteVacancy(target.id);
      addToast(`Lowongan "${target.title}" telah dihapus.`, 'success');
      setDeletingVacancy(null);
      fetchData();
    } catch (err) {
      console.error('Error deleting vacancy:', err);
      addToast('Gagal menghapus lowongan.', 'error');
      fetchData(); // Rollback on error
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* View Mode: Job Form (Mockup 3) OR Job List (Mockup 1 & 2) */}
        {isFormOpen ? (
          <div className="py-8 sm:py-12">
            <JobForm
              initialData={editingVacancy}
              onSave={handleSaveVacancy}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingVacancy(null);
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          <>
            {/* Hero Section (Hidden when adding/editing jobs) */}
            <HeroSection
              isAdmin={isAdmin}
              onLogout={handleLogout}
              onOpenAdminLogin={() => setIsAuthModalOpen(true)}
            />

            <div className="space-y-6 pb-16">
              {/* Search Bar (Mockup 1 & 2) */}
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

              {/* Section Header: "Daftar Lowongan" & "+ Tambah" (Mockup 2) */}
              <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-bold text-lg sm:text-xl text-[#FAFAFA] tracking-tight">
                    {selectedProdi === 'saved' ? 'Lowongan Tersimpan' : 'Daftar Lowongan'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#B07A3C]/40 border border-[#D9B26A]/40 text-[#FAFAFA]">
                    {filteredVacancies.length}
                  </span>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingVacancy(null);
                      setIsFormOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl glass-btn-primary text-xs font-bold text-white shadow-lg cursor-pointer transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah</span>
                  </button>
                )}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paginatedVacancies.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isAdmin={isAdmin}
                        isBookmarked={bookmarkedIds.includes(job.id)}
                        onToggleBookmark={handleToggleBookmark}
                        onEdit={(item) => {
                          setEditingVacancy(item);
                          setIsFormOpen(true);
                        }}
                        onToggleStatus={handleToggleStatus}
                        onDelete={(item) => setDeletingVacancy(item)}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls (Mockup 1 & 2) */}
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
          </>
        )}
      </div>

      {/* Footer Branding Kabinet Mandala FTMM UNAIR (Hidden when adding/editing jobs) */}
      {!isFormOpen && (
        <footer className="w-full border-t border-white/10 bg-[#351E0E]/80 backdrop-blur-xl mt-auto py-8 text-stone-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Kabinet Mandala Official Logo & Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-block">
                  <Image
                    src="/logo-mandala.png"
                    alt="Logo Kabinet Mandala BEM FTMM UNAIR — Makna, Daya, Laksana"
                    width={260}
                    height={82}
                    className="h-12 sm:h-14 w-auto object-contain select-none"
                    priority
                  />
                </div>
                <p className="text-xs text-stone-300/80 font-normal">
                  Gedung Nano, Kampus C UNAIR, Kota Surabaya
                </p>
              </div>

              {/* Kontak Section */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-[#FAFAFA] tracking-wide uppercase">Kontak</h5>
                <div className="space-y-1.5 text-xs text-stone-300/80">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#D9B26A]" />
                    <a
                      href="https://wa.me/628577795167"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#D9B26A] transition-colors"
                    >
                      +62-857-7795-167
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-[#D9B26A]" />
                    <a
                      href="https://instagram.com/psdm.bemftmm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#D9B26A] transition-colors"
                    >
                      psdm.bemftmm
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-[11px] text-stone-400 text-center sm:text-left">
              &copy; {new Date().getFullYear()} DAMARA (Daya Magang Industri Mandala) &bull; BEM FTMM Universitas Airlangga
            </div>
          </div>
        </footer>
      )}

      {/* Admin Login Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAdmin(true);
          addToast('Selamat datang, Admin BEM FTMM!', 'success');
          fetchData();
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingVacancy}
        jobTitle={deletingVacancy?.title || ''}
        onClose={() => setDeletingVacancy(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

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
