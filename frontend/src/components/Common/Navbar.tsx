import { Button, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

import StoreForm from "../Stores/StoreForm";
import WarehouseForm from "../Warehouses/WarehouseForm";
import UserForm from "../Users/UserForm";
import ItemForm from "../Items/ItemForm";
import WarehouseItemsForm from "../WarehouseItems/WarehouseItemsForm";
import { StoreItemsByIdPublic } from "../../client";
import PurchaseForm from "../Purchases/PurchaseForm";

interface NavbarProps {
  type: string;
  id?: number;
  storeItem?: StoreItemsByIdPublic;
}

const Navbar = ({ type, id, storeItem }: NavbarProps) => {
  const addUserModal = useDisclosure();
  const addItemModal = useDisclosure();
  const addWarehouseModal = useDisclosure();
  const addStoreModal = useDisclosure();

  const receiveItemModal = useDisclosure();
  const recordPurchaseModal = useDisclosure();

  return (
    <>
      <Flex py={4} gap={4}>
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
                    : type === "StoreItem"
                      ? recordPurchaseModal.onOpen
                      : addStoreModal.onOpen
          }
        >
          <Icon as={FaPlus} />{" "}
          {type === "WarehouseItem"
            ? "Receive Item"
            : type === "StoreItem"
              ? "Record Purchase"
              : `Add ${type}`}
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
        <PurchaseForm
          isOpen={recordPurchaseModal.isOpen}
          onClose={recordPurchaseModal.onClose}
          id={storeItem?.id!}
          warehouse_price={storeItem?.warehouse_price!}
          retail_price={storeItem?.retail_price!}
          store={storeItem?.store_id!}          
          item={storeItem?.item_id!}
          itemName={storeItem?.item_name!}
          itemQuantity={storeItem?.quantity!}
        />
      </Flex>
    </>
  );
};

export default Navbar;
