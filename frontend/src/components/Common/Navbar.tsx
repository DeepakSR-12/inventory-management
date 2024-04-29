import { Button, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

import StoreForm from "../Stores/StoreForm"
import WarehouseForm from "../Warehouses/WarehouseForm";
import UserForm from "../Users/UserForm";
import ItemForm from "../Items/ItemForm";

interface NavbarProps {
  type: string;
}

const Navbar = ({ type }: NavbarProps) => {
  const addUserModal = useDisclosure();
  const addItemModal = useDisclosure();
  const addWarehouseModal = useDisclosure();
  const addStoreModal = useDisclosure();

  const receiveItemModal = useDisclosure();

  return (
    <>
      <Flex py={8} gap={4}>
        {/* TODO: Complete search functionality */}
        {/* <InputGroup w={{ base: '100%', md: 'auto' }}>
                    <InputLeftElement pointerEvents='none'>
                        <Icon as={FaSearch} color='ui.dim' />
                    </InputLeftElement>
                    <Input type='text' placeholder='Search' fontSize={{ base: 'sm', md: 'inherit' }} borderRadius='8px' />
                </InputGroup> */}
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
                  : addStoreModal.onOpen
          }
        >
          <Icon as={FaPlus} /> Add {type}
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
