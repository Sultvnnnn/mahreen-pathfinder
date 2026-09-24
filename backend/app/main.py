import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.programs import router as programs_router
from app.api.quiz import router as quiz_router

load_dotenv()

app = FastAPI(
    title="Mahreen PathFinder API",
    description="REST API publik dan terproteksi untuk platform web Mahreen PathFinder — 'BERKARYA UNTUK INDONESIA'.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration - restricted to FRONTEND_URL with local dev flexibility
frontend_env = os.getenv("FRONTEND_URL", "http://localhost:3000")
origins_set: set[str] = set()

for url in frontend_env.split(","):
    clean_url = url.strip().rstrip("/")
    if clean_url:
        origins_set.add(clean_url)
        if "localhost" in clean_url or "127.0.0.1" in clean_url:
            for host in ("localhost", "127.0.0.1"):
                for port in ("3000", "3001", "3002"):
                    origins_set.add(f"http://{host}:{port}")

origins = sorted(list(origins_set))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(programs_router)
app.include_router(quiz_router)


@app.get(
    "/health",
    tags=["health"],
    summary="Health check layanan",
    description="Memeriksa ketersediaan dan status server backend.",
    responses={
        200: {
            "description": "Layanan backend aktif dan sehat",
        }
    },
)
def health_check() -> dict[str, str]:
    """Public health check endpoint."""
    return {
        "status": "ok",
        "service": "mahreen-pathfinder-backend",
    }
