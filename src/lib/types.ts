export type ProdiName =
  | 'Robotika & AI'
  | 'Elektro'
  | 'Industri'
  | 'Sains Data'
  | 'Rekayasa Nano';

export type VacancyStatus = 'active' | 'closed' | 'unknown';
export type VacancySource = 'linkedin' | 'manual';
export type WorkMode = 'remote' | 'hybrid' | 'on-site';

/** @deprecated Use VacancyStatus instead */
export type JobStatus = 'ACTIVE' | 'INACTIVE';

export interface Program {
  id: string;
  name: string;
  slug: string;
  colorHex?: string;
  created_at?: string;
}

export type ProgramOption = Program;

/**
 * Represents a single internship vacancy stored in Supabase.
 * Includes both the original public fields and the automated-tracker
 * fields added in Phase 2 of the server-driven migration.
 */
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

  // ── Automated tracker fields ──────────────────────────────────────────────
  /** Source of the vacancy: 'linkedin' for auto-ingested, 'manual' for hand-entered */
  source?: VacancySource;
  /** Stable job identifier from the source platform (e.g. LinkedIn job ID) */
  source_job_id?: string | null;
  /** Work arrangement */
  work_mode?: WorkMode | null;
  /** Direct application URL (may differ from the LinkedIn listing URL) */
  apply_url?: string | null;
  /** Human-readable explanation of why this job matched the target programs */
  match_reason?: string | null;
  /** Date the job was first published on LinkedIn, if available */
  posted_at?: string | null;
  /** Timestamp of first discovery by the automation script */
  first_seen_at?: string | null;
  /** Timestamp of most recent observation in a job alert email */
  last_seen_at?: string | null;
  /** Timestamp of the most recent automated HTTP status check */
  last_checked_at?: string | null;
  /** Current vacancy lifecycle status as determined by the StatusChecker */
  vacancy_status?: VacancyStatus;

  // ── Legacy compatibility fields ───────────────────────────────────────────
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

/**
 * Audit log of individual HTTP status-check attempts for a vacancy.
 * Populated by the StatusChecker Apps Script job.
 */
export interface JobCheck {
  id: string;
  job_id: string;
  checked_at: string;
  http_status_code?: number | null;
  /** Status inferred from this check attempt */
  observed_status?: VacancyStatus | null;
  /** Human-readable explanation of the check result */
  result_reason?: string | null;
  error_message?: string | null;
}

/**
 * Audit log for each automated ingestion run (EmailCollector execution).
 * Provides observability into the pipeline health without a dedicated dashboard.
 */
export interface IngestionRun {
  id: string;
  started_at: string;
  finished_at?: string | null;
  jobs_found?: number;
  jobs_inserted?: number;
  jobs_updated?: number;
  jobs_checked?: number;
  errors_count?: number;
  run_status?: 'success' | 'partial' | 'error';
  error_summary?: string | null;
}

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
