import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionHeading from "@/components/SectionHeading";

interface ProgramDetail {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  duration: string;
  format: string;
  location: string;
  curriculum: string[];
  eligibility: string[];
  benefits: string[];
  tags: string[];
}

const PROGRAM_DETAILS: Record<string, ProgramDetail> = {
  "tech-innovator": {
    slug: "tech-innovator",
    title: "Mahreen Tech Innovator",
    category: "Teknologi Digital",
    tagline: "Inkubasi rekayasa perangkat lunak dan talenta engineering untuk ekosistem digital Indonesia.",
    description:
      "Mahreen Tech Innovator adalah program intensif yang dirancang untuk membimbing mahasiswa, fresh graduate, dan developer muda dalam merancang arsitektur sistem perangkat lunak berskala riil. Melalui sprint engineering praktis, peserta belajar standar industri (clean architecture, API design, cloud deployment) dengan bimbingan senior engineer.",
    duration: "12 Minggu Intensif",
    format: "Hybrid (Online Sprint + Workshop)",
    location: "Jakarta & Virtual Hub",
    curriculum: [
      "Arsitektur Backend Modern & Pemodelan Data Relasional",
      "Pembangunan RESTful & Event-Driven API Berskala Produksi",
      "Integrasi Autentikasi Modern (JWT, OAuth, JWKS) & Keamanan Data",
      "Deployment, Containerization, dan CI/CD Pipeline Otomatis",
      "Capstone Project: Solusi Digital Nyata untuk Masalah Publik Indonesia",
    ],
    eligibility: [
      "Pemuda usia 18–26 tahun (mahasiswa atau lulusan baru)",
      "Memiliki pemahaman dasar pemrograman (Python, JavaScript/TypeScript, dsb.)",
      "Memiliki komitmen waktu minimal 10 jam per minggu selama masa program",
      "Memiliki semangat tinggi memecahkan tantangan teknologi nasional",
    ],
    benefits: [
      "Portofolio engineering riil bertaraf industri siap kerja",
      "Mentorship 1-on-1 bersama praktisi teknologi senior",
      "Sertifikat Kelulusan Resmi Mahreen Indonesia",
      "Peluang magang dan rekomendasi karir ke jaringan mitra teknologi Mahreen",
    ],
    tags: ["teknologi", "coding", "software", "hands-on", "portofolio", "digital"],
  },
  "creative-studio": {
    slug: "creative-studio",
    title: "Mahreen Creative Studio",
    category: "Industri Kreatif",
    tagline: "Laboratorium karya kreatif bagi kreator konten, desainer, dan seniman multimedia.",
    description:
      "Mahreen Creative Studio memfasilitasi kreator visual, desainer antarmuka, dan produser konten muda untuk memproduksi karya multimedia bertaraf nasional. Peserta berkolaborasi menghasilkan kampanye kreatif terpadu yang mempromosikan narasi kebangsaan dan inovasi pemuda Indonesia.",
    duration: "10 Minggu Kolaboratif",
    format: "Hybrid (Online Studio + Showcase)",
    location: "Bandung, Jakarta & Virtual",
    curriculum: [
      "Creative Direction, Storytelling & Brand Identity Development",
      "Desain Komunikasi Visual & UI/UX Experience Design",
      "Produksi Konten Multimedia, Video Sinematik & Digital Animation",
      "Distribusi Karya Digital, Hak Kekayaan Intelektual, & Monetisasi",
      "Final Showcase: Pameran Karya Terbuka untuk Publik",
    ],
    eligibility: [
      "Kreator, desainer grafis, UI designer, animator, atau video maker muda usia 17–27 tahun",
      "Memiliki portofolio karya visual awal (format link Behance/Dribbble/Instagram/Drive)",
      "Antusias berkolaborasi dalam tim multidisiplin lintas daerah",
    ],
    benefits: [
      "Koleksi portofolio kreatif profesional berstandar kurasi nasional",
      "Akses studio kolaborasi dan mentorship dari Creative Director ternama",
      "Eksposur karya di media resmi Mahreen Indonesia dan festival karya",
      "Sertifikat Resmi dan jejaring kreator lintas Nusantara",
    ],
    tags: ["kreatif", "media", "desain", "konten", "kolaboratif", "portofolio", "mandiri"],
  },
  "youth-business": {
    slug: "youth-business",
    title: "Mahreen Youth Business",
    category: "Bisnis & Startup",
    tagline: "Akselerator bisnis rintisan dan kompetisi kewirausahaan untuk pemuda berjiwa wirausaha.",
    description:
      "Mahreen Youth Business membimbing para pendiri startup awal (early-stage founders) dan calon wirausahawan dalam memvalidasi ide bisnis, membangun prototype produk, menguji penerimaan pasar, hingga menyusun proposal pendanaan untuk menarik mitra strategis.",
    duration: "8 Minggu Akselerasi",
    format: "Virtual Incubator + Demo Day",
    location: "Virtual & Jakarta",
    curriculum: [
      "Problem-Solution Fit & Validasi Hipotesis Pasar Lapangan",
      "Perancangan MVP (Minimum Viable Product) yang Terukur",
      "Unit Economics, Pemodelan Keuangan & Penetapan Harga",
      "Strategi Go-to-Market, Akuisisi Pengguna & Pertumbuhan Organik",
      "Pitch Deck Masterclass & Demo Day di Hadapan Investor/Mitra",
    ],
    eligibility: [
      "Tim atau individu pendiri usaha pemuda usia 18–28 tahun",
      "Memiliki konsep produk bisnis yang siap divalidasi atau sudah berjalan < 1 tahun",
      "Berkomitmen menghadiri seluruh sesi bimbingan mingguan dan demo day",
    ],
    benefits: [
      "Akses pendanaan awal (seed grant) untuk tim terbaik",
      "Pendampingan intensif dari pengusaha dan venture builder berpengalaman",
      "Koneksi langsung dengan angel investor dan jaringan ekosistem startup Mahreen",
      "Eksposur media bisnis dan kemitraan strategis",
    ],
    tags: ["bisnis", "startup", "wirausaha", "kepemimpinan", "strategi", "mandiri", "kompetisi"],
  },
  "social-impact": {
    slug: "social-impact",
    title: "Mahreen Social Impact Fellowship",
    category: "Kontribusi Sosial",
    tagline: "Inisiatif pengabdian pemuda untuk menyelesaikan tantangan riil di akar rumput masyarakat.",
    description:
      "Mahreen Social Impact Fellowship mempersiapkan pemimpin muda berjiwa sosial untuk merumuskan dan mengeksekusi proyek perubahan sosial terukur di berbagai daerah di Indonesia. Fokus pada isu pendidikan, inklusi digital, lingkungan hidup, dan penguatan ekonomi lokal.",
    duration: "14 Minggu Fellowship",
    format: "Hybrid (Persiapan Online + Aksi Lapangan)",
    location: "Penempatan Daerah & Virtual",
    curriculum: [
      "Social Problem Framing, Human-Centered Design & Analisis Kebutuhan Komunitas",
      "Penyusunan Teori Perubahan (Theory of Change) dan Metrik Dampak Sosial",
      "Penggalangan Dukungan Publik, Kolaborasi Lintas Sektor & Relawan",
      "Eksekusi Inisiatif Lapangan Berkelanjutan",
      "Evaluasi Dampak, Pelaporan Transparan & Diseminasi Praktik Baik",
    ],
    eligibility: [
      "Pemuda usia 18–27 tahun yang aktif di organisasi kemasyarakatan atau kampus",
      "Memiliki kepedulian tinggi terhadap isu sosial kemasyarakatan",
      "Siap terjun dan berinteraksi langsung dengan warga sasaran program",
    ],
    benefits: [
      "Dukungan dana stimulan implementasi proyek sosial",
      "Mentorship dari praktisi NGO, sosiolog terapan, dan pegiat sosial senior",
      "Gelar Fellow Mahreen Social Impact dan sertifikat resmi",
      "Jejaring alumni penggerak sosial dari seluruh Indonesia",
    ],
    tags: ["sosial", "komunitas", "dampak", "kepemimpinan", "relasi", "kolaboratif"],
  },
  "talent-growth": {
    slug: "talent-growth",
    title: "Mahreen Talent Growth",
    category: "Pengembangan Talenta",
    tagline: "Pelatihan keterampilan digital esensial yang terhubung langsung dengan akselerasi karir.",
    description:
      "Mahreen Talent Growth membekali talenta muda dengan keahlian teknis dan profesional yang paling dicari dunia kerja saat ini (Product Management, UI/UX, Data Analytics, dan Quality Assurance), dilengkapi sesi persiapan karir, review CV, dan simulasi interview.",
    duration: "8 Minggu Pembelajaran",
    format: "Online Bootcamp Interaktif",
    location: "Virtual Hub Nasional",
    curriculum: [
      "Fondasi Jalur Karir Pilihan (Product, Data, atau QA/Testing)",
      "Pengerjaan Kasus Riil Industri (Case-Study Driven Learning)",
      "Penguasaan Alat Kerja Standar Industri (Figma, SQL, Jira, dsb.)",
      "Career Readiness: CV Crafting, Portfolio Presentation, & Mock Interview",
      "Job Fair & Speed Networking bersama Perusahaan Rekanan Mahreen",
    ],
    eligibility: [
      "Mahasiswa tingkat akhir atau lulusan baru (maksimal 2 tahun kelulusan)",
      "Berkomitmen aktif mengikuti kelas malam / akhir pekan",
      "Memiliki laptop dan koneksi internet memadai untuk pengerjaan tugas",
    ],
    benefits: [
      "Portofolio studi kasus industri yang teruji",
      "Bimbingan karir personal dari Career Coach bersertifikat",
      "Rekomendasi CV langsung ke HR perusahaan mitra Mahreen",
      "Sertifikat Kompetensi Resmi Mahreen Talent Growth",
    ],
    tags: ["teknologi", "portofolio", "skill", "mentorship", "hands-on", "mandiri", "karir"],
  },
  "community-action": {
    slug: "community-action",
    title: "Mahreen Community Action",
    category: "Komunitas",
    tagline: "Pemberdayaan penggerak komunitas muda untuk memperkuat jejaring nasional dan partisipasi publik.",
    description:
      "Mahreen Community Action mengumpulkan para ketua himpunan, ketua komunitas lokal, dan inisiator gerakan kepemudaan untuk memperkuat kapasitas tata kelola organisasi, aktivasi acara berskala besar, serta memperluas sinergi antarkomunitas lintas kota.",
    duration: "6 Minggu Kolaborasi",
    format: "Online Masterclass + Community Meetup",
    location: "Virtual Hub + Regional Hubs",
    curriculum: [
      "Community Building & Community Management Framework Modern",
      "Manajemen Event Hybrid & Pengelolaan Audiens Skala Besar",
      "Strategi Kemitraan Komunitas & Sponsorship Berkelanjutan",
      "Penggunaan Media Digital untuk Mobilisasi Aksi Positif",
      "Penyelenggaraan Mahreen Youth Summit: Konferensi Pemuda Nasional",
    ],
    eligibility: [
      "Pengurus atau inisiator komunitas pemuda / organisasi mahasiswa",
      "Memiliki basis anggota komunitas aktif minimal 20 orang",
      "Bertekad membangun kolaborasi dan sinergi jangka panjang",
    ],
    benefits: [
      "Akses co-branding dan dukungan promosi acara komunitas dari Mahreen",
      "Jejaring kolaborasi dengan ratusan komunitas pemuda se-Indonesia",
      "Peluang mengusulkan inisiatif bersama untuk didanai Mahreen Indonesia",
      "Sertifikat Kepemimpinan Komunitas Resmi",
    ],
    tags: ["komunitas", "relasi", "pengorganisasian", "kolaboratif", "jejaring", "sosial", "dampak"],
  },
};

