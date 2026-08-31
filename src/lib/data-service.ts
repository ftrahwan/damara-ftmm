import { createClient } from './supabase/client';
import {
  Vacancy,
  VacancyFormData,
  FilterParams,
  ProgramOption,
} from './types';
import { FTMM_PRODI_LIST, INITIAL_MOCK_VACANCIES } from './mock-data';

const LOCAL_STORAGE_KEY = 'damara_vacancies_data';

// Helper for local mock storage in browser
function getLocalVacancies(): Vacancy[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_VACANCIES;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_VACANCIES));
      return INITIAL_MOCK_VACANCIES;
    }
    return JSON.parse(saved);
  } catch {
    return INITIAL_MOCK_VACANCIES;
  }
}

function saveLocalVacancies(vacancies: Vacancy[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(vacancies));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
}

/**
 * Subscribe to Real-time database changes on the vacancies table
 */
export function subscribeToVacancies(onUpdate: () => void): () => void {
  const supabase = createClient();
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel('public:vacancies:realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vacancies' },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.warn('Realtime subscription error:', e);
    return () => {};
  }
}

/**
 * Fetch all FTMM Programs
 */
export async function getPrograms(): Promise<ProgramOption[]> {
  return FTMM_PRODI_LIST;
}

/**
 * Fetch Public Active Vacancies with search and prodi filter
 */
export async function getPublicVacancies(params: FilterParams = {}): Promise<Vacancy[]> {
  const { searchQuery = '', prodiTag = '' } = params;
  const supabase = createClient();

  if (supabase) {
    try {
      let query = supabase
        .from('vacancies')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (searchQuery.trim()) {
        const term = `%${searchQuery.trim()}%`;
        query = query.or(`title.ilike.${term},company.ilike.${term},location.ilike.${term}`);
      }

      if (prodiTag && prodiTag !== 'Semua' && prodiTag !== 'all') {
        query = query.contains('prodi_tags', [prodiTag]);
      }

      const { data, error } = await query;

      if (!error && data) {
        return data as Vacancy[];
      }
    } catch (e) {
      console.warn('Supabase query failed, falling back to local dataset:', e);
    }
  }

  // Fallback Local Filtering (Matching Supabase SQL behavior)
  let items = getLocalVacancies().filter((v) => v.is_active);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    items = items.filter((v) => {
      const matchTitle = v.title.toLowerCase().includes(q);
      const matchCompany = v.company.toLowerCase().includes(q);
      const matchLocation = v.location ? v.location.toLowerCase().includes(q) : false;
      return matchTitle || matchCompany || matchLocation;
    });
  }

  if (prodiTag && prodiTag !== 'Semua' && prodiTag !== 'all') {
    items = items.filter((v) =>
      v.prodi_tags.some((tag) => tag.toLowerCase() === prodiTag.toLowerCase())
    );
  }

  return items.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Fetch All Vacancies for Admin (Both Active and Inactive)
 */
export async function getAllVacanciesAdmin(): Promise<Vacancy[]> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vacancies')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Vacancy[];
      }
    } catch (e) {
      console.warn('Supabase admin fetch failed, using local store:', e);
    }
  }

  return getLocalVacancies().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Fetch a single Vacancy by ID
 */
export async function getVacancyById(id: string): Promise<Vacancy | null> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vacancies')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as Vacancy;
      }
    } catch (e) {
      console.warn('Supabase getVacancyById failed, checking local store:', e);
    }
  }

  const local = getLocalVacancies();
  return local.find((v) => v.id === id) || null;
}

/**
 * Create a new Vacancy
 */
export async function createVacancy(formData: VacancyFormData): Promise<Vacancy> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vacancies')
        .insert({
          title: formData.title,
          company: formData.company,
          location: formData.location || 'Surabaya',
          description: formData.description || '',
          source_url: formData.source_url,
          prodi_tags: formData.prodi_tags,
          is_active: formData.is_active ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        // Keep local storage synced
        const list = getLocalVacancies();
        list.unshift(data as Vacancy);
        saveLocalVacancies(list);
        return data as Vacancy;
      }
    } catch (e) {
      console.warn('Supabase createVacancy failed, saving locally:', e);
    }
  }

  // Fallback Local creation
  const newVacancy: Vacancy = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `vac-${Date.now()}`,
    title: formData.title,
    company: formData.company,
    location: formData.location || 'Surabaya',
    description: formData.description || '',
    source_url: formData.source_url,
    prodi_tags: formData.prodi_tags,
    is_active: formData.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const list = getLocalVacancies();
  list.unshift(newVacancy);
  saveLocalVacancies(list);
  return newVacancy;
}

