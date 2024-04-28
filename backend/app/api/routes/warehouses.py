from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import SessionDep
from app.models import Warehouse, WarehouseCreate, WarehousePublic, WarehousesPublic, WarehouseUpdate, Message

router = APIRouter()


@router.get("/", response_model=WarehousesPublic)
def read_warehouses(
    session: SessionDep, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve warehouses.
    """
    count_statement = select(func.count()).select_from(Warehouse)
    count = session.exec(count_statement).one()
    statement = select(Warehouse).offset(skip).limit(limit)
    warehouses = session.exec(statement).all()

    return WarehousesPublic(data=warehouses, count=count)


@router.get("/{id}", response_model=WarehousePublic)
def read_warehouse(session: SessionDep, id: int) -> Any:
    """
    Get warehouse by ID.
    """
    warehouse = session.get(Warehouse, id)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    
    return warehouse


@router.post("/", response_model=WarehousePublic)
def create_warehouse(
    *, session: SessionDep, warehouse_in: WarehouseCreate
) -> Any:
    """
    Create new warehouse.
    """
    warehouse = Warehouse.model_validate(warehouse_in)
    session.add(warehouse)
    session.commit()
    session.refresh(warehouse)
    return warehouse


@router.put("/{id}", response_model=WarehousePublic)
def update_warehouse(
    *, session: SessionDep, id: int, warehouse_in: WarehouseUpdate
) -> Any:
    """
    Update an warehouse.
    """
    warehouse = session.get(Warehouse, id)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
   
    update_dict = warehouse_in.model_dump(exclude_unset=True)
    warehouse.sqlmodel_update(update_dict)
    session.add(warehouse)
    session.commit()
    session.refresh(warehouse)
    return warehouse


@router.delete("/{id}")
def delete_warehouse(session: SessionDep, id: int) -> Message:
    """
    Delete an warehouse.
    """
    warehouse = session.get(Warehouse, id)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
   
    session.delete(warehouse)
    session.commit()
    return Message(message="Warehouse deleted successfully")
