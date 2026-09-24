"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, animate } from "framer-motion";
import { RecommendedProgram } from "@/lib/api";
import { scaleIn, EASE_BEZIER } from "@/lib/motion";
import ShareCardButton from "@/components/ShareCardButton";

interface ResultCardProps {
  program: RecommendedProgram;
  userName?: string;
}

export function getProgramUrl(ctaLink: string): string {
  if (!ctaLink) return "/programs";
  if (ctaLink.includes("mahreen.id/programs/")) {
    const slug = ctaLink.split("mahreen.id/programs/")[1]?.replace(/\/$/, "");
    if (slug) return `/programs/${slug}`;
  }
  return ctaLink;
}

export default function ResultCard({ program, userName }: ResultCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayScore, setDisplayScore] = useState(shouldReduceMotion ? program.score : 0);
  const targetUrl = getProgramUrl(program.cta_link);
  const isInternal = targetUrl.startsWith("/");

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayScore(program.score);
      return;
    }
    const controls = animate(0, program.score, {
      duration: 0.6,
      ease: EASE_BEZIER,
      onUpdate: (value) => setDisplayScore(Math.round(value)),
    });
    return () => controls.stop();
  }, [program.score, shouldReduceMotion]);

  return (
    <motion.article
      variants={scaleIn}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate="visible"
      className="flex flex-col justify-between bg-deep-slate rounded-lg p-8 gap-4 border border-fog/10"
    >
      <div className="flex flex-col gap-3">
        {/* Header: Kategori & Skor Kecocokan */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[14px] font-jetbrains-mono text-mist/80">
            {program.category}
          </span>
          <span className="text-[14px] font-jetbrains-mono text-specimen-green">
            skor kecocokan: {displayScore}%
          </span>
        </div>

        {/* Judul Program 16px Ghost White */}
        <h3 className="text-[16px] font-jetbrains-mono text-ghost-white font-normal">
          {program.title}
        </h3>

        {/* Deskripsi (DM Sans 16px Mist) */}
        <p className="font-dm-sans text-[16px] text-mist leading-[1.5]">
          {program.description}
        </p>

        {/* Transparansi Alasan Rekomendasi */}
        {program.match_reasons && program.match_reasons.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-2 border-t border-fog/10">
            <span className="text-[14px] font-jetbrains-mono text-warning-amber">
              ★ Mengapa program ini cocok:
            </span>
            <ul className="text-[14px] font-jetbrains-mono text-mist/90 space-y-1 pl-4 list-disc marker:text-portal-blue">
              {program.match_reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Row: CTA Link + Share Card Button */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-fog/5">
        <div>
          {isInternal ? (
            <Link
              href={targetUrl}
              className="inline-block text-[16px] font-jetbrains-mono text-portal-blue hover:underline cursor-pointer"
            >
              {program.cta_text || "ikut program →"}
            </Link>
          ) : (
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[16px] font-jetbrains-mono text-portal-blue hover:underline"
            >
              {program.cta_text || "ikut program →"}
            </a>
          )}
        </div>
        <ShareCardButton program={program} userName={userName} />
      </div>
    </motion.article>
  );
}
