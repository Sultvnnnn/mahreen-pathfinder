import os
from contextlib import contextmanager
from typing import Generator
import psycopg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set in environment variables")


@contextmanager
def get_db_connection() -> Generator[psycopg.Connection, None, None]:
    """Provide a database connection context using psycopg."""
    connection: psycopg.Connection = psycopg.connect(DATABASE_URL)
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()
