from fastapi import APIRouter, HTTPException, status
from app.repositories.program_repository import get_all_programs
from app.schemas.common import ErrorResponse
from app.schemas.program import ProgramResponse

router = APIRouter(prefix="/api/programs", tags=["programs"])


@router.get(
    "",
    response_model=list[ProgramResponse],
    status_code=status.HTTP_200_OK,
    summary="Ambil katalog program",
    description="Mengambil seluruh daftar program resmi Mahreen Indonesia yang tersimpan di database.",
    responses={
        200: {
            "description": "Katalog program Mahreen Indonesia berhasil diambil",
        },
        500: {
            "model": ErrorResponse,
            "description": "Kesalahan server internal saat mengambil katalog program",
        },
    },
)
def list_programs() -> list[ProgramResponse]:
    """Retrieve catalog of all active Mahreen Indonesia programs."""
    try:
        programs_data = get_all_programs()
        return [ProgramResponse.model_validate(p) for p in programs_data]
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal mengambil katalog program: {str(exc)}",
        ) from exc
