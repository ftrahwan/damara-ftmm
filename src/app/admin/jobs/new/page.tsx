'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JobForm } from '@/components/admin/JobForm';
import { createVacancy } from '@/lib/data-service';
import { VacancyFormData } from '@/lib/types';

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (formData: VacancyFormData) => {
    setIsSubmitting(true);
    try {
      await createVacancy(formData);
      router.push('/');
    } catch (err) {
      console.error('Failed to create vacancy:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <JobForm
        onSave={handleSave}
        onCancel={() => router.push('/')}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
