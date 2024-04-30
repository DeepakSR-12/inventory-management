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
  Button,
  HStack,
  Text,
  Box,
} from "@chakra-ui/react";
import { WarehouseItemsByIdService, WarehousePublic } from "../../client";
import { useSuspenseQuery } from "@tanstack/react-query";
import ActionsMenu from "./ActionsMenu";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Navbar from "./Navbar";
import { Navigate } from "@tanstack/react-router";

interface WarehousesItemsProps {
  warehouse: WarehousePublic;
  isOpen: boolean;
  onClose: () => void;
}

function WarehousesItemsTableBody({
  id,
  currentPage,
  itemsPerPage,
}: {
  id: number;
  currentPage: number;
  itemsPerPage: number;
}) {
  const { data: warehouseItems } = useSuspenseQuery({
    queryKey: ["warehouseItemsById", id],
    queryFn: () => WarehouseItemsByIdService.readWarehouseItemsById({ id }),
  });

  // Sort and paginate the items
  const sortedWarehouseItems = warehouseItems.data.sort((a, b) => a.id - b.id);
  const paginatedWarehouseItems = sortedWarehouseItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Tbody>
      {paginatedWarehouseItems.map((warehouseItem, index) => (
        <Tr key={index}>
          <Td>{warehouseItem.id}</Td>
          <Td>{warehouseItem.item_name}</Td>
          <Td>{warehouseItem.item_id}</Td>
          <Td>{warehouseItem.warehouse_price}</Td>
          <Td>{warehouseItem.retail_price}</Td>
          <Td>{warehouseItem.quantity}</Td>
          <Td>
            <ActionsMenu type="WarehouseItem" value={warehouseItem} />
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
}

function WarehousesItemsTable({ id }: { id: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

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
                <Td colSpan={7}>Something went wrong: {error.message}</Td>
              </Tr>
            </Tbody>
          )}
        >
          <Suspense
            fallback={
              <Tbody>
                {new Array(5).fill(null).map((_, index) => (
                  <Tr key={index}>
                    {new Array(7).fill(null).map((_, index) => (
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
            <WarehousesItemsTableBody
              id={id}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          </Suspense>
        </ErrorBoundary>
      </Table>

      {/* Pagination controls */}
      <HStack justifyContent="center" mt={10}>
        <Button onClick={prevPage} isDisabled={currentPage <= 1}>
          Previous
        </Button>
        <Text>Page {currentPage}</Text>
        <Button onClick={nextPage}>Next</Button>
      </HStack>
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
      <Modal
        closeOnEsc={false}
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Container maxW="container.md">
              <Heading as="h1" size="lg" my={8} textAlign="center">
                Warehouse Details
              </Heading>
              <Box pt={2}>
                <Flex
                  direction={["column", "row", "row"]}
                  flexWrap={["nowrap", "wrap", "wrap"]}
                  justifyContent={"flex-end"}
                  gap={4}
                >
                  <Box flexBasis={["100%", "33.33%", "30%"]}>
                    <Heading as="h2" size="md" color="ui.main">
                      Name
                    </Heading>
                    <Text fontSize="sm" mb={2}>
                      {warehouse.name}
                    </Text>
                  </Box>
                  <Box flexBasis={["100%", "33.33%", "30%"]}>
                    <Heading as="h2" size="md" color="ui.main">
                      Location
                    </Heading>
                    <Text fontSize="sm" mb={2}>
                      {warehouse.location}
                    </Text>
                  </Box>
                  <Box flexBasis={["100%", "33.33%", "30%"]}>
                    <Heading as="h2" size="md" color="ui.main">
                      Warehouse ID
                    </Heading>
                    <Text fontSize="sm" ml={2} mb={2}>
                      {warehouse.id}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Container>
          </ModalHeader>
          <ModalBody pb={6} py={10}>
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
