"""Prediction endpoint — the core of the API."""
import base64
import io

from fastapi import APIRouter, Depends, File, UploadFile
from PIL import Image
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.logging import get_logger
from app.db.database import get_db
from app.exceptions import FileTooLargeError, UnsupportedFileTypeError
from app.ml.model import model_service
from app.ml.preprocess import load_and_preprocess_image
from app.models.prediction_record import PredictionRecord
from app.schemas.prediction import CLASS_DESCRIPTIONS, ClassProbability, PredictionResponse

router = APIRouter(tags=["Prediction"])
settings = get_settings()
logger = get_logger(__name__)

THUMBNAIL_SIZE = (256, 256)


def _make_thumbnail_data_url(file_bytes: bytes) -> str:
    """Create a small base64 JPEG thumbnail for history display, so we
    don't need a separate static file store for uploaded images."""
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img.thumbnail(THUMBNAIL_SIZE)
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=80)
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/jpeg;base64,{encoded}"


@router.post("/predict", response_model=PredictionResponse, response_model_by_alias=True)
async def predict(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> PredictionResponse:
    if file.content_type not in settings.ALLOWED_CONTENT_TYPES:
        raise UnsupportedFileTypeError(
            f"Unsupported content type '{file.content_type}'. "
            f"Allowed types: {', '.join(settings.ALLOWED_CONTENT_TYPES)}."
        )

    file_bytes = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise FileTooLargeError(
            f"File exceeds the {settings.MAX_UPLOAD_SIZE_MB}MB upload limit."
        )

    image_batch = load_and_preprocess_image(file_bytes)
    result = model_service.predict(image_batch)

    logger.info(
        "Prediction complete: class=%s confidence=%.2f%% time=%.4fs",
        result.class_name,
        result.confidence,
        result.prediction_time_seconds,
    )

    # Persist to history (best-effort — a history-write failure should
    # never take down a successful prediction response).
    try:
        record = PredictionRecord(
            filename=file.filename or "upload.png",
            class_name=result.class_name,
            confidence=result.confidence,
            risk_level=result.risk_level,
            image_data_url=_make_thumbnail_data_url(file_bytes),
        )
        db.add(record)
        db.commit()
    except Exception:  # noqa: BLE001
        logger.exception("Failed to persist prediction history record")
        db.rollback()

    return PredictionResponse(
        **{
            "class": result.class_name,
            "confidence": result.confidence,
            "prediction_time": f"{result.prediction_time_seconds:.2f} sec",
            "risk_level": result.risk_level,
            "description": CLASS_DESCRIPTIONS.get(result.class_name, ""),
            "probabilities": [ClassProbability(**p) for p in result.probabilities],
        }
    )
