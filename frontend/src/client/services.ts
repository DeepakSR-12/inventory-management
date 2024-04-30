import type { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";

import type {
  Body_login_login_access_token,
  Message,
  NewPassword,
  Token,
  UserPublic,
  UpdatePassword,
  UserCreate,
  UserRegister,
  UsersPublic,
  UserUpdate,
  UserUpdateMe,
  ItemCreate,
  ItemPublic,
  ItemsPublic,
  ItemUpdate,
  WarehouseCreate,
  WarehousePublic,
  WarehousesPublic,
  WarehouseUpdate,
  WarehouseItemsByIdPublic,
  StoreCreate,
  StorePublic,
  StoresPublic,
  StoreUpdate,
  WarehouseItemsByIdsPublic,
  WarehouseItemsByIdCreate,
  WarehouseItemsByIdUpdate,
  StoreItemsByIdsPublic,
  StoreItemsByIdCreate,
  StoreItemsByIdPublic,
  PurchaseCreate,
  PurchasesPublic,
  PurchasePublic,
} from "./models";

export type TDataLoginAccessToken = {
  formData: Body_login_login_access_token;
};
export type TDataRecoverPassword = {
  email: string;
};
export type TDataResetPassword = {
  requestBody: NewPassword;
};
export type TDataRecoverPasswordHtmlContent = {
  email: string;
};

export class LoginService {
  /**
   * Login Access Token
   * OAuth2 compatible token login, get an access token for future requests
   * @returns Token Successful Response
   * @throws ApiError
   */
  public static loginAccessToken(
    data: TDataLoginAccessToken
  ): CancelablePromise<Token> {
    const { formData } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/login/access-token",
      formData: formData,
      mediaType: "application/x-www-form-urlencoded",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Test Token
   * Test access token
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static testToken(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/login/test-token",
    });
  }

  /**
   * Recover Password
   * Password Recovery
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static recoverPassword(
    data: TDataRecoverPassword
  ): CancelablePromise<Message> {
    const { email } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/password-recovery/{email}",
      path: {
        email,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Reset Password
   * Reset password
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static resetPassword(
    data: TDataResetPassword
  ): CancelablePromise<Message> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/reset-password/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Recover Password Html Content
   * HTML Content for Password Recovery
   * @returns string Successful Response
   * @throws ApiError
   */
  public static recoverPasswordHtmlContent(
    data: TDataRecoverPasswordHtmlContent
  ): CancelablePromise<string> {
    const { email } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/password-recovery-html-content/{email}",
      path: {
        email,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export type TDataReadUsers = {
  limit?: number;
  skip?: number;
};
export type TDataCreateUser = {
  requestBody: UserCreate;
};
export type TDataUpdateUserMe = {
  requestBody: UserUpdateMe;
};
export type TDataUpdatePasswordMe = {
  requestBody: UpdatePassword;
};
export type TDataRegisterUser = {
  requestBody: UserRegister;
};
export type TDataReadUserById = {
  userId: number;
};
export type TDataUpdateUser = {
  requestBody: UserUpdate;
  userId: number;
};
export type TDataDeleteUser = {
  userId: number;
};

export class UsersService {
  /**
   * Read Users
   * Retrieve users.
   * @returns UsersPublic Successful Response
   * @throws ApiError
   */
  public static readUsers(
    data: TDataReadUsers = {}
  ): CancelablePromise<UsersPublic> {
    const { limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create User
   * Create new user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static createUser(
    data: TDataCreateUser
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read User Me
   * Get current user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static readUserMe(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/me",
    });
  }

  /**
   * Update User Me
   * Update own user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static updateUserMe(
    data: TDataUpdateUserMe
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/me",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Password Me
   * Update own password.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static updatePasswordMe(
    data: TDataUpdatePasswordMe
  ): CancelablePromise<Message> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/me/password",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Register User
   * Create new user without the need to be logged in.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static registerUser(
    data: TDataRegisterUser
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/signup",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read User By Id
   * Get a specific user by id.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static readUserById(
    data: TDataReadUserById
  ): CancelablePromise<UserPublic> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update User
   * Update a user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static updateUser(
    data: TDataUpdateUser
  ): CancelablePromise<UserPublic> {
    const { requestBody, userId } = data;
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete User
   * Delete a user.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteUser(data: TDataDeleteUser): CancelablePromise<Message> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export type TDataTestEmail = {
  emailTo: string;
};

export class UtilsService {
  /**
   * Test Email
   * Test emails.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static testEmail(data: TDataTestEmail): CancelablePromise<Message> {
    const { emailTo } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/utils/test-email/",
      query: {
        email_to: emailTo,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export type TDataReadItems = {
  limit?: number;
  skip?: number;
};
export type TDataCreateItem = {
  requestBody: ItemCreate;
};
export type TDataReadItem = {
  id: number;
};
export type TDataUpdateItem = {
  id: number;
  requestBody: ItemUpdate;
};
export type TDataDeleteItem = {
  id: number;
};

export class ItemsService {
  /**
   * Read Items
   * Retrieve items.
   * @returns ItemsPublic Successful Response
   * @throws ApiError
   */
  public static readItems(
    data: TDataReadItems = {}
  ): CancelablePromise<ItemsPublic> {
    const { limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/items/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Item
   * Create new item.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static createItem(
    data: TDataCreateItem
  ): CancelablePromise<ItemPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/items/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read Item
   * Get item by ID.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static readItem(data: TDataReadItem): CancelablePromise<ItemPublic> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/items/{id}",
      path: {
        id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Item
   * Update an item.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static updateItem(
    data: TDataUpdateItem
  ): CancelablePromise<ItemPublic> {
    const { id, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/items/{id}",
      path: {
        id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Item
   * Delete an item.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteItem(data: TDataDeleteItem): CancelablePromise<Message> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/items/{id}",
      path: {
        id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

// Warehouses Service
export type TDataReadWarehouses = {
  limit?: number;
  skip?: number;
};
export type TDataCreateWarehouse = {
  requestBody: WarehouseCreate;
};
export type TDataReadWarehouse = {
  id: number;
};
export type TDataUpdateWarehouse = {
  id: number;
  requestBody: WarehouseUpdate;
};
export type TDataDeleteWarehouse = {
  id: number;
};

export class WarehousesService {
  /**
   * Read Warehouses
   * Retrieve Warehouses.
   * @returns WarehousesPublic Successful Response
   * @throws ApiError
   */
  public static readWarehouses(
    data: TDataReadWarehouses = {}
  ): CancelablePromise<WarehousesPublic> {
    const { limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/warehouses/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Warehouse
   * Create new warehouse.
   * @returns WarehousePublic Successful Response
   * @throws ApiError
   */
  public static createWarehouse(
    data: TDataCreateWarehouse
  ): CancelablePromise<WarehousePublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/warehouses/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read Warehouse
   * Get Warehouse by ID.
   * @returns WarehousePublic Successful Response
   * @throws ApiError
   */
  public static readWarehouse(
    data: TDataReadWarehouse
  ): CancelablePromise<WarehousePublic> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/warehouses/{id}",
      path: {
        id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Warehouse
   * Update a warehouse.
   * @returns WarehousePublic Successful Response
   * @throws ApiError
   */
  public static updateWarehouse(
    data: TDataUpdateWarehouse
  ): CancelablePromise<WarehousePublic> {
    const { id, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/warehouses/{id}",
      path: {
        id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Warehouse
   * Delete a warehouse.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteWarehouse(
    data: TDataDeleteWarehouse
  ): CancelablePromise<Message> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/warehouses/{id}",
      path: {
        id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export type TDataReadWarehouseItemsById = {
  id: number;
  limit?: number;
  skip?: number;
};
export type TDataReceiveWarehouseItemsById = {
  requestBody: WarehouseItemsByIdCreate;
};

export type TDataUpdateWarehouseItemById = {
  id: number;
  requestBody: WarehouseItemsByIdUpdate;
};
export type TDataDeleteWarehouseItemById = {
  id: number;
};

// Warehouse By Id Service
export class WarehouseItemsByIdService {
  /**
   * Read Warehouses By Id
   * Retrieve Warehouses By Id.
   * @returns WarehouseItemsByIdsPublic Successful Response
   * @throws ApiError
   */
  public static readWarehouseItemsById(
    data: TDataReadWarehouseItemsById
  ): CancelablePromise<WarehouseItemsByIdsPublic> {
    const { id, limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/warehouseitems/{id}",
      path: {
        id,
      },
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Warehouse
   * Create new warehouse.
   * @returns WarehousePublic Successful Response
   * @throws ApiError
   */
  public static receiveWarehouseItemsById(
    data: TDataReceiveWarehouseItemsById
  ): CancelablePromise<WarehouseItemsByIdPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/warehouseitems/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Warehouse Items by ID.
   * Update a warehouse item.
   * @returns WarehouseItemsByIdPublic Successful Response
   * @throws ApiError
   */
  public static updateWarehouseItemsById(
    data: TDataUpdateWarehouseItemById
  ): CancelablePromise<WarehouseItemsByIdPublic> {
    const { id, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/warehouseitems/{id}",
      path: {
        id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Warehouse Item by ID.
   * Delete a warehouse item.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteWarehouseItemById(
    data: TDataDeleteWarehouseItemById
  ): CancelablePromise<Message> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/warehouseitems/{id}",
      path: {
        id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

// Stores Service
export type TDataReadStores = {
  limit?: number;
  skip?: number;
};
export type TDataCreateStore = {
  requestBody: StoreCreate;
};
export type TDataReadStore = {
  id: number;
};
export type TDataUpdateStore = {
  id: number;
  requestBody: StoreUpdate;
};
export type TDataDeleteStore = {
  id: number;
};

export class StoresService {
  /**
   * Read Stores
   * Retrieve Stores.
   * @returns StoresPublic Successful Response
   * @throws ApiError
   */
  public static readStores(
    data: TDataReadStores = {}
  ): CancelablePromise<StoresPublic> {
    const { limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/stores",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Store
   * Create new Store.
   * @returns StorePublic Successful Response
   * @throws ApiError
   */
  public static createStore(
    data: TDataCreateStore
  ): CancelablePromise<StorePublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/stores",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read Store
   * Get Store by ID.
   * @returns StorePublic Successful Response
   * @throws ApiError
   */
  public static readStore(
    data: TDataReadStore
  ): CancelablePromise<StorePublic> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/stores/{id}",
      path: {
        id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Store
   * Update a Store.
   * @returns StorePublic Successful Response
   * @throws ApiError
   */
  public static updateStore(
    data: TDataUpdateStore
  ): CancelablePromise<StorePublic> {
    const { id, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/stores/{id}",
      path: {
        id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Store
   * Delete a Store.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteStore(
    data: TDataDeleteStore
  ): CancelablePromise<Message> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/stores/{id}",
      path: {
        id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export type TDataReadStoreItemsById = {
  id: number;
  limit?: number;
  skip?: number;
};
export type TDataShipItemsById = {
  requestBody: StoreItemsByIdCreate;
  previousQuantity: number;
  id: number;
};

// StoreItems By Id Service
export class StoreItemsByIdService {
  /**
   * Read StoresItems By Id
   * Retrieve StoreItems By Id.
   * @returns StoreItemsByIdsPublic Successful Response
   * @throws ApiError
   */
  public static readStoreItemsById(
    data: TDataReadStoreItemsById
  ): CancelablePromise<StoreItemsByIdsPublic> {
    const { id, limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/storeitems/{id}",
      path: {
        id,
      },
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Ship Items
   * Ship Items to Store
   * @returns StoreItemsByIdPublic Successful Response
   * @throws ApiError
   */
  public static shipItemsById(
    data: TDataShipItemsById
  ): CancelablePromise<StoreItemsByIdPublic> {
    const { requestBody, previousQuantity, id } = data;    
    const updateBody = {...requestBody, quantity: previousQuantity - requestBody.quantity}

    __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/warehouseitems/{id}",
      path: {
        id: id,
      },
      body: updateBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });

    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/storeitems",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export type TDataReadPurchases = {
  limit?: number;
  skip?: number;
};
export type TDataCreatePurchase = {
  requestBody: PurchaseCreate;
  previousQuantity: number;
  id: number;
};
export type TDataDeletePurchase = {
  id: number;
};

// Purchases
export class PurchasesService {
  /**
   * Read Purchases
   * Retrieve Purchases.
   * @returns PurchasesPublic Successful Response
   * @throws ApiError
   */
  public static readPurchases(
    data: TDataReadPurchases
  ): CancelablePromise<PurchasesPublic> {
    const { limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/purchases",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Purchase
   * Create new purchase.
   * @returns PurchasePublic Successful Response
   * @throws ApiError
   */
  public static createPurchase(
    data: TDataCreatePurchase
  ): CancelablePromise<PurchasePublic> {
    const { requestBody, previousQuantity, id } = data;    
    const updateBody = {...requestBody, quantity: previousQuantity - requestBody.quantity}

    __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/storeitems/{id}",
      path: {
        id: id,
      },
      body: updateBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });

    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/purchases",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
