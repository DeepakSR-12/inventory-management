import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiEye, FiShoppingBag, FiTrash } from "react-icons/fi";

import type {
  ItemPublic,
  StoreItemsByIdPublic,
  StorePublic,
  UserPublic,
  WarehouseItemsByIdPublic,
  WarehousePublic,
} from "../../client";
import Delete from "./DeleteAlert";
import WarehouseForm from "../Warehouses/WarehouseForm";
import StoreForm from "../Stores/StoreForm";
import UserForm from "../Users/UserForm";
import ItemForm from "../Items/ItemForm";
import WarehouseItemsForm from "../WarehouseItems/WarehouseItemsForm";
import WarehousesItems from "./WarehouseItem";
import StoresItems from "./StoreItem";
import Navbar from "./Navbar";

interface ActionsMenuProps {
  type: string;
  value:
    | ItemPublic
    | UserPublic
    | WarehousePublic
    | StorePublic
    | WarehouseItemsByIdPublic
    | StoreItemsByIdPublic;
  disabled?: boolean;
}

const ActionsMenu = ({ type, value, disabled }: ActionsMenuProps) => {
  const editUserModal = useDisclosure();
  const deleteModal = useDisclosure();
  const viewUserModal = useDisclosure();

  return (
    <>
      {type != "StoreItem" ? (
        <Menu>
          <MenuButton
            isDisabled={disabled}
            as={Button}
            rightIcon={<BsThreeDotsVertical />}
            variant="unstyled"
          />
          <MenuList>
            {type == "WarehouseItem" ? (
              <MenuItem
                onClick={viewUserModal.onOpen}
                icon={<FiShoppingBag fontSize="16px" />}
              >
                Ship Warehouse Item
              </MenuItem>
            ) : type == "Warehouse" || type == "Store" ? (
              <MenuItem
                onClick={viewUserModal.onOpen}
                icon={<FiEye fontSize="16px" />}
              >
                View {type}
              </MenuItem>
            ) : null}
            {type !== "Item" ? (
              <MenuItem
                onClick={editUserModal.onOpen}
                icon={<FiEdit fontSize="16px" />}
              >
                Edit {type === "WarehouseItem" ? "Warehouse Item" : type}
              </MenuItem>
            ) : null}
            <MenuItem
              onClick={deleteModal.onOpen}
              icon={<FiTrash fontSize="16px" />}
              color="ui.danger"
            >
              Delete {type === "WarehouseItem" ? "Warehouse Item" : type}
            </MenuItem>
          </MenuList>
          {type === "User" ? (
            <>
              {!!editUserModal.isOpen ? (
                <UserForm
                  mode="edit"
                  user={value as UserPublic}
                  isOpen={editUserModal.isOpen}
                  onClose={editUserModal.onClose}
                />
              ) : null}
            </>
          ) : type == "Item" ? (
            <>
              {!!editUserModal.isOpen ? (
                <ItemForm
                  mode="edit"
                  item={value as ItemPublic}
                  isOpen={editUserModal.isOpen}
                  onClose={editUserModal.onClose}
                />
              ) : null}
            </>
          ) : type == "Warehouse" ? (
            <WarehouseForm
              mode="edit"
              warehouse={value as WarehousePublic}
              isOpen={editUserModal.isOpen}
              onClose={editUserModal.onClose}
            />
          ) : type == "WarehouseItem" ? (
            <>
              {!!editUserModal.isOpen ? (
                <WarehouseItemsForm
                  mode="edit"
                  warehouseItem={value as WarehouseItemsByIdPublic}
                  isOpen={editUserModal.isOpen}
                  onClose={editUserModal.onClose}
                />
              ) : null}
            </>
          ) : (
            <StoreForm
              mode="edit"
              store={value as StorePublic}
              isOpen={editUserModal.isOpen}
              onClose={editUserModal.onClose}
            />
          )}
          <Delete
            type={type}
            id={value.id}
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.onClose}
          />

          {!!viewUserModal.isOpen && type == "WarehouseItem" ? (
            <WarehouseItemsForm
              mode="ship"
              warehouseItem={value as WarehouseItemsByIdPublic}
              isOpen={viewUserModal.isOpen}
              onClose={viewUserModal.onClose}
            />
          ) : null}

          {!!viewUserModal.isOpen && type == "Warehouse" ? (
            <WarehousesItems
              warehouse={value as WarehousePublic}
              isOpen={viewUserModal.isOpen}
              onClose={viewUserModal.onClose}
            />
          ) : null}

          {!!viewUserModal.isOpen && type == "Store" ? (
            <StoresItems
              store={value as StorePublic}
              isOpen={viewUserModal.isOpen}
              onClose={viewUserModal.onClose}
            />
          ) : null}
        </Menu>
      ) : (
        <Navbar
          type={"StoreItem"}
          id={value?.id}
          storeItem={value as StoreItemsByIdPublic}
        />
      )}
    </>
  );
};

export default ActionsMenu;
