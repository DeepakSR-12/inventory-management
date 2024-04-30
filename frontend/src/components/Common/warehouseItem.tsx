import { Navigate } from "@tanstack/react-router";
import useAuth from "../../hooks/useAuth";
import {
  Container,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Box,
} from "@chakra-ui/react";
import { WarehouseItemsByIdService, WarehousePublic } from "../../client";
import { useSuspenseQuery } from "@tanstack/react-query";
import ActionsMenu from "./ActionsMenu";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import Navbar from "./Navbar";

interface WarehousesItemsProps {
  warehouse: WarehousePublic;
  isOpen: boolean;
  onClose: () => void;
}

function WarehousesItemsTableBody({ id }: { id: number }) {
  const { data: warehouseItems } = useSuspenseQuery({
    queryKey: ["warehouseItemsById"],
    queryFn: () => WarehouseItemsByIdService.readWarehouseItemsById({ id }),
  });

  return (
    <>
      {!!warehouseItems?.data?.length ? (
        <Tbody>
          {warehouseItems.data.sort((a, b) => a.id - b.id).map((warehouseItem, index) => (
            <Tr key={index}>
              <Td>{warehouseItem.id}</Td>
              <Td>{warehouseItem.item_name}</Td>
              <Td>{warehouseItem.item_id}</Td>
              <Td>{warehouseItem.warehouse_price}</Td>
              <Td>{warehouseItem.retail_price}</Td>
              <Td>{warehouseItem.quantity}</Td>
              <Td>
                <ActionsMenu type={"WarehouseItem"} value={warehouseItem} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      ) : null}
    </>
  );
}

function WarehousesItemsTable({ id }: { id: number }) {
  return (
    <TableContainer>
      <Table size={{ base: "sm", md: "md" }}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Item Name</Th>
            <Th>Item ID</Th>
            <Th>Warehouse Price</Th>
            <Th>Retail Price</Th>
            <Th>Quantity</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <Tbody>
              <Tr>
                <Td colSpan={4}>Something went wrong: {error.message}</Td>
              </Tr>
            </Tbody>
          )}
        >
          <Suspense
            fallback={
              <Tbody>
                {new Array(5).fill(null).map((_, index) => (
                  <Tr key={index}>
                    {new Array(4).fill(null).map((_, index) => (
                      <Td key={index}>
                        <Flex>
                          <Skeleton height="20px" width="20px" />
                        </Flex>
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            }
          >
            <WarehousesItemsTableBody id={id} />
          </Suspense>
        </ErrorBoundary>
      </Table>
    </TableContainer>
  );
}

const WarehousesItems = ({
  warehouse,
  isOpen,
  onClose,
}: WarehousesItemsProps) => {
  const { user } = useAuth();

  if (!user?.is_superuser) {
    return <Navigate to="/" replace />;
  } else {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
          <Container maxW="container.md" py={10}>
              <Heading as="h1" size="lg" mb={4} textAlign="center">
                Warehouse Details
              </Heading>
              <Box
                border="1px"
                borderColor="gray.300"
                borderRadius="md"
                p={5}
                boxShadow="md"
              >
                <Flex direction="column" gap={4}>
                  <Box>
                    <Heading as="h2" size="md" color="ui.main">
                      Name:
                    </Heading>
                    <Text fontSize="lg" mb={2}>
                      {warehouse.name}
                    </Text>
                  </Box>
                  <Box>
                    <Heading as="h2" size="md" color="ui.main">
                      Location:
                    </Heading>
                    <Text fontSize="lg" mb={2}>
                      {warehouse.location}
                    </Text>
                  </Box>
                  <Box>
                    <Heading as="h2" size="md" color="ui.main">
                      Warehouse ID:
                    </Heading>
                    <Text fontSize="lg" mb={2}>
                      {warehouse.id}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Container>
          </ModalHeader>
          <ModalBody pb={6}>
            <Flex justifyContent={"flex-end"}>
              <Navbar type={"WarehouseItem"} id={warehouse.id} />
            </Flex>
            <WarehousesItemsTable id={warehouse.id} />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
};

export default WarehousesItems;
