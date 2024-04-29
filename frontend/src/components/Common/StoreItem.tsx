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
import { StoreItemsByIdService, StorePublic } from "../../client";
import { useSuspenseQuery } from "@tanstack/react-query";
import ActionsMenu from "./ActionsMenu";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import Navbar from "./Navbar";

interface StoresItemsProps {
  store: StorePublic;
  isOpen: boolean;
  onClose: () => void;
}

function StoresItemsTableBody({ id }: { id: number }) {
  const { data: storeItems } = useSuspenseQuery({
    queryKey: ["storeItemsById"],
    queryFn: () => StoreItemsByIdService.readStoreItemsById({ id }),
  });

  console.log({ storeItems });

  return (
    <>
      {!!storeItems?.data?.length ? (
        <Tbody>
          {storeItems.data.map((storeItem, index) => (
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
            <StoresItemsTableBody id={id} />
          </Suspense>
        </ErrorBoundary>
      </Table>
    </TableContainer>
  );
}

const StoresItems = ({ store, isOpen, onClose }: StoresItemsProps) => {
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
                Store Details
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
                      {store.name}
                    </Text>
                  </Box>
                  <Box>
                    <Heading as="h2" size="md" color="ui.main">
                      Location:
                    </Heading>
                    <Text fontSize="lg" mb={2}>
                      {store.location}
                    </Text>
                  </Box>
                  <Box>
                    <Heading as="h2" size="md" color="ui.main">
                      Store ID:
                    </Heading>
                    <Text fontSize="lg" mb={2}>
                      {store.id}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Container>
          </ModalHeader>
          <ModalBody pb={6}>
            <Flex justifyContent={"flex-end"}>
              <Navbar type={"StoreItem"} id={store.id} />
            </Flex>
            <StoresItemsTable id={store.id} />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
};

export default StoresItems;
