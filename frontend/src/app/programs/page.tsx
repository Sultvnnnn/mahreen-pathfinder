"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import ProgramCard from "@/components/ProgramCard";
import { getPrograms, type Program } from "@/lib/api";
import { staggerParent } from "@/lib/motion";

export default function ProgramsPage() {
  const shouldReduceMotion = useReducedMotion();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPrograms();
      setPrograms(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memuat program";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-16 w-full max-w-[800px] mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <SectionHeading icon="⚙" label="program" />
        <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
          Daftar program resmi Mahreen Indonesia yang dirancang untuk memberdayakan generasi muda
          dalam bidang teknologi, karya kreatif, bisnis rintisan, dan kontribusi sosial.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center border border-fog/10 rounded-lg bg-abyssal-blue/40">
          <span className="text-[14px] font-jetbrains-mono text-mist opacity-70">
            memproses data program...
          </span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-8 border border-fault-red/30 rounded-lg bg-abyssal-blue/60 flex flex-col gap-4 items-start">
          <span className="text-[14px] font-jetbrains-mono text-fault-red">
            Terjadi kesalahan: {error}
          </span>
          <button
            type="button"
            onClick={loadData}
            className="text-[16px] font-jetbrains-mono text-portal-blue hover:underline cursor-pointer"
          >
            ← Coba lagi
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && programs.length === 0 && (
        <div className="p-12 text-center border border-fog/10 rounded-lg bg-abyssal-blue/30">
          <span className="text-[14px] font-jetbrains-mono text-mist">
            belum ada data program
          </span>
        </div>
      )}

      {/* Program Grid (2 kolom desktop, 1 kolom mobile per DESIGN_SYSTEM.md) */}
      {!loading && !error && programs.length > 0 && (
        <motion.div
          variants={staggerParent(0.08)}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {programs.map((prog) => (
            <ProgramCard key={prog.id} program={prog} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
