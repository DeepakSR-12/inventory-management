from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import SessionDep
from app.models import WarehouseItemsById, WarehouseItemsByIdCreate, WarehouseItemsByIdPublic, WarehouseItemsByIdsPublic, WarehouseItemsByIdUpdate, Message

router = APIRouter()


# @router.get("/", response_model=WarehouseItemsByIdsPublic)
# def read_warehouses(
#     session: SessionDep, skip: int = 0, limit: int = 100
# ) -> Any:
#     """
#     Retrieve warehouse items.
#     """
    # count_statement = select(func.count()).select_from(WarehouseItemsById)
    # count = session.exec(count_statement).one()
    # statement = select(WarehouseItemsById).offset(skip).limit(limit)
    # warehouse_items = session.exec(statement).all()

    # return WarehouseItemsByIdsPublic(data=warehouse_items, count=count)


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

# @router.post("/", response_model=WarehouseItemsByIdPublic)
# def add_items_to_warehouse(session: SessionDep, warehouse_item: WarehouseItemsByIdCreate) -> Any:
#     """
#     Add an item to a warehouse.
#     """
#     # Check if the item already exists in this warehouse
#     existing_warehouse_item = session.query(WarehouseItemsById).filter_by(
#         warehouse_id=warehouse_item.warehouse_id, 
#         item_id=warehouse_item.item_id
#     ).first()

#     if existing_warehouse_item:
#         # If the item already exists, update its quantity
#         existing_warehouse_item.quantity += warehouse_item.quantity
#         session.commit() # Save the changes to the database
#         session.refresh(existing_warehouse_item) # Refresh the instance with new database values
#         return existing_warehouse_item
    
#     # If the item is new, add it
#     # new_warehouse_item = WarehouseItemsById(**warehouse_item.dict())
#     warehouse_item_with_id = WarehouseItemsById.model_validate(warehouse_item)
#     session.add(warehouse_item_with_id) # Add new item to the session
#     session.commit() # Save it to the database
#     session.refresh(warehouse_item_with_id) # Refresh the instance with new database values

#     return warehouse_item_with_id

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
        # If the item already exists, update its quantity
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



# @router.post("/", response_model=WarehousePublic)
# def create_warehouse(
#     *, session: SessionDep, warehouse_in: WarehouseCreate
# ) -> Any:
#     """
#     Create new warehouse.
#     """
#     warehouse = Warehouse.model_validate(warehouse_in)
#     session.add(warehouse)
#     session.commit()
#     session.refresh(warehouse)
#     return warehouse


# @router.put("/{id}", response_model=WarehousePublic)
# def update_warehouse(
#     *, session: SessionDep, id: int, warehouse_in: WarehouseUpdate
# ) -> Any:
#     """
#     Update an warehouse.
#     """
#     warehouse = session.get(Warehouse, id)
#     if not warehouse:
#         raise HTTPException(status_code=404, detail="Warehouse not found")

#     update_dict = warehouse_in.model_dump(exclude_unset=True)
#     warehouse.sqlmodel_update(update_dict)
#     session.add(warehouse)
#     session.commit()
#     session.refresh(warehouse)
#     return warehouse


# @router.delete("/{id}")
# def delete_warehouse(session: SessionDep, id: int) -> Message:
#     """
#     Delete an warehouse.
#     """
#     warehouse = session.get(Warehouse, id)
#     if not warehouse:
#         raise HTTPException(status_code=404, detail="Warehouse not found")

#     session.delete(warehouse)
#     session.commit()
#     return Message(message="Warehouse deleted successfully")
