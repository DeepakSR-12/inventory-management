import { Button, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

import AddItem from "../Items/AddItem";
import AddWarehouse from "../Warehouses/AddWarehouses";
import AddUser from "../Users/AddUser";

interface NavbarProps {
  type: string;
}

const Navbar = ({ type }: NavbarProps) => {
  const addUserModal = useDisclosure();
  const addItemModal = useDisclosure();
  const addWarehouseModal = useDisclosure();

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
                : addWarehouseModal.onOpen
          }
        >
          <Icon as={FaPlus} /> Add {type}
        </Button>
        <AddUser isOpen={addUserModal.isOpen} onClose={addUserModal.onClose} />
        <AddWarehouse
          isOpen={addWarehouseModal.isOpen}
          onClose={addWarehouseModal.onClose}
        />
        <AddItem isOpen={addItemModal.isOpen} onClose={addItemModal.onClose} />
      </Flex>
    </>
  );
};

export default Navbar;
