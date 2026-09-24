import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 gap-6 max-w-[800px] mx-auto">
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-jetbrains-mono text-warning-amber">
          ℹ 404 // HALAMAN TIDAK DITEMUKAN
        </span>
        <h1 className="text-[30px] font-jetbrains-mono text-ghost-white font-normal">
          Jalur Belum Terpetakan
        </h1>
        <p className="text-[15px] font-dm-sans text-mist leading-relaxed max-w-[480px]">
          Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan ke jalur baru di ekosistem Mahreen PathFinder.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          href="/"
          className="pill-green px-6 py-2 text-[14px] font-jetbrains-mono cursor-pointer"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/programs"
          className="text-portal-blue hover:underline text-[14px] font-jetbrains-mono transition-colors cursor-pointer"
        >
          katalog program →
        </Link>
      </div>
    </div>
  );
}

