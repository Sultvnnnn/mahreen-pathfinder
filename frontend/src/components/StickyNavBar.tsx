"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export interface UserSession {
  email: string;
}

export default function StickyNavBar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      // Hysteresis threshold to eliminate flutter/flicker
      if (y > 48) {
        setIsScrolled(true);
      } else if (y < 16) {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    try {
      const supabase = getSupabase();

      supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
        if (session?.user?.email) {
          setCurrentUser({ email: session.user.email });
        } else {
          setCurrentUser(null);
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user?.email) {
          setCurrentUser({ email: session.user.email });
        } else {
          setCurrentUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Supabase client initialization fallback
    }
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
      setCurrentUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full flex justify-center pointer-events-none transition-[padding] duration-300 ease-out ${
        isScrolled ? "pt-2.5 px-3 sm:px-6" : "pt-0 px-0"
      }`}
    >
      <div
        className={`pointer-events-auto w-full transition-[max-width,border-radius,padding,margin,border-color,box-shadow,background-color] duration-300 ease-out flex items-center justify-between ${
          isScrolled
            ? "max-w-[760px] bg-steel-navy/95 border border-portal-blue/25 rounded-full py-1.5 px-4 sm:px-6 pill-shadow"
            : "max-w-full bg-steel-navy border-b border-fog/10 rounded-none py-2.5 px-4 sm:px-12"
        }`}
      >
        {/* Kiri: Logo-text mahreen://pathfinder + Flat Links */}
        <div className="flex items-center gap-4 sm:gap-8 flex-shrink-0">
          <Link
            href="/"
            className="text-[13px] sm:text-[14px] font-jetbrains-mono text-ghost-white hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            mahreen://pathfinder
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/programs"
              className="text-[14px] sm:text-[16px] font-jetbrains-mono text-portal-blue hover:underline whitespace-nowrap"
            >
              program
            </Link>
            <Link
              href="/tentang"
              className="text-[14px] sm:text-[16px] font-jetbrains-mono text-portal-blue hover:underline whitespace-nowrap"
            >
              tentang
            </Link>
          </div>
        </div>

        {/* Kanan: Pill Triad atau Caption Email + Keluar */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {!isScrolled && (
                <span
                  className="text-[13px] sm:text-[14px] font-jetbrains-mono text-mist truncate max-w-[140px] sm:max-w-[220px]"
                  title={currentUser.email}
                >
                  {currentUser.email}
                </span>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                title="Keluar"
                aria-label="Keluar"
                className="p-1.5 rounded-lg text-mist hover:text-fault-red hover:bg-abyssal-blue/60 transition-colors cursor-pointer flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login?mode=register"
                className={`pill-green font-jetbrains-mono cursor-pointer whitespace-nowrap transition-all ${
                  isScrolled
                    ? "px-3 py-1 text-[13px]"
                    : "px-4 py-1.5 text-[14px]"
                }`}
              >
                Daftar
              </Link>
              <Link
                href="/login"
                className={`pill-red font-jetbrains-mono cursor-pointer whitespace-nowrap transition-all ${
                  isScrolled
                    ? "px-3 py-1 text-[13px]"
                    : "px-4 py-1.5 text-[14px]"
                }`}
              >
                Masuk
              </Link>
              <Link
                href="/quiz"
                className={`pill-amber font-jetbrains-mono cursor-pointer whitespace-nowrap transition-all hidden sm:inline-block ${
                  isScrolled
                    ? "px-3 py-1 text-[13px]"
                    : "px-4 py-1.5 text-[14px]"
                }`}
              >
                Mulai Quiz
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
