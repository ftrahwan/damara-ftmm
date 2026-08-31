CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel Utama: vacancies
CREATE TABLE IF NOT EXISTS vacancies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    source_url TEXT NOT NULL,
    description TEXT NOT NULL,
    prodi_tags TEXT[] NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexing untuk Kecepatan Query & Filter
CREATE INDEX IF NOT EXISTS idx_vacancies_is_active ON vacancies(is_active);
CREATE INDEX IF NOT EXISTS idx_vacancies_created_at ON vacancies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vacancies_prodi_tags ON vacancies USING GIN(prodi_tags);

-- Enable Replica Identity Full for complete real-time payload on update/delete
ALTER TABLE vacancies REPLICA IDENTITY FULL;

-- Enable Real-Time Broadcast for vacancies table
ALTER PUBLICATION supabase_realtime ADD TABLE vacancies;

-- ====================================================================
-- Row Level Security (RLS) Sesuai PRD Bagian 7
-- ====================================================================
ALTER TABLE vacancies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active vacancies" ON vacancies;
DROP POLICY IF EXISTS "Authenticated admin can view all vacancies" ON vacancies;
DROP POLICY IF EXISTS "Authenticated admin can insert vacancies" ON vacancies;
DROP POLICY IF EXISTS "Authenticated admin can update vacancies" ON vacancies;
DROP POLICY IF EXISTS "Authenticated admin can delete vacancies" ON vacancies;

-- Public SELECT: Hanya lowongan dengan is_active = true
CREATE POLICY "Public can view active vacancies" ON vacancies
    FOR SELECT TO anon
    USING (is_active = true);

-- Admin Full Access: Authenticated users dapat SELECT semua, INSERT, UPDATE, DELETE
CREATE POLICY "Authenticated admin can view all vacancies" ON vacancies
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Authenticated admin can insert vacancies" ON vacancies
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated admin can update vacancies" ON vacancies
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete vacancies" ON vacancies
    FOR DELETE TO authenticated
    USING (true);

