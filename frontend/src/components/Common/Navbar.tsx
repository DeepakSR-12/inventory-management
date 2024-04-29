import { Button, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

import StoreForm from "../Stores/StoreForm";
import WarehouseForm from "../Warehouses/WarehouseForm";
import UserForm from "../Users/UserForm";
import ItemForm from "../Items/ItemForm";
import WarehouseItemsForm from "../WarehouseItems/WarehouseItemsForm";

interface NavbarProps {
  type: string;
  id?: number;
}

const Navbar = ({ type, id }: NavbarProps) => {
  const addUserModal = useDisclosure();
  const addItemModal = useDisclosure();
  const addWarehouseModal = useDisclosure();
  const addStoreModal = useDisclosure();

  const receiveItemModal = useDisclosure();

  return (
    <>
      <Flex py={8} gap={4}>
        <Button
          variant="primary"
          gap={1}
          fontSize={{ base: "sm", md: "inherit" }}
          onClick={
            type === "User"
              ? addUserModal.onOpen
              : type === "Item"
                ? addItemModal.onOpen
                : type === "Warehouse"
                  ? addWarehouseModal.onOpen
                  : type === "WarehouseItem"
                    ? receiveItemModal.onOpen
                    : addStoreModal.onOpen
          }
        >
          <Icon as={FaPlus} />{" "}
          {type === "WarehouseItem" ? "Receive Item" : `Add ${type}`}
        </Button>
        <UserForm
          mode="add"
          isOpen={addUserModal.isOpen}
          onClose={addUserModal.onClose}
        />
        <WarehouseForm
          mode="add"
          isOpen={addWarehouseModal.isOpen}
          onClose={addWarehouseModal.onClose}
        />
        <WarehouseItemsForm
          mode="add"
          isOpen={receiveItemModal.isOpen}
          onClose={receiveItemModal.onClose}
          warehouseId={id}
        />
        <StoreForm
          mode="add"
          isOpen={addStoreModal.isOpen}
          onClose={addStoreModal.onClose}
        />
        <ItemForm
          mode="add"
          isOpen={addItemModal.isOpen}
          onClose={addItemModal.onClose}
        />
      </Flex>
    </>
  );
};

export default Navbar;
