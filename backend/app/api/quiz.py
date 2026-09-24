from fastapi import APIRouter, Depends, HTTPException, status
from app.core.auth import get_current_user
from app.schemas.common import ErrorResponse
from app.schemas.quiz import (
    QuizSubmitRequest,
    QuizSubmitResponse,
    StatsResponse,
)
from app.services.recommendation_service import (
    fetch_stats,
    process_quiz_submission,
)

router = APIRouter(prefix="/api", tags=["quiz"])


@router.post(
    "/quiz/submit",
    response_model=QuizSubmitResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit kuis minat",
    description="Menyimpan jawaban kuis pengguna yang terautentikasi dan menghitung rekomendasi program Mahreen yang paling sesuai.",
    responses={
        200: {
            "description": "Kuis berhasil diproses dan rekomendasi dikembalikan",
        },
        401: {
            "model": ErrorResponse,
            "description": "Autentikasi gagal: Token tidak ditemukan atau tidak valid",
        },
        500: {
            "model": ErrorResponse,
            "description": "Kesalahan server internal saat memproses kuis",
        },
    },
)
def submit_quiz(
    payload: QuizSubmitRequest,
    current_user: dict = Depends(get_current_user),
) -> QuizSubmitResponse:
    """Submit quiz answers for authenticated user and return calculated recommendations."""
    try:
        user_id = current_user.get("id")
        email = current_user.get("email")

        return process_quiz_submission(
            payload=payload,
            user_id=user_id,
            email=email,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat memproses kuis: {str(exc)}",
        ) from exc


@router.get(
    "/stats",
    response_model=StatsResponse,
    status_code=status.HTTP_200_OK,
    summary="Ambil statistik submisi kuis",
    description="Mengambil data agregat publik: total submission, minat terpopuler, program paling banyak direkomendasikan, dan rincian distribusi minat.",
    responses={
        200: {
            "description": "Statistik kuis berhasil diambil",
        },
        500: {
            "model": ErrorResponse,
            "description": "Kesalahan server internal saat mengambil data statistik",
        },
    },
)
def get_stats() -> StatsResponse:
    """Retrieve public aggregated stats of quiz submissions."""
    try:
        return fetch_stats()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal mengambil statistik: {str(exc)}",
        ) from exc
