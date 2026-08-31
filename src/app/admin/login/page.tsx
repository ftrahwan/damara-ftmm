'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { adminLogin, getAdminSession } from '@/lib/auth';
import { Shield, Key, Mail, ArrowLeft, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already logged in, redirect to admin immediately
  useEffect(() => {
    const session = getAdminSession();
    if (session) {
      router.replace(redirectUrl);
    }
  }, [router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Harap masukkan email dan kata sandi.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await adminLogin(email.trim(), password);

      if (res.success) {
        router.push(redirectUrl);
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Email atau kata sandi tidak valid. Silakan coba lagi.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat mencoba masuk.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="w-full max-w-md">
        {/* Top Header: < Kembali */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>
        </div>

        {/* Glass Login Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D9B26A]/30">
          {/* Header Icon & Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#B07A3C]/40 border border-[#D9B26A]/40 flex items-center justify-center text-[#D9B26A] mb-3 shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-bold text-xl text-[#FAFAFA]">
              Akses Admin DAMARA
            </h1>
            <p className="text-xs text-stone-300/80 mt-1">
              Masuk untuk mengelola direktori lowongan magang BEM FTMM UNAIR
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-stone-200 font-semibold mb-1"
              >
                Email Administrator
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4 text-[#D9B26A]" />
                </div>
                <input
                  id="admin-email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ftmm.unair.ac.id"
                  className="w-full rounded-2xl glass-input py-2.5 pl-10 pr-4 text-xs sm:text-sm placeholder:text-stone-400/50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-stone-200 font-semibold mb-1"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
                  <Key className="w-4 h-4 text-[#D9B26A]" />
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                id="btn-login-submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl glass-btn-primary font-bold text-xs sm:text-sm text-white shadow-lg cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-stone-200">
          Memuat form login...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}

