import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Panel Admin — DAMARA FTMM',
  description: 'Sistem Manajemen Konten Lowongan Magang FTMM UNAIR',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
