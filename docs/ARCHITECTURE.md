# Architecture — Mahreen PathFinder

## System Overview

User
↓
Next.js Frontend (Vercel)
↓ HTTPS + Bearer JWT
FastAPI Backend (Render/Railway)
↓ psycopg, parameterized SQL
Supabase Postgres (Supavisor session pooler, port 5432)

External service:

- Supabase Auth → menerbitkan JWT ES256; public key via JWKS.

## Tech Stack

| Layer             | Teknologi                                                 |
| ----------------- | --------------------------------------------------------- |
| Frontend          | Next.js App Router, TypeScript, Tailwind v4, Bun          |
| Auth client       | @supabase/ssr (browser client)                            |
| Backend           | FastAPI, Pydantic, PyJWT[crypto], psycopg                 |
| Database          | Supabase Postgres, raw SQL (TANPA ORM)                    |
| Auth verification | JWT ES256 diverifikasi server-side via JWKS (PyJWKClient) |
| API docs          | Swagger/OpenAPI otomatis (/docs)                          |

## Project Structure

backend/
app/main.py # app factory, CORS, router
app/core/auth.py # get_current_user (JWKS ES256)
app/api/ # routers: programs.py, quiz.py
app/services/ # business logic: recommendation_service.py
app/repositories/ # SQL: db.py, program_repository.py, submission_repository.py
app/schemas/ # Pydantic models
sql/ # schema.sql, seed.sql, migration
frontend/
src/app/ # page.tsx, login/, quiz/, programs/
src/components/ # Navbar, Hero, ProgramCard, QuizForm, ResultCard
src/lib/api.ts # fetch helper + Bearer token
src/lib/supabase/client.ts

## Data Flow

1. User buka UI.
2. Login/register → Supabase Auth → session.access_token (JWT ES256).
3. Frontend kirim POST /api/quiz/submit dengan header Authorization: Bearer.
4. FastAPI verifikasi token via JWKS (app/core/auth.py).
5. recommendation_service hitung skor tag terhadap programs.
6. submission_repository INSERT submission (parameterized) returning id.
7. Response: submissionId + recommendation.
8. UI render ResultCard + loading/error state.
   Flow publik: GET /api/programs → repository SELECT → UI ProgramCard grid.

## Database

Tabel programs: id, title, category, description, tags text[], cta_text, cta_link, created_at.
Tabel submissions: id, user_id uuid, visitor_id text null, name, email, answers jsonb, created_at.
Migrations: file baru di backend/sql/, dijalankan manual via Supabase SQL Editor. Tidak ada file storage untuk MVP.
Tabel activity: id, kind, label, interest, program_title, created_at.
RLS: anon/authenticated SELECT only; write hanya via backend (direct connection).
Realtime: publication supabase_realtime mencakup tabel activity.

## API Surface

- GET /health (public)
- GET /api/programs (public)
- POST /api/quiz/submit (protected: Bearer JWT)
- GET /api/stats (public)

## Deployment

- Frontend: Vercel. Env: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.
- Backend: Render/Railway. Env: DATABASE_URL, FRONTEND_URL, SUPABASE_JWKS_URL.
- Database: Supabase cloud.
- CORS dibatasi hanya ke FRONTEND_URL.

## Security

- Secrets hanya di backend; .env tidak pernah di-commit.
- service_role key tidak dipakai sama sekali.
- JWKS endpoint publik (aman) dipakai untuk verifikasi ES256.
- Semua SQL parameterized; semua input divalidasi Pydantic.

## Scalability Notes (di luar MVP, jangan dibangun sekarang)

- Cache list programs (TTL singkat).
- Rate limit POST /api/quiz/submit.
- Index submissions(user_id).
- Recommendation v2: pembobotan tag / ML.
- Background job untuk email notifikasi.
