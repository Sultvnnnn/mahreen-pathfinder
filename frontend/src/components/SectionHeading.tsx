"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

interface SectionHeadingProps {
  icon?: string;
  label: string;
}

export default function SectionHeading({ icon = "⚙", label }: SectionHeadingProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={fadeUp}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="flex items-center gap-2 text-left"
    >
      <span className="text-[16px] text-warning-amber select-none font-jetbrains-mono shrink-0">
        {icon}
      </span>
      <h2 className="text-[30px] font-normal font-jetbrains-mono text-ghost-white leading-[1.25]">
        {label}
      </h2>
    </motion.div>
  );
}
