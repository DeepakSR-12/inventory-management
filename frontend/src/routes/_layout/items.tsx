import {
  Container,
  Flex,
  Heading,
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
} from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ItemsService } from "../../client";
import ActionsMenu from "../../components/Common/ActionsMenu";
import Navbar from "../../components/Common/Navbar";
import useAuth from "../../hooks/useAuth";

export const Route = createFileRoute("/_layout/items")({
  component: Items,
});

function ItemsTableBody({
  currentPage,
  itemsPerPage,
}: {
  currentPage: number;
  itemsPerPage: number;
}) {
  const { data: items } = useSuspenseQuery({
    queryKey: ["items"],
    queryFn: () => ItemsService.readItems({}),
  });

  // Sort items and select only the ones for the current page
  const sortedItems = items.data.sort((a, b) => a.id - b.id);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Tbody>
      {paginatedItems.map((item) => (
        <Tr key={item.id}>
          <Td>{item.id}</Td>
          <Td color={!item.name ? "ui.dim" : "inherit"}>
            {item.name || "N/A"}
          </Td>
          <Td>{item.warehouse_price}</Td>
          <Td>{item.retail_price}</Td>
          <Td>
            <ActionsMenu type={"Item"} value={item} />
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
}

function ItemsTable() {
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
            <Th>Name</Th>
            <Th>Warehouse Price</Th>
            <Th>Retail Price</Th>
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
            <ItemsTableBody
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

export default function Items() {
  const { user } = useAuth();

  if (!user?.is_superuser) {
    return <Navigate to="/" replace />;
  } else {
    return (
      <Container maxW="full">
        <Heading size="lg" textAlign="center" pt={12}>
          Items Management
        </Heading>
        <Flex justifyContent={"flex-end"}>
          <Navbar type={"Item"} />
        </Flex>
        <ItemsTable />
      </Container>
    );
  }
}
