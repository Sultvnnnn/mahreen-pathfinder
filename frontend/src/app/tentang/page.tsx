import React from "react";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";

export default function TentangPage() {
  return (
    <div className="flex flex-col gap-16 w-full max-w-[800px] mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <SectionHeading icon="ℹ" label="tentang" />
        <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
          Membangun jembatan karya dan inovasi bagi generasi muda Indonesia untuk berkontribusi nyata bagi bangsa.
        </p>
      </div>

      {/* Main Philosophy */}
      <section className="flex flex-col gap-4 p-8 rounded-lg bg-steel-navy border border-fog/10">
        <span className="text-[14px] font-jetbrains-mono text-specimen-green">
          TEMA // BERKARYA UNTUK INDONESIA
        </span>
        <h3 className="text-[16px] font-jetbrains-mono text-ghost-white font-normal leading-[1.25]">
          Ekosistem Pemuda Berdaya
        </h3>
        <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
          Mahreen Indonesia adalah wadah kolaboratif pemuda yang mengintegrasikan berbagai pilar pemberdayaan:
          rekayasa teknologi digital, kreasi industri multimedia, inkubasi bisnis rintisan, pengembangan talenta
          siap karir, hingga gerakan aksi sosial kemasyarakatan.
        </p>
      </section>

      {/* 3 Core Pillars */}
      <section className="flex flex-col gap-6">
        <SectionHeading icon="⚙" label="pilar utama" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-8 rounded-lg bg-steel-navy border border-fog/10 flex flex-col gap-3">
            <h4 className="text-[16px] font-jetbrains-mono text-ghost-white font-normal">
              1. Eksplorasi Relevan
            </h4>
            <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
              Membantu pemuda menemukan program yang presisi sesuai minat otentik dan sasaran karir mereka.
            </p>
          </div>

          <div className="p-8 rounded-lg bg-steel-navy border border-fog/10 flex flex-col gap-3">
            <h4 className="text-[16px] font-jetbrains-mono text-ghost-white font-normal">
              2. Jejaring Kolaboratif
            </h4>
            <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
              Menghubungkan talenta lintas disiplin dalam inisiatif terpadu yang berkelanjutan.
            </p>
          </div>

          <div className="p-8 rounded-lg bg-steel-navy border border-fog/10 flex flex-col gap-3">
            <h4 className="text-[16px] font-jetbrains-mono text-ghost-white font-normal">
              3. Dampak Terukur
            </h4>
            <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
              Memastikan setiap proyek menghasilkan portofolio nyata dan solusi yang berguna untuk masyarakat.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="p-8 rounded-lg bg-steel-navy border border-fog/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h4 className="text-[16px] font-jetbrains-mono text-ghost-white font-normal">
            Siap Menemukan Jalur Karya Anda?
          </h4>
          <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
            Ikuti kuis minat 3 langkah atau telusuri langsung seluruh program resmi.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/quiz"
            className="pill-amber px-6 py-2.5 text-[14px] font-jetbrains-mono inline-block cursor-pointer"
          >
            Mulai Quiz
          </Link>
          <Link
            href="/programs"
            className="text-[16px] font-jetbrains-mono text-portal-blue hover:underline"
          >
            katalog program →
          </Link>
        </div>
      </section>
    </div>
  );
}
