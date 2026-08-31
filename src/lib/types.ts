export type ProdiName =
  | 'Robotika & AI'
  | 'Teknik Elektro'
  | 'Teknik Industri'
  | 'Sains Data'
  | 'Rekayasa Nano';

export type JobStatus = 'ACTIVE' | 'INACTIVE';

export interface Program {
  id: string;
  name: string;
  slug: string;
  colorHex?: string;
  created_at?: string;
}

export type ProgramOption = Program;

export interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  source_url: string;
  description: string;
  prodi_tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Compatibility fields
  deadline?: string | null;
  status?: JobStatus;
  programs?: Program[];
}

export type Job = Vacancy;
export type JobWithPrograms = Vacancy;

export interface VacancyFormData {
  title: string;
  company: string;
  location: string;
  source_url: string;
  description: string;
  prodi_tags: string[];
  is_active?: boolean;
  deadline?: string | null;
  status?: JobStatus;
  program_ids?: string[];
}

export type JobFormData = VacancyFormData;

export interface DashboardMetrics {
  totalJobs: number;
  activeJobs: number;
  inactiveJobs: number;
}

export interface FilterParams {
  searchQuery?: string;
  prodiTag?: string;
  programSlug?: string;
}
