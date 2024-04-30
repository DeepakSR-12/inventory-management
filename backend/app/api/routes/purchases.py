from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import SessionDep
from app.models import Purchase, PurchaseCreate, PurchasePublic, PurchasesPublic, Message

router = APIRouter()


@router.get("/", response_model=PurchasesPublic)
def read_purchases(
    session: SessionDep, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve purchases.
    """
    count_statement = select(func.count()).select_from(Purchase)
    count = session.exec(count_statement).one()
    statement = select(Purchase).offset(skip).limit(limit)
    purchases = session.exec(statement).all()

    return PurchasesPublic(data=purchases, count=count)


@router.post("/", response_model=PurchasePublic)
def create_purchase(
    *, session: SessionDep, purchase_in: PurchaseCreate
) -> Any:
    """
    Create new purchase.
    """
    purchase = Purchase.model_validate(purchase_in)
    session.add(purchase)
    session.commit()
    session.refresh(purchase)
    return purchase


@router.delete("/{id}")
def delete_purchase(session: SessionDep, id: int) -> Message:
    """
    Delete an purchase.
    """
    purchase = session.get(Purchase, id)
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
   
    session.delete(purchase)
    session.commit()
    return Message(message="Purchase deleted successfully")
