# Product Requirements Document — Mahreen PathFinder

## Product Overview

- Product: Mahreen PathFinder
- One-line: Platform web interaktif yang membantu generasi muda Indonesia menemukan program Mahreen Indonesia yang paling cocok dengan minat, tujuan, dan gaya berkarya mereka.
- Vision: Menjadi "pintu masuk" generasi muda ke ekosistem Mahreen Indonesia melalui pengalaman yang menarik, mudah dipahami, dan relevan.
- Theme: "BERKARYA UNTUK INDONESIA"
- Context: Creative Challenge Mahreen Indonesia Internship Batch 2 — posisi Website Development (fokus backend engineer).

## Problem

Mahreen Indonesia memiliki banyak program (kreativitas, teknologi digital, pengembangan talenta, bisnis, komunitas, kontribusi sosial), tetapi informasinya belum mudah dikenal, dipahami, dan diikuti generasi muda karena tersebar dan tidak terpersonalisasi.

## Goal

- Generasi muda memahami program Mahreen dalam < 5 menit kunjungan pertama.
- Meningkatkan partisipasi lewat rekomendasi program yang personal.
- Memberikan Mahreen data minat generasi muda (dari submission quiz) sebagai insight.

## Target Users

- Generasi muda Indonesia usia 17–27 (pelajar, mahasiswa, fresh graduate, anggota komunitas).
- Peserta internship / program Mahreen yang butuh panduan memilih program.
- Tim seleksi Mahreen (secondary) yang menilai karya ini.

## Core Features (MVP)

1. Landing page bertema "BERKARYA UNTUK INDONESIA".
2. Autentikasi email + password via Supabase Auth (register & login).
3. Quiz minat 3 pertanyaan (minat, tujuan, gaya berkarya).
4. Recommendation engine berbasis tag scoring (bukan ML).
5. Katalog program Mahreen dari database (data-driven, bukan hardcode).
6. Penyimpanan submission quiz per user login.
7. REST API publik terdokumentasi (Swagger/OpenAPI).
8. Endpoint stats sederhana (total submission, minat terpopuler).
9. Terminal Pulse: live activity feed + statistik distribusi minat generasi (Supabase Realtime, data anonim via tabel activity).
10. Kartu Karya: unduh hasil rekomendasi sebagai PNG 1080x1080 siap posting Instagram.

## User Flows

1. Anonymous: landing → /programs → baca katalog program.
2. Member: landing → /login (register jika baru) → /quiz → submit → hasil rekomendasi → CTA program.
3. Reviewer: buka website → coba quiz → cek Swagger `/docs` → cek README.

## Requirements

- Functional: endpoint GET /api/programs, POST /api/quiz/submit (protected), GET /api/stats, GET /health.
- UX: mobile-first, dark theme, quiz maksimal 3 langkah, seluruh copy UI Bahasa Indonesia.
- Performance: API p95 < 500 ms; landing LCP < 3 s.
- Platform: web browser desktop & mobile.

## Success Metrics

- Quiz completion rate > 60% dari sesi yang memulai quiz.
- 100% submission menghasilkan minimal 1 rekomendasi.
- Tidak ada error fatal saat demo ke reviewer.
- Skor kecocokan transparan (ditampilkan ke user).

## Out of Scope

Admin dashboard, CMS, payment, email/notification, rekomendasi berbasis ML/AI, edit profile, OAuth social login, leaderboard, i18n, upload file/media user.
