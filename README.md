# Mahreen PathFinder — "BERKARYA UNTUK INDONESIA"

> Platform web interaktif yang membantu generasi muda Indonesia menemukan program Mahreen Indonesia yang paling cocok dengan minat, sasaran, dan gaya berkarya mereka melalui kuis cerdas berbobot data transparan.

---

## 1. Project Overview

- **Produk:** Mahreen PathFinder
- **Tema:** *"BERKARYA UNTUK INDONESIA"*
- **Tujuan:** 
  - Membantu generasi muda memahami ekosistem program Mahreen Indonesia (teknologi digital, industri kreatif, bisnis startup, kontribusi sosial, pengembangan talenta, dan komunitas) dalam kunjungan singkat (< 5 menit).
  - Memberikan rekomendasi program personal dengan transparansi skor kecocokan (*match score*) berbasis tag matching.
  - Mengumpulkan insight minat generasi muda Indonesia dari submission kuis.
- **Aesthetic Design:** Deep-Ocean Bioluminescent Terminal (Strict Dark Mode, JetBrains Mono & DM Sans, closed triad pill buttons).

---

## 2. Architecture Diagram

```text
[ Pengguna / Browser ]
         │
         ▼ (HTTPS / UI Client)
┌─────────────────────────────────────────────────────────────┐
│ Next.js Frontend (App Router, TypeScript, Tailwind v4, Bun) │
│                                                             │
│  - /           : Landing Page & Hero ASCII Generatif        │
│  - /programs   : Katalog Program Grid (2 kolom / 1 kolom)   │
│  - /login      : Form Autentikasi (Supabase Auth Client)    │
│  - /quiz       : Kuis 3 Langkah & ResultCard Rekomendasi    │
└──────────────┬───────────────────────────────┬──────────────┘
               │ Bearer JWT (ES256)            │ Auth Session (ES256)
               ▼                               ▼
┌──────────────────────────────┐     ┌────────────────────────┐
│ FastAPI Backend (Python)     │     │ Supabase Auth (JWKS)   │
│                              │     │ /.well-known/jwks.json │
│  - app/main.py (App & CORS)  │     └────────────────────────┘
│  - app/core/auth.py (ES256)  │
│  - app/api/ (Programs & Quiz)│
│  - app/services/ (Engine)    │
│  - app/repositories/ (SQL)   │
└──────────────┬───────────────┘
               │ psycopg (Parameterized raw SQL %s, Tanpa ORM)
               ▼
┌──────────────────────────────┐
│ Supabase Postgres Database   │
│                              │
│  - public.programs           │
│  - public.submissions        │
└──────────────────────────────┘
```

---

## 3. Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript (Strict), Tailwind CSS v4, Bun.
- **Auth Client:** `@supabase/ssr` (Browser Client).
- **Backend:** FastAPI, Python 3.11+, Pydantic v2, PyJWT dengan dukungan Cryptography, `psycopg` (v3).
- **Database:** Supabase Postgres (Connection pooling via Supavisor port 5432).
- **Auth Verification:** Verifikasi server-side JWT ES256 via PyJWKClient (JWKS endpoint).
- **API Documentation:** Swagger UI otomatis di `/docs`.

---

## 4. Environment Variables

> **Catatan Keamanan:** Jangan pernah melakukan commit file `.env` yang memuat nilai rahasia.

### Backend (`backend/.env`)

```ini
DATABASE_URL=
FRONTEND_URL=
SUPABASE_JWKS_URL=
```

### Frontend (`frontend/.env.local`)

```ini
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 5. Local Run Instructions

### A. Persiapan Database
Jalankan skrip SQL di Supabase SQL Editor sesuai urutan berikut:
1. [`backend/sql/schema.sql`](file:///E:/codingan/mahreen-pathfinder/backend/sql/schema.sql) — Membuat tabel `programs` dan `submissions`.
2. [`backend/sql/seed.sql`](file:///E:/codingan/mahreen-pathfinder/backend/sql/seed.sql) — Mengisi katalog program awal Mahreen Indonesia.

### B. Menjalankan Backend (FastAPI)
```bash
cd backend

# 1. Buat dan aktifkan virtual environment
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# 2. Pasang dependensi
pip install -r requirements.txt

# 3. Jalankan server backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- Endpoint Health: `http://127.0.0.1:8000/health`
- Swagger Documentation: `http://127.0.0.1:8000/docs`

### C. Menjalankan Frontend (Next.js)
```bash
cd frontend

# 1. Pasang dependensi via Bun
bun install

# 2. Jalankan development server
bun run dev

# Atau jalankan production build:
bun run build
bun run start --port 3000
```
- Buka antarmuka web di browser: `http://localhost:3000`

---

## 6. Daftar Endpoint REST API

| Method | Path | Auth | Deskripsi | Status Responses |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Publik | Health check ketersediaan server backend | `200` |
| `GET` | `/api/programs` | Publik | Mengambil seluruh katalog program Mahreen Indonesia | `200`, `500` |
| `POST` | `/api/quiz/submit` | Protected (`Bearer JWT`) | Mengirimkan jawaban kuis 3 pertanyaan dan menerima hasil rekomendasi program | `200`, `401`, `500` |
| `GET` | `/api/stats` | Publik | Mengambil total submisi, minat terpopuler, dan program yang paling banyak direkomendasikan | `200`, `500` |
| `GET` | `/docs` | Publik | Antarmuka interaktif OpenAPI / Swagger UI | `200` |

---

## 7. Out of Scope (Sesuai PRD)

Fitur-fitur berikut secara eksplisit berada di luar cakupan MVP Mahreen PathFinder:
1. **Admin Dashboard:** Pengelolaan submission dan analitik lanjutan admin.
2. **CMS (Content Management System):** Penambahan/pengeditan program lewat GUI admin.
3. **Payment Gateway:** Transaksi atau pembayaran program.
4. **Email / SMS Notifications:** Pengiriman pengingat atau email berkala.
5. **Machine Learning / AI Recommendations:** Sistem rekomendasi menggunakan pembobotan tag deterministik transparan, bukan blackbox AI/ML.
6. **Edit Profile:** Pengubahan data profil user selain autentikasi dasar.
7. **OAuth Social Login:** Login via Google/GitHub (hanya email & password).
8. **Leaderboard:** Papan peringkat peserta kuis.
9. **Internasionalisasi (i18n):** Seluruh antarmuka berbahasa Indonesia.
10. **Upload File / Media User:** Tidak ada penyimpanan berkas/portofolio pengguna.
