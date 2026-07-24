"""
Model loading and inference.

The model is loaded exactly once, at application startup (see main.py's
lifespan handler), and held in memory for the life of the process. Every
request reuses the same in-memory model — reloading from disk per-request
would add hundreds of milliseconds of latency and is unnecessary since the
model is static (inference only, no retraining).
"""
import os
import time
from dataclasses import dataclass
from typing import List, Optional

import numpy as np

from app.core.config import get_settings
from app.core.logging import get_logger
from app.exceptions import ModelNotLoadedError

# Must be set before `tf_keras` (or `tensorflow`) is imported anywhere in
# the process. Setting it here in code — rather than requiring it as a
# shell environment variable — means it works identically on bash, zsh,
# PowerShell, and cmd.exe without platform-specific syntax.
os.environ.setdefault("TF_USE_LEGACY_KERAS", "1")

logger = get_logger(__name__)
settings = get_settings()


@dataclass
class PredictionResult:
    class_name: str
    confidence: float  # 0-100
    prediction_time_seconds: float
    probabilities: List[dict]  # [{"class_name": str, "probability": float}, ...]
    risk_level: str


class ModelService:
    """
    Thin wrapper around the Keras model providing a stable interface to
    the rest of the app. Instantiated once as a module-level singleton
    (`model_service` below).
    """

    def __init__(self) -> None:
        self._model = None

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    def load(self) -> None:
        """Load the trained EfficientNet-B0 model from disk into memory."""
        # The shipped .h5 file was saved under Keras 2's config format.
        # Keras 3 (TensorFlow's current default) cannot deserialize it
        # (fails on DepthwiseConv2D's legacy `groups` argument), so we use
        # `tf_keras` — TensorFlow's own maintained Keras-2 compatibility
        # package — instead of `tensorflow.keras`. Imported lazily so this
        # heavy dependency only loads once, at startup.
        import tf_keras

        logger.info("Loading model from %s", settings.MODEL_PATH)
        start = time.perf_counter()
        try:
            self._model = tf_keras.models.load_model(settings.MODEL_PATH, compile=False)
        except (OSError, ValueError) as exc:
            logger.error("Failed to load model: %s", exc)
            raise
        elapsed = time.perf_counter() - start
        logger.info("Model loaded successfully in %.2fs", elapsed)

        # Warm up the model with a dummy forward pass so the *first* real
        # user request isn't the one that pays for graph tracing / cuDNN
        # kernel selection.
        dummy_input = np.zeros(
            (1, settings.MODEL_INPUT_SIZE, settings.MODEL_INPUT_SIZE, settings.MODEL_INPUT_CHANNELS),
            dtype=np.float32,
        )
        self._model.predict(dummy_input, verbose=0)
        logger.info("Model warm-up complete")

    def unload(self) -> None:
        self._model = None

    @staticmethod
    def _risk_level_for(class_name: str, confidence: float) -> str:
        """
        Map a predicted class + confidence to a coarse risk banding used
        purely for UI presentation. This is NOT a clinical risk score.
        """
        if class_name == "Normal":
            return "Low" if confidence >= 70 else "Uncertain"
        # Any carcinoma class
        if confidence >= 85:
            return "High"
        if confidence >= 60:
            return "Elevated"
        return "Uncertain"

    def predict(self, image_batch: np.ndarray) -> PredictionResult:
        if not self.is_loaded:
            raise ModelNotLoadedError()

        start = time.perf_counter()
        raw_predictions = self._model.predict(image_batch, verbose=0)[0]
        elapsed = time.perf_counter() - start

        probabilities = [
            {
                "class_name": settings.CLASS_NAMES[i],
                "probability": round(float(raw_predictions[i]) * 100, 2),
            }
            for i in range(len(settings.CLASS_NAMES))
        ]

        top_idx = int(np.argmax(raw_predictions))
        class_name = settings.CLASS_NAMES[top_idx]
        confidence = round(float(raw_predictions[top_idx]) * 100, 2)

        return PredictionResult(
            class_name=class_name,
            confidence=confidence,
            prediction_time_seconds=round(elapsed, 4),
            probabilities=probabilities,
            risk_level=self._risk_level_for(class_name, confidence),
        )


# Module-level singleton — imported by routes and by the startup lifespan.
model_service = ModelService()
