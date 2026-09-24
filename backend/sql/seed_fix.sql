-- Mahreen PathFinder — seed_fix.sql
-- Menambahkan tag yang dibutuhkan agar setiap opsi kuis dapat mencocokkan program secara optimal:
-- 'karir' -> Mahreen Talent Growth
-- 'dampak' -> Mahreen Community Action
-- 'mandiri' -> Mahreen Creative Studio
-- 'kompetisi' -> Mahreen Youth Business

-- 1. Selaraskan nama program ke penamaan kanonikal jika sebelumnya menggunakan nama alternatif
UPDATE public.programs SET title = 'Mahreen Talent Growth' WHERE title = 'Mahreen Digital Talent Accelerator';
UPDATE public.programs SET title = 'Mahreen Community Action' WHERE title = 'Mahreen Community Catalyst';
UPDATE public.programs SET title = 'Mahreen Youth Business' WHERE title = 'Mahreen Young Founders Lab';

-- 2. Pastikan program kanonikal tersedia jika belum ada di database
INSERT INTO public.programs (title, category, description, tags, cta_text, cta_link)
SELECT 'Mahreen Talent Growth', 'Pengembangan Talenta', 'Program akselerasi karir dan peningkatan kapabilitas profesional talenta muda.', ARRAY['karir', 'portofolio', 'skill', 'mentorship'], 'ikut program →', 'https://mahreen.id/programs/talent-growth'
WHERE NOT EXISTS (SELECT 1 FROM public.programs WHERE title = 'Mahreen Talent Growth');

INSERT INTO public.programs (title, category, description, tags, cta_text, cta_link)
SELECT 'Mahreen Community Action', 'Komunitas & Sosial', 'Inisiatif kepemimpinan pemuda untuk menciptakan dampak sosial berkelanjutan.', ARRAY['dampak', 'komunitas', 'sosial', 'relasi'], 'ikut program →', 'https://mahreen.id/programs/community-action'
WHERE NOT EXISTS (SELECT 1 FROM public.programs WHERE title = 'Mahreen Community Action');

INSERT INTO public.programs (title, category, description, tags, cta_text, cta_link)
SELECT 'Mahreen Youth Business', 'Bisnis & Kewirausahaan', 'Inkubasi dan kompetisi kewirausahaan untuk melatih strategi bisnis pemuda.', ARRAY['kompetisi', 'bisnis', 'startup', 'wirausaha'], 'ikut program →', 'https://mahreen.id/programs/youth-business'
WHERE NOT EXISTS (SELECT 1 FROM public.programs WHERE title = 'Mahreen Youth Business');

-- 3. Append missing tags per spesifikasi:
-- 'karir' -> Mahreen Talent Growth
UPDATE public.programs
SET tags = array_append(tags, 'karir')
WHERE title IN ('Mahreen Talent Growth', 'Mahreen Digital Talent Accelerator')
  AND NOT ('karir' = ANY(tags));

-- 'dampak' -> Mahreen Community Action
UPDATE public.programs
SET tags = array_append(tags, 'dampak')
WHERE title IN ('Mahreen Community Action', 'Mahreen Social Impact Fellowship', 'Mahreen Community Catalyst')
  AND NOT ('dampak' = ANY(tags));

-- 'mandiri' -> Mahreen Creative Studio
UPDATE public.programs
SET tags = array_append(tags, 'mandiri')
WHERE title = 'Mahreen Creative Studio'
  AND NOT ('mandiri' = ANY(tags));

-- 'kompetisi' -> Mahreen Youth Business
UPDATE public.programs
SET tags = array_append(tags, 'kompetisi')
WHERE title IN ('Mahreen Youth Business', 'Mahreen Young Founders Lab')
  AND NOT ('kompetisi' = ANY(tags));