export function generateStaticParams() {
  return Object.keys(PROGRAM_DETAILS).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = PROGRAM_DETAILS[slug];

  if (!program) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-16 w-full max-w-[800px] mx-auto px-4 py-12">
      {/* Back Link */}
      <div>
        <Link
          href="/programs"
          className="text-[16px] font-jetbrains-mono text-portal-blue hover:underline"
        >
          ← Kembali ke Katalog Program
        </Link>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col gap-4 p-8 rounded-lg bg-steel-navy border border-fog/10">
        <span className="text-[14px] font-jetbrains-mono text-specimen-green">
          {program.category}
        </span>
        <h1 className="text-[30px] font-jetbrains-mono text-ghost-white font-normal leading-[1.25]">
          {program.title}
        </h1>
        <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
          {program.tagline}
        </p>

        {/* Quick Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-fog/10 text-[14px] font-jetbrains-mono text-mist">
          <div>durasi: {program.duration}</div>
          <div>format: {program.format}</div>
          <div>lokasi: {program.location}</div>
        </div>
      </div>

      {/* Program Description */}
      <section className="flex flex-col gap-4">
        <SectionHeading icon="ℹ" label="gambaran program" />
        <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
          {program.description}
        </p>
      </section>

      {/* Curriculum */}
      <section className="flex flex-col gap-4">
        <SectionHeading icon="⚙" label="kurikulum" />
        <div className="grid grid-cols-1 gap-3">
          {program.curriculum.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-6 rounded-lg bg-steel-navy border border-fog/10"
            >
              <span className="text-[14px] font-jetbrains-mono text-portal-blue shrink-0">
                0{idx + 1}.
              </span>
              <span className="text-[16px] font-dm-sans text-ghost-white leading-[1.5]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Eligibility */}
      <section className="flex flex-col gap-4">
        <SectionHeading icon="▶" label="persyaratan" />
        <div className="flex flex-col gap-3 p-8 rounded-lg bg-steel-navy border border-fog/10">
          {program.eligibility.map((item, idx) => (
            <div key={idx} className="text-[16px] font-dm-sans text-mist leading-[1.5]">
              · {item}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="flex flex-col gap-4">
        <SectionHeading icon="★" label="manfaat" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {program.benefits.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-lg bg-steel-navy border border-fog/10 text-[16px] font-dm-sans text-mist leading-[1.5]"
            >
              · {item}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="p-8 rounded-lg bg-steel-navy border border-fog/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h3 className="text-[16px] font-jetbrains-mono text-ghost-white font-normal">
            Tertarik Mengikuti {program.title}?
          </h3>
          <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
            Ikuti kuis rekomendasi 3 langkah untuk mengukur tingkat kecocokan profil Anda.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/quiz"
            className="pill-amber px-6 py-2.5 text-[14px] font-jetbrains-mono inline-block cursor-pointer"
          >
            Mulai Quiz
          </Link>
          <a
            href="mailto:halo@mahreen.id"
            className="text-[16px] font-jetbrains-mono text-portal-blue hover:underline"
          >
            hubungi kami →
          </a>
        </div>
      </section>
    </div>
  );
}
