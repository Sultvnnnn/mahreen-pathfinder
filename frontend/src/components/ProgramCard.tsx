"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Program } from "@/lib/api";
import { fadeUp } from "@/lib/motion";
import { getProgramUrl } from "./ResultCard";

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const targetUrl = getProgramUrl(program.cta_link);
  const isInternal = targetUrl.startsWith("/");

  return (
    <motion.article
      variants={fadeUp}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col justify-between bg-steel-navy hover:bg-deep-slate rounded-lg p-8 transition-colors duration-200 border border-fog/10 gap-6"
    >
      <div className="flex flex-col gap-3">
        {/* Kategori caption 14px Specimen Green */}
        <span className="text-[14px] font-jetbrains-mono text-specimen-green">
          {program.category}
        </span>

        {/* Judul 16px Ghost White */}
        <h3 className="text-[16px] font-jetbrains-mono text-ghost-white font-normal">
          {program.title}
        </h3>

        {/* Deskripsi DM Sans 16px Mist leading 1.5 */}
        <p className="font-dm-sans text-[16px] text-mist leading-[1.5]">
          {program.description}
        </p>

        {/* Tags caption 14px mono Portal Blue dipisah " · " */}
        {program.tags && program.tags.length > 0 && (
          <div className="text-[14px] font-jetbrains-mono text-portal-blue pt-1">
            {program.tags.join(" · ")}
          </div>
        )}
      </div>

      {/* CTA Inline Link Portal Blue */}
      <div className="pt-2">
        {isInternal ? (
          <Link
            href={targetUrl}
            className="text-[16px] font-jetbrains-mono text-portal-blue hover:underline inline-block cursor-pointer"
          >
            {program.cta_text || "ikut program →"}
          </Link>
        ) : (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[16px] font-jetbrains-mono text-portal-blue hover:underline inline-block"
          >
            {program.cta_text || "ikut program →"}
          </a>
        )}
      </div>
    </motion.article>
  );
}
