"""
Database engine/session setup for prediction history.

SQLite is used deliberately: it needs zero extra infrastructure (no
separate DB server to provision on a free Hugging Face Space), and
prediction-history read/write volume for this app is far below the point
where SQLite's single-writer limitation would matter.
"""
import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings

settings = get_settings()

# Ensure the directory for the SQLite file exists before the engine tries
# to open it (fresh containers / fresh Spaces won't have it yet).
if settings.DATABASE_URL.startswith("sqlite:///"):
    db_path = settings.DATABASE_URL.replace("sqlite:///", "", 1)
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency that yields a request-scoped DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create tables if they don't exist. Called once at startup."""
    # Import models here so they're registered on Base.metadata before
    # create_all runs, without creating a circular import at module load.
    from app.models import prediction_record  # noqa: F401

    Base.metadata.create_all(bind=engine)
