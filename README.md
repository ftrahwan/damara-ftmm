# DAMARA — Daya Magang Industri Mandala

**DAMARA** adalah platform microsite terintegrasi dan sistem direktori informasi lowongan magang yang dirancang khusus untuk mahasiswa **Fakultas Teknologi Maju dan Multidisiplin (FTMM) Universitas Airlangga**.

---

## 🚀 Tech Stack
- **Frontend**: Next.js (App Router, React 19), TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Mobile-First, WCAG AA Accessible)
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security - RLS, Auth)
- **Icons**: Lucide React

---

## 🎯 Fitur Utama

### 1. Portal Publik Mahasiswa (`/`)
- **Pencarian Real-Time**: Pencarian *case-insensitive* pada judul posisi (*title*), nama perusahaan (*company*), dan lokasi (*location*).
- **Filter Multi-Prodi FTMM**:
  - *Semua Prodi*
  - Rekayasa Nanoteknologi
  - Teknologi Sains Data
  - Teknik Robotika dan Kecerdasan Buatan
  - Teknik Industri
  - Teknik Elektro
- **Kartu Lowongan Responsif**:
  - Tampilan grid responsif (1 kolom di mobile, 2 kolom di tablet, 3 kolom di desktop).
  - Badge program studi interaktif dengan warna khas tiap prodi.
  - Tanggal batas pendaftaran dalam format Indonesia (contoh: `30 September 2026`). Jika `null`, disembunyikan otomatis.
  - Tombol tautan langsung ke situs resmi dengan atribut `target="_blank" rel="noopener noreferrer"`.
- **UI States**: Skeleton loading animasi, empty state dengan tombol reset pencarian, dan penanganan error ramah pengguna.

### 2. Panel Admin CMS (`/admin`)
- **Autentikasi Aman (`/admin/login`)**: Terintegrasi dengan Supabase Auth dan route protection middleware.
- **Ringkasan Metrik**: Total Lowongan, Lowongan Aktif, dan Lowongan Nonaktif.
- **Tabel Manajemen Lowongan**:
  - Pencarian dan filter status/prodi di dalam tabel admin.
  - Toggle status instan (`ACTIVE` $\leftrightarrow$ `INACTIVE`).
  - Modal dialog konfirmasi hapus (`"Apakah Anda yakin ingin menghapus lowongan '[Title]'?"`).
- **Form Tambah & Edit Lowongan (`/admin/jobs/new` & `/admin/jobs/[id]/edit`)**:
  - Validasi ketat sisi klien & server sesuai PRD v2.0.
  - Dukungan multi-prodi *many-to-many* (satu lowongan dapat ditujukan untuk beberapa prodi sekaligus).

---

## 🛠️ Panduan Memulai (Setup & Run)

### 1. Clone & Install Dependencies
```bash
# Pastikan Node.js 18+ telah terpasang
npm install
```

### 2. Konfigurasi Environment (Opsional untuk Supabase Live)
Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Isi konfigurasi Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
> **Catatan**: Jika environment Supabase belum diisi, DAMARA otomatis berjalan menggunakan *high-fidelity mock dataset* lokal di browser dengan persistensi `localStorage`.

### 3. Migrasi Database Supabase (SQL DDL & Seed)
Jalankan skrip berikut di **SQL Editor** pada dashboard Supabase:
1. `supabase/schema.sql`: Membuat tabel `programs`, `jobs`, `job_programs`, indeks, dan kebijakan keamanan **Row Level Security (RLS)**.
2. `supabase/seed.sql`: Memasukkan data master 5 Prodi FTMM dan 9 lowongan magang industri & riset terkurasi.

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 5. Akses Panel Admin (Demo Mode)
- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@ftmm.unair.ac.id`
- **Password**: `ftmmhebat2026`

---

## 🧪 Verifikasi & Build
```bash
# Linter check (ESLint)
npm run lint

# Production Build Test
npm run build
```

---
