'use client';

import React, { useState } from 'react';
import { adminLogin } from '@/lib/auth';
import { Shield, Key, Mail, X, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminAuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const res = await adminLogin(email.trim(), password);
    setIsLoading(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMessage(res.error || 'Autentikasi gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D9B26A]/30">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#B07A3C]/40 border border-[#D9B26A]/40 flex items-center justify-center text-[#D9B26A] mb-3 shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-bold text-xl text-[#FAFAFA]">
            Akses Admin DAMARA
          </h2>
          <p className="text-xs text-stone-300/80 mt-1">
            Masuk untuk mengelola data lowongan magang BEM FTMM
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-stone-200 font-semibold mb-1">
              Email Administrator
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
                <Mail className="w-4 h-4 text-[#D9B26A]" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ftmm.unair.ac.id"
                className="w-full rounded-2xl glass-input py-2.5 pl-10 pr-4 text-xs sm:text-sm placeholder:text-stone-400/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-200 font-semibold mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
                <Key className="w-4 h-4 text-[#D9B26A]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl glass-input py-2.5 pl-10 pr-10 text-xs sm:text-sm placeholder:text-stone-400/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full glass-btn-primary font-bold text-xs sm:text-sm text-white shadow-lg cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi dengan Supabase...</span>
                </>
              ) : (
                <span>Masuk Sesi Admin</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
