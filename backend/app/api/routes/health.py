"""Health check endpoint — used by uptime monitors and HF Spaces itself."""
from fastapi import APIRouter

from app.ml.model import model_service

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check() -> dict:
    return {
        "status": "ok" if model_service.is_loaded else "degraded",
        "model_loaded": model_service.is_loaded,
    }
