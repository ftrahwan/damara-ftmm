import { createClient } from './supabase/client';

export interface AdminUser {
  email: string;
  role: string;
  name?: string;
  loggedInAt?: string;
}

const AUTH_STORAGE_KEY = 'damara_admin_session';

/**
 * Log in strictly using credentials registered in Supabase Auth.
 */
export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedInputEmail = email.trim().toLowerCase();

  const supabase = createClient();
  if (!supabase) {
    return {
      success: false,
      error: 'Konfigurasi Supabase tidak ditemukan. Pastikan URL dan Anon Key sudah terpasang di file .env.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedInputEmail,
      password,
    });

    if (error) {
      let errorMsg = error.message;
      if (error.message.toLowerCase().includes('invalid login credentials')) {
        errorMsg = 'Email atau kata sandi salah. Pastikan akun sudah terdaftar di Supabase Auth.';
      } else if (error.message.toLowerCase().includes('email not confirmed')) {
        errorMsg = 'Email belum dikonfirmasi di Supabase Auth. Silakan cek inbox/spam email Anda.';
      }
      return { success: false, error: errorMsg };
    }

    if (data.session && data.user) {
      if (typeof window !== 'undefined') {
        const sessionData: AdminUser = {
          email: data.user.email || normalizedInputEmail,
          role: 'admin',
          name:
            (data.user.user_metadata as { name?: string })?.name ||
            (data.user.email ? data.user.email.split('@')[0] : 'Administrator FTMM'),
          loggedInAt: new Date().toISOString(),
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
        document.cookie = `damara_auth=admin_logged_in; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=604800; SameSite=Lax`;
      }
      return { success: true };
    }

    return {
      success: false,
      error: 'Gagal memperoleh sesi login dari Supabase.',
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Gagal terhubung ke layanan Supabase Auth.';
    return { success: false, error: msg };
  }
}

/**
 * Log out and clear Supabase session, local storage, and cookies.
 */
export async function adminLogout(): Promise<void> {
  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout failed:', e);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = `damara_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    document.cookie = `sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  }
}

/**
 * Retrieve the active admin session.
 */
export function getAdminSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const session = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!session) return null;
    return JSON.parse(session);
  } catch {
    return null;
  }
}
