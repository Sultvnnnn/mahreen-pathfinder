import HeroASCII from "@/components/HeroASCII";
import SectionHeading from "@/components/SectionHeading";
import InlineBodyLink from "@/components/InlineBodyLink";
import ProgramCard from "@/components/ProgramCard";
import TerminalFeed from "@/components/TerminalFeed";
import type { Program } from "@/lib/api";

const STATIC_PROGRAMS: Program[] = [
  {
    id: "1",
    title: "Mahreen Tech Innovator",
    category: "Teknologi Digital",
    description: "Program inkubasi teknologi digital intensif bagi talenta muda untuk membangun solusi perangkat lunak berdampak nyata bagi ekosistem Indonesia.",
    tags: ["teknologi", "coding", "software", "hands-on", "portofolio", "digital"],
    cta_text: "ikut program →",
    cta_link: "/programs/tech-innovator",
  },
  {
    id: "2",
    title: "Mahreen Creative Studio",
    category: "Industri Kreatif",
    description: "Wadah kolaborasi kreator konten, desainer, dan seniman multimedia untuk memproduksi karya kreatif bertaraf nasional.",
    tags: ["kreatif", "media", "desain", "konten", "kolaboratif", "portofolio", "mandiri"],
    cta_text: "ikut program →",
    cta_link: "/programs/creative-studio",
  },
  {
    id: "3",
    title: "Mahreen Youth Business",
    category: "Bisnis & Startup",
    description: "Akselerator bisnis rintisan dan kompetisi kewirausahaan untuk membimbing pemuda Indonesia memvalidasi ide, membangun produk, dan menarik mitra bisnis.",
    tags: ["bisnis", "startup", "wirausaha", "kepemimpinan", "strategi", "mandiri", "kompetisi"],
    cta_text: "ikut program →",
    cta_link: "/programs/youth-business",
  },
  {
    id: "4",
    title: "Mahreen Social Impact Fellowship",
    category: "Kontribusi Sosial",
    description: "Program pengabdian dan kepemimpinan pemuda dalam merancang inisiatif pemecahan masalah sosial di berbagai daerah Indonesia.",
    tags: ["sosial", "komunitas", "dampak", "kepemimpinan", "relasi", "kolaboratif"],
    cta_text: "ikut program →",
    cta_link: "/programs/social-impact",
  },
  {
    id: "5",
    title: "Mahreen Talent Growth",
    category: "Pengembangan Talenta",
    description: "Pelatihan keterampilan digital esensial (Product, Data, & Engineering) yang terhubung langsung dengan akselerasi karir dan mentorship.",
    tags: ["teknologi", "portofolio", "skill", "mentorship", "hands-on", "mandiri", "karir"],
    cta_text: "ikut program →",
    cta_link: "/programs/talent-growth",
  },
  {
    id: "6",
    title: "Mahreen Community Action",
    category: "Komunitas",
    description: "Pemberdayaan penggerak komunitas muda untuk memperkuat jejaring nasional, memimpin acara bermakna, dan menggerakkan partisipasi publik.",
    tags: ["komunitas", "relasi", "pengorganisasian", "kolaboratif", "jejaring", "sosial", "dampak"],
    cta_text: "ikut program →",
    cta_link: "/programs/community-action",
  },
];

