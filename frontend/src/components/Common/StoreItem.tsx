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
import { StoreItemsByIdService, StorePublic } from "../../client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import ActionsMenu from "./ActionsMenu";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useState } from "react";
import useAuth from "../../hooks/useAuth";

interface StoresItemsProps {
  store: StorePublic;
  isOpen: boolean;
  onClose: () => void;
}

function StoresItemsTableBody({ id, currentPage, itemsPerPage }: { id: number, currentPage: number, itemsPerPage: number }) {
  const { data: storeItems } = useSuspenseQuery({
    queryKey: ["storeItemsById"],
    queryFn: () => StoreItemsByIdService.readStoreItemsById({ id }),
  });

  const sortedStoreItems = storeItems.data.sort((a, b) => a.id - b.id);
  const paginatedStoreItems = sortedStoreItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {!!paginatedStoreItems?.length ? (
        <Tbody>
          {paginatedStoreItems.map((storeItem, index) => (
            <Tr key={index}>
              <Td>{storeItem.id}</Td>
              <Td>{storeItem.item_name}</Td>
              <Td>{storeItem.item_id}</Td>
              <Td>{storeItem.warehouse_price}</Td>
              <Td>{storeItem.retail_price}</Td>
              <Td>{storeItem.quantity}</Td>
              <Td>
                <ActionsMenu type={"StoreItem"} value={storeItem} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      ) : null}
    </>
  );
}

function StoresItemsTable({ id }: { id: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  return (
    <TableContainer>
      <Table size={{ base: "sm", md: "md" }}>
        <Thead>
          <Tr>
            <Th width="10%">ID</Th>
            <Th>Item Name</Th>
            <Th>Item ID</Th>
            <Th>Warehouse Price</Th>
            <Th>Retail Price</Th>
            <Th>Quantity</Th>
            <Th width="10%">Actions</Th>
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
            <StoresItemsTableBody id={id} currentPage={currentPage} itemsPerPage={itemsPerPage} />
          </Suspense>
        </ErrorBoundary>
      </Table>

      {/* Pagination controls */}
      <HStack justifyContent="center" mt={10}>
        <Button onClick={prevPage} isDisabled={currentPage <= 1}>
          Previous
        </Button>
        <Text>Page {currentPage}</Text>
        <Button onClick={nextPage}>
          Next
        </Button>
      </HStack>
    </TableContainer>
  );
}

const StoresItems = ({ store, isOpen, onClose }: StoresItemsProps) => {
  const { user } = useAuth();

  if (!user?.is_superuser) {
    return <Navigate to="/" replace />;
  } else {
    return (
      <Modal closeOnEsc={false} isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Container maxW="container.md">
              <Heading as="h1" size="lg" my={8} textAlign="center">
                Store Details
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
                      {store.name}
                    </Text>
                  </Box>
                  <Box flexBasis={["100%", "33.33%", "30%"]}>
                    <Heading as="h2" size="md" color="ui.main">
                      Location
                    </Heading>
                    <Text fontSize="sm" mb={2}>
                      {store.location}
                    </Text>
                  </Box>
                  <Box flexBasis={["100%", "33.33%", "30%"]}>
                    <Heading as="h2" size="md" color="ui.main">
                      Store ID
                    </Heading>
                    <Text fontSize="sm" ml={2} mb={2}>
                      {store.id}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Container>
          </ModalHeader>
          <ModalBody pb={6} py={10}>
            <StoresItemsTable id={store.id} />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
}

export default StoresItems;
