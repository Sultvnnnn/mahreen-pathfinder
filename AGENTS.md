# Agent Instructions — Mahreen PathFinder

## Project Context

Dua aplikasi terpisah dalam satu repo:

- backend/: FastAPI (Python), raw SQL via psycopg, tanpa ORM.
- frontend/: Next.js App Router (TypeScript, Tailwind v4), package manager Bun.
- Database & Auth: Supabase (Postgres + Auth JWT ES256 diverifikasi via JWKS).

## Before You Start

- Baca docs/PRD.md, docs/DESIGN_SYSTEM.md, docs/ARCHITECTURE.md.
- Inspeksi komponen existing di frontend/src/components dan router existing di backend/app/api sebelum membuat baru.

## General Rules

- Frontend: TypeScript strict, App Router, styling hanya via token Tailwind dari DESIGN_SYSTEM.md.
- Backend: Python 3.11+, type hints wajib di semua fungsi.
- TIDAK ADA ORM. Semua SQL hanya di app/repositories, wajib parameterized (%s), dilarang string interpolation/f-string untuk query.
- Layering wajib: router → service → repository. Router tidak boleh menulis SQL atau logic bisnis.
- Reuse komponen existing; buat komponen baru hanya jika belum ada.
- Jangan menambah dependency baru tanpa persetujuan.
- Seluruh copy UI dalam Bahasa Indonesia.

## Code Guidelines

- Python: file & fungsi snake_case; satu Pydantic schema per payload endpoint di app/schemas.
- TypeScript: komponen PascalCase, fungsi/hook camelCase, dilarang `any`.
- Error handling: backend pakai HTTPException dengan detail jelas; frontend wajib render error state, jangan silent fail.

## Design Rules

- Ikuti docs/DESIGN_SYSTEM.md sepenuhnya; gunakan token, dilarang hardcode hex di komponen.
- Sistem pill triad tertutup: hijau = Daftar/submit utama, merah = Masuk, amber = Mulai Quiz. DILARANG menambah warna pill keempat.
- Tidak ada light mode. Tidak ada font-weight > 500.

## Security Rules

- Jangan pernah commit .env; secrets hanya di backend.
- SUPABASE_SECRET_KEY (service role) DILARANG dipakai di frontend maupun kode mana pun.
- Autentikasi diverifikasi server-side di backend/app/core/auth.py (ES256 via JWKS). Endpoint protected wajib pakai Depends(get_current_user).
- Validasi semua input dengan Pydantic sebelum menyentuh database.

## Commands

Backend:

- python -m venv .venv lalu aktifkan (.venv\Scripts\activate atau source .venv/bin/activate)
- pip install -r requirements.txt
- uvicorn app.main:app --reload

Frontend:

- bun install
- bun run dev
- bun run build

Database:

- Jalankan file SQL di backend/sql/ melalui Supabase SQL Editor (urutan: schema.sql lalu seed.sql).

## Boundaries

- Jangan mengubah arsitektur (2 service + Supabase).
- Jangan mengubah schema database tanpa persetujuan; jika perlu, tambahkan file migration baru di backend/sql/, jangan edit file lama.
- Jangan menyentuh flow auth (JWKS ES256).
- Jangan menambah fitur di luar Core Features PRD tanpa persetujuan.
