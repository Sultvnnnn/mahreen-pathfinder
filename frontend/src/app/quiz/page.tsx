"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SectionHeading from "@/components/SectionHeading";
import QuizForm from "@/components/QuizForm";
import ResultCard from "@/components/ResultCard";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  Recommendation,
  RecommendedProgram,
  QuizSubmitRequest,
  QuizSubmitResponse,
  submitQuizAnswers,
} from "@/lib/api";

export default function QuizPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<QuizSubmitResponse | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        if (!isSupabaseConfigured()) {
          router.replace("/login?redirect=/quiz");
          return;
        }

        const supabase = getSupabase();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/login?redirect=/quiz");
          return;
        }

        setAuthToken(session.access_token);
        setUserEmail(session.user.email || null);
      } catch {
        router.replace("/login?redirect=/quiz");
      } finally {
        setCheckingAuth(false);
      }
    }

    checkSession();
  }, [router]);

  const handleSubmit = async (payload: QuizSubmitRequest) => {
    if (!authToken) {
      setErrorMessage("Sesi login tidak valid atau telah berakhir. Silakan login kembali.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setUserName(payload.name || userEmail?.split("@")[0] || "Kreator Muda");

    try {
      const response = await submitQuizAnswers(payload, authToken);
      setResult(response);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses dan mengirimkan kuis";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setErrorMessage(null);
  };

  // Guard Loading State
  if (checkingAuth) {
    return (
      <div className="p-16 text-center border border-fog/10 rounded-lg bg-abyssal-blue/40 w-full max-w-[640px] mx-auto my-12">
        <span className="text-[14px] leading-[1.63] font-jetbrains-mono text-mist">
          memverifikasi sesi autentikasi...
        </span>
      </div>
    );
  }

  // Jika Hasil Kuis Sudah Ada (Result State)
  if (result) {
    return (
      <div className="flex flex-col gap-10 w-full max-w-[800px] mx-auto px-4 py-12">
        <div className="flex flex-col gap-3">
          <SectionHeading icon="★" label="hasil" />
          <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
            Berdasarkan profil minat, sasaran, dan gaya berkarya yang Anda pilih,
            berikut adalah program Mahreen Indonesia yang paling relevan untuk
            perjalanan karya Anda:
          </p>
        </div>

        {/* List of Result Cards */}
        <div className="flex flex-col gap-6">
          {result.recommendations.map((prog: RecommendedProgram) => (
            <ResultCard key={prog.id} program={prog} userName={userName} />
          ))}
        </div>

        {/* Retake CTA */}
        <div className="pt-6 border-t border-fog/10 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-[16px] font-jetbrains-mono text-portal-blue hover:underline cursor-pointer"
          >
            ← Ulangi Kuis Minat
          </button>
        </div>
      </div>
    );
  }

  // Tampilan Form Kuis (Default State)
  return (
    <div className="flex flex-col gap-8 w-full max-w-[640px] mx-auto px-4 py-12">
      <div className="flex flex-col gap-3">
        <SectionHeading icon="▶" label="quiz" />
        <p className="text-[16px] font-dm-sans text-mist leading-[1.5]">
          Jawab 3 pertanyaan berikut untuk menemukan program Mahreen Indonesia yang
          paling sesuai dengan minat, sasaran, dan gaya berkarya Anda.
        </p>
        {userEmail && (
          <span className="text-[14px] font-jetbrains-mono text-ash">
            peserta: {userEmail}
          </span>
        )}
      </div>

      {/* Visible Error State on Submit Failure */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="p-4 border border-fault-red/40 rounded-lg bg-abyssal-blue/80 flex flex-col gap-1"
        >
          <span className="text-[14px] leading-[1.63] font-jetbrains-mono text-fault-red">
            ✕ Terjadi kesalahan: {errorMessage}
          </span>
        </div>
      )}

      <QuizForm
        onSubmit={handleSubmit}
        isLoading={submitting}
        errorMessage={errorMessage}
      />
    </div>
  );
}
