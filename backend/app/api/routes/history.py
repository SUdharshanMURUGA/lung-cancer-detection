"""Prediction history endpoints — list and delete past predictions."""
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.exceptions import RecordNotFoundError
from app.models.prediction_record import PredictionRecord
from app.schemas.history import DeleteHistoryResponse, HistoryItem, HistoryListResponse

router = APIRouter(tags=["History"])


@router.get("/history", response_model=HistoryListResponse)
def list_history(db: Session = Depends(get_db)) -> HistoryListResponse:
    stmt = select(PredictionRecord).order_by(PredictionRecord.created_at.desc())
    records = db.execute(stmt).scalars().all()
    return HistoryListResponse(
        items=[HistoryItem.model_validate(r) for r in records],
        total=len(records),
    )


@router.delete("/history/{record_id}", response_model=DeleteHistoryResponse)
def delete_history_item(record_id: str, db: Session = Depends(get_db)) -> DeleteHistoryResponse:
    record = db.get(PredictionRecord, record_id)
    if record is None:
        raise RecordNotFoundError(f"No history record found with id '{record_id}'.")

    db.delete(record)
    db.commit()
    return DeleteHistoryResponse(id=record_id, deleted=True)