async function getStatsSafe() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/api/stats`, {
      next: { revalidate: 15 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Graceful fallback for offline / build time
  }
  return {
    total_submissions: 1,
    top_interest: "Teknologi Digital & Software",
    most_recommended_program: "Mahreen Tech Innovator",
  };
}

export default async function Home() {
  const stats = await getStatsSafe();

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section (ASCII Sphere + Title Overlay + Pill Triad) */}
      <HeroASCII />

      {/* Main Content Sections Container (Page max-width 800px, section gap 64px per DESIGN_SYSTEM.md) */}
      <div className="w-full max-w-[800px] mx-auto px-4 flex flex-col gap-16 py-16">
        {/* Pulse Generasi Section */}
        <section id="pulse" className="flex flex-col gap-6 scroll-mt-20">
          <SectionHeading icon="⚙" label="pulse generasi" />
          <TerminalFeed />
        </section>

        {/* Section 1: Tentang (Prose langsung di Cosmic Void) */}
        <section id="tentang" className="flex flex-col gap-6 scroll-mt-20">
          <SectionHeading icon="ℹ" label="tentang" />
          <div className="flex flex-col gap-4 text-mist font-dm-sans text-[16px] leading-[1.5]">
            <p>
              Mahreen PathFinder adalah platform web interaktif yang membantu generasi muda Indonesia menemukan program Mahreen Indonesia yang paling cocok dengan minat, sasaran, dan gaya berkarya mereka.
            </p>
            <p>
              Melalui kuis minat 3 langkah berbobot data transparan dan katalog program komprehensif, kami hadir untuk membantu Anda menemukan jalur berkarya terbaik dalam ekosistem pemberdayaan pemuda nasional.
            </p>
            <div className="pt-2 flex flex-wrap gap-6 items-center">
              <InlineBodyLink href="/programs">
                Lihat seluruh katalog program →
              </InlineBodyLink>
              <InlineBodyLink href="/quiz">
                Mulai kuis rekomendasi 3 langkah →
              </InlineBodyLink>
            </div>
          </div>
        </section>

        {/* Section 2: Program (2 kolom desktop, 1 kolom mobile, gap 16px) */}
        <section id="program" className="flex flex-col gap-6 scroll-mt-20">
          <SectionHeading icon="⚙" label="program" />
          <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
            Ekosistem Mahreen Indonesia menaungi spektrum inisiatif strategis di berbagai pilar karya nyata. Jelajahi program berikut:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STATIC_PROGRAMS.map((prog) => (
              <ProgramCard key={prog.id} program={prog} />
            ))}
          </div>

          <div className="pt-2">
            <InlineBodyLink href="/programs">
              Buka katalog lengkap program Mahreen →
            </InlineBodyLink>
          </div>
        </section>

        {/* Section 3: Statistik (PRD Core Feature) */}
        <section className="flex flex-col gap-6">
          <SectionHeading icon="▶" label="statistik" />
          <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
            Data agregat publik yang dihimpun secara transparan dari submission kuis minat generasi muda:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1 */}
            <div className="bg-steel-navy rounded-lg p-8 border border-fog/10 flex flex-col gap-2">
              <span className="text-[14px] font-jetbrains-mono text-mist">
                total submisi
              </span>
              <span className="text-[30px] font-jetbrains-mono text-specimen-green font-normal">
                {stats.total_submissions}
              </span>
              <span className="text-[14px] font-jetbrains-mono text-ash">
                peserta terdaftar
              </span>
            </div>

            {/* Stat 2 */}
            <div className="bg-steel-navy rounded-lg p-8 border border-fog/10 flex flex-col gap-2">
              <span className="text-[14px] font-jetbrains-mono text-mist">
                minat terpopuler
              </span>
              <span className="text-[16px] font-jetbrains-mono text-ghost-white font-normal line-clamp-1">
                {stats.top_interest || "Teknologi Digital"}
              </span>
              <span className="text-[14px] font-jetbrains-mono text-ash">
                pilihan terbanyak
              </span>
            </div>

            {/* Stat 3 */}
            <div className="bg-steel-navy rounded-lg p-8 border border-fog/10 flex flex-col gap-2">
              <span className="text-[14px] font-jetbrains-mono text-mist">
                top rekomendasi
              </span>
              <span className="text-[16px] font-jetbrains-mono text-ghost-white font-normal line-clamp-1">
                {stats.most_recommended_program || "Mahreen Tech Innovator"}
              </span>
              <span className="text-[14px] font-jetbrains-mono text-ash">
                paling relevan
              </span>
            </div>
          </div>

          <div className="pt-2">
            <InlineBodyLink href="/quiz">
              Mulai kuis untuk menemukan rekomendasi Anda →
            </InlineBodyLink>
          </div>
        </section>

        {/* Section 4: Kontak (Prose langsung di Cosmic Void) */}
        <section id="kontak" className="flex flex-col gap-6">
          <SectionHeading icon="✉" label="kontak" />
          <div className="flex flex-col gap-4 text-mist font-jetbrains-mono text-[14px] leading-[1.63]">
            <p>
              Untuk pertanyaan seputar program, kemitraan institusi, dan kolaborasi komunitas, hubungi tim melalui{" "}
              <a
                href="mailto:halo@mahreen.id"
                className="text-portal-blue hover:underline"
              >
                halo@mahreen.id
              </a>
              .
            </p>
            <p>
              Dokumentasi antarmuka pemrograman aplikasi publik tersedia di{" "}
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portal-blue hover:underline"
              >
                OpenAPI Swagger /docs →
              </a>
            </p>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="pt-8 border-t border-fog/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px] font-jetbrains-mono text-ash">
          <div className="flex flex-wrap gap-4">
            <a href="/tentang" className="text-portal-blue hover:underline">
              tentang
            </a>
            <span>·</span>
            <a href="/programs" className="text-portal-blue hover:underline">
              program
            </a>
            <span>·</span>
            <a href="/quiz" className="text-portal-blue hover:underline">
              quiz
            </a>
          </div>
          <div>
            © 2026 Mahreen Indonesia — BERKARYA UNTUK INDONESIA
          </div>
        </footer>
      </div>
    </div>
  );
}
