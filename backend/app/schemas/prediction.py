"""Pydantic schemas for the /predict endpoint."""
from typing import List

from pydantic import BaseModel, Field

CLASS_DESCRIPTIONS = {
    "Normal": (
        "No radiographic features associated with malignant lung tissue were "
        "detected in this scan."
    ),
    "Adenocarcinoma": (
        "Features consistent with adenocarcinoma, the most common subtype of "
        "non-small cell lung cancer, were detected. It typically originates in "
        "the outer regions of the lung."
    ),
    "Squamous cell carcinoma": (
        "Features consistent with squamous cell carcinoma, a non-small cell "
        "lung cancer subtype, were detected. It is often associated with the "
        "central airways."
    ),
    "Large cell carcinoma": (
        "Features consistent with large cell carcinoma, an undifferentiated "
        "non-small cell lung cancer subtype, were detected. It can appear in "
        "any part of the lung and tends to grow quickly."
    ),
}


class ClassProbability(BaseModel):
    class_name: str = Field(..., description="One of the four model output classes")
    probability: float = Field(..., ge=0, le=100, description="Probability as a percentage")


class PredictionResponse(BaseModel):
    class_name: str = Field(..., alias="class", serialization_alias="class")
    confidence: float = Field(..., ge=0, le=100)
    prediction_time: str
    risk_level: str
    description: str
    probabilities: List[ClassProbability]

    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "example": {
                "class": "Normal",
                "confidence": 98.45,
                "prediction_time": "0.24 sec",
                "risk_level": "Low",
                "description": "No radiographic features associated with malignant lung tissue were detected in this scan.",
                "probabilities": [
                    {"class_name": "Normal", "probability": 98.45},
                    {"class_name": "Adenocarcinoma", "probability": 0.9},
                    {"class_name": "Squamous cell carcinoma", "probability": 0.4},
                    {"class_name": "Large cell carcinoma", "probability": 0.25},
                ],
            }
        },
    }


class ErrorResponse(BaseModel):
    error: str
    detail: str
