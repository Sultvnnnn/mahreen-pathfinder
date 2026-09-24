from typing import Any
from app.repositories.db import get_db_connection


def get_all_programs() -> list[dict[str, Any]]:
    """Fetch all programs from the database sorted by category and title."""
    query = """
        SELECT id, title, category, description, tags, cta_text, cta_link, created_at
        FROM public.programs
        ORDER BY category ASC, title ASC;
    """
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            programs: list[dict[str, Any]] = []
            for row in rows:
                item = dict(zip(columns, row))
                item["id"] = str(item["id"])
                programs.append(item)
            return programs


def get_program_by_id(program_id: str) -> dict[str, Any] | None:
    """Fetch a single program by ID using parameterized query."""
    query = """
        SELECT id, title, category, description, tags, cta_text, cta_link, created_at
        FROM public.programs
        WHERE id = %s;
    """
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, (program_id,))
            row = cursor.fetchone()
            if not row:
                return None
            columns = [desc[0] for desc in cursor.description]
            result = dict(zip(columns, row))
            result["id"] = str(result["id"])
            return result
