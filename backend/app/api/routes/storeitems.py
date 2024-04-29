from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import SessionDep
from app.models import (
    StoreItemsById,
    StoreItemsByIdCreate,
    StoreItemsByIdPublic,
    StoreItemsByIdsPublic,
    StoreItemsByIdUpdate,
    Message,
)

router = APIRouter()


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


# @router.put("/{id}", response_model=StoreItemsByIdPublic)
# def update_warehouse_item(
#     *, session: SessionDep, id: int, warehouse_in: StoreItemsById
# ) -> Any:
#     """
#     Update an warehouse item.
#     """
#     warehouse_item = session.get(StoreItemsById, id)
#     if not warehouse_item:
#         raise HTTPException(status_code=404, detail="Warehouse Item not found")

#     update_dict = warehouse_in.model_dump(exclude_unset=True)
#     warehouse_item.sqlmodel_update(update_dict)
#     session.add(warehouse_item)
#     session.commit()
#     session.refresh(warehouse_item)
#     return warehouse_item


# @router.delete("/{id}")
# def delete_warehouse_item(session: SessionDep, id: int) -> Message:
#     """
#     Delete a warehouse item.
#     """
#     warehouse_item = session.get(WarehouseItemsById, id)
#     if not warehouse_item:
#         raise HTTPException(status_code=404, detail="Warehouse item not found")

#     session.delete(warehouse_item)
#     session.commit()
#     return Message(message="Warehouse item deleted successfully")
