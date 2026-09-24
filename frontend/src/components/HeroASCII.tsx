"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import {
  characterStaggerParent,
  characterVariant,
  staggerParent,
  fadeUp,
} from "@/lib/motion";

const TITLE_TEXT = "BERKARYA UNTUK INDONESIA";

const LOGO_ASCII = [
  "|¯¯\\/¯¯|  /¯¯\\  |¯|__|¯| |¯¯¯\\  |¯¯¯¯| |¯¯¯¯| |¯\\  |¯|",
  "| |\\/| | / /\\ \\ |  __  | | |_) )| |__  | |__  |  \\ | |",
  "| |  | |/ /__\\ \\| |  | | |  _ < |  __| |  __| | |\\\\| |",
  "|_|  |_/_/    \\_|_|  |_| |_| \\_\\| |___ | |___ |_| \\__|",
];

const RAW_WORDS = [
  "mahreen",
  "pathfinder",
  "berkarya",
  "teknologi",
  "kreativitas",
  "komunitas",
  "indonesia",
  "inovasi",
  "talenta",
  "startup",
  "dampak",
  "generasi",
  "karir",
  "future",
  "media",
  "studio",
  "action",
];

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789.,/\\-_;:'\"~*+=<>[]{}()|";

function generateRowText(length: number, rowIndex: number): string {
  let result = "";
  let seed = (rowIndex * 9301 + 49297) % 233280;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (result.length < length) {
    const r = rand();
    if (r < 0.22) {
      const word = RAW_WORDS[Math.floor(rand() * RAW_WORDS.length)];
      result += " " + word + " ";
    } else if (r < 0.55) {
      const len = Math.floor(rand() * 4) + 1;
      let cluster = "";
      for (let i = 0; i < len; i++) {
        cluster += GLYPHS[Math.floor(rand() * GLYPHS.length)];
      }
      result += cluster + " ";
    } else if (r < 0.78) {
      result += " " + GLYPHS[Math.floor(rand() * GLYPHS.length)] + " ";
    } else {
      result += "   ";
    }
  }
  return result.slice(0, length);
}

