import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";

import type {
  ItemPublic,
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
import WarehousesById from "./warehouseItem";

interface ActionsMenuProps {
  type: string;
  value: ItemPublic | UserPublic | WarehousePublic | StorePublic | WarehouseItemsByIdPublic;
  disabled?: boolean;
}

const ActionsMenu = ({ type, value, disabled }: ActionsMenuProps) => {
  const editUserModal = useDisclosure();
  const deleteModal = useDisclosure();
  const viewUserModal = useDisclosure();

  return (
    <>
      <Menu>
        <MenuButton
          isDisabled={disabled}
          as={Button}
          rightIcon={<BsThreeDotsVertical />}
          variant="unstyled"
        />
        <MenuList>
          <MenuItem
            onClick={viewUserModal.onOpen}
            icon={<FiEye fontSize="16px" />}
          >
            View {type}
          </MenuItem>
          <MenuItem
            onClick={editUserModal.onOpen}
            icon={<FiEdit fontSize="16px" />}
          >
            Edit {type}
          </MenuItem>
          <MenuItem
            onClick={deleteModal.onOpen}
            icon={<FiTrash fontSize="16px" />}
            color="ui.danger"
          >
            Delete {type}
          </MenuItem>
        </MenuList>
        {type === "User" ? (
          <UserForm
            mode="edit"
            user={value as UserPublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
        ) : type == "Item" ? (
          <ItemForm
            mode="edit"
            item={value as ItemPublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
        ) : type == "Warehouse" ? (
          <WarehouseForm
            mode="edit"
            warehouse={value as WarehousePublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
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

        <WarehousesById
          warehouse={value as WarehousePublic}
          isOpen={viewUserModal.isOpen}
          onClose={viewUserModal.onClose}
        />
      </Menu>
    </>
  );
};

export default ActionsMenu;
