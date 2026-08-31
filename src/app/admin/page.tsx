'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to SPA main view with admin controls
    router.replace('/');
  }, [router]);

  return null;
}
