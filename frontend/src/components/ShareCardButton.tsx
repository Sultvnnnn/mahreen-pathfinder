"use client";

import React, { useState } from "react";
import { RecommendedProgram } from "@/lib/api";

interface ShareCardButtonProps {
  program: RecommendedProgram;
  userName?: string;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export default function ShareCardButton({
  program,
  userName = "Kreator Muda",
}: ShareCardButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      // 1. Wait for webfonts to be ready
      if (typeof document !== "undefined" && document.fonts) {
        await document.fonts.ready;
      }

      // 2. Create offscreen canvas (1080x1080)
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Gagal menginisialisasi 2D canvas context");
      }

      const fontMono = '"JetBrains Mono", monospace';

      // --- Background: Cosmic Void (#06051d) to Abyssal Blue (#0f1c36) ---
      const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1080);
      bgGradient.addColorStop(0, "#06051d");
      bgGradient.addColorStop(1, "#0f1c36");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 1080, 1080);

      // --- Inset Borders ---
      // Outer border (Fog 15%)
      ctx.strokeStyle = "rgba(229, 231, 235, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(60, 60, 960, 960);

      // Inner faint border (Fog 5%)
      ctx.strokeStyle = "rgba(229, 231, 235, 0.05)";
      ctx.lineWidth = 1;
      ctx.strokeRect(72, 72, 936, 936);

      // Corner Crosshair Accents (Specimen Green #10b981)
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      const corners = [
        [60, 60],
        [1020, 60],
        [60, 1020],
        [1020, 1020],
      ];
      corners.forEach(([x, y]) => {
        const dx = x === 60 ? 1 : -1;
        const dy = y === 60 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(x, y + dy * 16);
        ctx.lineTo(x, y);
        ctx.lineTo(x + dx * 16, y);
        ctx.stroke();
      });

      // --- Header Area ---
      // Subtitle / Label
      ctx.font = `500 16px ${fontMono}`;
      ctx.fillStyle = "#94a3b8"; // Ash
      ctx.fillText("[ MAHREEN PATHFINDER // KARTU KARYA ]", 100, 130);

      // Main Slogan (Specimen Green)
      ctx.font = `500 28px ${fontMono}`;
      ctx.fillStyle = "#10b981"; // Specimen Green
      ctx.fillText("BERKARYA UNTUK INDONESIA", 100, 175);

      // Header Divider Line
      ctx.strokeStyle = "rgba(229, 231, 235, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, 210);
      ctx.lineTo(980, 210);
      ctx.stroke();

      // --- User Profile Section ---
      ctx.font = `500 15px ${fontMono}`;
      ctx.fillStyle = "#94a3b8"; // Ash
      ctx.fillText("NAMA PESERTA / TALENTA MUDA:", 100, 260);

      ctx.font = `500 40px ${fontMono}`;
      ctx.fillStyle = "#ffffff"; // Ghost White
      const safeUserName = (userName || "Kreator Muda").trim();
      ctx.fillText(safeUserName, 100, 310);

      // --- Recommended Program Card (Deep Slate #111625) ---
      const cardX = 100;
      const cardY = 360;
      const cardW = 880;
      const cardH = 340;

      ctx.fillStyle = "#111625"; // Deep Slate
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeStyle = "rgba(229, 231, 235, 0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      // Card Header: Category & Match Score
      ctx.font = `500 18px ${fontMono}`;
      ctx.fillStyle = "#cbd5e1"; // Mist
      ctx.fillText(program.category.toUpperCase(), cardX + 36, cardY + 50);

      ctx.font = `500 20px ${fontMono}`;
      ctx.fillStyle = "#10b981"; // Specimen Green
      const scoreText = `skor kecocokan: ${program.score}%`;
      const scoreWidth = ctx.measureText(scoreText).width;
      ctx.fillText(scoreText, cardX + cardW - 36 - scoreWidth, cardY + 50);

      // Card Program Title (Portal Blue #38bdf8)
      ctx.font = `500 34px ${fontMono}`;
      ctx.fillStyle = "#38bdf8";
      const titleLines = wrapText(ctx, program.title, cardW - 72);
      let titleY = cardY + 105;
      titleLines.slice(0, 2).forEach((line) => {
        ctx.fillText(line, cardX + 36, titleY);
        titleY += 44;
      });

      // Card Description excerpt
      ctx.font = `400 17px ${fontMono}`;
      ctx.fillStyle = "#cbd5e1"; // Mist
      const descLines = wrapText(ctx, program.description, cardW - 72);
      let descY = titleY + 10;
      descLines.slice(0, 3).forEach((line) => {
        ctx.fillText(line, cardX + 36, descY);
        descY += 26;
      });

      // --- Match Reasons Section ---
      if (program.match_reasons && program.match_reasons.length > 0) {
        ctx.font = `500 17px ${fontMono}`;
        ctx.fillStyle = "#fbbf24"; // Warning Amber
        ctx.fillText("★ ALASAN REKOMENDASI:", 100, 745);

        ctx.font = `400 16px ${fontMono}`;
        ctx.fillStyle = "#cbd5e1"; // Mist
        let reasonY = 780;
        program.match_reasons.slice(0, 3).forEach((reason) => {
          const reasonLine = `• ${reason}`;
          const wrappedReason = wrapText(ctx, reasonLine, 880);
          wrappedReason.slice(0, 1).forEach((line) => {
            ctx.fillText(line, 100, reasonY);
            reasonY += 28;
          });
        });
      }

      // --- Footer Section ---
      ctx.strokeStyle = "rgba(229, 231, 235, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, 930);
      ctx.lineTo(980, 930);
      ctx.stroke();

      ctx.font = `500 16px ${fontMono}`;
      ctx.fillStyle = "#10b981"; // Specimen Green
      ctx.fillText("mahreen://pathfinder", 100, 970);

      ctx.font = `500 16px ${fontMono}`;
      ctx.fillStyle = "#94a3b8"; // Ash
      const hashtag = "#berkaryauntukindonesia";
      const hashWidth = ctx.measureText(hashtag).width;
      ctx.fillText(hashtag, 980 - hashWidth, 970);

      // 3. Export as PNG and trigger download
      canvas.toBlob((blob) => {
        if (!blob) {
          setErrorMessage("Gagal membuat gambar PNG");
          setIsGenerating(false);
          return;
        }

        const safeSlug = safeUserName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        const fileName = `kartu-karya-${safeSlug || "talenta"}.png`;

        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        setIsGenerating(false);
      }, "image/png");
    } catch (err: unknown) {
      console.error("Gagal generate kartu karya:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Gagal menyiapkan berkas kartu karya"
      );
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 items-start">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        aria-label="Unduh kartu karya hasil rekomendasi"
        className="px-4 py-2 rounded-full border border-specimen-green/40 bg-abyssal-blue/60 hover:bg-specimen-green/10 text-specimen-green font-jetbrains-mono text-[14px] transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
      >
        <span>↓</span>
        <span>{isGenerating ? "menyiapkan kartu karya..." : "unduh kartu karya"}</span>
      </button>
      {errorMessage && (
        <span className="font-jetbrains-mono text-[12px] text-fault-red">
          ! {errorMessage}
        </span>
      )}
    </div>
  );
}
