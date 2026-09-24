import os
from contextlib import contextmanager
from typing import Generator
import psycopg
from dotenv import load_dotenv

load_dotenv()


@contextmanager
def get_db_connection() -> Generator[psycopg.Connection, None, None]:
    """Provide a database connection context using psycopg."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not set in environment variables")

    connection: psycopg.Connection = psycopg.connect(database_url)
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()
