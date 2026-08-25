from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db


router = APIRouter(
    prefix="/frauds",
    tags=["Fraud Predictions"]
)


@router.post(
    "/",
    response_model=schemas.FraudPredictionResponse
)
def create_fraud_prediction(
    fraud: schemas.FraudPredictionCreate,
    db: Session = Depends(get_db)
):

    return crud.create_fraud_prediction(db, fraud)


@router.get(
    "/",
    response_model=list[schemas.FraudPredictionResponse]
)
def get_fraud_predictions(
    db: Session = Depends(get_db)
):

    return crud.get_fraud_predictions(db)


@router.get(
    "/{prediction_id}",
    response_model=schemas.FraudPredictionResponse
)
def get_fraud_prediction(
    prediction_id: int,
    db: Session = Depends(get_db)
):

    fraud = crud.get_fraud_prediction(
        db,
        prediction_id
    )

    if not fraud:
        raise HTTPException(
            status_code=404,
            detail="Fraud prediction not found"
        )

    return fraud


@router.delete("/{prediction_id}")
def delete_fraud_prediction(
    prediction_id: int,
    db: Session = Depends(get_db)
):

    fraud = crud.delete_fraud_prediction(
        db,
        prediction_id
    )

    if not fraud:
        raise HTTPException(
            status_code=404,
            detail="Fraud prediction not found"
        )

    return {
        "message": "Fraud prediction deleted successfully"
    }