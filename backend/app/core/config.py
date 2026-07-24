"""
Application configuration.

All runtime configuration is sourced from environment variables (with sane
defaults for local development). Never hardcode secrets, hosts, or file
paths directly in application code — this is the single source of truth.
"""
from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- App metadata ---
    APP_NAME: str = "Lung Cancer Detection API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"  # development | production
    DEBUG: bool = False

    # --- CORS ---
    # Comma-separated list of allowed origins, e.g.
    # "https://your-app.vercel.app,http://localhost:3000"
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    # --- Model ---
    MODEL_PATH: str = str(BASE_DIR / "model" / "my_model.h5")
    MODEL_INPUT_SIZE: int = 350  # width == height, matches training pipeline
    MODEL_INPUT_CHANNELS: int = 3

    # Class order MUST match the order the model was trained/exported with
    # (alphabetical order produced by Keras `flow_from_directory`).
    CLASS_NAMES: List[str] = [
        "Adenocarcinoma",
        "Large cell carcinoma",
        "Normal",
        "Squamous cell carcinoma",
    ]

    # --- Upload limits ---
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_CONTENT_TYPES: List[str] = ["image/png", "image/jpeg", "image/jpg"]

    # --- Database (prediction history) ---
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'data' / 'history.db'}"

    # --- Logging ---
    LOG_LEVEL: str = "INFO"


@lru_cache
def get_settings() -> Settings:
    """Settings are cached so the .env file is parsed only once per process."""
    return Settings()
