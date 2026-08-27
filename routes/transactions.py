from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db


router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


@router.post("/", response_model=schemas.TransactionResponse)
def create_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db)
):

    return crud.create_transaction(db, transaction)

@router.get("/", response_model=list[schemas.TransactionResponse])
def get_transactions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud.get_transactions(db, skip, limit)


@router.get(
    "/{transaction_id}",
    response_model=schemas.TransactionResponse
)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):

    transaction = crud.get_transaction(
        db,
        transaction_id
    )

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return transaction


@router.put(
    "/{transaction_id}",
    response_model=schemas.TransactionResponse
)
def update_transaction(
    transaction_id: int,
    transaction: schemas.TransactionUpdate,
    db: Session = Depends(get_db)
):

    updated = crud.update_transaction(
        db,
        transaction_id,
        transaction
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return updated


@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):

    transaction = crud.delete_transaction(
        db,
        transaction_id
    )

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return {
        "message": "Transaction deleted successfully"
    }