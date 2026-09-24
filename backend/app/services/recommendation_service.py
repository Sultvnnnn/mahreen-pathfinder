import logging
from typing import Any
from app.repositories.program_repository import get_all_programs
from app.repositories.submission_repository import (
    create_activity,
    create_submission,
    get_submission_stats,
)
from app.schemas.quiz import (
    QuizSubmitRequest,
    QuizSubmitResponse,
    RecommendedProgram,
    StatsResponse,
)

logger = logging.getLogger(__name__)

# Tag keyword associations for scoring
KEYWORD_MAPPINGS: dict[str, list[str]] = {
    # Minat
    "teknologi": ["teknologi", "coding", "software", "digital", "engineering"],
    "kreatif": ["kreatif", "media", "desain", "konten", "mandiri"],
    "bisnis": ["bisnis", "startup", "wirausaha", "strategi", "kompetisi"],
    "sosial": ["sosial", "dampak", "fellowship", "komunitas"],
    "komunitas": ["komunitas", "jejaring", "relasi", "pengorganisasian", "dampak"],
    "talenta": ["skill", "portofolio", "mentorship", "teknologi", "karir"],
    # Tujuan
    "portofolio": ["portofolio", "skill", "hands-on", "karya"],
    "startup": ["startup", "bisnis", "wirausaha", "strategi", "kompetisi"],
    "relasi": ["relasi", "komunitas", "jejaring", "kolaboratif", "dampak"],
    "dampak": ["dampak", "sosial", "masyarakat", "komunitas"],
    "karir": ["karir", "skill", "portofolio", "mentorship"],
    "kompetisi": ["kompetisi", "bisnis", "startup", "wirausaha"],
    # Gaya Berkarya
    "hands-on": ["hands-on", "coding", "software", "desain", "skill"],
    "kolaboratif": ["kolaboratif", "tim", "media", "komunitas"],
    "kepemimpinan": ["kepemimpinan", "pengorganisasian", "strategi", "startup"],
    "mandiri": ["mandiri", "riset", "skill", "kreatif"],
}


def _extract_keywords(text: str) -> list[str]:
    """Normalize input text and extract associated tags."""
    text_lower = text.lower()
    keywords: list[str] = []
    for key, related_tags in KEYWORD_MAPPINGS.items():
        if key in text_lower:
            keywords.extend(related_tags)
    return list(set(keywords))


def calculate_recommendations(
    minat: str, tujuan: str, gaya_berkarya: str
) -> list[RecommendedProgram]:
    """Calculate transparent recommendation scores for all programs."""
    programs = get_all_programs()
    if not programs:
        return []

    minat_keywords = _extract_keywords(minat)
    tujuan_keywords = _extract_keywords(tujuan)
    gaya_keywords = _extract_keywords(gaya_berkarya)

    scored_programs: list[tuple[int, list[str], dict[str, Any]]] = []

    for prog in programs:
        prog_tags = [t.lower() for t in prog.get("tags", [])]
        prog_cat = prog.get("category", "").lower()
        prog_title = prog.get("title", "").lower()

        score = 55  # Base match guarantee
        reasons: list[str] = []

        # 1. Minat match evaluation (up to 25 pts)
        minat_match = any(
            kw in prog_tags or kw in prog_cat or kw in prog_title
            for kw in minat_keywords
        ) or any(w in prog_cat for w in minat.lower().split())
        if minat_match:
            score += 25
            reasons.append(f"Selaras dengan minat utama Anda di bidang {prog.get('category')}")

        # 2. Tujuan match evaluation (up to 12 pts)
        tujuan_match = any(kw in prog_tags for kw in tujuan_keywords)
        if tujuan_match:
            score += 12
            reasons.append(f"Mendukung capaian tujuan Anda ({tujuan})")

        # 3. Gaya berkarya match evaluation (up to 8 pts)
        gaya_match = any(kw in prog_tags for kw in gaya_keywords)
        if gaya_match:
            score += 8
            reasons.append(f"Cocok dengan pendekatan kerja {gaya_berkarya}")

        # Fallback reason if minimal match
        if not reasons:
            reasons.append("Program rekomendasi pengembangan diri dalam ekosistem Mahreen")

        final_score = min(score, 98)
        scored_programs.append((final_score, reasons, prog))

    # Deterministic tie-break: sort by (-score, program id) per code review spec
    scored_programs.sort(key=lambda x: (-x[0], str(x[2]["id"])))

    # Return top 3 recommendations (minimum 1 guaranteed per PRD)
    top_candidates = scored_programs[:3] if len(scored_programs) >= 3 else scored_programs

    return [
        RecommendedProgram(
            id=prog["id"],
            title=prog["title"],
            category=prog["category"],
            description=prog["description"],
            score=score,
            match_reasons=reasons,
            cta_text=prog.get("cta_text", "ikut program →"),
            cta_link=prog.get("cta_link", "#"),
        )
        for score, reasons, prog in top_candidates
    ]


def process_quiz_submission(
    payload: QuizSubmitRequest,
    user_id: str | None,
    email: str | None,
) -> QuizSubmitResponse:
    """Save submission with top recommendation and return computed program recommendations."""
    # 1. Calculate recommendations
    recommendations = calculate_recommendations(
        minat=payload.answers.minat,
        tujuan=payload.answers.tujuan,
        gaya_berkarya=payload.answers.gaya_berkarya,
    )

    answers_dict = payload.answers.model_dump()
    top_program_title = "Program Umum"
    if recommendations:
        top_program_title = recommendations[0].title
        answers_dict["recommended_program"] = top_program_title

    # 2. Save to database repository (parameterized)
    submission_id = create_submission(
        user_id=user_id,
        email=email,
        name=payload.name,
        answers=answers_dict,
        visitor_id=payload.visitor_id,
    )

    # 3. Record anonymous activity for terminal pulse (fail-safe)
    try:
        interest = payload.answers.minat
        label = f"{interest} -> {top_program_title}"
        create_activity(
            kind="quiz",
            label=label,
            interest=interest,
            program_title=top_program_title,
        )
    except Exception as exc:
        logger.warning("Gagal mencatat data activity pulse: %s", exc)

    return QuizSubmitResponse(
        submission_id=submission_id,
        recommendations=recommendations,
    )


def fetch_stats() -> StatsResponse:
    """Fetch aggregated submission stats from repository."""
    stats = get_submission_stats()
    return StatsResponse(
        total_submissions=stats["total_submissions"],
        top_program=stats["top_program"],
        interest_distribution=stats["interest_distribution"],
        top_interest=stats["top_interest"],
        most_recommended_program=stats["most_recommended_program"],
        popular_interests=stats["popular_interests"],
    )
