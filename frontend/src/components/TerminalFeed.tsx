"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchStats, ActivityItem, StatsResponse } from "@/lib/api";
import { fadeUp, staggerParent } from "@/lib/motion";

function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "baru saja";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  } catch {
    return "baru saja";
  }
}

export default function TerminalFeed() {
  const shouldReduceMotion = useReducedMotion();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        // 1. Fetch initial statistics
        const statsData = await fetchStats().catch((err) => {
          console.warn("Gagal memuat stats backend:", err);
          return null;
        });

        if (isMounted && statsData) {
          setStats(statsData);
        }

        // 2. Fetch initial 8 activities via Supabase REST (anon key)
        if (isSupabaseConfigured()) {
          const supabase = getSupabase();
          const { data, error: sbError } = await supabase
            .from("activity")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(8);

          if (sbError) {
            console.warn("Gagal memuat aktivitas awal:", sbError.message);
          } else if (isMounted && data) {
            setActivities(data as ActivityItem[]);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Terjadi kesalahan saat memuat pulse data"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    // 3. Realtime subscription to public.activity INSERT events
    let channel: ReturnType<ReturnType<typeof getSupabase>["channel"]> | null = null;
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        channel = supabase
          .channel("public-activity-pulse")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "activity" },
            (payload) => {
              if (!isMounted) return;
              const newActivity = payload.new as ActivityItem;
              setActivities((prev) => [newActivity, ...prev.slice(0, 11)]);
              // Increment total submissions counter optimistically
              setStats((prev) =>
                prev
                  ? {
                      ...prev,
                      total_submissions: prev.total_submissions + 1,
                    }
                  : null
              );
            }
          )
          .subscribe();
      } catch (err) {
        console.warn("Gagal inisialisasi Realtime channel:", err);
      }
    }

    return () => {
      isMounted = false;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  // Compute ASCII Bar Chart from interest_distribution
  const distribution = stats?.interest_distribution || [];
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);
  const barWidth = 16;

  return (
    <div className="w-full bg-steel-navy rounded-lg p-6 sm:p-8 border border-fog/10 flex flex-col gap-6">
      {/* Top Status Bar: Live status indicator & aggregate badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-fog/10 font-jetbrains-mono text-[13px]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-specimen-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-specimen-green"></span>
          </span>
          <span className="text-specimen-green tracking-wider uppercase">
            LIVE // TERMINAL PULSE
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-mist/80">
          <span>
            total:{" "}
            <strong className="text-ghost-white font-normal">
              {stats?.total_submissions ?? 0}
            </strong>{" "}
            submisi
          </span>
          {stats?.top_program && (
            <span className="hidden sm:inline">
              favorit:{" "}
              <strong className="text-portal-blue font-normal">
                {stats.top_program}
              </strong>
            </span>
          )}
        </div>
      </div>

      {/* Grid: Live Feed (Left) & ASCII Bar Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col (7/12): Live Activity Feed */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[13px] font-jetbrains-mono text-mist/60 pb-1">
            <span>RIWAYAT AKTIVITAS TERBARU</span>
            <span className="text-[12px]">max 12 baris</span>
          </div>

          {isLoading ? (
            <div className="bg-abyssal-blue/40 border border-fog/10 rounded-lg p-6 font-jetbrains-mono text-[14px] text-mist/60 text-center">
              &gt; memuat log aktivitas kuis...
            </div>
          ) : error ? (
            <div className="bg-abyssal-blue/40 border border-fault-red/30 rounded-lg p-4 font-jetbrains-mono text-[13px] text-fault-red">
              ! Gagal memuat aktivitas: {error}
            </div>
          ) : activities.length === 0 ? (
            <div className="bg-abyssal-blue/40 border border-fog/10 rounded-lg p-6 font-jetbrains-mono text-[14px] text-mist/60 text-center">
              &gt; belum ada aktivitas tercatat. selesaikan kuis untuk memicu pulse realtime.
            </div>
          ) : (
            <motion.ul
              variants={staggerParent(0.04)}
              initial={shouldReduceMotion ? "visible" : "hidden"}
              animate="visible"
              className="flex flex-col gap-2 font-jetbrains-mono text-[14px]"
            >
              {activities.map((item) => (
                <motion.li
                  key={item.id}
                  variants={fadeUp}
                  className="flex items-baseline gap-2.5 px-3 py-2 rounded bg-abyssal-blue/50 border border-fog/5 hover:border-portal-blue/20 transition-colors"
                >
                  <span className="text-[12px] text-mist/50 shrink-0">
                    [{formatTimestamp(item.created_at)}]
                  </span>
                  <span className="text-[12px] text-specimen-green shrink-0">
                    [QUIZ]
                  </span>
                  <span className="text-mist truncate" title={item.label}>
                    {item.label}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>

        {/* Right Col (5/12): ASCII Bar Chart from /api/stats */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[13px] font-jetbrains-mono text-warning-amber pb-1">
            <span>★ DISTRIBUSI MINAT (TOP 5)</span>
            <span className="text-[12px] text-mist/60">agregat</span>
          </div>

          <div className="bg-abyssal-blue/80 border border-fog/10 rounded-lg p-4 font-jetbrains-mono text-[13px] sm:text-[14px] leading-relaxed overflow-x-auto">
            {distribution.length === 0 ? (
              <div className="text-mist/60 text-center py-6">
                &gt; belum ada data distribusi.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {distribution.map((item, idx) => {
                  const filledLen = Math.max(
                    1,
                    Math.round((item.count / maxCount) * barWidth)
                  );
                  const emptyLen = Math.max(0, barWidth - filledLen);
                  const filledBlocks = "█".repeat(filledLen);
                  const emptyBlocks = "░".repeat(emptyLen);
                  const paddedInterest = item.interest.slice(0, 12).padEnd(12);

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 whitespace-pre"
                    >
                      <span className="text-mist shrink-0">{paddedInterest}</span>
                      <span className="font-jetbrains-mono text-[12px] sm:text-[13px] shrink-0">
                        <span className="text-portal-blue">{filledBlocks}</span>
                        <span className="text-mist/20">{emptyBlocks}</span>
                      </span>
                      <span className="text-specimen-green text-right w-8 shrink-0">
                        {item.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer Summary note */}
            <div className="pt-4 mt-4 border-t border-fog/10 text-[12px] text-mist/60 flex items-center justify-between">
              <span>skala: 1 blok = {Math.ceil(maxCount / barWidth)} submisi</span>
              <span>sumber: /api/stats</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
