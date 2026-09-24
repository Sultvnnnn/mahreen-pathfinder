-- Mahreen PathFinder Seed Programs Data

INSERT INTO public.programs (title, category, description, tags, cta_text, cta_link)
VALUES
(
    'Mahreen Tech Innovator',
    'Teknologi Digital',
    'Program inkubasi teknologi digital intensif bagi talenta muda untuk membangun solusi perangkat lunak berdampak nyata bagi ekosistem Indonesia.',
    ARRAY['teknologi', 'coding', 'software', 'hands-on', 'portofolio', 'digital'],
    'ikut program →',
    'https://mahreen.id/programs/tech-innovator'
),
(
    'Mahreen Creative Studio',
    'Industri Kreatif',
    'Wadah kolaborasi kreator konten, desainer, dan seniman multimedia untuk memproduksi karya kreatif bertaraf nasional.',
    ARRAY['kreatif', 'media', 'desain', 'konten', 'kolaboratif', 'portofolio', 'mandiri'],
    'ikut program →',
    'https://mahreen.id/programs/creative-studio'
),
(
    'Mahreen Youth Business',
    'Bisnis & Startup',
    'Akselerator bisnis rintisan dan kompetisi kewirausahaan untuk membimbing pemuda Indonesia memvalidasi ide, membangun produk, dan menarik mitra bisnis.',
    ARRAY['bisnis', 'startup', 'wirausaha', 'kepemimpinan', 'strategi', 'mandiri', 'kompetisi'],
    'ikut program →',
    'https://mahreen.id/programs/youth-business'
),
(
    'Mahreen Social Impact Fellowship',
    'Kontribusi Sosial',
    'Program pengabdian dan kepemimpinan pemuda dalam merancang inisiatif pemecahan masalah sosial di berbagai daerah Indonesia.',
    ARRAY['sosial', 'komunitas', 'dampak', 'kepemimpinan', 'relasi', 'kolaboratif'],
    'ikut program →',
    'https://mahreen.id/programs/social-impact'
),
(
    'Mahreen Talent Growth',
    'Pengembangan Talenta',
    'Pelatihan keterampilan digital esensial (Product, Data, & Engineering) yang terhubung langsung dengan akselerasi karir dan mentorship.',
    ARRAY['teknologi', 'portofolio', 'skill', 'mentorship', 'hands-on', 'mandiri', 'karir'],
    'ikut program →',
    'https://mahreen.id/programs/talent-growth'
),
(
    'Mahreen Community Action',
    'Komunitas',
    'Pemberdayaan penggerak komunitas muda untuk memperkuat jejaring nasional, memimpin acara bermakna, dan menggerakkan partisipasi publik.',
    ARRAY['komunitas', 'relasi', 'pengorganisasian', 'kolaboratif', 'jejaring', 'sosial', 'dampak'],
    'ikut program →',
    'https://mahreen.id/programs/community-action'
)
ON CONFLICT DO NOTHING;
