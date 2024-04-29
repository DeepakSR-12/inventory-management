from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import SessionDep
from app.models import WarehouseItemsById, WarehouseItemsByIdCreate, WarehouseItemsByIdPublic, WarehouseItemsByIdsPublic, WarehouseItemsByIdUpdate, Message

router = APIRouter()


@router.get("/{id}", response_model=WarehouseItemsByIdsPublic)
def read_warehouse_items_by_id(session: SessionDep, id: int, skip: int = 0, limit: int = 100) -> Any:
    """
    Get warehouse items by ID.
    """
    # Count the total number of matching records
    count_statement = select(func.count()).select_from(WarehouseItemsById).where(WarehouseItemsById.warehouse_id == id)
    count = session.exec(count_statement).one()

    # Retrieve the matching records
    statement = select(WarehouseItemsById).where(WarehouseItemsById.warehouse_id == id).offset(skip).limit(limit)
    warehouse_items = session.exec(statement).all()

    # Return the records in an array
    return WarehouseItemsByIdsPublic(data=warehouse_items, count=count)

@router.post("/", response_model=WarehouseItemsByIdPublic)
def add_items_to_warehouse(session: SessionDep, warehouse_item: WarehouseItemsByIdCreate) -> Any:
    """
    Add an item to a warehouse.
    """
    # Check if the item already exists in this warehouse
    existing_warehouse_item = session.query(WarehouseItemsById).filter_by(
        warehouse_id=warehouse_item.warehouse_id, 
        item_id=warehouse_item.item_id
    ).first()

    if existing_warehouse_item:
        # If the item already exists, replace its quantity
        existing_warehouse_item.quantity += warehouse_item.quantity
        session.commit() # Save the changes to the database
        session.refresh(existing_warehouse_item) # Refresh the instance with new database values
        return existing_warehouse_item

    # Create and add a new item
    new_warehouse_item = WarehouseItemsById(**warehouse_item.dict())
    session.add(new_warehouse_item) # Add new item to the session
    session.commit() # Save it to the database
    session.refresh(new_warehouse_item) # Refresh the instance with new database values

    return new_warehouse_item


@router.put("/{id}", response_model=WarehouseItemsByIdPublic)
def update_warehouse_item(
    *, session: SessionDep, id: int, warehouse_in: WarehouseItemsById
) -> Any:
    """
    Update an warehouse item.
    """
    warehouse_item = session.get(WarehouseItemsById, id)
    if not warehouse_item:
        raise HTTPException(status_code=404, detail="Warehouse Item not found")

    update_dict = warehouse_in.model_dump(exclude_unset=True)
    warehouse_item.sqlmodel_update(update_dict)
    session.add(warehouse_item)
    session.commit()
    session.refresh(warehouse_item)
    return warehouse_item


@router.delete("/{id}")
def delete_warehouse_item(session: SessionDep, id: int) -> Message:
    """
    Delete a warehouse item.
    """
    warehouse_item = session.get(WarehouseItemsById, id)
    if not warehouse_item:
        raise HTTPException(status_code=404, detail="Warehouse item not found")

    session.delete(warehouse_item)
    session.commit()
    return Message(message="Warehouse item deleted successfully")
