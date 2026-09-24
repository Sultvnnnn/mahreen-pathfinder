"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { QuizAnswers, QuizSubmitRequest } from "@/lib/api";
import { staggerParent, fadeUp } from "@/lib/motion";

interface QuizFormProps {
  onSubmit: (payload: QuizSubmitRequest) => Promise<void>;
  isLoading: boolean;
  errorMessage?: string | null;
}

const MINAT_OPTIONS = [
  "Teknologi Digital & Software",
  "Industri Kreatif & Media",
  "Bisnis & Startup",
  "Kontribusi Sosial & Komunitas",
  "Pengembangan Talenta & Skill",
];

const TUJUAN_OPTIONS = [
  "Mengembangkan Portofolio & Skill",
  "Membangun Startup / Bisnis Rintisan",
  "Memperluas Relasi & Dampak Sosial",
  "Mendapat Mentorship & Kesempatan Magang",
];

const GAYA_OPTIONS = [
  "Hands-on Technical & Coding",
  "Kolaboratif dalam Tim Multidisiplin",
  "Kepemimpinan & Pengorganisasian Proyek",
  "Eksplorasi Mandiri & Riset Strategis",
];

export default function QuizForm({
  onSubmit,
  isLoading,
  errorMessage,
}: QuizFormProps) {
  const shouldReduceMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<QuizAnswers>({
    minat: "",
    tujuan: "",
    gaya_berkarya: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof QuizAnswers, string>>>({});

  const validate = () => {
    const errs: Partial<Record<keyof QuizAnswers, string>> = {};
    if (!answers.minat) errs.minat = "Pilih minat utama Anda";
    if (!answers.tujuan) errs.tujuan = "Pilih tujuan yang ingin dicapai";
    if (!answers.gaya_berkarya) errs.gaya_berkarya = "Pilih gaya berkarya yang paling cocok";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    await onSubmit({
      answers,
      name: name.trim() || undefined,
    });
  };

  return (
    <motion.form
      variants={staggerParent(0.06)}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate="visible"
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full max-w-[640px] mx-auto"
      noValidate
    >
      {/* Input Nama (Opsional) */}
      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <label
          htmlFor="quiz-name"
          className="text-[14px] leading-[1.63] font-jetbrains-mono text-mist"
        >
          Nama Lengkap (opsional)
        </label>
        <input
          id="quiz-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="contoh: Budi Pratama"
          disabled={isLoading}
          className="bg-abyssal-blue border border-fog/15 rounded-lg px-4 py-2 text-[16px] font-jetbrains-mono text-mist focus:outline-none focus:border-portal-blue placeholder:text-ash disabled:opacity-50 transition-colors"
        />
      </motion.div>

      {/* Pertanyaan 1: Minat */}
      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <label
          htmlFor="quiz-minat"
          className="text-[14px] leading-[1.63] font-jetbrains-mono text-mist"
        >
          1. Minat utama dalam berkarya *
        </label>
        <select
          id="quiz-minat"
          value={answers.minat}
          onChange={(e) => {
            setAnswers({ ...answers, minat: e.target.value });
            if (errors.minat) setErrors({ ...errors, minat: undefined });
          }}
          disabled={isLoading}
          className={`bg-abyssal-blue border ${
            errors.minat ? "border-fault-red" : "border-fog/15"
          } rounded-lg px-4 py-2 text-[16px] font-jetbrains-mono text-mist focus:outline-none focus:border-portal-blue disabled:opacity-50 transition-colors cursor-pointer`}
        >
          <option value="" disabled className="bg-abyssal-blue text-ash">
            -- pilih minat Anda --
          </option>
          {MINAT_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-abyssal-blue text-mist">
              {opt}
            </option>
          ))}
        </select>
        {errors.minat && (
          <span className="text-[14px] leading-[1.63] font-jetbrains-mono text-fault-red">
            {errors.minat}
          </span>
        )}
      </motion.div>

      {/* Pertanyaan 2: Tujuan */}
      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <label
          htmlFor="quiz-tujuan"
          className="text-[14px] leading-[1.63] font-jetbrains-mono text-mist"
        >
          2. Sasaran yang ingin dicapai melalui program *
        </label>
        <select
          id="quiz-tujuan"
          value={answers.tujuan}
          onChange={(e) => {
            setAnswers({ ...answers, tujuan: e.target.value });
            if (errors.tujuan) setErrors({ ...errors, tujuan: undefined });
          }}
          disabled={isLoading}
          className={`bg-abyssal-blue border ${
            errors.tujuan ? "border-fault-red" : "border-fog/15"
          } rounded-lg px-4 py-2 text-[16px] font-jetbrains-mono text-mist focus:outline-none focus:border-portal-blue disabled:opacity-50 transition-colors cursor-pointer`}
        >
          <option value="" disabled className="bg-abyssal-blue text-ash">
            -- pilih sasaran Anda --
          </option>
          {TUJUAN_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-abyssal-blue text-mist">
              {opt}
            </option>
          ))}
        </select>
        {errors.tujuan && (
          <span className="text-[14px] leading-[1.63] font-jetbrains-mono text-fault-red">
            {errors.tujuan}
          </span>
        )}
      </motion.div>

      {/* Pertanyaan 3: Gaya Berkarya */}
      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <label
          htmlFor="quiz-gaya"
          className="text-[14px] leading-[1.63] font-jetbrains-mono text-mist"
        >
          3. Gaya berkarya yang paling mewakili Anda *
        </label>
        <select
          id="quiz-gaya"
          value={answers.gaya_berkarya}
          onChange={(e) => {
            setAnswers({ ...answers, gaya_berkarya: e.target.value });
            if (errors.gaya_berkarya) setErrors({ ...errors, gaya_berkarya: undefined });
          }}
          disabled={isLoading}
          className={`bg-abyssal-blue border ${
            errors.gaya_berkarya ? "border-fault-red" : "border-fog/15"
          } rounded-lg px-4 py-2 text-[16px] font-jetbrains-mono text-mist focus:outline-none focus:border-portal-blue disabled:opacity-50 transition-colors cursor-pointer`}
        >
          <option value="" disabled className="bg-abyssal-blue text-ash">
            -- pilih gaya berkarya --
          </option>
          {GAYA_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-abyssal-blue text-mist">
              {opt}
            </option>
          ))}
        </select>
        {errors.gaya_berkarya && (
          <span className="text-[14px] leading-[1.63] font-jetbrains-mono text-fault-red">
            {errors.gaya_berkarya}
          </span>
        )}
      </motion.div>

      {/* Submit Button & Error Message */}
      <motion.div variants={fadeUp} className="pt-2 flex flex-col gap-3 items-start">
        <button
          type="submit"
          disabled={isLoading}
          className={`pill-green px-8 py-3 text-[16px] font-jetbrains-mono cursor-pointer ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "memproses..." : "Dapatkan Rekomendasi Program →"}
        </button>

        {errorMessage && (
          <span
            role="alert"
            className="text-[14px] leading-[1.63] font-jetbrains-mono text-fault-red"
          >
            ✕ {errorMessage}
          </span>
        )}
      </motion.div>
    </motion.form>
  );
}
