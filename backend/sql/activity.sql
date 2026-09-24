-- Mahreen PathFinder — Activity Table for Terminal Pulse (Live Feed & Realtime)
-- Dijalankan manual di Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kind VARCHAR(50) NOT NULL DEFAULT 'quiz',
    label TEXT NOT NULL,
    interest VARCHAR(100) NOT NULL,
    program_title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index untuk efisiensi query sorting feed & agregasi
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON public.activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_interest ON public.activity(interest);

-- RLS: anon/authenticated SELECT only; write hanya via backend (direct connection)
ALTER TABLE public.activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon and authenticated select on activity" ON public.activity;
CREATE POLICY "Allow anon and authenticated select on activity"
    ON public.activity
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Realtime: pastikan publication supabase_realtime mencakup tabel activity
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'activity'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.activity;
    END IF;
END $$;
