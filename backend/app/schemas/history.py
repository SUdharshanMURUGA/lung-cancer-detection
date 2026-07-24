"""Pydantic schemas for the /history endpoints."""
from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict


class HistoryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    filename: str
    class_name: str
    confidence: float
    risk_level: str
    image_data_url: str
    created_at: datetime


class HistoryListResponse(BaseModel):
    items: List[HistoryItem]
    total: int


class DeleteHistoryResponse(BaseModel):
    id: str
    deleted: bool
