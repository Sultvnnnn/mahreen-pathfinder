from typing import Any
from psycopg.types.json import Json
from app.repositories.db import get_db_connection


def create_submission(
    user_id: str | None,
    email: str | None,
    name: str | None,
    answers: dict[str, Any],
    visitor_id: str | None = None,
) -> str:
    """Insert a new quiz submission and return its generated UUID string."""
    query = """
        INSERT INTO public.submissions (user_id, email, name, answers, visitor_id)
        VALUES (%s, %s, %s, %s::jsonb, %s)
        RETURNING id;
    """
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                query,
                (user_id, email, name, Json(answers), visitor_id),
            )
            submission_id = cursor.fetchone()[0]
            return str(submission_id)


def create_activity(
    kind: str,
    label: str,
    interest: str,
    program_title: str,
) -> str:
    """Insert a new anonymous activity pulse entry and return its generated UUID string."""
    query = """
        INSERT INTO public.activity (kind, label, interest, program_title)
        VALUES (%s, %s, %s, %s)
        RETURNING id;
    """
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                query,
                (kind, label, interest, program_title),
            )
            activity_id = cursor.fetchone()[0]
            return str(activity_id)


def get_submission_stats() -> dict[str, Any]:
    """Retrieve total submissions, top program, and top 5 interest distribution."""
    count_query = "SELECT COUNT(*) FROM public.submissions;"
    interests_query = """
        SELECT answers->>'minat' AS minat, COUNT(*) AS count
        FROM public.submissions
        WHERE answers->>'minat' IS NOT NULL
        GROUP BY answers->>'minat'
        ORDER BY count DESC
        LIMIT 5;
    """
    recommended_prog_query = """
        SELECT answers->>'recommended_program' AS program, COUNT(*) AS count
        FROM public.submissions
        WHERE answers->>'recommended_program' IS NOT NULL
        GROUP BY answers->>'recommended_program'
        ORDER BY count DESC
        LIMIT 1;
    """

    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            # 1. Total submissions
            cursor.execute(count_query)
            total_submissions = cursor.fetchone()[0]

            # 2. Interest distribution (top 5 with counts)
            cursor.execute(interests_query)
            popular_rows = cursor.fetchall()
            interest_distribution = [
                {"interest": str(row[0]), "count": int(row[1])}
                for row in popular_rows
            ]
            popular_interests = [
                {"minat": str(row[0]), "count": int(row[1])}
                for row in popular_rows
            ]
            top_interest = popular_rows[0][0] if popular_rows else None

            # 3. Top program (most recommended)
            cursor.execute(recommended_prog_query)
            rec_row = cursor.fetchone()
            top_program = rec_row[0] if rec_row else None

            return {
                "total_submissions": int(total_submissions),
                "top_program": top_program,
                "interest_distribution": interest_distribution,
                "top_interest": top_interest,
                "most_recommended_program": top_program,
                "popular_interests": popular_interests,
            }
