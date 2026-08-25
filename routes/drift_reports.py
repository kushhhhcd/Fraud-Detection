from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db


router = APIRouter(
    prefix="/drift-reports",
    tags=["Model Drift"]
)


@router.post(
    "/",
    response_model=schemas.DriftReportResponse
)
def create_drift_report(
    report: schemas.DriftReportCreate,
    db: Session = Depends(get_db)
):

    return crud.create_drift_report(db, report)


@router.get(
    "/",
    response_model=list[schemas.DriftReportResponse]
)
def get_drift_reports(
    db: Session = Depends(get_db)
):

    return crud.get_drift_reports(db)


@router.get(
    "/{report_id}",
    response_model=schemas.DriftReportResponse
)
def get_drift_report(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = crud.get_drift_report(
        db,
        report_id
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Drift report not found"
        )

    return report


@router.delete("/{report_id}")
def delete_drift_report(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = crud.delete_drift_report(
        db,
        report_id
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Drift report not found"
        )

    return {
        "message": "Drift report deleted successfully"
    }