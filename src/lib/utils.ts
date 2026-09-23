import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to standard Indonesian format: e.g. "Ditambahkan 24 Agustus"
 */
export function formatDateID(dateString: string | null | undefined): string {
  if (!dateString) return 'Baru saja';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Baru saja';

    const day = date.getDate();
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `Ditambahkan ${day} ${months[date.getMonth()]}`;
  } catch {
    return 'Baru saja';
  }
}

/**
 * Get visual badge colors according to FTMM prodi color identity:
 * - Rekayasa Nano: #EF4444 (Red)
 * - Sains Data: #A855F7 (Purple)
 * - Industri: #2563EB (Blue)
 * - Elektro: #F4C542 (Golden Yellow)
 * - Robotika & AI: #9CA3AF (Slate Gray)
 */
export function getProdiBadgeStyle(prodiNameOrSlug: string): {
  bgHex: string;
  textColor: string;
  bgClass: string;
  borderClass: string;
} {
  const normalized = (prodiNameOrSlug || '').toLowerCase().trim();

  if (normalized.includes('nano')) {
    return {
      bgHex: '#EF4444',
      textColor: '#FFFFFF',
      bgClass: 'bg-[#EF4444] text-white',
      borderClass: 'border-[#EF4444]/40',
    };
  }

  if (normalized.includes('sains') || normalized.includes('data')) {
    return {
      bgHex: '#A855F7',
      textColor: '#FFFFFF',
      bgClass: 'bg-[#A855F7] text-white',
      borderClass: 'border-[#A855F7]/40',
    };
  }

  if (normalized.includes('industri')) {
    return {
      bgHex: '#2563EB',
      textColor: '#FFFFFF',
      bgClass: 'bg-[#2563EB] text-white',
      borderClass: 'border-[#2563EB]/40',
    };
  }

  if (normalized.includes('elektro')) {
    return {
      bgHex: '#F4C542',
      textColor: '#5B3A1E',
      bgClass: 'bg-[#F4C542] text-[#5B3A1E] font-bold',
      borderClass: 'border-[#F4C542]/40',
    };
  }

  if (normalized.includes('robotika') || normalized.includes('ai')) {
    return {
      bgHex: '#9CA3AF',
      textColor: '#FFFFFF',
      bgClass: 'bg-[#9CA3AF] text-white',
      borderClass: 'border-[#9CA3AF]/40',
    };
  }

  // Fallback
  return {
    bgHex: '#B07A3C',
    textColor: '#FFFFFF',
    bgClass: 'bg-[#B07A3C] text-white',
    borderClass: 'border-[#B07A3C]/40',
  };
}

export const getProgramBadgeStyle = getProdiBadgeStyle;

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
