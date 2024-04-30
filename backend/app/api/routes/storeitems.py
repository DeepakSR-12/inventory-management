from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import SessionDep
from app.models import (
    StoreItemsById,
    StoreItemsByIdCreate,
    StoreItemsByIdPublic,
    StoreItemsByIdsPublic,
)

router = APIRouter()

@router.get("/", response_model=StoreItemsByIdsPublic)
def read_store_items(
    session: SessionDep, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve store items.
    """
    count_statement = select(func.count()).select_from(StoreItemsById)
    count = session.exec(count_statement).one()
    statement = select(StoreItemsById).offset(skip).limit(limit)
    store_items = session.exec(statement).all()

    return StoreItemsByIdsPublic(data=store_items, count=count)


@router.get("/{id}", response_model=StoreItemsByIdsPublic)
def read_store_items_by_id(
    session: SessionDep, id: int, skip: int = 0, limit: int = 100
) -> Any:
    """
    Get store items by ID.
    """
    # Count the total number of matching records
    count_statement = (
        select(func.count())
        .select_from(StoreItemsById)
        .where(StoreItemsById.store_id == id)
    )
    count = session.exec(count_statement).one()

    # Retrieve the matching records
    statement = (
        select(StoreItemsById)
        .where(StoreItemsById.store_id == id)
        .offset(skip)
        .limit(limit)
    )
    store_items = session.exec(statement).all()

    # Return the records in an array
    return StoreItemsByIdsPublic(data=store_items, count=count)


@router.post("/", response_model=StoreItemsByIdPublic)
def add_items_to_store(
    session: SessionDep, store_item: StoreItemsByIdCreate
) -> Any:
    """
    Add an item to a store.
    """
    # Check if the item already exists in this store
    existing_store_item = (
        session.query(StoreItemsById)
        .filter_by(
            store_id=store_item.store_id, item_id=store_item.item_id
        )
        .first()
    )

    if existing_store_item:
        # If the item already exists, replace its quantity
        existing_store_item.quantity += store_item.quantity
        session.commit()  # Save the changes to the database
        session.refresh(
            existing_store_item
        )  # Refresh the instance with new database values
        return existing_store_item

    # Create and add a new item
    new_store_item = StoreItemsById(**store_item.dict())
    session.add(new_store_item)  # Add new item to the session
    session.commit()  # Save it to the database
    session.refresh(new_store_item)  # Refresh the instance with new database values

    return new_store_item

@router.put("/{id}", response_model=StoreItemsByIdPublic)
def update_store_item(
    *, session: SessionDep, id: int, store_in: StoreItemsById
) -> Any:
    """
    Update an store item.
    """
    store_item = session.get(StoreItemsById, id)
    if not store_item:
        raise HTTPException(status_code=404, detail="Store Item not found")

    update_dict = store_in.model_dump(exclude_unset=True)
    store_item.sqlmodel_update(update_dict)
    session.add(store_item)
    session.commit()
    session.refresh(store_item)
    return store_item