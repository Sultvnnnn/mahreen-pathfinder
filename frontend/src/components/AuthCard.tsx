"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { fadeUp } from "@/lib/motion";

interface AuthCardProps {
  initialMode?: "login" | "register";
  redirectTo?: string;
}

function mapAuthError(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("invalid login credentials")) return "Email atau kata sandi salah";
  if (lower.includes("user already registered")) return "Email ini sudah terdaftar. Silakan masuk.";
  if (lower.includes("over_email_send_rate_limit") || lower.includes("rate limit")) {
    return "Batas pengiriman email terlampaui. Silakan matikan 'Confirm email' di Supabase Dashboard (Auth -> Providers -> Email).";
  }
  if (lower.includes("is invalid")) {
    return "Email ditolak oleh server verifikasi Supabase. Matikan opsi 'Confirm email' di Supabase Dashboard agar registrasi langsung aktif tanpa kirim email.";
  }
  if (lower.includes("password should be at least")) return "Kata sandi minimal 6 karakter";
  return msg;
}

export default function AuthCard({
  initialMode = "login",
  redirectTo = "/quiz",
}: AuthCardProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!email || !password) {
      setErrorMessage("Email dan password wajib diisi");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password minimal 6 karakter");
      return;
    }

    if (!isSupabaseConfigured()) {
      setErrorMessage(
        "Variabel NEXT_PUBLIC_SUPABASE_ANON_KEY belum dikonfigurasi di frontend/.env.local. Silakan salin anon public key dari Supabase Dashboard (Settings -> API) untuk mengaktifkan login autentikasi."
      );
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabase();

      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMessage(mapAuthError(error.message));
          return;
        }

        // If session created directly or confirmation needed
        if (data.session) {
          router.push(redirectTo);
          router.refresh();
        } else {
          setInfoMessage(
            "Pendaftaran berhasil! Jika akun belum aktif, silakan periksa inbox email atau matikan konfirmasi email di Supabase."
          );
          setMode("login");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMessage(mapAuthError(error.message));
          return;
        }

        if (data.session) {
          router.push(redirectTo);
          router.refresh();
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={fadeUp}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate="visible"
      className="w-full max-w-[640px] mx-auto bg-steel-navy/40 border border-fog/10 rounded-lg p-8 flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-[30px] font-normal font-jetbrains-mono text-ghost-white leading-[1.25]">
          {mode === "login" ? "Masuk ke Akun" : "Daftar Akun Baru"}
        </h2>
        <p className="text-[14px] leading-[1.63] font-jetbrains-mono text-mist">
          {mode === "login"
            ? "Masuk untuk menyimpan hasil kuis dan mendapatkan rekomendasi personal."
            : "Buat akun untuk memulai eksplorasi program Mahreen Indonesia."}
        </p>
      </div>

      {!isSupabaseConfigured() && (
        <div className="p-3 border border-warning-amber/40 bg-abyssal-blue/70 rounded-lg text-[13px] font-jetbrains-mono text-warning-amber leading-relaxed">
          ℹ Konfigurasi Diperlukan: Masukkan <code className="text-ice-blue">anon public key</code> dari Supabase Project Settings ke file <code className="text-ice-blue">frontend/.env.local</code> pada <code className="text-ice-blue">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        {/* Email */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="auth-email"
            className="text-[14px] leading-[1.63] font-jetbrains-mono text-mist"
          >
            Alamat Email *
          </label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            disabled={isLoading}
            className={`bg-abyssal-blue border ${
              errorMessage ? "border-fault-red" : "border-fog/15"
            } rounded-lg px-4 py-2 text-[16px] font-jetbrains-mono text-mist focus:outline-none focus:border-portal-blue placeholder:text-ash disabled:opacity-50 transition-colors`}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="auth-password"
            className="text-[14px] leading-[1.63] font-jetbrains-mono text-mist"
          >
            Kata Sandi *
          </label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="minimal 6 karakter"
            disabled={isLoading}
            className={`bg-abyssal-blue border ${
              errorMessage ? "border-fault-red" : "border-fog/15"
            } rounded-lg px-4 py-2 text-[16px] font-jetbrains-mono text-mist focus:outline-none focus:border-portal-blue placeholder:text-ash disabled:opacity-50 transition-colors`}
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-[14px] leading-[1.63] font-jetbrains-mono text-fault-red"
          >
            ✕ {errorMessage}
          </motion.div>
        )}

        {/* Info Message */}
        {infoMessage && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-[14px] leading-[1.63] font-jetbrains-mono text-specimen-green"
          >
            {infoMessage}
          </motion.div>
        )}

        {/* Submit Button (Pill Hijau) */}
        <div className="pt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className={`pill-green px-8 py-2.5 text-[16px] font-jetbrains-mono font-normal cursor-pointer ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading
              ? "memproses..."
              : mode === "login"
              ? "Masuk"
              : "Daftar Sekarang"}
          </button>

          {/* Toggle Mode Flat Link */}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setErrorMessage(null);
              setInfoMessage(null);
            }}
            className="text-[16px] font-jetbrains-mono text-portal-blue hover:underline text-left cursor-pointer"
          >
            {mode === "login"
              ? "Belum punya akun? Buat akun baru →"
              : "Sudah punya akun? Masuk di sini →"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
