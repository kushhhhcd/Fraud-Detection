from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db


router = APIRouter(
    prefix="/models",
    tags=["ML Models"]
)


@router.post("/", response_model=schemas.ModelResponse)
def create_model(
    model: schemas.ModelCreate,
    db: Session = Depends(get_db)
):

    return crud.create_model(db, model)


@router.get("/", response_model=list[schemas.ModelResponse])
def get_models(db: Session = Depends(get_db)):

    return crud.get_models(db)


@router.get("/{model_id}", response_model=schemas.ModelResponse)
def get_model(
    model_id: str,
    db: Session = Depends(get_db)
):

    model = crud.get_model(db, model_id)

    if not model:
        raise HTTPException(
            status_code=404,
            detail="Model not found"
        )

    return model


@router.put("/{model_id}", response_model=schemas.ModelResponse)
def update_model(
    model_id: str,
    model: schemas.ModelUpdate,
    db: Session = Depends(get_db)
):

    updated = crud.update_model(
        db,
        model_id,
        model
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Model not found"
        )

    return updated


@router.delete("/{model_id}")
def delete_model(
    model_id: str,
    db: Session = Depends(get_db)
):

    model = crud.delete_model(db, model_id)

    if not model:
        raise HTTPException(
            status_code=404,
            detail="Model not found"
        )

    return {
        "message": "Model deleted successfully"
    }