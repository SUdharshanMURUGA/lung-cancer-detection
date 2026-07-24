"""Version endpoint — reports API + model version for client-side diagnostics."""
from fastapi import APIRouter

from app.core.config import get_settings

router = APIRouter(tags=["Version"])
settings = get_settings()


@router.get("/version")
def get_version() -> dict:
    return {
        "app_name": settings.APP_NAME,
        "api_version": settings.APP_VERSION,
        "model_input_size": settings.MODEL_INPUT_SIZE,
        "classes": settings.CLASS_NAMES,
        "environment": settings.ENVIRONMENT,
    }
