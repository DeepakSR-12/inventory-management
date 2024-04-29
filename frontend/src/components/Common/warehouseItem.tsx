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
  Th,
  Thead,
  Tr,
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
    <Tbody>
      {warehouseItems.data.map((warehouseItem) => (
        <Tr key={warehouseItem.warehouse_id}>
          <Td color={!warehouseItem.item_id ? "ui.dim" : "inherit"}>
            {warehouseItem.item_id}
          </Td>
          <Td>{warehouseItem.item_name}</Td>
          <Td>{warehouseItem.warehouse_price}</Td>
          <Td>{warehouseItem.retail_price}</Td>
          <Td>{warehouseItem.quantity}</Td>
          <Td>
            <ActionsMenu type={"WarehouseItems"} value={warehouseItem} />
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
}

function WarehousesItemsTable({ id }: { id: number }) {
  return (
    <TableContainer>
      <Table size={{ base: "sm", md: "md" }}>
        <Thead>
          <Tr>
            <Th>Item ID</Th>
            <Th>Item Name</Th>
            <Th>Warehouse Price</Th>
            <Th>Retail Price</Th>
            <Th>Quantity</Th>
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
            <Container maxW="full">
              <Heading
                as="h1"
                size="lg"
                textAlign={{ base: "center", md: "left" }}
                pt={12}
              >
                Warehouse Details
              </Heading>
              <Heading
                as="h2"
                size="sm"
                textAlign={{ base: "center", md: "left" }}
                pt={2}
              >
                Name: {warehouse.name}
              </Heading>
              <Heading
                as="h2"
                size="sm"
                textAlign={{ base: "center", md: "left" }}
                pt={2}
              >
                Location: {warehouse.location}
              </Heading>
              <Heading
                as="h2"
                size="sm"
                textAlign={{ base: "center", md: "left" }}
                pt={2}
              >
                ID: {warehouse.id}
              </Heading>
            </Container>
          </ModalHeader>
          <ModalBody pb={6}>
            <Navbar type={"WarehouseItem"} />
            <WarehousesItemsTable id={warehouse.id} />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
};

export default WarehousesItems;