export default function HeroASCII() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [currentUser, setCurrentUser] = useState<{ email: string } | null>(null);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    const lineHeight = 13.5;
    const charWidth = 9.2;

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    let numRows = 0;
    let numCols = 0;
    let rowTexts: string[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      numRows = Math.ceil(height / lineHeight) + 4;
      numCols = Math.ceil(width / charWidth) + 4;

      rowTexts = [];
      for (let r = 0; r < numRows; r++) {
        rowTexts.push(generateRowText(numCols + 10, r));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const mouse = {
      x: width * 0.5,
      y: height * 0.45,
      targetX: width * 0.5,
      targetY: height * 0.45,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Concave bottom bowl parameters (dipping in center, arching up at left/right edges)
      const sag = Math.min(85, Math.max(48, height * 0.11));
      const bottomCenterY = height - 12;
      const bottomEdgeY = height - sag;

      // Clip canvas drawing to the bottom concave bowl
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, bottomEdgeY);
      ctx.quadraticCurveTo(width * 0.5, bottomCenterY, 0, bottomEdgeY);
      ctx.closePath();
      ctx.clip();

      // Smooth mouse follow
      if (!shouldReduceMotion) {
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;
        time += 0.018;
      }

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textBaseline = "middle";

      const waveSpeed = 2.0;
      const waveFreq = 0.016;
      const ellipticalFactor = 2.4; // Wide perspective ripple ratio

      // Pre-calculate MAHREEN logo layout and exclusion bounds
      const logoCharWidth = 12.0;
      const logoLineHeight = 18;
      const logoTotalWidth = LOGO_ASCII[0].length * logoCharWidth;
      const startX = Math.max(16, (width - logoTotalWidth) / 2);
      const startY = Math.max(90, height * 0.25);
      const logoHeight = LOGO_ASCII.length * logoLineHeight;
      const logoPadX = 36;
      const logoPadY = 20;

      // 1. Draw horizontal scanlines and matrix characters
      for (let r = 0; r < numRows; r++) {
        const baseY = r * lineHeight;
        const rowProgress = r / numRows;
        // Curvature bowing downward in center, stronger towards the bottom
        const bowIntensity = Math.pow(rowProgress, 1.3) * (sag * 0.72);

        // Draw subtle horizontal scanline with concave bow
        ctx.beginPath();
        ctx.strokeStyle = "rgba(15, 28, 54, 0.55)";
        ctx.lineWidth = 1;

        const stepX = 18;
        for (let x = 0; x <= width + stepX; x += stepX) {
          const dx = x - mouse.x;
          const dy = (baseY - mouse.y) * ellipticalFactor;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const ripple = Math.sin(dist * waveFreq - time * waveSpeed);
          const ambient = Math.sin(x * 0.005 + time * 0.7) * Math.cos(baseY * 0.01 + time * 0.5);
          const bow = Math.sin((x / width) * Math.PI) * bowIntensity;
          const lineY = baseY + bow + ripple * 4.5 + ambient * 2.5;

          if (x === 0) {
            ctx.moveTo(x, lineY);
          } else {
            ctx.lineTo(x, lineY);
          }
        }
        ctx.stroke();

        // Draw characters along the scanline
        const rowText = rowTexts[r % rowTexts.length] || "";
        for (let c = 0; c < numCols; c++) {
          const ch = rowText[c % rowText.length];
          if (!ch || ch === " ") continue;

          const baseX = c * charWidth;

          // Exclusion zone for the MAHREEN logo: NEVER overlap random text with the logo!
          if (
            baseX >= startX - logoPadX &&
            baseX <= startX + logoTotalWidth + logoPadX &&
            baseY >= startY - logoPadY &&
            baseY <= startY + logoHeight + logoPadY
          ) {
            continue;
          }

          // Exclusion zone for center headline ("BERKARYA UNTUK INDONESIA") and buttons
          const centerDistX = Math.abs(baseX - width * 0.5);
          const centerDistY = Math.abs(baseY - height * 0.58);
          if (centerDistX < 360 && centerDistY < 85) {
            continue;
          }

          const dx = baseX - mouse.x;
          const dy = (baseY - mouse.y) * ellipticalFactor;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const ripple = Math.sin(dist * waveFreq - time * waveSpeed);
          const ambient = Math.sin(baseX * 0.005 + time * 0.7) * Math.cos(baseY * 0.01 + time * 0.5);
          const charBow = Math.sin((baseX / width) * Math.PI) * bowIntensity;
          const totalY = baseY + charBow + ripple * 4.5 + ambient * 2.5;
          const totalX = baseX + Math.cos(dist * waveFreq - time * waveSpeed) * 1.6;

          // Wave crest illumination - subtle, low-key bioluminescence that blends with cosmic void
          const waveVal = (ripple + 1) / 2;
          if (waveVal > 0.72) {
            ctx.fillStyle = "rgba(148, 197, 237, 0.28)"; // Soft crest glimmer
          } else if (waveVal > 0.42) {
            ctx.fillStyle = "rgba(70, 95, 135, 0.18)"; // Gentle mid tone
          } else {
            ctx.fillStyle = "rgba(25, 38, 65, 0.10)"; // Deep trough, barely whispering in the dark
          }

          ctx.fillText(ch, totalX, totalY);
        }
      }

      // 2. Draw Wireframe ASCII Logo "MAHREEN" with subtle dark backdrop and refined glow
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        startY + logoHeight * 0.5,
        20,
        width * 0.5,
        startY + logoHeight * 0.5,
        logoTotalWidth * 0.55
      );
      bgGrad.addColorStop(0, "rgba(6, 5, 29, 0.85)");
      bgGrad.addColorStop(0.7, "rgba(6, 5, 29, 0.6)");
      bgGrad.addColorStop(1, "rgba(6, 5, 29, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(startX - logoPadX, startY - logoPadY, logoTotalWidth + logoPadX * 2, logoHeight + logoPadY * 2);

      // Render logo with refined Mist tone that integrates harmoniously with the dark backdrop
      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.shadowColor = "rgba(99, 179, 237, 0.35)";
      ctx.shadowBlur = 8;

      for (let rowIdx = 0; rowIdx < LOGO_ASCII.length; rowIdx++) {
        const line = LOGO_ASCII[rowIdx];
        const lineBaseY = startY + rowIdx * logoLineHeight;

        for (let charIdx = 0; charIdx < line.length; charIdx++) {
          const char = line[charIdx];
          if (char === " ") continue;

          const charBaseX = startX + charIdx * logoCharWidth;
          const dx = charBaseX - mouse.x;
          const dy = (lineBaseY - mouse.y) * ellipticalFactor;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const ripple = Math.sin(dist * waveFreq - time * waveSpeed);
          const waveY = lineBaseY + ripple * 4.5;
          const waveX = charBaseX + Math.cos(dist * waveFreq - time * waveSpeed) * 1.6;

          const logoWaveVal = (ripple + 1) / 2;
          if (logoWaveVal > 0.6) {
            ctx.fillStyle = "rgba(225, 238, 252, 0.72)";
          } else {
            ctx.fillStyle = "rgba(180, 202, 226, 0.48)";
          }

          ctx.fillText(char, waveX, waveY);
        }
      }
      ctx.shadowBlur = 0;

      // Soft natural fade towards the bottom curved edge so characters and lines dissolve organically into the void
      const fadeGrad = ctx.createLinearGradient(0, height - sag - 40, 0, height);
      fadeGrad.addColorStop(0, "rgba(6, 5, 29, 0)");
      fadeGrad.addColorStop(1, "rgba(6, 5, 29, 0.9)");
      ctx.fillStyle = fadeGrad;
      ctx.fillRect(0, height - sag - 40, width, sag + 40);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion]);

  return (
    <section className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 select-none">
      {/* Background ASCII Midjourney-style Wave Canvas */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        initial={shouldReduceMotion ? { opacity: 0.85 } : { opacity: 0 }}
        animate={
          shouldReduceMotion
            ? { opacity: 0.85 }
            : {
                opacity: [0.82, 0.88, 0.84, 0.88],
                transition: {
                  opacity: {
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut",
                  },
                },
              }
        }
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          aria-hidden="true"
        />
      </motion.div>

      {/* Center Foreground Overlay per DESIGN_SYSTEM.md */}
      <div className="relative z-10 w-full max-w-[800px] mx-auto text-center flex flex-col items-center gap-6 mt-16 md:mt-24">
        {/* Title: BERKARYA UNTUK INDONESIA 36-40px JetBrains Mono 400 Ghost White, Center */}
        <motion.h1
          variants={characterStaggerParent}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate="visible"
          className="text-[30px] sm:text-[36px] md:text-[40px] font-normal font-jetbrains-mono text-ghost-white tracking-tight leading-tight text-center"
        >
          {TITLE_TEXT.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={characterVariant}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Sub-caption: 14px Mist */}
        <motion.p
          variants={fadeUp}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate="visible"
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-[14px] font-jetbrains-mono text-mist max-w-[560px] leading-relaxed"
        >
          Temukan program Mahreen Indonesia yang paling relevan dengan minat, sasaran, dan gaya berkarya Anda.
        </motion.p>

        {/* Tombol hero per permintaan: Sign In & Login jika belum login, hanya Mulai Quiz jika sudah login */}
        <motion.div
          variants={staggerParent(0.08, 0.7)}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          {!currentUser ? (
            <>
              <motion.div variants={fadeUp}>
                <Link
                  href="/login?mode=register"
                  className="pill-green px-6 py-2.5 text-[14px] font-jetbrains-mono inline-block cursor-pointer"
                >
                  Sign In
                </Link>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Link
                  href="/login"
                  className="pill-red px-6 py-2.5 text-[14px] font-jetbrains-mono inline-block cursor-pointer"
                >
                  Login
                </Link>
              </motion.div>
            </>
          ) : null}

          <motion.div variants={fadeUp}>
            <Link
              href="/quiz"
              className="pill-amber px-6 py-2.5 text-[14px] font-jetbrains-mono inline-block cursor-pointer"
            >
              Mulai Quiz
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
