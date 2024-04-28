from sqlmodel import Field, Relationship, SQLModel


# Shared properties
# TODO replace email str with EmailStr when sqlmodel supports it
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = None


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str


# TODO replace email str with EmailStr when sqlmodel supports it
class UserRegister(SQLModel):
    email: str
    password: str
    full_name: str | None = None


# Properties to receive via API on update, all are optional
# TODO replace email str with EmailStr when sqlmodel supports it
class UserUpdate(UserBase):
    email: str | None = None  # type: ignore
    password: str | None = None


# TODO replace email str with EmailStr when sqlmodel supports it
class UserUpdateMe(SQLModel):
    full_name: str | None = None
    email: str | None = None


class UpdatePassword(SQLModel):
    current_password: str
    new_password: str


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: int


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Item model, database table inferred from class name
# Shared properties
class ItemBase(SQLModel):
    name: str
    warehouse_price: float
    retail_price: float


# Properties to receive on item creation
class ItemCreate(ItemBase):
    name: str
    warehouse_price: float
    retail_price: float


# Properties to receive on item update
class ItemUpdate(ItemBase):
    name: str | None = None  # type: ignore
    warehouse_price: float | None = None  # type: ignore
    retail_price: float | None = None  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: int


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int

# Warehouse model, database table inferred from class name
# Shared properties
class WarehouseBase(SQLModel):
    name: str
    location: str


# Properties to receive on warehouse creation
class WarehouseCreate(WarehouseBase):
    name: str
    location: str


# Properties to receive on warehouse update
class WarehouseUpdate(WarehouseBase):
    name: str | None = None  # type: ignore
    location: str | None = None  # type: ignore    


# Database model, database table inferred from class name
class Warehouse(WarehouseBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str


# Properties to return via API, id is always required
class WarehousePublic(WarehouseBase):
    id: int


class WarehousesPublic(SQLModel):
    data: list[WarehousePublic]
    count: int

# Store model, database table inferred from class name
# Shared properties
class StoreBase(SQLModel):
    name: str
    location: str


# Properties to receive on store creation
class StoreCreate(StoreBase):
    name: str
    location: str


# Properties to receive on store update
class StoreUpdate(StoreBase):
    name: str | None = None  # type: ignore
    location: str | None = None  # type: ignore    


# Database model, database table inferred from class name
class Store(StoreBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str


# Properties to return via API, id is always required
class StorePublic(StoreBase):
    id: int


class StoresPublic(SQLModel):
    data: list[StorePublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: int | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str
