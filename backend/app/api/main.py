from fastapi import APIRouter

from app.api.routes import items, login, users, utils, warehouses, stores, warehouseitems, storeitems, purchases

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(warehouses.router, prefix="/warehouses", tags=["warehouses"])
api_router.include_router(warehouseitems.router, prefix="/warehouseitems", tags=["warehouseitems"])
api_router.include_router(storeitems.router, prefix="/storeitems", tags=["storeitems"])
api_router.include_router(stores.router, prefix="/stores", tags=["stores"])
api_router.include_router(purchases.router, prefix="/purchases", tags=["purchases"])
