export type Body_login_login_access_token = {
  grant_type?: string | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
};

export type HTTPValidationError = {
  detail?: Array<ValidationError>;
};

export type ItemCreate = {
  name: string;
  warehouse_price: number | null;
  retail_price: number | null;
};

export type ItemPublic = {
  id: number;
  name: string;
  warehouse_price: number | null;
  retail_price: number | null;
};

export type ItemUpdate = {
  name: string;
  warehouse_price: number | null;
  retail_price: number | null;
};

export type ItemsPublic = {
  data: Array<ItemPublic>;
  count: number;
};

export type WarehouseCreate = {
  name: string;
  location: string;
};

export type WarehousePublic = {
  id: number;
  name: string;
  location: string;
};

export type WarehouseUpdate = {
  name: string;
  location: string;
};

export type WarehousesPublic = {
  data: Array<WarehousePublic>;
  count: number;
};

export type StoreCreate = {
  name: string;
  location: string;
};

export type StorePublic = {
  id: number;
  name: string;
  location: string;
};

export type StoreUpdate = {
  name: string;
  location: string;
};

export type StoresPublic = {
  data: Array<StorePublic>;
  count: number;
};

export type Message = {
  message: string;
};

export type NewPassword = {
  token: string;
  new_password: string;
};

export type Token = {
  access_token: string;
  token_type?: string;
};

export type UpdatePassword = {
  current_password: string;
  new_password: string;
};

export type UserCreate = {
  email: string;
  is_active?: boolean;
  is_superuser?: boolean;
  full_name?: string | null;
  password: string;
};

export type UserPublic = {
  email: string;
  is_active?: boolean;
  is_superuser?: boolean;
  full_name?: string | null;
  id: number;
};

export type UserRegister = {
  email: string;
  password: string;
  full_name?: string | null;
};

export type UserUpdate = {
  email?: string | null;
  is_active?: boolean;
  is_superuser?: boolean;
  full_name?: string | null;
  password?: string | null;
};

export type UserUpdateMe = {
  full_name?: string | null;
  email?: string | null;
};

export type UsersPublic = {
  data: Array<UserPublic>;
  count: number;
};

export type ValidationError = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};