/**
 * Update an existing Vacancy
 */
export async function updateVacancy(id: string, formData: VacancyFormData): Promise<Vacancy> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vacancies')
        .update({
          title: formData.title,
          company: formData.company,
          location: formData.location || 'Surabaya',
          description: formData.description || '',
          source_url: formData.source_url,
          prodi_tags: formData.prodi_tags,
          is_active: formData.is_active ?? true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        // Keep local storage synced
        const list = getLocalVacancies();
        const idx = list.findIndex((v) => v.id === id);
        if (idx !== -1) {
          list[idx] = data as Vacancy;
        } else {
          list.unshift(data as Vacancy);
        }
        saveLocalVacancies(list);
        return data as Vacancy;
      }
    } catch (e) {
      console.warn('Supabase updateVacancy failed, updating locally:', e);
    }
  }

  // Fallback Local update
  const list = getLocalVacancies();
  const index = list.findIndex((v) => v.id === id);
  if (index === -1) throw new Error('Lowongan tidak ditemukan');

  const updated: Vacancy = {
    ...list[index],
    title: formData.title,
    company: formData.company,
    location: formData.location || 'Surabaya',
    description: formData.description || '',
    source_url: formData.source_url,
    prodi_tags: formData.prodi_tags,
    is_active: formData.is_active ?? list[index].is_active,
    updated_at: new Date().toISOString(),
  };

  list[index] = updated;
  saveLocalVacancies(list);
  return updated;
}

/**
 * Toggle Vacancy Status (Active <-> Inactive)
 */
export async function toggleVacancyStatus(id: string, newStatus: boolean): Promise<void> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { error } = await supabase
        .from('vacancies')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      console.warn('Supabase toggleVacancyStatus failed, toggling locally:', e);
    }
  }

  const list = getLocalVacancies();
  const target = list.find((v) => v.id === id);
  if (target) {
    target.is_active = newStatus;
    target.updated_at = new Date().toISOString();
    saveLocalVacancies(list);
  }
}

/**
 * Delete a Vacancy
 */
export async function deleteVacancy(id: string): Promise<void> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { error } = await supabase.from('vacancies').delete().eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.warn('Supabase deleteVacancy failed, deleting locally:', e);
    }
  }

  const list = getLocalVacancies().filter((v) => v.id !== id);
  saveLocalVacancies(list);
}

// Aliases for compatibility
export const getPublicJobs = getPublicVacancies;
export const getAllJobsAdmin = getAllVacanciesAdmin;
export const getJobById = getVacancyById;
export const createJob = async (data: Record<string, unknown>) => {
  return createVacancy({
    title: (data.title as string) || '',
    company: (data.company as string) || '',
    location: (data.location as string) || '',
    source_url: (data.source_url as string) || '',
    description: (data.description as string) || '',
    prodi_tags: (data.prodi_tags as string[]) || (data.program_ids ? ['Robotika & AI'] : []),
    is_active: data.status === 'ACTIVE' || data.is_active === true,
  });
};
export const updateJob = async (id: string, data: Record<string, unknown>) => {
  return updateVacancy(id, {
    title: (data.title as string) || '',
    company: (data.company as string) || '',
    location: (data.location as string) || '',
    source_url: (data.source_url as string) || '',
    description: (data.description as string) || '',
    prodi_tags: (data.prodi_tags as string[]) || ['Robotika & AI'],
    is_active: data.status === 'ACTIVE' || data.is_active === true,
  });
};
export const toggleJobStatus = async (id: string, statusOrBool: boolean | string) => {
  const isActive = typeof statusOrBool === 'boolean' ? statusOrBool : statusOrBool === 'ACTIVE';
  return toggleVacancyStatus(id, isActive);
};
export const deleteJob = deleteVacancy;

