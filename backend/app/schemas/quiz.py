from pydantic import BaseModel, Field


class QuizAnswers(BaseModel):
    minat: str = Field(..., description="Minat utama pengguna")
    tujuan: str = Field(..., description="Tujuan yang ingin dicapai pengguna")
    gaya_berkarya: str = Field(..., description="Gaya kerja atau berkarya pengguna")


class QuizSubmitRequest(BaseModel):
    answers: QuizAnswers
    name: str | None = Field(default=None, description="Nama pengguna (opsional)")
    visitor_id: str | None = Field(default=None, description="Visitor identifier opsional")


class RecommendedProgram(BaseModel):
    id: str
    title: str
    category: str
    description: str
    score: int = Field(..., description="Skor kecocokan dalam persentase (misal: 85)")
    match_reasons: list[str] = Field(default_factory=list, description="Alasan transparansi rekomendasi")
    cta_text: str
    cta_link: str


class QuizSubmitResponse(BaseModel):
    submission_id: str
    recommendations: list[RecommendedProgram]


class PopularInterest(BaseModel):
    minat: str
    count: int


class InterestDistribution(BaseModel):
    interest: str = Field(..., description="Nama bidang minat")
    count: int = Field(..., description="Jumlah submisi")


class StatsResponse(BaseModel):
    total_submissions: int = Field(..., description="Total submission kuis yang tersimpan")
    top_program: str | None = Field(default=None, description="Program yang paling banyak direkomendasikan")
    interest_distribution: list[InterestDistribution] = Field(
        default_factory=list,
        description="Distribusi minat top 5 beserta jumlahnya",
    )
    # Backward compatibility
    top_interest: str | None = Field(default=None, description="Minat paling populer")
    most_recommended_program: str | None = Field(default=None, description="Alias untuk top_program")
    popular_interests: list[PopularInterest] = Field(default_factory=list, description="Alias untuk popular_interests")
