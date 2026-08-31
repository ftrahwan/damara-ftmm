'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { JobForm } from '@/components/admin/JobForm';
import { getVacancyById, updateVacancy } from '@/lib/data-service';
import { Vacancy, VacancyFormData } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      getVacancyById(id).then((data) => {
        setVacancy(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  const handleSave = async (formData: VacancyFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateVacancy(id, formData);
      router.push('/');
    } catch (err) {
      console.error('Failed to update vacancy:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-200">
        <Loader2 className="w-6 h-6 animate-spin text-[#D9B26A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <JobForm
        initialData={vacancy}
        onSave={handleSave}
        onCancel={() => router.push('/')}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
