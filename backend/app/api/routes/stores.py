from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import SessionDep
from app.models import Store, StoreCreate, StorePublic, StoresPublic, StoreUpdate, Message

router = APIRouter()


@router.get("/", response_model=StoresPublic)
def read_stores(
    session: SessionDep, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve stores.
    """
    count_statement = select(func.count()).select_from(Store)
    count = session.exec(count_statement).one()
    statement = select(Store).offset(skip).limit(limit)
    stores = session.exec(statement).all()

    return StoresPublic(data=stores, count=count)


@router.get("/{id}", response_model=StorePublic)
def read_store(session: SessionDep, id: int) -> Any:
    """
    Get store by ID.
    """
    store = session.get(Store, id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    return store


@router.post("/", response_model=StorePublic)
def create_store(
    *, session: SessionDep, store_in: StoreCreate
) -> Any:
    """
    Create new store.
    """
    store = Store.model_validate(store_in)
    session.add(store)
    session.commit()
    session.refresh(store)
    return store


@router.put("/{id}", response_model=StorePublic)
def update_store(
    *, session: SessionDep, id: int, store_in: StoreUpdate
) -> Any:
    """
    Update an store.
    """
    store = session.get(Store, id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
   
    update_dict = store_in.model_dump(exclude_unset=True)
    store.sqlmodel_update(update_dict)
    session.add(store)
    session.commit()
    session.refresh(store)
    return store


@router.delete("/{id}")
def delete_store(session: SessionDep, id: int) -> Message:
    """
    Delete an store.
    """
    store = session.get(Store, id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
   
    session.delete(store)
    session.commit()
    return Message(message="Store deleted successfully")
